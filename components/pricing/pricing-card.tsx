'use client';

import { useState } from 'react';

interface PricingCardProps {
  name: string;
  price: string;
  priceId: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  priceId,
  features,
  popular,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
  setLoading(true);

  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const data = await response.json();
    
    // Log the full response
    console.log('Checkout response:', data);

    if (data.error) {
      console.error('Checkout error details:', data);
      throw new Error(data.error);
    }

    window.location.href = data.url;
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Failed to start checkout. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`rounded-lg border p-6 ${
        popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
      }`}
    >
      {popular && (
        <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="mt-2 text-3xl font-bold">
        {price}
        <span className="text-base font-normal text-gray-500">/month</span>
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
}