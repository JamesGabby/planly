// app/cookie-policy/page.tsx

import React from 'react';

export const metadata = {
  title: 'Cookie Policy | Lessonly',
  description: 'Cookie Policy for Lessonly - A platform for teachers and educators',
};

export default function CookiePolicyPage() {
  const appName = "Lessonly";
  const companyName = "Lessonly Ltd";
  const contactEmail = "contact@lessonly.co.uk";
  const lastUpdated = "15 January 2026"; 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or 
                mobile device when you visit a website. They are widely used to 
                make websites work more efficiently and to provide information to 
                the owners of the site.
              </p>
              <p className="text-gray-700">
                This Cookie Policy explains how {companyName} (&quot;we, &quot;us&quot;, or &quot;our&quot;) 
                uses cookies and similar technologies on the {appName} website and 
                application.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Authentication:</strong> To recognise you when you sign 
                  in and keep you logged in during your session
                </li>
                <li>
                  <strong>Security:</strong> To support and enable security features 
                  and help detect malicious activity
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings and 
                  preferences
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how you use our Service 
                  so we can improve it
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Types of Cookies We Use
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Strictly Necessary</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Essential for the website to function. Cannot be disabled.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Session / Persistent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Functional</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Remember your preferences and settings.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Analytics</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Help us understand how visitors use our website.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.1 Strictly Necessary Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies are essential for the website to function properly. 
                They enable core functionality such as security, authentication, 
                and accessibility. You cannot opt out of these cookies.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Cookie Name</th>
                      <th className="text-left py-2 font-medium">Provider</th>
                      <th className="text-left py-2 font-medium">Purpose</th>
                      <th className="text-left py-2 font-medium">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="py-2">sb-*-auth-token</td>
                      <td className="py-2">Supabase</td>
                      <td className="py-2">Authentication</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">__Host-*</td>
                      <td className="py-2">{appName}</td>
                      <td className="py-2">Session management</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2">csrf_token</td>
                      <td className="py-2">{appName}</td>
                      <td className="py-2">Security</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.2 Functional Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies enable enhanced functionality and personalisation. 
                They may be set by us or by third-party providers whose services 
                we have added to our pages.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Cookie Name</th>
                      <th className="text-left py-2 font-medium">Provider</th>
                      <th className="text-left py-2 font-medium">Purpose</th>
                      <th className="text-left py-2 font-medium">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="py-2">theme</td>
                      <td className="py-2">{appName}</td>
                      <td className="py-2">Remember theme preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2">locale</td>
                      <td className="py-2">{appName}</td>
                      <td className="py-2">Remember language preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.3 Analytics Cookies
              </h3>
              <p className="text-gray-700 mb-4">
                These cookies help us understand how visitors interact with our 
                website by collecting and reporting information anonymously.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Cookie Name</th>
                      <th className="text-left py-2 font-medium">Provider</th>
                      <th className="text-left py-2 font-medium">Purpose</th>
                      <th className="text-left py-2 font-medium">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="py-2">_ga</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distinguish users</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">_ga_*</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Persist session state</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gid</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distinguish users</td>
                      <td className="py-2">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Managing Cookies
              </h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                4.1 Cookie Consent
              </h3>
              <p className="text-gray-700 mb-4">
                When you first visit {appName}, you will be shown a cookie banner 
                that allows you to accept or decline non-essential cookies. You 
                can change your preferences at any time by clicking the &quot;Cookie 
                Settings&quot; link in the footer of our website.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                4.2 Browser Settings
              </h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their 
                settings. You can usually find these settings in the &quot;Options&quot; 
                or &quot;Preferences&quot; menu of your browser. The following links may 
                be helpful:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>
                  <a 
                    href="https://support.google.com/chrome/answer/95647" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie settings in Chrome
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie settings in Firefox
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie settings in Safari
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie settings in Microsoft Edge
                  </a>
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                4.3 Impact of Disabling Cookies
              </h3>
              <p className="text-gray-700">
                Please note that if you disable or delete cookies, some features 
                of {appName} may not function properly. Strictly necessary cookies 
                cannot be disabled as they are essential for the website to work.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Third-Party Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Some cookies on our website are set by third-party services. We 
                use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Supabase:</strong> For authentication and database 
                  services. See{' '}
                  <a 
                    href="https://supabase.com/privacy" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Supabase Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Google Analytics:</strong> For website analytics. See{' '}
                  <a 
                    href="https://policies.google.com/privacy" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Privacy Policy
                  </a>
                </li>
                {/* Add other third-party services as applicable */}
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Changes to This Cookie Policy
              </h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time. We will notify 
                you of any changes by posting the new Cookie Policy on this page 
                and updating the &quot;Last updated&quot; date. We encourage you to review 
                this Cookie Policy periodically.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
                <p className="font-semibold text-gray-900">{companyName}</p>
                <p>Email:{' '}
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </p>
              </div>
            </section>

            {/* More Information */}
            <section className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                More Information
              </h2>
              <p className="text-gray-700 mb-4">
                For more information about cookies and how to manage them, visit:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  <a 
                    href="https://www.aboutcookies.org" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aboutcookies.org
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.allaboutcookies.org" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.allaboutcookies.org
                  </a>
                </li>
                <li>
                  <a 
                    href="https://ico.org.uk/for-the-public/online/cookies" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ICO guidance on cookies
                  </a>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}