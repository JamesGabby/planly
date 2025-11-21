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
- Personalized, responsive instruction
- Frequent checks for understanding every 3-5 minutes
- Adaptive pacing based on student response
- Building student confidence and independence
- Addressing specific knowledge gaps`;

      jsonStructure = `{
  "objectives": "• Specific, achievable goals for this tutoring session\\n• Focused on the student's individual needs and current level",
  "outcomes": "• What the student will be able to do by the end\\n• Concrete, measurable progress indicators",
  "materials_needed": [
    "Whiteboard and markers",
    "Student workbook or paper",
    "Specific textbook pages or worksheets",
    "Calculator or other tools",
    "Access to online resources if needed"
  ],
  "lesson_structure": [
    {
      "stage": "Warm-up & Review",
      "duration": "5-10 min",
      "teaching": "What the tutor does: Review previous session, assess starting point, build rapport and confidence",
      "learning": "What the student does: Answers questions, demonstrates prior knowledge, shares concerns or questions",
      "assessing": "Check understanding through specific questions: What do you remember from last time? Can you explain...?",
      "adapting": "If struggling: Break down into smaller steps, revisit basics. If excelling: Move faster, add complexity"
    },
    {
      "stage": "Main Teaching",
      "duration": "15-20 min",
      "teaching": "Explicit teaching: Explain, model, demonstrate with clear examples and step-by-step guidance",
      "learning": "Active learning: Student takes notes, asks questions, tries examples with support",
      "assessing": "Check understanding every 3-5 minutes with targeted questions and observation of working",
      "adapting": "If struggling: Use different explanations, more worked examples, simplify. If excelling: Reduce scaffolding, increase complexity"
    },
    {
      "stage": "Guided Practice",
      "duration": "15-20 min",
      "teaching": "Support and guide: Provide scaffolding, give hints not answers, ask leading questions",
      "learning": "Work through problems with decreasing support, explain reasoning, practice independently",
      "assessing": "Observe working process, ask reasoning questions (Why did you...? How do you know...?)",
      "adapting": "If struggling: Provide more worked examples, work through together. If excelling: Step back, let them lead"
    },
    {
      "stage": "Independent Practice",
      "duration": "10-15 min",
      "teaching": "Observe and provide feedback: Watch student work independently, note areas of difficulty",
      "learning": "Work independently on similar problems, apply what they've learned without prompting",
      "assessing": "Review completed work, identify any remaining gaps or misconceptions",
      "adapting": "If struggling: Return to guided practice, reteach key concepts. If excelling: Provide challenge problems"
    },
    {
      "stage": "Review & Next Steps",
      "duration": "5 min",
      "teaching": "Summarize learning, celebrate progress, set homework, plan next session",
      "learning": "Reflect on what they learned, ask final questions, understand what to practice",
      "assessing": "Can student explain key concepts back to you? Do they feel confident?",
      "adapting": "Identify specific areas to focus on next time based on today's progress"
    }
  ],
  "key_teaching_points": [
    "• Most important concept 1 to emphasize and ensure understanding",
    "• Critical skill 2 that needs practice and mastery",
    "• Key connection 3 to help student see the bigger picture"
  ],
  "common_misconceptions": [
    "• Misconception 1 students often have about this topic",
    "• How to identify this misconception (what they might say or do)",
    "• Strategy to address and correct this misconception",
    "• Misconception 2 to watch out for",
    "• Correction approach with clear explanation"
  ],
  "assessment_methods": [
    "• Ask student to explain concepts in their own words",
    "• Observe their problem-solving approach and working",
    "• Review written work for understanding and common errors",
    "• Use exit questions at end: 'Explain to me how to...'",
    "• Check confidence level: 'How confident do you feel with this?'"
  ],
  "homework": "Optional practice task that reinforces today's learning:\\n• Specific problems or exercises to complete\\n• Estimated time: 20-30 minutes\\n• What to do if stuck (review notes, watch video, try simpler version)\\n• What to bring to next session",
  "parent_communication": "What to tell parents about today's session:\\n• Topics covered and skills practiced\\n• Progress made and achievements to celebrate\\n• What to practice at home and how parents can support\\n• Any concerns or areas needing extra attention\\n• Goals for next session",
  "next_session_prep": "What to prepare for next time:\\n• Materials needed (worksheets, resources)\\n• Topics to review if student didn't fully grasp today\\n• New concepts to introduce building on today's learning\\n• Questions to ask to check retention\\n• How to increase challenge if student is progressing quickly",
  "notes": "• Session observations: engagement level, confidence, effort\\n• What strategies worked well with this student\\n• Teaching approaches that were most effective\\n• Adjustments needed for future sessions\\n• Student's strengths to build on\\n• Motivational notes and encouragement to use"
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
      body.planType = "standard"; // Default to standard if not specified
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

    // Clean up response (remove markdown code blocks if present)
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

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
}