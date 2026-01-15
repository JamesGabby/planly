// app/ai-transparency/page.tsx

import React from 'react';

export const metadata = {
  title: 'AI Transparency | Lessonly',
  description: 'Learn how Lessonly uses AI to help teachers create lesson plans',
};

export default function AITransparencyPage() {
  const appName = "Lessonly";
  const companyName = "[YOUR COMPANY NAME]";
  const contactEmail = "[YOUR CONTACT EMAIL]";
  const lastUpdated = "[DATE]";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🤖</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AI Transparency</h1>
              <p className="text-gray-500">How {appName} Uses Artificial Intelligence</p>
            </div>
          </div>
          <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none">

            {/* Introduction */}
            <section className="mb-10">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Our Commitment to Transparency
                </h2>
                <p className="text-gray-700">
                  At {appName}, we believe in being open about how we use AI 
                  technology. This page explains what AI features we offer, how 
                  they work, their limitations, and how we protect your data.
                </p>
              </div>
            </section>

            {/* What AI Does */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What Our AI Can Do
              </h2>
              <p className="text-gray-700 mb-4">
                {appName} uses AI to help teachers save time and create better 
                learning experiences. Our AI features include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lesson Plan Generation</h3>
                  <p className="text-gray-600 text-sm">
                    Generate complete lesson plans including learning objectives, 
                    activities, and assessments based on your topic and requirements.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Learning Objectives</h3>
                  <p className="text-gray-600 text-sm">
                    Create clear, measurable learning objectives aligned with 
                    curriculum standards and Bloom's taxonomy.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Differentiation</h3>
                  <p className="text-gray-600 text-sm">
                    Generate differentiated activities and resources for different 
                    ability levels and learning needs.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">❓</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Assessment Questions</h3>
                  <p className="text-gray-600 text-sm">
                    Create quizzes, discussion questions, and assessment activities 
                    to check understanding.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Activity Ideas</h3>
                  <p className="text-gray-600 text-sm">
                    Get suggestions for engaging teaching activities, discussions, 
                    and practical exercises.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Resource Suggestions</h3>
                  <p className="text-gray-600 text-sm">
                    Receive recommendations for resources, materials, and teaching 
                    strategies.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How Our AI Works
              </h2>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="font-semibold text-gray-900 mb-2">You Provide Input</h3>
                  <p className="text-gray-600 text-sm">
                    You tell us what you need: the subject, topic, year group, 
                    learning objectives, and any specific requirements.
                  </p>
                </div>
                
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="font-semibold text-gray-900 mb-2">We Process Your Request</h3>
                  <p className="text-gray-600 text-sm">
                    Your input is combined with our educational prompts and sent 
                    to our AI provider. We don't send your personal information.
                  </p>
                </div>
                
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Generates Content</h3>
                  <p className="text-gray-600 text-sm">
                    The AI processes your request and generates content based on 
                    its training and your specifications.
                  </p>
                </div>
                
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <h3 className="font-semibold text-gray-900 mb-2">You Review and Edit</h3>
                  <p className="text-gray-600 text-sm">
                    The generated content is presented to you for review. You can 
                    edit, modify, regenerate, or discard it entirely.
                  </p>
                </div>
                
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                  <h3 className="font-semibold text-gray-900 mb-2">You're in Control</h3>
                  <p className="text-gray-600 text-sm">
                    You decide whether to use the content. You maintain full 
                    control and professional judgement over what goes into your 
                    teaching.
                  </p>
                </div>
              </div>
            </section>

            {/* AI Technology */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                The Technology Behind Our AI
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Large Language Models (LLMs)
                </h3>
                <p className="text-gray-700 mb-4">
                  {appName} uses large language models – AI systems trained on 
                  vast amounts of text to understand and generate human-like 
                  language. These models can:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Understand context and follow instructions</li>
                  <li>Generate coherent, relevant text</li>
                  <li>Adapt to different subjects and age groups</li>
                  <li>Structure content in useful formats</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Our AI Provider
                </h3>
                <p className="text-gray-700 mb-4">
                  We partner with leading AI providers to deliver our features:
                </p>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <p className="font-medium text-gray-900">[AI PROVIDER NAME - e.g., OpenAI]</p>
                  <p className="text-gray-600 text-sm mt-1">
                    [Brief description of the provider and model used]
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Privacy Policy:{' '}
                    <a 
                      href="[PROVIDER PRIVACY POLICY URL]" 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [Link]
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                AI Limitations – What You Should Know
              </h2>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-amber-900 mb-3">
                  ⚠️ Important: AI is a Tool, Not a Replacement
                </h3>
                <p className="text-amber-800">
                  AI-generated content should always be reviewed by you, the 
                  professional educator. AI is designed to assist and inspire, 
                  not to replace your expertise and judgement.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Factual Accuracy
                  </h4>
                  <p className="text-red-800 text-sm">
                    AI can make factual errors or "hallucinate" information that 
                    sounds plausible but is incorrect. Always verify facts, 
                    especially for subjects requiring precision like science, 
                    history, and mathematics.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Current Information
                  </h4>
                  <p className="text-red-800 text-sm">
                    AI models have a knowledge cutoff date and may not have 
                    information about recent events, updated curricula, or new 
                    educational guidelines.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Curriculum Alignment
                  </h4>
                  <p className="text-red-800 text-sm">
                    While we aim to align with UK curricula, AI may not perfectly 
                    match specific curriculum requirements, examination board 
                    specifications, or your school's schemes of work.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Context About Your Students
                  </h4>
                  <p className="text-red-800 text-sm">
                    AI doesn't know your students, their needs, abilities, or 
                    your classroom context. You must adapt content appropriately.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Consistency
                  </h4>
                  <p className="text-red-800 text-sm">
                    AI may generate different outputs for the same prompt. Results 
                    are not guaranteed to be consistent or reproducible.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ❌ Potential Bias
                  </h4>
                  <p className="text-red-800 text-sm">
                    AI models can reflect biases present in their training data. 
                    Review content for balance, inclusivity, and appropriateness.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Data */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Protect Your Data
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <h3 className="font-semibold text-green-900 mb-3">
                    ✅ What We DO
                  </h3>
                  <ul className="text-green-800 text-sm space-y-2">
                    <li>✓ Send only your prompts and educational context to AI</li>
                    <li>✓ Use secure, encrypted connections</li>
                    <li>✓ Have data processing agreements with AI providers</li>
                    <li>✓ Ensure your data is not used to train AI models</li>
                    <li>✓ Allow you to delete your data at any time</li>
                    <li>✓ Comply with UK GDPR and data protection laws</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                  <h3 className="font-semibold text-red-900 mb-3">
                    ❌ What We DON'T Do
                  </h3>
                  <ul className="text-red-800 text-sm space-y-2">
                    <li>✗ Send your name or email to AI providers</li>
                    <li>✗ Send your school or institution details</li>
                    <li>✗ Allow AI providers to use your data for training</li>
                    <li>✗ Store your prompts longer than necessary</li>
                    <li>✗ Share your data with third parties for marketing</li>
                    <li>✗ Make automated decisions that affect your rights</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📋 Your Data Rights
                </h4>
                <p className="text-blue-800 text-sm">
                  You have full rights over your data under UK GDPR, including 
                  the right to access, correct, delete, and export your data. 
                  See our{' '}
                  <a href="/gdpr" className="text-blue-600 hover:underline">
                    GDPR page
                  </a>{' '}
                  for full details.
                </p>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Best Practices for Using AI in Education
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Always Review Before Use</h4>
                    <p className="text-gray-600 text-sm">
                      Read through all AI-generated content carefully before using 
                      it with students. Check for accuracy, appropriateness, and 
                      alignment with your objectives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verify Factual Information</h4>
                    <p className="text-gray-600 text-sm">
                      Cross-check facts, dates, statistics, and technical 
                      information with reliable sources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalise for Your Students</h4>
                    <p className="text-gray-600 text-sm">
                      Adapt AI-generated content to match your students' needs, 
                      abilities, and your classroom context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Check Curriculum Alignment</h4>
                    <p className="text-gray-600 text-sm">
                      Ensure content aligns with your specific curriculum, 
                      examination board, and school requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Don't Input Sensitive Data</h4>
                    <p className="text-gray-600 text-sm">
                      Never input student names, personal information, or sensitive 
                      data into AI prompts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Follow Your School's Policy</h4>
                    <p className="text-gray-600 text-sm">
                      Ensure your use of AI tools complies with your school or 
                      trust's policies on AI in education.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Is my data used to train the AI?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      No. We have agreements with our AI providers that ensure 
                      your prompts and generated content are not used to train 
                      or improve their AI models.
                    </p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Is AI-generated content copyrighted?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      The copyright status of AI-generated content is an evolving 
                      area of law. In the UK, copyright typically requires human 
                      authorship. AI-generated content may not be eligible for 
                      full copyright protection. You are free to use, modify, and 
                      build upon content generated through {appName} for your 
                      educational purposes.
                    </p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Can I use AI-generated content for Ofsted observations?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      AI-generated content can be a starting point, but you should 
                      always review, adapt, and personalise it. The content you 
                      use should reflect your professional judgement and knowledge 
                      of your students. We recommend being transparent about your 
                      use of AI tools if asked.
                    </p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Is the AI trained on UK curriculum content?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      Our AI has knowledge of UK curricula including the National 
                      Curriculum. However, it may not have the most recent updates, 
                      and you should always verify alignment with current curriculum 
                      requirements and your school's specific schemes of work.
                    </p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    What if the AI generates inappropriate content?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      We have safety measures in place, but AI can occasionally 
                      produce unexpected outputs. If you encounter inappropriate, 
                      offensive, or concerning content, please report it to us 
                      immediately at{' '}
                      <a 
                        href={`mailto:${contactEmail}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {contactEmail}
                      </a>. Do not use such content.
                    </p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Can students detect AI-generated content?
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 text-sm">
                      AI detection tools exist but are not always reliable. More 
                      importantly, we encourage you to personalise AI-generated 
                      content with your own expertise, examples, and teaching style, 
                      making it authentically yours.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Questions or Concerns?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our AI features, how we use 
                your data, or want to report an issue with AI-generated content, 
                please contact us:
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

            {/* Related Pages */}
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
                  href="/gdpr" 
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
                >
                  🔒 GDPR & Your Rights
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}