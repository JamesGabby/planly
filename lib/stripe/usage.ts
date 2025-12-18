import { createClient } from '@/lib/supabase/server';

const LIMITS = {
  free: {
    ai_lesson_plan: 5,
    classes: 2,
    students: 20,
  },
  pro: {
    ai_lesson_plan: 50,
    classes: -1, // unlimited
    students: -1, // unlimited
  },
};

export async function checkUsageLimit(
  userId: string,
  type: 'ai_lesson_plan' | 'classes' | 'students'
) {
  const supabase = await createClient();

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();

  const plan = subscription ? 'pro' : 'free';
  const limit = LIMITS[plan][type];

  // Unlimited
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  // Get current usage this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', startOfMonth.toISOString());

  const used = count || 0;
  const remaining = limit - used;

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    used,
  };
}

export async function recordUsage(
  userId: string,
  type: 'ai_lesson_plan' | 'classes' | 'students'
) {
  const supabase = await createClient();

  await supabase.from('usage').insert({
    user_id: userId,
    type,
  });
}