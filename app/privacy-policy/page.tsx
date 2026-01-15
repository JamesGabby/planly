// app/privacy-policy/page.tsx

import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Lessonly',
  description: 'Privacy Policy for Lessonly - A platform for teachers and educators',
};

export default function PrivacyPolicyPage() {
  const appName = "Lessonly";
  const companyName = "Lessonly Ltd";
  const companyNumber = "";
  const registeredAddress = "";
  const contactEmail = "contact@lessonly.co.uk";
  const dpoEmail = "contact@lessonly.co.uk";
  const websiteUrl = "https://lessonly.co.uk";
  const lastUpdated = "15 January 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to {appName}. We are committed to protecting and respecting
                your privacy in accordance with the UK General Data Protection
                Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="text-gray-700 mb-4">
                This Privacy Policy explains how we collect, use, store, and protect
                your personal data when you use our web application designed for
                teachers and educators.
              </p>
              <p className="text-gray-700">
                Please read this policy carefully to understand our practices
                regarding your personal data. By using {appName}, you acknowledge
                that you have read and understood this Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Data Controller
              </h2>
              <p className="text-gray-700 mb-4">
                For the purposes of UK data protection law, the data controller is:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700 mb-4">
                <p className="font-semibold text-gray-900">{companyName}</p>
                <p>Company Registration Number: {companyNumber}</p>
                <p>Registered Address: {registeredAddress}</p>
                <p>Email:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </p>
              </div>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data
                practices, please contact our Data Protection Officer at{' '}
                <a
                  href={`mailto:${dpoEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {dpoEmail}
                </a>.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Personal Data We Collect
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.1 Information You Provide
              </h3>
              <p className="text-gray-700 mb-2">
                We collect personal data that you voluntarily provide when
                registering or using {appName}:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li><strong>Identity Data:</strong> Full name, username, title</li>
                <li><strong>Contact Data:</strong> Email address, phone number (optional)</li>
                <li><strong>Professional Data:</strong> School/institution name, job title, subjects taught, key stage/year groups</li>
                <li><strong>Account Data:</strong> Username and password (encrypted)</li>
                <li><strong>Profile Data:</strong> Profile picture, preferences, settings</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.2 Information Collected Automatically
              </h3>
              <p className="text-gray-700 mb-2">
                When you use our Service, we automatically collect:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, device type</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on pages, click patterns</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                <li><strong>Log Data:</strong> Access times, error logs, referring URLs</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.3 Educational Content
              </h3>
              <p className="text-gray-700 mb-2">
                We collect content you create or upload:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Lesson plans and schemes of work</li>
                <li>Teaching resources and materials</li>
                <li>Timetables and calendar events</li>
                <li>Notes, comments, and annotations</li>
                <li>Uploaded documents and files</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Lawful Basis for Processing
              </h2>
              <p className="text-gray-700 mb-4">
                Under UK GDPR, we must have a lawful basis for processing your
                personal data. We rely on the following legal bases:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Lawful Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Creating and managing your account</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Providing the Service</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Processing payments</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Sending service updates and notifications</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract performance / Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Improving our Service</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Analytics and performance monitoring</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Marketing communications</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Consent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Preventing fraud and ensuring security</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate interests / Legal obligation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Complying with legal requirements</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legal obligation</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700">
                <strong>Legitimate Interests:</strong> Where we rely on legitimate
                interests, we have conducted a balancing test to ensure our interests
                do not override your fundamental rights and freedoms.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. How We Use Your Personal Data
              </h2>
              <p className="text-gray-700 mb-2">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>To register you as a user and create your account</li>
                <li>To provide, operate, and maintain the {appName} Service</li>
                <li>To personalise your experience and deliver relevant content</li>
                <li>To process transactions and manage billing</li>
                <li>To communicate with you about your account, updates, and support</li>
                <li>To send you marketing communications (where you have consented)</li>
                <li>To analyse usage patterns and improve our Service</li>
                <li>To detect, prevent, and address technical issues or security threats</li>
                <li>To comply with our legal and regulatory obligations</li>
                <li>To enforce our Terms of Service</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal data to third parties. We may share
                your personal data only in the following circumstances:
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.1 Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We share data with trusted third-party service providers who assist
                us in operating our Service:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li><strong>Supabase:</strong> Database hosting and authentication (data may be processed in the EU/EEA)</li>
                <li><strong>Payment processors:</strong> To process subscription payments</li>
                <li><strong>Email service providers:</strong> To send transactional emails</li>
                <li><strong>Analytics providers:</strong> To analyse Service usage</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All service providers are contractually bound to process your data
                only on our instructions and in compliance with UK GDPR.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your personal data if required to do so by law or
                in response to valid requests by public authorities (e.g., a court
                or government agency).
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.3 Business Transfers
              </h3>
              <p className="text-gray-700">
                If we are involved in a merger, acquisition, or sale of assets,
                your personal data may be transferred. We will provide notice
                before your data is transferred and becomes subject to a different
                privacy policy.
              </p>
            </section>

            {/* Add after Section 5 (How We Use Your Personal Data) */}

            {/* Section 6: AI and Automated Processing */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6.4. Artificial Intelligence and Automated Processing
              </h2>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-6">
                <p className="text-purple-800">
                  <strong>Important:</strong> {appName} uses artificial intelligence (AI)
                  technology to help generate lesson plans and educational content. This
                  section explains how we use AI and how your data is processed.
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.5 How We Use AI
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} incorporates AI-powered features to assist teachers in creating
                educational content. Our AI features include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Generating lesson plan suggestions and outlines</li>
                <li>Creating learning objectives and success criteria</li>
                <li>Suggesting teaching activities and resources</li>
                <li>Generating differentiated content for various ability levels</li>
                <li>Creating assessment questions and quizzes</li>
                <li>Providing curriculum-aligned content suggestions</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.6 AI Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                To provide our AI features, we use third-party AI service providers.
                When you use AI features, the following data may be shared with these
                providers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Your prompts and instructions (e.g., topic, year group, subject)</li>
                <li>Context you provide about the lesson</li>
                <li>Selected preferences (e.g., curriculum, difficulty level)</li>
              </ul>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Data Shared</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">[AI PROVIDER - e.g., OpenAI]</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Content generation</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Prompts, context</td>
                      <td className="px-4 py-3 text-sm text-gray-700">[LOCATION]</td>
                    </tr>
                    {/* Add other AI providers as needed */}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.7 Data Sent to AI Providers
              </h3>
              <p className="text-gray-700 mb-4">
                When you use our AI features, we send the following information to our
                AI service providers:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Data We DO Send</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Your lesson generation prompts</li>
                    <li>• Subject, topic, and year group</li>
                    <li>• Curriculum preferences (e.g., National Curriculum)</li>
                    <li>• Lesson duration and structure preferences</li>
                    <li>• Differentiation requirements you specify</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Data We DO NOT Send</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Your name or email address</li>
                    <li>• Your school or institution name</li>
                    <li>• Student names or personal data</li>
                    <li>• Your account credentials</li>
                    <li>• Payment information</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.8 AI Training Data
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 mb-2">
                  <strong>Your data is not used to train AI models.</strong>
                </p>
                <p className="text-blue-700 text-sm">
                  We have agreements with our AI providers that your prompts and the
                  content generated for you will not be used to train their AI models.
                  Your data is processed only to provide you with the requested output.
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.9 AI Data Retention
              </h3>
              <p className="text-gray-700 mb-4">
                Data sent to AI providers for processing:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Is processed in real-time to generate your content</li>
                <li>May be temporarily retained by the provider for up to 30 days for
                  abuse monitoring and safety purposes</li>
                <li>Is not permanently stored by AI providers</li>
                <li>Generated content is stored in your {appName} account until you
                  delete it</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.10 Your Choices Regarding AI
              </h3>
              <p className="text-gray-700 mb-4">
                You have the following choices regarding AI features:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>AI features are optional – you can create content manually without
                  using AI</li>
                <li>You can review, edit, or delete any AI-generated content</li>
                <li>You maintain full control over whether to use or save AI-generated
                  content</li>
                <li>You can request information about AI processing by contacting us</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your personal data may be transferred to, and processed in,
                countries outside the United Kingdom. When we transfer your data
                outside the UK, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Transfers to countries with an adequacy decision from the UK Government</li>
                <li>Standard Contractual Clauses (SCCs) approved by the ICO</li>
                <li>International Data Transfer Agreement (IDTA)</li>
                <li>Binding Corporate Rules where applicable</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You may request a copy of the safeguards we have put in place by
                contacting us at{' '}
                <a
                  href={`mailto:${dpoEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {dpoEmail}
                </a>.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We have implemented appropriate technical and organisational
                measures to protect your personal data against unauthorised or
                unlawful processing, accidental loss, destruction, or damage.
                These measures include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                <li>Secure password hashing using industry-standard algorithms</li>
                <li>Row-level security policies for database access</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular automated backups</li>
                <li>Staff training on data protection</li>
              </ul>
              <p className="text-gray-700">
                Whilst we implement safeguards designed to protect your data, no
                security system is impenetrable. We cannot guarantee the absolute
                security of your data.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your personal data only for as long as necessary to
                fulfil the purposes for which it was collected, including to
                satisfy any legal, accounting, or reporting requirements.
              </p>
              <p className="text-gray-700 mb-4">
                To determine the appropriate retention period, we consider:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                <li>The nature and sensitivity of the personal data</li>
                <li>The potential risk of harm from unauthorised use or disclosure</li>
                <li>The purposes for which we process the data</li>
                <li>Applicable legal requirements</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Retention periods:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Account data:</strong> Retained whilst your account is active, plus 30 days after deletion</li>
                <li><strong>User content:</strong> Deleted within 30 days of account deletion</li>
                <li><strong>Transaction records:</strong> 7 years (legal requirement)</li>
                <li><strong>Usage/analytics data:</strong> 26 months</li>
                <li><strong>Marketing consent records:</strong> 3 years after last interaction</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Your Rights Under UK GDPR
              </h2>
              <p className="text-gray-700 mb-4">
                Under UK data protection law, you have the following rights:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right of Access</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to request a copy of the personal data we hold about you (known as a &quot;Subject Access Request&quot;).
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Rectification</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to request correction of inaccurate or incomplete personal data.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Erasure (&quot;Right to be Forgotten&quot;)</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to request deletion of your personal data in certain circumstances.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Restrict Processing</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to request that we restrict processing of your personal data in certain circumstances.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Data Portability</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to receive your personal data in a structured, commonly used, machine-readable format.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Object</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right to object to processing based on legitimate interests or for direct marketing purposes.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Right to Withdraw Consent</h4>
                  <p className="text-gray-700 text-sm">
                    Where processing is based on consent, you have the right to withdraw consent at any time.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Rights Related to Automated Decision-Making</h4>
                  <p className="text-gray-700 text-sm">
                    You have the right not to be subject to decisions based solely on automated processing that significantly affect you.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mt-6 mb-4">
                <strong>To exercise any of these rights:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Email us at{' '}
                  <a
                    href={`mailto:${dpoEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {dpoEmail}
                  </a>
                </li>
                <li>We will respond to your request within one month</li>
                <li>We may ask for identification to verify your identity</li>
                <li>These rights are generally free to exercise, but we may charge a reasonable fee for excessive or unfounded requests</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Cookies and Similar Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                {appName} uses cookies and similar tracking technologies. Cookies
                are small text files stored on your device that help us provide
                and improve our Service.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Types of Cookies We Use
              </h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Strictly Necessary Cookies:</strong> Essential for the
                  Service to function (authentication, security). These cannot be
                  disabled.
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and settings to enhance your experience.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how you
                  use the Service so we can improve it.
                </li>
              </ul>

              <p className="text-gray-700 mb-4">
                <strong>Managing Cookies:</strong> You can control and manage
                cookies through your browser settings. Please note that disabling
                certain cookies may affect the functionality of {appName}.
              </p>

              <p className="text-gray-700">
                For more information about our use of cookies, please see our{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Marketing Communications
              </h2>
              <p className="text-gray-700 mb-4">
                We may send you marketing communications about our products and
                services where you have given your consent or where we have a
                legitimate interest to do so (e.g., if you are an existing customer).
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Your choices:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You can opt out of marketing emails at any time by clicking the &quot;unsubscribe&quot; link</li>
                <li>You can update your marketing preferences in your account settings</li>
                <li>You can contact us at{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                Please note that even if you opt out of marketing communications,
                we may still send you service-related communications (e.g., account
                notifications, security alerts).
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                {appName} is designed for teachers and educational professionals,
                not for children. We do not knowingly collect personal data from
                children under 13 years of age.
              </p>
              <p className="text-gray-700">
                If you are a parent or guardian and believe your child has provided
                us with personal data, please contact us immediately at{' '}
                <a
                  href={`mailto:${dpoEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {dpoEmail}
                </a>. We will take steps to delete such information promptly.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Third-Party Links
              </h2>
              <p className="text-gray-700">
                {appName} may contain links to third-party websites or services.
                We are not responsible for the privacy practices of these external
                sites. We encourage you to read the privacy policies of any
                third-party sites you visit.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify
                you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the &quot;Last updated&quot; date at the top of this page</li>
                <li>Sending you an email notification (for significant changes)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We encourage you to review this Privacy Policy periodically for
                any changes.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                16. Complaints
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any concerns about our use of your personal data, you
                have the right to make a complaint at any time to the Information
                Commissioner&apos;s Office (ICO), the UK supervisory authority for data
                protection issues:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
                <p className="font-semibold text-gray-900">Information Commissioner&apos;s Office</p>
                <p>Website:{' '}
                  <a
                    href="https://ico.org.uk"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ico.org.uk
                  </a>
                </p>
                <p>Telephone: 0303 123 1113</p>
                <p>Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
              </div>
              <p className="text-gray-700 mt-4">
                We would appreciate the opportunity to address your concerns before
                you approach the ICO, so please contact us first at{' '}
                <a
                  href={`mailto:${dpoEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {dpoEmail}
                </a>.
              </p>
            </section>

            {/* Section 17 */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                17. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
                <p className="font-semibold text-gray-900">{companyName}</p>
                <p>Company Number: {companyNumber}</p>
                <p>Registered Address: {registeredAddress}</p>
                <p>Email:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </p>
                <p>Data Protection Officer:{' '}
                  <a
                    href={`mailto:${dpoEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {dpoEmail}
                  </a>
                </p>
                <p>Website:{' '}
                  <a
                    href={websiteUrl}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {websiteUrl}
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}