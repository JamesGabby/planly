// app/gdpr/page.tsx

import React from 'react';

export const metadata = {
  title: 'GDPR & Your Privacy Rights | Lessonly',
  description: 'Information about your data protection rights under UK GDPR and EU GDPR',
};

export default function GDPRPage() {
  const appName = "Lessonly";
  const companyName = "Lessonly Ltd";
  const companyNumber = "";
  const registeredAddress = "";
  const contactEmail = "contact@lessonly.co.uk";
  const dpoName = "Data Protection Officer";
  const dpoEmail = "contact@lessonly.co.uk";
  const websiteUrl = "https://lessonly.co.uk";
  const lastUpdated = "15 January 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GDPR & Your Privacy Rights
          </h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">

            {/* Introduction */}
            <section className="mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                  Your Data, Your Rights
                </h2>
                <p className="text-blue-800">
                  At {appName}, we are committed to protecting your personal data
                  and respecting your privacy rights. This page explains your rights
                  under the UK General Data Protection Regulation (UK GDPR) and the
                  EU General Data Protection Regulation (EU GDPR), and how you can
                  exercise them.
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                The General Data Protection Regulation (GDPR) is a comprehensive
                data protection law that gives individuals control over their
                personal data. Whether you are based in the United Kingdom or the
                European Economic Area (EEA), you have specific rights regarding
                how your personal data is collected, used, and stored.
              </p>
              <p className="text-gray-700">
                This page should be read in conjunction with our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>, which provides full details about how we process your
                personal data.
              </p>
            </section>

            {/* Section 1: Data Controller */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Data Controller Information
              </h2>
              <p className="text-gray-700 mb-4">
                Under GDPR, the &quot;data controller&quot; is the organisation that determines
                the purposes and means of processing personal data. For {appName},
                the data controller is:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700 mb-4">
                <p className="font-semibold text-gray-900">{companyName}</p>
                <p>Company Registration Number: {companyNumber}</p>
                <p>Registered Address: {registeredAddress}</p>
                <p>Website: {websiteUrl}</p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Data Protection Officer (DPO)
              </h3>
              <p className="text-gray-700 mb-4">
                We have appointed a Data Protection Officer to oversee our data
                protection strategy and ensure compliance with GDPR. You can contact
                our DPO for any data protection queries:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
                <p className="font-semibold text-gray-900">{dpoName}</p>
                <p>Email:{' '}
                  <a
                    href={`mailto:${dpoEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {dpoEmail}
                  </a>
                </p>
                <p>Address: {registeredAddress}</p>
              </div>
            </section>

            {/* Section 2: Legal Bases */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Legal Bases for Processing
              </h2>
              <p className="text-gray-700 mb-4">
                Under Article 6 of the GDPR, we must have a valid legal basis to
                process your personal data. We rely on the following legal bases:
              </p>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">A</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Contract Performance (Article 6(1)(b))
                      </h4>
                      <p className="text-gray-700 mt-1">
                        Processing necessary to perform our contract with you or to
                        take steps at your request before entering into a contract.
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Examples:</strong> Creating your account, providing
                        the {appName} service, processing payments, customer support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-semibold">B</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Legitimate Interests (Article 6(1)(f))
                      </h4>
                      <p className="text-gray-700 mt-1">
                        Processing necessary for our legitimate interests or those
                        of a third party, provided your rights don&apos;t override those
                        interests.
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Examples:</strong> Improving our services, analytics,
                        fraud prevention, security monitoring, business administration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">C</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Consent (Article 6(1)(a))
                      </h4>
                      <p className="text-gray-700 mt-1">
                        Processing based on your specific, informed, and unambiguous
                        consent. You can withdraw consent at any time.
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Examples:</strong> Marketing communications, optional
                        analytics cookies, newsletter subscriptions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">D</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Legal Obligation (Article 6(1)(c))
                      </h4>
                      <p className="text-gray-700 mt-1">
                        Processing necessary to comply with a legal obligation to
                        which we are subject.
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Examples:</strong> Tax and accounting requirements,
                        responding to lawful requests from authorities, regulatory
                        compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Legitimate Interests Assessment
                </h4>
                <p className="text-yellow-700 text-sm">
                  Where we rely on legitimate interests, we have conducted a
                  Legitimate Interests Assessment (LIA) to balance our interests
                  against your rights and freedoms. You can request a copy of our
                  LIA by contacting our DPO.
                </p>
              </div>

              {/* Update Section 2: Legal Bases to include AI */}

              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">E</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      AI Processing (Article 6(1)(b) and 6(1)(a))
                    </h4>
                    <p className="text-gray-700 mt-1">
                      Processing of your prompts and inputs by AI systems to provide the
                      lesson generation service you have requested.
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      <strong>Legal basis:</strong> Contract performance (providing the
                      service you requested) and, where applicable, consent for optional
                      AI features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add new section about AI and Automated Decision-Making */}

              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  [X]. AI Processing and Automated Decision-Making
                </h2>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-6">
                  <p className="text-purple-800">
                    {appName} uses artificial intelligence to generate educational content.
                    This section explains how AI processing relates to your GDPR rights.
                  </p>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].1 Nature of AI Processing
                </h3>
                <p className="text-gray-700 mb-4">
                  When you use our AI-powered lesson generation features:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                  <li>Your prompts and inputs are processed by AI systems to generate content</li>
                  <li>This processing is automated but does not constitute &quot;automated
                    decision-making&quot; under Article 22 of the GDPR</li>
                  <li>AI outputs are suggestions and tools – no decisions with legal or
                    similarly significant effects are made solely by AI</li>
                  <li>You maintain full control over whether to use, modify, or discard
                    AI-generated content</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].2 Article 22 - Automated Decision-Making
                </h3>
                <p className="text-gray-700 mb-4">
                  Article 22 of the GDPR gives you the right not to be subject to decisions
                  based solely on automated processing that produce legal effects or
                  similarly significantly affect you.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800">
                    <strong>Our AI features do not fall under Article 22 because:</strong>
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-green-700 text-sm space-y-1">
                    <li>AI-generated lesson content does not produce legal effects on you</li>
                    <li>AI suggestions do not similarly significantly affect you – they are
                      tools to assist your work</li>
                    <li>You have full human oversight and control over all AI outputs</li>
                    <li>No automated decisions are made about your account, access, or rights</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].3 Data Sent to AI Providers
                </h3>
                <p className="text-gray-700 mb-4">
                  When you use AI features, the following data is processed:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Data Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Legal Basis</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Retention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Lesson prompts</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Generate content</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Transient (up to 30 days by provider)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Subject/topic</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Context for generation</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Transient</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Year group/key stage</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Age-appropriate content</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Transient</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Curriculum preferences</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Aligned content</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Transient</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].4 AI Providers and International Transfers
                </h3>
                <p className="text-gray-700 mb-4">
                  Our AI features are powered by third-party providers. Data transfers to
                  these providers are protected by:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Provider</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Transfer Safeguard</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Training Data Policy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., OpenAI]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., USA]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., SCCs + UK Addendum]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Data not used for training</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., Anthropic]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., USA]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">[e.g., SCCs + UK Addendum]</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Data not used for training</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].5 Your Rights Regarding AI Processing
                </h3>
                <p className="text-gray-700 mb-4">
                  In relation to AI processing, you have the right to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                  <li><strong>Information:</strong> Know when AI is being used to process your data (this page)</li>
                  <li><strong>Access:</strong> Request information about AI processing of your data</li>
                  <li><strong>Choice:</strong> Use {appName} without AI features if you prefer</li>
                  <li><strong>Deletion:</strong> Request deletion of AI-generated content and associated data</li>
                  <li><strong>Object:</strong> Object to AI processing based on legitimate interests</li>
                  <li><strong>Human review:</strong> Request human review of any concerns about AI outputs</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].6 AI Training and Your Data
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Important: Your Data Is Not Used to Train AI Models
                  </h4>
                  <p className="text-blue-800 text-sm mb-2">
                    We have contractual agreements with our AI providers ensuring that:
                  </p>
                  <ul className="list-disc pl-6 text-blue-700 text-sm space-y-1">
                    <li>Your prompts and inputs are not used to train or improve AI models</li>
                    <li>AI-generated outputs are not used to train AI models</li>
                    <li>Your data is processed only to provide the requested service</li>
                    <li>Data is handled in accordance with our Data Processing Agreements</li>
                  </ul>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  [X].7 Data Protection Impact Assessment (DPIA)
                </h3>
                <p className="text-gray-700">
                  In accordance with Article 35 of the GDPR, we have conducted a Data
                  Protection Impact Assessment for our AI features. This assessment
                  evaluates the risks to your rights and freedoms and the measures we
                  have implemented to mitigate those risks. You may request a summary
                  of our DPIA by contacting our Data Protection Officer.
                </p>
              </section>
            </section>

            {/* Section 3: Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Your Data Protection Rights
              </h2>
              <p className="text-gray-700 mb-6">
                Under UK GDPR and EU GDPR, you have the following rights regarding
                your personal data. These rights are not absolute and may be subject
                to certain conditions and exemptions.
              </p>

              {/* Right 1: Access */}
              <div className="mb-6 border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🔍 Right of Access (Article 15)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to obtain confirmation as to whether we process
                  your personal data and, if so, to request access to that data. This
                  is commonly known as a &quot;Subject Access Request&quot; (SAR).
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>What you can request:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Confirmation that we process your data</li>
                    <li>A copy of your personal data</li>
                    <li>Information about processing purposes</li>
                    <li>Categories of data we hold</li>
                    <li>Recipients of your data</li>
                    <li>Retention periods</li>
                    <li>Source of the data (if not collected from you)</li>
                    <li>Information about automated decision-making</li>
                  </ul>
                </div>
              </div>

              {/* Right 2: Rectification */}
              <div className="mb-6 border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ✏️ Right to Rectification (Article 16)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to request correction of inaccurate personal
                  data and to have incomplete data completed.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>How to rectify your data:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Update your profile directly in your {appName} account settings</li>
                    <li>Contact us to request corrections to data you cannot edit yourself</li>
                    <li>We will respond within one month</li>
                  </ul>
                </div>
              </div>

              {/* Right 3: Erasure */}
              <div className="mb-6 border-l-4 border-red-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🗑️ Right to Erasure / &quot;Right to be Forgotten&quot; (Article 17)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to request deletion of your personal data in
                  certain circumstances.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>When you can request erasure:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>The data is no longer necessary for its original purpose</li>
                    <li>You withdraw consent (where consent was the legal basis)</li>
                    <li>You object to processing and there are no overriding legitimate grounds</li>
                    <li>The data has been unlawfully processed</li>
                    <li>Legal obligation requires erasure</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> We may not be able to delete your data if
                    we need to keep it for legal compliance, legal claims, or other
                    lawful purposes. We will inform you if this is the case.
                  </p>
                </div>
              </div>

              {/* Right 4: Restriction */}
              <div className="mb-6 border-l-4 border-yellow-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ⏸️ Right to Restriction of Processing (Article 18)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to request that we restrict processing of your
                  personal data in certain circumstances.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>When you can request restriction:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>You contest the accuracy of the data (while we verify it)</li>
                    <li>Processing is unlawful but you prefer restriction over erasure</li>
                    <li>We no longer need the data but you need it for legal claims</li>
                    <li>You have objected to processing (pending verification)</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3">
                    When processing is restricted, we will only store your data and
                    not process it further without your consent (unless for legal claims,
                    protecting others&apos; rights, or important public interest).
                  </p>
                </div>
              </div>

              {/* Right 5: Data Portability */}
              <div className="mb-6 border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  📦 Right to Data Portability (Article 20)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to receive your personal data in a structured,
                  commonly used, machine-readable format and to transmit it to another
                  controller.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>This right applies when:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Processing is based on consent or contract</li>
                    <li>Processing is carried out by automated means</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3">
                    <strong>Data formats we provide:</strong> JSON, CSV
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    You can export your data directly from your {appName} account
                    settings, or contact us for assistance.
                  </p>
                </div>
              </div>

              {/* Right 6: Object */}
              <div className="mb-6 border-l-4 border-orange-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ✋ Right to Object (Article 21)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right to object to processing of your personal data
                  in certain circumstances.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>You can object to:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>
                      <strong>Direct marketing:</strong> You have an absolute right
                      to object to processing for direct marketing purposes. We will
                      stop immediately.
                    </li>
                    <li>
                      <strong>Legitimate interests:</strong> You can object to
                      processing based on legitimate interests. We must stop unless
                      we have compelling legitimate grounds.
                    </li>
                    <li>
                      <strong>Research/statistics:</strong> You can object to
                      processing for scientific, historical research, or statistical
                      purposes (unless in the public interest).
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>How to object:</strong> Email{' '}
                    <a
                      href={`mailto:${dpoEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {dpoEmail}
                    </a>{' '}
                    with details of your objection, or use the unsubscribe link in
                    marketing emails.
                  </p>
                </div>
              </div>

              {/* Right 7: Automated Decision-Making */}
              <div className="mb-6 border-l-4 border-indigo-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🤖 Rights Related to Automated Decision-Making (Article 22)
                </h3>
                <p className="text-gray-700 mb-3">
                  You have the right not to be subject to a decision based solely on
                  automated processing, including profiling, which produces legal
                  effects or similarly significantly affects you.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Our approach:</strong>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {appName} does not currently make any solely automated decisions
                    that have legal or similarly significant effects on users. If this
                    changes, we will update this policy and ensure you have the right
                    to obtain human intervention, express your point of view, and
                    contest the decision.
                  </p>
                </div>
              </div>

              {/* Right 8: Withdraw Consent */}
              <div className="mb-6 border-l-4 border-pink-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ↩️ Right to Withdraw Consent (Article 7)
                </h3>
                <p className="text-gray-700 mb-3">
                  Where we process your data based on consent, you have the right to
                  withdraw that consent at any time.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>How to withdraw consent:</strong>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                    <li>Update your preferences in account settings</li>
                    <li>Click &quot;unsubscribe&quot; in marketing emails</li>
                    <li>Update cookie preferences via our cookie banner</li>
                    <li>Contact us at{' '}
                      <a
                        href={`mailto:${dpoEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {dpoEmail}
                      </a>
                    </li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3">
                    <strong>Note:</strong> Withdrawing consent does not affect the
                    lawfulness of processing carried out before withdrawal.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: How to Exercise Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. How to Exercise Your Rights
              </h2>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Submit a Data Subject Request
                </h3>
                <p className="text-gray-700 mb-4">
                  You can exercise any of your rights by contacting us using the
                  methods below:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">📧 Email</h4>
                    <a
                      href={`mailto:${dpoEmail}?subject=Data Subject Request`}
                      className="text-blue-600 hover:underline"
                    >
                      {dpoEmail}
                    </a>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">📝 Post</h4>
                    <p className="text-gray-600 text-sm">
                      Data Protection Officer<br />
                      {companyName}<br />
                      {registeredAddress}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                What to Include in Your Request
              </h3>
              <p className="text-gray-700 mb-4">
                To help us process your request efficiently, please include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Your full name and email address associated with your {appName} account</li>
                <li>The specific right(s) you wish to exercise</li>
                <li>Any relevant details to help us identify the data concerned</li>
                <li>Preferred format for receiving data (for access/portability requests)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Identity Verification
              </h3>
              <p className="text-gray-700 mb-4">
                To protect your data, we may need to verify your identity before
                processing your request. This may include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Confirming information we already hold about you</li>
                <li>Requesting a copy of identification documents</li>
                <li>Verifying via your registered email address</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Response Times
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Stage</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Timeframe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Acknowledgement of request</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Within 5 working days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Standard response</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Within 1 month</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Complex requests (extension)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 3 months total</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm">
                If we need to extend the response time, we will inform you within
                one month of receiving your request, explaining why the extension
                is necessary.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
                Fees
              </h3>
              <p className="text-gray-700 mb-4">
                In most cases, you will not have to pay a fee to exercise your
                rights. However, we may charge a reasonable fee if your request is:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Manifestly unfounded or excessive</li>
                <li>Repetitive</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Alternatively, we may refuse to comply with the request in such
                circumstances. If we charge a fee or refuse your request, we will
                inform you and explain our reasons.
              </p>
            </section>

            {/* Section 5: Data We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Personal Data We Process
              </h2>
              <p className="text-gray-700 mb-4">
                For full details about the personal data we collect, please see our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>. Below is a summary:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Examples</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Identity Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Name, username, title</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Contact Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Email address, phone number</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Professional Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">School name, job title, subjects taught</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Account Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Username, password (encrypted)</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Technical Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">IP address, browser type, device info</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate Interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Usage Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Pages visited, features used</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate Interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Content Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Lesson plans, resources, documents</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Contract</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Marketing Data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Preferences, subscriptions</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Consent</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Special Category Data
                </h4>
                <p className="text-green-700 text-sm">
                  We do not intentionally collect special category data (e.g.,
                  racial or ethnic origin, political opinions, religious beliefs,
                  health data, biometric data). If you include such data in your
                  content, you do so at your own discretion.
                </p>
              </div>
            </section>

            {/* Section 6: Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your personal data only for as long as necessary to
                fulfil the purposes for which it was collected, in accordance with
                Article 5(1)(e) of the GDPR (storage limitation principle).
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Data Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Retention Period</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Account data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Duration of account + 30 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Service provision</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">User content</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Until deleted or account closure + 30 days</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Service provision</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Transaction records</td>
                      <td className="px-4 py-3 text-sm text-gray-700">7 years</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legal obligation (tax/accounting)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Analytics data</td>
                      <td className="px-4 py-3 text-sm text-gray-700">26 months</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Marketing consent</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Until withdrawn + 3 years</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legal compliance</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Support tickets</td>
                      <td className="px-4 py-3 text-sm text-gray-700">3 years after resolution</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Security logs</td>
                      <td className="px-4 py-3 text-sm text-gray-700">12 months</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Security/legitimate interests</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700">
                After the retention period expires, your data will be securely
                deleted or anonymised.
              </p>
            </section>

            {/* Section 7: International Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your personal data may be transferred to, stored, and processed in
                countries outside the United Kingdom and European Economic Area
                (EEA). When we transfer your data internationally, we ensure
                appropriate safeguards are in place as required by Articles 44-49
                of the GDPR.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Transfer Mechanisms We Use
              </h3>
              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    ✅ Adequacy Decisions
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Transfers to countries recognised by the UK Government or
                    European Commission as providing adequate protection for
                    personal data.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    ✅ Standard Contractual Clauses (SCCs)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    EU Commission-approved standard contractual clauses that provide
                    appropriate safeguards for data transfers.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    ✅ International Data Transfer Agreement (IDTA)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    UK-specific transfer agreement approved by the ICO for transfers
                    from the UK.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    ✅ UK Addendum to EU SCCs
                  </h4>
                  <p className="text-gray-600 text-sm">
                    The UK Addendum used alongside EU SCCs to cover UK data transfers.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Our Data Sub-Processors
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Safeguard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Supabase</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Database & authentication</td>
                      <td className="px-4 py-3 text-sm text-gray-700">EU (Frankfurt) / USA</td>
                      <td className="px-4 py-3 text-sm text-gray-700">SCCs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Vercel</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Hosting</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Global CDN</td>
                      <td className="px-4 py-3 text-sm text-gray-700">SCCs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">[Payment Provider]</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment processing</td>
                      <td className="px-4 py-3 text-sm text-gray-700">[Location]</td>
                      <td className="px-4 py-3 text-sm text-gray-700">[Safeguard]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">[Email Provider]</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Transactional emails</td>
                      <td className="px-4 py-3 text-sm text-gray-700">[Location]</td>
                      <td className="px-4 py-3 text-sm text-gray-700">[Safeguard]</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700">
                You may request a copy of the safeguards we have put in place for
                international transfers by contacting our DPO at{' '}
                <a
                  href={`mailto:${dpoEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {dpoEmail}
                </a>.
              </p>
            </section>

            {/* Section 8: Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Security Measures
              </h2>
              <p className="text-gray-700 mb-4">
                In accordance with Article 32 of the GDPR, we have implemented
                appropriate technical and organisational measures to ensure a
                level of security appropriate to the risk.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🔐 Technical Measures
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• TLS/SSL encryption in transit</li>
                    <li>• AES-256 encryption at rest</li>
                    <li>• Secure password hashing (bcrypt)</li>
                    <li>• Row-level security policies</li>
                    <li>• Regular security patching</li>
                    <li>• Intrusion detection systems</li>
                    <li>• Regular penetration testing</li>
                    <li>• Automated vulnerability scanning</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📋 Organisational Measures
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Data protection policies</li>
                    <li>• Staff training on GDPR</li>
                    <li>• Access controls (need-to-know basis)</li>
                    <li>• Confidentiality agreements</li>
                    <li>• Vendor due diligence</li>
                    <li>• Incident response procedures</li>
                    <li>• Regular policy reviews</li>
                    <li>• Data protection impact assessments</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                Data Breach Notification
              </h3>
              <p className="text-gray-700">
                In the event of a personal data breach that poses a risk to your
                rights and freedoms, we will notify the relevant supervisory
                authority within 72 hours of becoming aware of the breach (as
                required by Article 33). If the breach is likely to result in a
                high risk to your rights and freedoms, we will also notify you
                directly (Article 34).
              </p>
            </section>

            {/* Section 9: Complaints */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Complaints & Supervisory Authorities
              </h2>
              <p className="text-gray-700 mb-4">
                If you are not satisfied with how we handle your personal data or
                respond to your requests, you have the right to lodge a complaint
                with a supervisory authority.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🇬🇧 UK Users
                  </h3>
                  <p className="font-medium text-gray-900">
                    Information Commissioner&apos;s Office (ICO)
                  </p>
                  <div className="text-gray-600 text-sm mt-2 space-y-1">
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
                    <p>Live chat:{' '}
                      <a
                        href="https://ico.org.uk/global/contact-us/live-chat"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ico.org.uk/live-chat
                      </a>
                    </p>
                    <p className="pt-2">
                      Address:<br />
                      Wycliffe House<br />
                      Water Lane<br />
                      Wilmslow<br />
                      Cheshire SK9 5AF
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🇪🇺 EU/EEA Users
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    You may lodge a complaint with your local data protection
                    authority. A list of EU/EEA supervisory authorities can be
                    found at:
                  </p>
                  <a
                    href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    European Data Protection Board - Members
                  </a>
                  <p className="text-gray-600 text-sm mt-4">
                    Common supervisory authorities:
                  </p>
                  <ul className="text-gray-600 text-sm mt-1 space-y-1">
                    <li>• Ireland: Data Protection Commission</li>
                    <li>• Germany: State data protection authorities</li>
                    <li>• France: CNIL</li>
                    <li>• Netherlands: Autoriteit Persoonsgegevens</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Before contacting a supervisory authority:</strong> We
                  would appreciate the opportunity to address your concerns directly.
                  Please contact our Data Protection Officer at{' '}
                  <a
                    href={`mailto:${dpoEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {dpoEmail}
                  </a>{' '}
                  first, and we will do our best to resolve your issue.
                </p>
              </div>
            </section>

            {/* Section 10: Changes */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to This GDPR Information
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this GDPR information page from time to time to
                reflect changes in our practices or legal requirements. We will
                notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Posting the updated information on this page</li>
                <li>Updating the &quot;Last updated&quot; date</li>
                <li>Sending an email notification for significant changes</li>
                <li>Displaying a notice when you log in to {appName}</li>
              </ul>
            </section>

            {/* Section 11: Contact */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Our Data Protection Team
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this GDPR information, your rights,
                or our data practices, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Data Protection Officer
                  </h3>
                  <p className="text-gray-700">{dpoName}</p>
                  <p className="text-gray-700">
                    Email:{' '}
                    <a
                      href={`mailto:${dpoEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {dpoEmail}
                    </a>
                  </p>
                  <p className="text-gray-700 mt-2">
                    {companyName}<br />
                    {registeredAddress}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    General Enquiries
                  </h3>
                  <p className="text-gray-700">
                    Email:{' '}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Website:{' '}
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
              </div>
            </section>

            {/* Quick Links */}
            <section className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Related Pages
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/privacy-policy"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
                >
                  📄 Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
                >
                  📋 Terms of Service
                </a>
                <a
                  href="/cookie-policy"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
                >
                  🍪 Cookie Policy
                </a>
              </div>
            </section>

            {/* GDPR Articles Reference */}
            <section className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                GDPR Articles Referenced
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                This page references the following GDPR articles:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 5</span>
                  <p className="text-gray-600">Principles</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 6</span>
                  <p className="text-gray-600">Lawfulness</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 7</span>
                  <p className="text-gray-600">Consent</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 12-14</span>
                  <p className="text-gray-600">Transparency</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 15</span>
                  <p className="text-gray-600">Right of Access</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 16</span>
                  <p className="text-gray-600">Rectification</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 17</span>
                  <p className="text-gray-600">Erasure</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 18</span>
                  <p className="text-gray-600">Restriction</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 20</span>
                  <p className="text-gray-600">Portability</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 21</span>
                  <p className="text-gray-600">Right to Object</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 22</span>
                  <p className="text-gray-600">Automated Decisions</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 32-34</span>
                  <p className="text-gray-600">Security & Breach</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 44-49</span>
                  <p className="text-gray-600">Int&apos;l Transfers</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <span className="font-semibold text-gray-900">Art. 77</span>
                  <p className="text-gray-600">Right to Complain</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}