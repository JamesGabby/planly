// app/terms-of-service/page.tsx

import React from 'react';

export const metadata = {
  title: 'Terms of Service | Lessonly',
  description: 'Terms of Service for Lessonly - A platform for teachers and educators',
};

export default function TermsOfServicePage() {
  const appName = "Lessonly";
  const companyName = "Lessonly Ltd";
  const companyNumber = "";
  const registeredAddress = "";
  const contactEmail = "contact@lessonly.co.uk";
  const websiteUrl = "https://lessonly.co.uk";
  const lastUpdated = "15 January 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">

            {/* Important Notice */}
            <section className="mb-10 bg-blue-50 rounded-lg p-6">
              <p className="text-blue-900 font-medium mb-2">
                IMPORTANT: Please read these Terms carefully before using {appName}.
              </p>
              <p className="text-blue-800 text-sm">
                These Terms of Service constitute a legally binding agreement between
                you and {companyName}. By accessing or using our Service, you agree
                to be bound by these Terms.
              </p>
            </section>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. About Us and These Terms
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                1.1 Who We Are
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} is operated by {companyName}, a company registered in
                England and Wales under company number {companyNumber}. Our
                registered office is at {registeredAddress}.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                1.2 How to Contact Us
              </h3>
              <p className="text-gray-700 mb-4">
                You can contact us by emailing{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>{' '}
                or by writing to us at our registered address.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                1.3 Acceptance of Terms
              </h3>
              <p className="text-gray-700 mb-4">
                By creating an account or using {appName}, you confirm that you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Accept these Terms of Service</li>
                <li>Agree to comply with them</li>
                <li>Are at least 18 years old</li>
                <li>Have the authority to enter into these Terms (if acting on behalf of an organisation)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                If you do not agree to these Terms, you must not use our Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Our Service
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                2.1 Description of Service
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} is a web-based platform designed for teachers and educators
                in the United Kingdom, providing tools to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Create and manage lesson plans and schemes of work</li>
                <li>Organise teaching resources and curriculum materials</li>
                <li>Schedule lessons and manage timetables</li>
                <li>Collaborate with other educators</li>
                <li>Store and access educational documents</li>
                <li>Other features as may be added from time to time</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                2.2 Changes to the Service
              </h3>
              <p className="text-gray-700 mb-4">
                We may update and change {appName} from time to time to reflect
                changes to our users' needs, our business priorities, or for other
                reasons. We will try to give you reasonable notice of any major
                changes.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                2.3 Service Availability
              </h3>
              <p className="text-gray-700">
                We do not guarantee that {appName} will always be available or
                uninterrupted. We may suspend, withdraw, or restrict the availability
                of all or any part of the Service for business or operational reasons.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Your Account
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.1 Account Registration
              </h3>
              <p className="text-gray-700 mb-4">
                To use certain features of {appName}, you must register for an
                account. When registering, you must:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Keep your account information up to date</li>
                <li>Keep your login credentials confidential</li>
                <li>Not share your account with others</li>
                <li>Notify us immediately of any unauthorised access</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.2 Account Security
              </h3>
              <p className="text-gray-700 mb-4">
                You are responsible for all activities that occur under your account.
                If you believe your account has been compromised, please contact us
                immediately at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                3.3 Account Suspension and Termination
              </h3>
              <p className="text-gray-700">
                We may suspend or terminate your account if you breach these Terms,
                if we reasonably believe your account poses a security risk, or if
                required to do so by law. You may close your account at any time
                through your account settings or by contacting us.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to use {appName} only for lawful purposes and in accordance
                with these Terms. You must not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Use the Service in any way that breaches any applicable local,
                  national, or international law or regulation
                </li>
                <li>
                  Use the Service in any way that is unlawful or fraudulent, or has
                  any unlawful or fraudulent purpose or effect
                </li>
                <li>
                  Transmit any material that is defamatory, offensive, or otherwise
                  objectionable
                </li>
                <li>
                  Infringe any copyright, database right, trademark, or other
                  intellectual property rights of any other person
                </li>
                <li>
                  Upload any content that contains viruses, Trojan horses, worms,
                  or other malicious code
                </li>
                <li>
                  Attempt to gain unauthorised access to our systems, servers, or
                  other users' accounts
                </li>
                <li>
                  Use any automated system (including bots, scrapers, or spiders)
                  to access the Service without our written permission
                </li>
                <li>
                  Impersonate any person or misrepresent your identity or affiliation
                  with any person or organisation
                </li>
                <li>
                  Interfere with or disrupt the Service or servers or networks
                  connected to the Service
                </li>
                <li>
                  Collect or harvest any personally identifiable information from
                  the Service without authorisation
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Your Content
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                5.1 Ownership of Your Content
              </h3>
              <p className="text-gray-700 mb-4">
                You retain all ownership rights in the content you create or upload
                to {appName} ("Your Content"), including lesson plans, resources,
                documents, and other materials.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                5.2 Licence to Use Your Content
              </h3>
              <p className="text-gray-700 mb-4">
                By uploading Your Content to {appName}, you grant us a non-exclusive,
                worldwide, royalty-free licence to use, store, copy, and display
                Your Content solely for the purpose of providing and improving the
                Service. This licence ends when you delete Your Content or close
                your account.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                5.3 Your Responsibilities
              </h3>
              <p className="text-gray-700 mb-4">
                You are solely responsible for Your Content. You warrant that:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>You own or have the necessary rights to Your Content</li>
                <li>Your Content does not infringe any third party's intellectual property rights</li>
                <li>Your Content complies with all applicable laws and regulations</li>
                <li>Your Content does not contain any unlawful, harmful, or objectionable material</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                5.4 Our Rights to Remove Content
              </h3>
              <p className="text-gray-700">
                We reserve the right to remove or disable access to any content that
                we believe, in our sole discretion, violates these Terms or applicable
                law, or may harm our reputation or the Service.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Intellectual Property Rights
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.1 Our Intellectual Property
              </h3>
              <p className="text-gray-700 mb-4">
                {appName}, including all software, design, text, graphics, logos,
                icons, and other content (excluding Your Content), is owned by or
                licensed to {companyName} and is protected by copyright, trademark,
                and other intellectual property laws of the United Kingdom and
                international treaties.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.2 Limited Licence
              </h3>
              <p className="text-gray-700 mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive,
                non-transferable, revocable licence to access and use the Service
                for your personal or internal educational purposes.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.3 Restrictions
              </h3>
              <p className="text-gray-700 mb-2">You must not:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Copy, modify, distribute, sell, or lease any part of the Service</li>
                <li>Reverse engineer or attempt to extract the source code of the Service</li>
                <li>Remove any copyright, trademark, or proprietary notices</li>
                <li>Use our intellectual property without our prior written consent</li>
                <li>Create derivative works based on the Service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6.4. AI-Generated Content
              </h2>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
                <p className="text-amber-800">
                  <strong>Important:</strong> {appName} uses artificial intelligence to
                  assist with content generation. Please read this section carefully to
                  understand your responsibilities when using AI features.
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.5 AI Feature Description
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} provides AI-powered tools to help you create lesson plans,
                teaching resources, and educational content. These features use large
                language models (LLMs) to generate suggestions based on your inputs.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.6 AI Limitations and Disclaimers
              </h3>
              <p className="text-gray-700 mb-4">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>AI is a tool, not a replacement for professional judgement:</strong>{' '}
                  AI-generated content is intended to assist and inspire, not to replace
                  your professional expertise as an educator.
                </li>
                <li>
                  <strong>Content may contain errors:</strong> AI-generated content may
                  contain factual inaccuracies, outdated information, or inappropriate
                  suggestions. You must review all AI-generated content before use.
                </li>
                <li>
                  <strong>No guarantee of accuracy:</strong> We do not guarantee that
                  AI-generated content is accurate, complete, current, reliable, or
                  suitable for any particular purpose.
                </li>
                <li>
                  <strong>Curriculum alignment:</strong> While we aim to align with UK
                  curricula (e.g., National Curriculum, Scottish Curriculum for Excellence),
                  AI-generated content may not fully meet specific curriculum requirements.
                  You are responsible for verifying alignment.
                </li>
                <li>
                  <strong>Content may vary:</strong> AI may generate different outputs for
                  the same or similar prompts. Results are not guaranteed to be consistent.
                </li>
                <li>
                  <strong>Not a substitute for safeguarding:</strong> AI cannot assess the
                  safeguarding implications of content. You must ensure all content used
                  with students is appropriate and safe.
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.7 Your Responsibilities
              </h3>
              <p className="text-gray-700 mb-4">
                When using AI features, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Review all AI-generated content</strong> before using it in
                  your teaching or sharing it with students, parents, or colleagues
                </li>
                <li>
                  <strong>Verify factual accuracy</strong> of any information generated
                  by AI, particularly for subjects requiring precision (e.g., science,
                  mathematics, history)
                </li>
                <li>
                  <strong>Ensure age-appropriateness</strong> of content for your intended
                  audience
                </li>
                <li>
                  <strong>Check curriculum alignment</strong> with your specific requirements,
                  examination boards, or educational standards
                </li>
                <li>
                  <strong>Adapt and personalise</strong> AI-generated content to meet the
                  needs of your students
                </li>
                <li>
                  <strong>Not rely solely on AI</strong> for critical educational decisions
                </li>
                <li>
                  <strong>Comply with your school's policies</strong> regarding the use of
                  AI tools in education
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.8 Acceptable Use of AI Features
              </h3>
              <p className="text-gray-700 mb-4">
                When using AI features, you must not:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Attempt to generate harmful, illegal, or inappropriate content</li>
                <li>Input student personal data, names, or sensitive information into AI prompts</li>
                <li>Use AI to generate content that discriminates against any group</li>
                <li>Attempt to bypass content safety filters or restrictions</li>
                <li>Use AI features to generate content for commercial resale without permission</li>
                <li>Misrepresent AI-generated content as entirely your own original work where
                  disclosure is required</li>
                <li>Use AI to generate academic submissions on behalf of students (academic dishonesty)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.9 Ownership of AI-Generated Content
              </h3>
              <p className="text-gray-700 mb-4">
                Regarding ownership and rights to AI-generated content:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>AI-generated content created through {appName} is provided to you for
                  your use in accordance with these Terms</li>
                <li>You may use, modify, and build upon AI-generated content for your
                  educational purposes</li>
                <li>We do not claim ownership over the AI-generated content you create</li>
                <li>You are responsible for ensuring your use of AI-generated content
                  complies with applicable laws and your institution's policies</li>
                <li>AI-generated content may not be eligible for copyright protection in
                  some jurisdictions</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.10 AI Service Availability
              </h3>
              <p className="text-gray-700 mb-4">
                AI features are provided subject to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Availability of third-party AI services we rely upon</li>
                <li>Usage limits that may apply to your subscription plan</li>
                <li>Our right to modify, suspend, or discontinue AI features at any time</li>
                <li>Potential temporary unavailability due to maintenance or technical issues</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                6.11 Feedback and Improvements
              </h3>
              <p className="text-gray-700">
                We welcome feedback on AI-generated content quality. If you encounter
                inappropriate, inaccurate, or problematic AI outputs, please report them
                to{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>. Your feedback helps us improve our content safety measures.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Fees and Payment
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                7.1 Pricing
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} may offer free and paid subscription plans. Current pricing
                and features are displayed on our website. All prices are in pounds
                sterling (GBP) and inclusive of VAT where applicable.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                7.2 Payment Terms
              </h3>
              <p className="text-gray-700 mb-4">
                For paid subscriptions:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Payment is due at the start of each billing period</li>
                <li>We accept major credit and debit cards</li>
                <li>You authorise us to charge your payment method automatically for recurring subscriptions</li>
                <li>If payment fails, we may suspend access to paid features</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                7.3 Price Changes
              </h3>
              <p className="text-gray-700 mb-4">
                We may change our prices at any time. We will give you at least 30
                days' notice of any price increase. Price changes will take effect
                at your next billing date.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                7.4 Refunds
              </h3>
              <p className="text-gray-700 mb-4">
                Unless required by law, fees are non-refundable. However, if you
                are a consumer in the UK, you may have a legal right to cancel
                within 14 days of purchase (see Section 8 - Cancellation Rights).
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                7.5 Cancellation
              </h3>
              <p className="text-gray-700">
                You may cancel your subscription at any time through your account
                settings. Cancellation will take effect at the end of your current
                billing period.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Consumer Cancellation Rights
              </h2>
              <p className="text-gray-700 mb-4">
                If you are a consumer (an individual acting outside your trade,
                business, craft, or profession), you have certain rights under
                the Consumer Contracts (Information, Cancellation and Additional
                Charges) Regulations 2013.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                8.1 Right to Cancel
              </h3>
              <p className="text-gray-700 mb-4">
                You have the right to cancel your subscription within 14 days of
                purchase without giving any reason. To exercise this right, you
                must inform us of your decision by a clear statement (e.g., by
                email to{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>).
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                8.2 Effects of Cancellation
              </h3>
              <p className="text-gray-700 mb-4">
                If you cancel within the 14-day period, we will reimburse all
                payments received from you without undue delay and no later than
                14 days from the day we are informed of your decision to cancel.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                8.3 Loss of Cancellation Right
              </h3>
              <p className="text-gray-700">
                If you request to begin using the Service during the cancellation
                period and subsequently cancel, you may be required to pay for the
                Service provided up to the time of cancellation.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Privacy
              </h2>
              <p className="text-gray-700">
                Your privacy is important to us. Our collection and use of your
                personal data is governed by our{' '}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>, which forms part of these Terms. By using {appName}, you
                consent to such processing and warrant that all data provided by
                you is accurate.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Third-Party Links and Services
              </h2>
              <p className="text-gray-700 mb-4">
                {appName} may contain links to third-party websites or services
                that are not owned or controlled by us. We have no control over,
                and assume no responsibility for, the content, privacy policies,
                or practices of any third-party websites or services.
              </p>
              <p className="text-gray-700">
                Your use of third-party services is at your own risk and subject
                to the terms and conditions of those third parties.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Limitation of Liability
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 text-gray-700 mb-4">
                <p className="mb-4">
                  <strong>Nothing in these Terms excludes or limits our liability for:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Death or personal injury caused by our negligence</li>
                  <li>Fraud or fraudulent misrepresentation</li>
                  <li>Any other liability that cannot be excluded or limited by English law</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                11.1 If You Are a Business User
              </h3>
              <p className="text-gray-700 mb-4">
                If you are a business user:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>We exclude all implied conditions, warranties, representations, or other terms that may apply to the Service</li>
                <li>We will not be liable for any indirect or consequential loss or damage, loss of profit, loss of business, business interruption, or loss of business opportunity</li>
                <li>Our total liability to you for all other losses shall not exceed the total fees paid by you in the 12 months preceding the claim, or £100, whichever is greater</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                11.2 If You Are a Consumer
              </h3>
              <p className="text-gray-700 mb-4">
                If you are a consumer:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The Service is provided for domestic and private use only</li>
                <li>You agree not to use the Service for any commercial, business, or resale purpose</li>
                <li>We have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity</li>
                <li>Your statutory rights as a consumer are not affected</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Disclaimer
              </h2>
              <p className="text-gray-700 mb-4">
                The Service is provided on an "as is" and "as available" basis.
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We make no warranties or representations about the accuracy or completeness of the Service's content</li>
                <li>We do not guarantee that the Service will be uninterrupted, secure, or error-free</li>
                <li>We are not responsible for any delays, delivery failures, or other damage resulting from limitations of the Service</li>
                <li>We do not warrant that the Service will meet your specific requirements</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                [X]. Disclaimers
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700 mb-4">
                <p className="mb-4 uppercase font-semibold text-sm">
                  PLEASE READ THIS SECTION CAREFULLY
                </p>
                <p className="mb-4">
                  THE SERVICE, INCLUDING ALL AI-GENERATED CONTENT, IS PROVIDED ON AN
                  "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="mb-4">
                  WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY WARRANTIES
                  REGARDING AI-GENERATED CONTENT, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>ACCURACY, COMPLETENESS, OR RELIABILITY OF AI-GENERATED CONTENT</li>
                  <li>SUITABILITY OF AI-GENERATED CONTENT FOR ANY PARTICULAR PURPOSE</li>
                  <li>ALIGNMENT WITH ANY SPECIFIC CURRICULUM, EXAMINATION BOARD, OR
                    EDUCATIONAL STANDARD</li>
                  <li>AGE-APPROPRIATENESS OF AI-GENERATED CONTENT</li>
                  <li>ABSENCE OF ERRORS, BIASES, OR INAPPROPRIATE MATERIAL IN AI OUTPUTS</li>
                </ul>
                <p>
                  YOU ACKNOWLEDGE THAT AI TECHNOLOGY HAS INHERENT LIMITATIONS AND THAT
                  YOU ARE SOLELY RESPONSIBLE FOR REVIEWING, VERIFYING, AND ADAPTING ANY
                  AI-GENERATED CONTENT BEFORE USE.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Indemnity
              </h2>
              <p className="text-gray-700">
                If you are a business user, you agree to indemnify, defend, and
                hold harmless {companyName}, its officers, directors, employees,
                and agents from and against any claims, liabilities, damages,
                losses, costs, or expenses (including reasonable legal fees)
                arising out of or relating to: (a) your use of the Service;
                (b) Your Content; (c) your breach of these Terms; or (d) your
                violation of any rights of a third party.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Termination
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                14.1 Termination by You
              </h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time by using the account
                deletion feature in your settings or by contacting us. Upon
                termination, your right to use the Service will cease immediately.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                14.2 Termination by Us
              </h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your account at any time if:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>You breach these Terms</li>
                <li>We are required to do so by law</li>
                <li>We decide to withdraw the Service (with reasonable notice)</li>
                <li>Your conduct may cause harm to us, other users, or third parties</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                14.3 Effects of Termination
              </h3>
              <p className="text-gray-700">
                Upon termination, we will delete your account and Your Content in
                accordance with our Privacy Policy. Provisions of these Terms that
                by their nature should survive termination will survive (including
                intellectual property rights, disclaimers, and limitation of liability).
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Changes to These Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We may revise these Terms from time to time. The revised Terms will
                apply from the date of publication on our website.
              </p>
              <p className="text-gray-700 mb-4">
                For material changes, we will notify you by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Posting a notice on our website</li>
                <li>Sending you an email notification</li>
                <li>Displaying a notice when you log in</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Your continued use of the Service after such changes constitutes
                acceptance of the new Terms. If you do not agree to the revised
                Terms, you should stop using the Service.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                16. General Provisions
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                16.1 Entire Agreement
              </h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and {companyName} regarding the
                Service and supersede all prior agreements.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                16.2 Severability
              </h3>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be invalid or
                unenforceable by a court, the remaining provisions will continue
                to be valid and enforceable.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                16.3 Waiver
              </h3>
              <p className="text-gray-700 mb-4">
                Our failure to enforce any provision of these Terms shall not
                constitute a waiver of that provision or the right to enforce
                it at a later time.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                16.4 Assignment
              </h3>
              <p className="text-gray-700 mb-4">
                You may not assign or transfer your rights under these Terms
                without our prior written consent. We may assign our rights to
                any affiliate or in connection with a merger, acquisition, or
                sale of assets.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                16.5 Third-Party Rights
              </h3>
              <p className="text-gray-700">
                These Terms do not give rise to any rights under the Contracts
                (Rights of Third Parties) Act 1999 to enforce any term of these
                Terms.
              </p>
            </section>

            {/* Section 17 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                17. Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of England and Wales.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>If you are a consumer:</strong> You may bring proceedings
                in the courts of England and Wales or, if you live in Scotland or
                Northern Ireland, in the courts of your home jurisdiction. We may
                bring proceedings in your home jurisdiction.
              </p>
              <p className="text-gray-700">
                <strong>If you are a business:</strong> The courts of England and
                Wales shall have exclusive jurisdiction to settle any dispute
                arising out of or in connection with these Terms.
              </p>
            </section>

            {/* Section 18 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                18. Complaints and Disputes
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                18.1 Complaints Procedure
              </h3>
              <p className="text-gray-700 mb-4">
                If you have a complaint about the Service, please contact us at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>. We will try to resolve your complaint as quickly as possible
                and will acknowledge receipt within 5 working days.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                18.2 Alternative Dispute Resolution
              </h3>
              <p className="text-gray-700 mb-4">
                If you are a consumer and we are unable to resolve your complaint,
                you may be able to use an alternative dispute resolution (ADR)
                service. The European Commission provides an online dispute
                resolution platform, which you can access at:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-gray-700">
                Please note that we are not obligated to use ADR services but will
                consider doing so on a case-by-case basis.
              </p>
            </section>

            {/* Section 19 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                19. Accessibility
              </h2>
              <p className="text-gray-700 mb-4">
                We are committed to making {appName} accessible to all users,
                including those with disabilities. We aim to comply with the
                Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p className="text-gray-700">
                If you experience any accessibility issues or have suggestions for
                improvement, please contact us at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>.
              </p>
            </section>

            {/* Section 20 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                20. Education-Specific Terms
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                20.1 Safeguarding
              </h3>
              <p className="text-gray-700 mb-4">
                {appName} is designed for use by teachers and educational
                professionals. While the Service may be used to create materials
                for students, it is not intended for direct use by children.
                You are responsible for ensuring that any use of {appName} in
                connection with pupils or students complies with your school's
                safeguarding policies and applicable laws.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                20.2 Pupil Data
              </h3>
              <p className="text-gray-700 mb-4">
                If you upload or input any pupil data to {appName}, you must:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                <li>Ensure you have the necessary permissions and lawful basis to process that data</li>
                <li>Comply with your school's data protection policies</li>
                <li>Only upload the minimum data necessary for your purposes</li>
                <li>Not upload any sensitive pupil data unless absolutely necessary and permitted</li>
                <li>Ensure compliance with the UK GDPR and Data Protection Act 2018</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                20.3 Educational Use Only
              </h3>
              <p className="text-gray-700">
                The Service is intended for educational purposes only. We do not
                make any representations or warranties about the suitability of
                any content created using {appName} for any particular curriculum,
                examination board, or educational standard. You are responsible
                for ensuring that your content meets any applicable requirements.
              </p>
            </section>

            {/* Section 21 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                21. Force Majeure
              </h2>
              <p className="text-gray-700">
                We shall not be liable for any failure or delay in performing our
                obligations under these Terms where such failure or delay results
                from circumstances beyond our reasonable control, including but
                not limited to: acts of God, natural disasters, pandemic, epidemic,
                war, terrorism, riots, civil unrest, government action, labour
                disputes, fire, flood, power failure, telecommunications failure,
                or cyber attacks.
              </p>
            </section>

            {/* Section 22 */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                22. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-gray-700">
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

            {/* Acknowledgment */}
            <section className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                By using {appName}, you acknowledge that you have read, understood,
                and agree to be bound by these Terms of Service.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}