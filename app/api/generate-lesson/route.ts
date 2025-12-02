import { NextRequest, NextResponse } from "next/server";

type LessonPlanType = "standard" | "detailed" | "student" | "tutor";

interface GenerateLessonRequest {
  // Common fields
  topic: string;
  subject: string;
  year_group?: string;
  class?: string;
  duration?: string;
  objectives?: string;
  outcomes?: string;
  exam_board?: string;

  // Type identifier
  planType: LessonPlanType;

  // Detailed/Student plan specific
  specialist_subject_knowledge_required?: string;
  knowledge_revisited?: string;
  numeracy_opportunities?: string;
  literacy_opportunities?: string;
  subject_pedagogies?: string;
  health_and_safety_considerations?: string;

  // Student/Tutor specific
  student_name?: string;
  learning_style?: string;
  specific_needs?: string;
  parent_goals?: string;
}

function getPromptForType(data: GenerateLessonRequest): string {
  const basePrompt = `You are an expert UK teacher. Create a ${data.planType} lesson plan with the following specifications:

**Lesson Details:**
- Subject: ${data.subject}
${data.year_group ? `- Year Group: ${data.year_group}` : ""}
- Topic: ${data.topic}
${data.class ? `- Class: ${data.class}` : ""}
- Duration: ${data.duration || "60 minutes"}
${data.exam_board ? `- Exam Board: ${data.exam_board}` : ""}
${data.objectives ? `- Teacher's Objectives: ${data.objectives}` : ""}
${data.outcomes ? `- Desired Outcomes: ${data.outcomes}` : ""}`;

  let specificContext = "";
  let jsonStructure = "";

  switch (data.planType) {
    case "detailed":
      specificContext = `
${data.specialist_subject_knowledge_required ? `- Specialist Knowledge: ${data.specialist_subject_knowledge_required}` : ""}
${data.knowledge_revisited ? `- Knowledge Revisited: ${data.knowledge_revisited}` : ""}
${data.numeracy_opportunities ? `- Numeracy Focus: ${data.numeracy_opportunities}` : ""}
${data.literacy_opportunities ? `- Literacy Focus: ${data.literacy_opportunities}` : ""}
${data.subject_pedagogies ? `- Pedagogical Approaches: ${data.subject_pedagogies}` : ""}
${data.health_and_safety_considerations ? `- Health & Safety: ${data.health_and_safety_considerations}` : ""}

This is a DETAILED lesson plan with comprehensive pedagogical information for each section.`;

      jsonStructure = `{
  "objectives": "• Detailed learning objectives (3-4 specific objectives)",
  "outcomes": "• Measurable learning outcomes (3-4 outcomes)",
  "specialist_subject_knowledge_required": "• Key subject knowledge the teacher needs\\n• Specialist concepts to understand\\n• Background information required",
  "knowledge_revisited": "• Prior learning being built upon\\n• Previously taught concepts\\n• Links to previous lessons",
  "numeracy_opportunities": "• Ways students practice numerical skills\\n• Data handling opportunities\\n• Mathematical reasoning embedded in the lesson",
  "literacy_opportunities": "• Reading and writing activities\\n• Subject-specific vocabulary development\\n• Communication and oracy skills",
  "subject_pedagogies": "• Subject-specific teaching strategies\\n• Proven pedagogical approaches for this topic\\n• Research-based methods",
  "health_and_safety_considerations": "• Potential risks or hazards to be aware of\\n• Safety procedures to follow\\n• Risk assessment notes",
  "lesson_structure": [
    {
      "stage": "Starter",
      "duration": "10 min",
      "teaching": "Detailed teaching activities and instructions - what the teacher does/says, how they organise the learning",
      "learning": "What students will be doing - specific activities and engagement strategies",
      "assessing": "How to check understanding - questioning, observation, mini plenaries",
      "adapting": "Support for SEN students (scaffolding, LSA support) and stretch for high achievers (challenge tasks, deeper questions)"
    },
    {
      "stage": "Main Activity 1",
      "duration": "20 min",
      "teaching": "Detailed teaching activities and explicit instruction",
      "learning": "Student activities and how they engage with the content",
      "assessing": "Assessment strategies and success criteria checks",
      "adapting": "Differentiation approaches for different learning needs"
    },
    {
      "stage": "Main Activity 2",
      "duration": "20 min",
      "teaching": "Teaching activities building on previous learning",
      "learning": "Progressive student activities with increased independence",
      "assessing": "Checking for understanding and misconceptions",
      "adapting": "Support strategies and extension opportunities"
    },
    {
      "stage": "Plenary",
      "duration": "10 min",
      "teaching": "Summary, consolidation and review activities",
      "learning": "Student reflection and demonstration of learning",
      "assessing": "Check that learning objectives have been met",
      "adapting": "Ensure all students can demonstrate their learning"
    }
  ],
  "homework": "• Clear homework task that reinforces and extends learning\\n• Expected time to complete\\n• Success criteria",
  "evaluation": "• How to assess if learning objectives were met\\n• Questions to reflect on teaching effectiveness\\n• What worked well and areas for improvement",
  "notes": "• Important reminders for the teacher\\n• Common misconceptions to address\\n• Timing considerations\\n• Behaviour management strategies",
  "resources": [
    {"title": "Resource 1 name", "url": ""},
    {"title": "Resource 2 name", "url": ""}
  ]
}`;
      break;

    case "student":
      specificContext = `
${data.student_name ? `- Student Name: ${data.student_name}` : ""}
${data.learning_style ? `- Learning Style: ${data.learning_style}` : ""}
${data.specific_needs ? `- Specific Needs: ${data.specific_needs}` : ""}

This is a STUDENT-FOCUSED lesson plan. Make it:
- Engaging and clear with student-friendly language
- Easy for students to follow independently
- Written from the student's perspective
- Motivating with clear, achievable goals
- Include self-assessment opportunities`;

      jsonStructure = `{
  "lesson_title": "Engaging, student-friendly title that captures interest",
  "what_will_i_learn": "• I will learn... (3-4 clear learning goals written in first person)\\n• Written simply and positively to motivate students",
  "why_is_this_important": "Real-world explanation of why this topic matters to students' lives, future careers, or personal interests",
  "what_i_need": [
    "Material/resource 1",
    "Material/resource 2",
    "Notebook and pen",
    "Access to specific websites or tools"
  ],
  "lesson_steps": [
    {
      "step_number": 1,
      "title": "Getting Started",
      "time": "5-10 min",
      "what_to_do": "Clear, step-by-step instructions written directly to the student",
      "tips": "Helpful hints, things to remember, and strategies for success",
      "check_understanding": "Self-assessment questions: How can I check I understand? What should I be able to do?"
    },
    {
      "step_number": 2,
      "title": "Learning the Key Concepts",
      "time": "20-25 min",
      "what_to_do": "Detailed, student-friendly instructions for the main learning activity",
      "tips": "Helpful strategies and common mistakes to avoid",
      "check_understanding": "Questions to ask yourself to check your progress"
    },
    {
      "step_number": 3,
      "title": "Practice and Apply",
      "time": "15-20 min",
      "what_to_do": "Practice activities with clear expectations",
      "tips": "Success strategies and where to get help if stuck",
      "check_understanding": "How to know you're doing well and making progress"
    },
    {
      "step_number": 4,
      "title": "Review and Reflect",
      "time": "5-10 min",
      "what_to_do": "Summary activities and reflection prompts",
      "tips": "Key takeaways and what to remember for next time",
      "check_understanding": "Reflection questions about your learning journey"
    }
  ],
  "practice_activities": [
    {
      "difficulty": "Easier - Building Confidence",
      "activity": "Starter activity description that builds foundational skills",
      "success_criteria": "You'll know you've got it when..."
    },
    {
      "difficulty": "Medium - Core Practice",
      "activity": "Standard difficulty activity for most students",
      "success_criteria": "Success looks like... You should be able to..."
    },
    {
      "difficulty": "Challenge - Push Yourself",
      "activity": "Extension activity for those ready for more challenge",
      "success_criteria": "Excellent work includes... You're excelling if..."
    }
  ],
  "homework": "Clear homework instructions with specific tasks, estimated time (e.g., 20-30 minutes), and what to do if you get stuck",
  "help_resources": [
    {"title": "Video tutorial name", "url": "", "description": "What you'll learn from watching this"},
    {"title": "Practice website", "url": "", "description": "How this resource will help you practice"},
    {"title": "Study guide", "url": "", "description": "Use this to review key concepts"}
  ],
  "reflection": "Questions for you to think about after the lesson:\\n• What did I find easy today?\\n• What was challenging for me?\\n• What do I want to learn more about?\\n• How can I use this learning in real life?\\n• What am I proud of achieving?"
}`;
      break;

    case "tutor":
      specificContext = `
${data.student_name ? `- Student Name: ${data.student_name}` : ""}
${data.learning_style ? `- Learning Style: ${data.learning_style}` : ""}
${data.specific_needs ? `- Specific Needs/Goals: ${data.specific_needs}` : ""}
${data.parent_goals ? `- Parent Goals: ${data.parent_goals}` : ""}

This is a TUTORING SESSION plan (1-on-1 or small group). Focus on:
- Personalized, responsive instruction tailored to ${data.student_name || "the student"}
- Frequent checks for understanding every 3-5 minutes
- Adaptive pacing based on student response
- Building student confidence and independence
- Addressing specific knowledge gaps
- Clear, actionable feedback`;

      jsonStructure = `{
  "objectives": "• Specific, achievable goals for this tutoring session with ${data.student_name || "the student"}\\n• Focused on the student's individual needs and current level\\n• 3-4 clear learning objectives",
  "outcomes": "• What the student will be able to do independently by the end of this session\\n• Concrete, measurable progress indicators\\n• Success criteria that the student can self-assess",
  "lesson_structure": [
    {
      "stage": "Starter",
      "duration": "5-10 min",
      "teaching": "What you'll do as the tutor: Build rapport, review previous learning, assess starting point with warm-up questions. Ask 'What do you remember about...?' Check any homework from last time. Create a positive, encouraging atmosphere.",
      "learning": "What the student does: Answers warm-up questions to activate prior knowledge, shares any questions or concerns about the topic, demonstrates current understanding level through discussion",
      "assessing": "Check understanding: Ask 'Can you explain...?' 'What do you already know about...?' 'Show me how to...' Listen carefully to identify knowledge gaps or misconceptions to address today.",
      "adapting": "If student is struggling or anxious: Start with easier questions, provide lots of encouragement, break concepts into smaller steps. If student is confident: Move quickly through review, skip basics, jump to new material sooner."
    },
    {
      "stage": "Main Teaching",
      "duration": "15-20 min",
      "teaching": "Explicit, clear teaching: Explain the key concept step-by-step with visual aids (diagrams, worked examples). Model problem-solving with think-aloud. Use real-world examples relevant to the student. Check understanding every 3-5 minutes with quick questions.",
      "learning": "Active participation: Student takes notes in their own words, asks clarifying questions, works through guided examples alongside you, tries similar problems with your immediate support and feedback",
      "assessing": "Frequent checks: 'Can you explain this back to me in your own words?' 'Why did we do that step?' 'What would happen if we changed this?' Watch their face for confusion. Observe their working - are they applying the method correctly?",
      "adapting": "If struggling: Use different explanations (visual, verbal, hands-on), provide more worked examples, slow down pace, use simpler numbers or examples. If excelling: Reduce scaffolding faster, introduce more complex variations, ask 'what if' extension questions."
    },
    {
      "stage": "Guided Practice", 
      "duration": "15-20 min",
      "teaching": "Gradual release: Provide less help as confidence grows. Give hints and prompts rather than answers: 'What should you try first?' 'How can you check that?' Sit beside student, not across - work together. Praise effort and strategy use.",
      "learning": "Increasingly independent work: Student attempts problems with decreasing support, explains their reasoning out loud ('talk me through your thinking'), identifies and self-corrects mistakes with guidance, builds confidence through successful practice",
      "assessing": "Deep understanding checks: Ask 'Why did you choose that method?' 'How do you know you're right?' 'Can you spot any mistakes here?' Watch confidence level - are they attempting problems willingly or hesitating? Note remaining areas of difficulty.",
      "adapting": "If still struggling: Return to teaching mode, work through more examples together, break problems into substeps. If showing mastery: Step back more, let them work independently while you observe, introduce challenge problems or alternative methods."
    },
    {
      "stage": "Plenary",
      "duration": "5-10 min", 
      "teaching": "Consolidate learning: Summarize key concepts covered today. Celebrate specific successes: 'You really got the hang of...' Set clear, manageable homework. Discuss what to focus on in the next session. Answer any final questions. End positively.",
      "learning": "Demonstrate understanding: Student explains the main concepts in their own words, identifies what they found easy and what was challenging, understands what to practice at home, feels confident about next steps, asks any remaining questions",
      "assessing": "Final understanding check: 'Explain to me how to [solve this type of problem]' 'What's the most important thing you learned today?' 'On a scale of 1-10, how confident do you feel now?' If confidence is low, make note to revisit next time.",
      "adapting": "Based on today's session, plan next time: If student struggled, plan to review this topic again with different approach. If student succeeded, plan to build on this with next level of difficulty. Note what worked well to repeat."
    }
  ],
  "resources": [
    {"title": "Whiteboard/paper for working", "url": ""},
    {"title": "Relevant textbook or workbook pages", "url": ""},
    {"title": "Practice worksheet for this topic", "url": ""},
    {"title": "Online practice tool or educational video", "url": "https://example.com"},
    {"title": "Visual aids or manipulatives if needed", "url": ""}
  ],
  "homework": "Practice task to reinforce today's learning:\\n\\n• Specific problems to complete: [e.g., 'Complete questions 5-10 on worksheet' or 'Practice 5 similar problems']\\n• Estimated time: 20-30 minutes\\n• Purpose: Reinforce [specific skill] practiced today\\n• Instructions: Show all working, try independently first\\n• If stuck: Review notes from today, watch [recommended video], message me with specific questions\\n• Bring to next session: Completed work and any questions about problems that were difficult\\n• Optional extension: [Challenge problem for if they finish early]",
  "evaluation": "Post-session reflection and assessment:\\n\\n**Student Progress:**\\n• What progress did ${data.student_name || "the student"} make toward today's objectives? (Rate: Excellent/Good/Some/Limited progress)\\n• Concepts they grasped well and demonstrated confidence with:\\n• Areas that still need work or caused confusion:\\n• Observed confidence level and engagement: (Rate 1-10)\\n\\n**Teaching Effectiveness:**\\n• What teaching strategies worked best today? (visual aids, worked examples, real-world connections, etc.)\\n• What would I do differently next time?\\n• Any breakthrough moments or 'aha!' insights?\\n\\n**Next Session Planning:**\\n• Focus areas for next time based on today's performance\\n• Concepts to review before introducing new material\\n• Estimated pace: Can we move forward or need to consolidate?\\n\\n**Parent Communication Notes:**\\n• Key achievements to share with parents: 'Today [student] successfully...'\\n• Practice recommendations for home: 'Please help [student] practice...'\\n• Areas where parents can provide support\\n• Next session focus and goals\\n• Any concerns or celebrations to communicate",
  "notes": "Session observations and reminders:\\n\\n**Student Profile:**\\n• Engagement level today: (High/Medium/Low) - Note: [What affected this?]\\n• Confidence level: (Growing/Stable/Needs boost) - Note: [Specific observations]\\n• Learning style preferences: [What worked: visual/verbal/hands-on/written?]\\n• Pace that works best: [Fast/Moderate/Slow and steady]\\n\\n**Teaching Strategies That Worked:**\\n• [e.g., 'Diagrams really helped with understanding']\\n• [e.g., 'Real-world examples about sports clicked']\\n• [e.g., 'Breaking into smaller steps reduced anxiety']\\n\\n**Motivational Notes:**\\n• What encouragement/praise resonates with this student?\\n• Rewards or goals that motivate them\\n• Topics or contexts they find interesting\\n\\n**Important Reminders:**\\n• Specific struggles to be aware of: [e.g., 'Gets confused when multiple steps']\\n• Strengths to build on: [e.g., 'Great at spotting patterns']\\n• Parent preferences or requests: [Any special instructions]\\n• Best times/days for this student (energy levels, focus)\\n\\n**Preparation for Next Session:**\\n• Materials to bring: [Worksheets, specific textbook, tools]\\n• Concepts to review at start of next session\\n• New topics to introduce if ready\\n• Questions to ask to check retention of today's learning\\n• Adjustments to make based on today's observations"
}`;
      break;

    default: // standard
      jsonStructure = `{
  "objectives": "• Clear learning objectives (3-4 specific objectives)",
  "outcomes": "• Measurable learning outcomes (3-4 outcomes)",
  "homework": "• Relevant homework task that reinforces learning",
  "evaluation": "• How to assess if learning objectives were met\\n• Questions to ask\\n• Success criteria",
  "notes": "• Important reminders for the teacher\\n• Differentiation strategies\\n• Common misconceptions to address",
  "resources": [
    {"title": "Resource 1", "url": ""},
    {"title": "Resource 2", "url": ""}
  ],
  "lesson_structure": [
    {
      "stage": "Starter",
      "duration": "10 min",
      "teaching": "What the teacher does/says to engage students and introduce the topic",
      "learning": "What students do to activate prior knowledge and prepare for learning",
      "assessing": "How to check understanding through questioning or quick activities",
      "adapting": "Support for students with SEN (scaffolding, visuals) and stretch for high achievers (deeper questions)"
    },
    {
      "stage": "Main Activity 1",
      "duration": "20 min",
      "teaching": "Teaching activities and explicit instruction",
      "learning": "Student activities and engagement with content",
      "assessing": "Assessment methods and checks for understanding",
      "adapting": "Differentiation strategies for different learners"
    },
    {
      "stage": "Main Activity 2",
      "duration": "20 min",
      "teaching": "Teaching activities building on previous learning",
      "learning": "Student activities with increased independence",
      "assessing": "Ongoing assessment and feedback",
      "adapting": "Support and challenge strategies"
    },
    {
      "stage": "Plenary",
      "duration": "10 min",
      "teaching": "Summary and consolidation activities",
      "learning": "Student reflection and demonstration of learning",
      "assessing": "Check that learning objectives have been achieved",
      "adapting": "Ensure all students can demonstrate their learning"
    }
  ]
}`;
  }

  return `${basePrompt}${specificContext}

Please provide a comprehensive lesson plan in JSON format:

${jsonStructure}

Important guidelines:
${data.year_group ? `- Make it age-appropriate for ${data.year_group}` : "- Make it age-appropriate"}
- Include specific strategies for adapting to students with SEN (Special Educational Needs)
- Provide stretch and challenge for high achievers
- Include formative assessment opportunities throughout
- Use UK curriculum terminology and standards
- Make activities engaging and interactive
- Ensure clear progression throughout the lesson
- Return ONLY valid JSON, no markdown formatting or code blocks`;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLessonRequest = await request.json();

    if (!body.planType) {
      body.planType = "standard";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = getPromptForType(body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to generate content");
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;

    // Clean up response
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n?/g, "").replace(/\n?```$/g, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\n?/g, "").replace(/\n?```$/g, "");
    }

    let lessonPlan;
    try {
      lessonPlan = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error. Response was:", text);
      console.error(parseError);
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    // ============================================
    // ENSURE REQUIRED FIELDS EXIST
    // ============================================
    const ensureFieldsExist = (
      plan: Record<string, unknown>,
      planType: string,
      studentName?: string
    ) => {
      const name = studentName || "the student";

      // Evaluation defaults - with examples
      if (
        !plan.evaluation ||
        (Array.isArray(plan.evaluation) && plan.evaluation.length === 0)
      ) {
        if (planType === "tutor") {
          plan.evaluation = [
            `**Student Progress:** (e.g., ${name} made good progress toward today's objectives, demonstrating understanding of the core concept)`,
            "**Concepts Grasped:** (e.g., Quickly understood how to set up equations, showed confidence with basic problems)",
            "**Areas Needing Support:** (e.g., Still struggling with word problems - needs more practice translating words to equations)",
            "**Effective Strategies:** (e.g., Visual diagrams really helped, breaking problems into smaller steps reduced anxiety)",
            "**Confidence Level:** (e.g., Started at 4/10, ended at 7/10 - noticeable improvement mid-session)",
            "**Next Session Focus:** (e.g., Revisit word problems with simpler examples before progressing)",
          ];
        } else {
          plan.evaluation = [
            "**Objectives Achieved:** (e.g., Most students met learning objectives, evidenced by exit ticket results)",
            "**Evidence of Learning:** (e.g., Student discussions showed good understanding of key concepts)",
            "**Misconceptions Observed:** (e.g., Several students confused X with Y - address next lesson)",
            "**Improvements for Next Time:** (e.g., Allow more time for group activity, simplify initial examples)",
          ];
        }
      }

      // Notes defaults - with examples
      if (
        !plan.notes ||
        (Array.isArray(plan.notes) && plan.notes.length === 0)
      ) {
        if (planType === "tutor") {
          plan.notes = [
            "**Important Reminders:**",
            `(e.g., ${name} has a test next week - focus on exam technique)`,
            "(e.g., Parent requested focus on mental maths strategies)",
            "",
            "**Misconceptions Observed:**",
            "(e.g., Keeps forgetting to flip the sign when multiplying negatives)",
            "(e.g., Confuses area and perimeter formulas)",
            "",
            "**Timing Notes:**",
            "(e.g., Starter took longer than expected - reduce to 5 mins next time)",
            "(e.g., Student works best in 15-min focused blocks with short breaks)",
            "",
            "**Engagement Observations:**",
            "(e.g., Energy dropped after 30 mins - try a movement break next time)",
            "(e.g., Really engaged when using real-world football examples)",
            "",
            "**Learning Style Notes:**",
            "(e.g., Responds well to visual diagrams and colour-coding)",
            "(e.g., Prefers to try problems independently before asking for help)",
            "(e.g., Learns better when talking through their thinking aloud)",
            "",
            "**Next Session Preparation:**",
            "(e.g., Print worksheet on fractions, prepare number line visual)",
            "(e.g., Find video explanation as alternative approach)",
            "",
            "**Parent Communication:**",
            "(e.g., Share that student mastered multiplication tables 1-5)",
            "(e.g., Suggest 10 mins daily practice on times tables app)",
            "(e.g., Discuss moving to more challenging material next month)",
          ];
        } else {
          plan.notes = [
            "**Important Reminders:**",
            "(e.g., Year 11 mock exams in 3 weeks - adjust pace accordingly)",
            "",
            "**Common Misconceptions:**",
            "(e.g., Students often confuse correlation with causation)",
            "",
            "**Timing Considerations:**",
            "(e.g., Group work needs 5 extra minutes for this class)",
            "",
            "**Behaviour Management:**",
            "(e.g., Seat X away from Y, use proximity praise for Z)",
            "",
            "**Differentiation Notes:**",
            "(e.g., Table 3 needs additional scaffolding, Table 1 ready for extension)",
          ];
        }
      }

      return plan;
    };

    lessonPlan = ensureFieldsExist(lessonPlan, body.planType, body.student_name);

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate lesson plan",
      },
      { status: 500 }
    );
  }
}