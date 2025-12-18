import { PricingCard } from '@/components/pricing/pricing-card';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold">Simple, Transparent Pricing</h1>
      <p className="mt-4 text-center text-gray-600">
        Start for free, upgrade when you need more
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {/* Free Tier */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold">Free</h3>
          <p className="mt-2 text-3xl font-bold">£0</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>✓ 5 AI lesson plans/month</li>
            <li>✓ 2 classes</li>
            <li>✓ 20 students</li>
            <li>✓ Basic analytics</li>
          </ul>
          <button className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2">
            Current Plan
          </button>
        </div>

        {/* Pro Monthly */}
        <PricingCard
          name="Pro Monthly"
          price="£10"
          priceId={process.env.STRIPE_PRICE_ID_PRO_MONTHLY!}
          popular
          features={[
            '50 AI lesson plans/month',
            'Unlimited classes',
            'Unlimited students',
            'Advanced analytics',
            'Export to PDF/Word',
            'Priority support',
          ]}
        />

        {/* Pro Yearly */}
        <PricingCard
          name="Pro Yearly"
          price="£8"
          priceId={process.env.STRIPE_PRICE_ID_PRO_YEARLY!}
          features={[
            'Everything in Pro',
            '2 months free',
            '£96/year (save £24)',
            'Early access to features',
          ]}
        />
      </div>
    </div>
  );
}