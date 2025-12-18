'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Subscription {
  id: string;
  status: string;
  price_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setSubscription(data);
      }

      setLoading(false);
    };

    fetchSubscription();
  }, []);

  const isPro = subscription?.status === 'active' || subscription?.status === 'trialing';

  return { subscription, loading, isPro };
}