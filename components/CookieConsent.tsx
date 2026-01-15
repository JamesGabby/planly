// components/CookieConsent.tsx

'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
    // Initialize analytics here if accepted
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 mb-4 md:mb-0 md:mr-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              🍪 Cookie Preferences
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies to enhance your experience. By continuing to visit 
              this site you agree to our use of cookies.{' '}
              <a 
                href="/cookie-policy" 
                className="text-blue-600 hover:underline"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Necessary Only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}