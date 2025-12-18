import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to safely extract subscription ID from invoice
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  // Cast to unknown first, then to Record to handle different API versions
  const invoiceAny = invoice as unknown as Record<string, unknown>;
  
  // Try various possible locations for subscription ID
  if (typeof invoiceAny.subscription === 'string') {
    return invoiceAny.subscription;
  }
  
  if (invoiceAny.subscription && typeof invoiceAny.subscription === 'object') {
    const sub = invoiceAny.subscription as Record<string, unknown>;
    if (typeof sub.id === 'string') {
      return sub.id;
    }
  }

  // Newer API versions might have it in parent
  if (invoiceAny.parent && typeof invoiceAny.parent === 'object') {
    const parent = invoiceAny.parent as Record<string, unknown>;
    if (parent.subscription_details && typeof parent.subscription_details === 'object') {
      const subDetails = parent.subscription_details as Record<string, unknown>;
      if (typeof subDetails.subscription === 'string') {
        return subDetails.subscription;
      }
      if (subDetails.subscription && typeof subDetails.subscription === 'object') {
        const sub = subDetails.subscription as Record<string, unknown>;
        if (typeof sub.id === 'string') {
          return sub.id;
        }
      }
    }
  }

  return null;
}

// Helper to get subscription period dates
function getSubscriptionPeriodDates(subscription: Stripe.Subscription): {
  currentPeriodStart: string;
  currentPeriodEnd: string;
} {
  // Cast to unknown first, then to Record to handle different API versions
  const subAny = subscription as unknown as Record<string, unknown>;
  
  // Try direct fields first (older API versions)
  if (
    typeof subAny.current_period_start === 'number' &&
    typeof subAny.current_period_end === 'number'
  ) {
    return {
      currentPeriodStart: new Date(subAny.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subAny.current_period_end * 1000).toISOString(),
    };
  }

  // Try latest_invoice (newer API versions)
  const latestInvoice = subscription.latest_invoice;
  if (latestInvoice && typeof latestInvoice !== 'string') {
    // Cast to unknown first, then to Record
    const invoiceAny = latestInvoice as unknown as Record<string, unknown>;
    if (
      typeof invoiceAny.period_start === 'number' &&
      typeof invoiceAny.period_end === 'number'
    ) {
      return {
        currentPeriodStart: new Date(invoiceAny.period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(invoiceAny.period_end * 1000).toISOString(),
      };
    }
  }

  // Fallback: calculate from subscription created date and price interval
  const subscriptionItem = subscription.items.data[0];
  const createdDate = new Date(subscription.created * 1000);
  const price = subscriptionItem.price;
  const interval = price.recurring?.interval || 'month';
  const intervalCount = price.recurring?.interval_count || 1;

  const endDate = new Date(createdDate);
  switch (interval) {
    case 'day':
      endDate.setDate(endDate.getDate() + intervalCount);
      break;
    case 'week':
      endDate.setDate(endDate.getDate() + 7 * intervalCount);
      break;
    case 'month':
      endDate.setMonth(endDate.getMonth() + intervalCount);
      break;
    case 'year':
      endDate.setFullYear(endDate.getFullYear() + intervalCount);
      break;
  }

  return {
    currentPeriodStart: createdDate.toISOString(),
    currentPeriodEnd: endDate.toISOString(),
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session.subscription as string);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscription(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getSubscriptionIdFromInvoice(invoice);
        console.log('Payment failed for subscription:', subscriptionId);
        // Handle failed payment - send email, update status, etc.
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['latest_invoice'],
  });
  await upsertSubscription(subscription);
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  let userId = subscription.metadata.supabase_user_id;

  if (!userId) {
    // Try to get user ID from customer
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    if ('metadata' in customer && customer.metadata.supabase_user_id) {
      userId = customer.metadata.supabase_user_id;
    }
  }

  const subscriptionItem = subscription.items.data[0];
  const { currentPeriodStart, currentPeriodEnd } = getSubscriptionPeriodDates(subscription);

  const subscriptionData = {
    id: subscription.id,
    user_id: userId,
    status: subscription.status,
    price_id: subscriptionItem.price.id,
    quantity: subscriptionItem.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(subscriptionData);

  if (error) {
    console.error('Failed to upsert subscription:', error);
    throw error;
  }
}