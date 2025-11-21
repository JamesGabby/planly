import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      topic,
      subject,
      year_group,
      objectives,
      outcomes,
      exam_board,
      class: className,
      duration = "60 minutes",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `You are an expert UK teacher. Create a detailed lesson plan with the following specifications:

**Lesson Details:**
- Subject: ${subject}
- Year Group: ${year_group}
- Topic: ${topic}
- Class: ${className}
- Duration: ${duration}
${exam_board ? `- Exam Board: ${exam_board}` : ""}
${objectives ? `- Teacher's Objectives: ${objectives}` : ""}
${outcomes ? `- Desired Outcomes: ${outcomes}` : ""}

Please provide a comprehensive lesson plan in the following JSON format:

{
  "objectives": "• Clear learning objectives (if not provided, generate 3-4 specific objectives)",
  "outcomes": "• Measurable learning outcomes (if not provided, generate 3-4 outcomes)",
  "homework": "• Relevant homework task that reinforces learning",
  "evaluation": "• How to assess if learning objectives were met\\n• Questions to ask\\n• Success criteria",
  "notes": "• Important reminders for the teacher\\n• Differentiation strategies\\n• Common misconceptions to address",
  "resources": [
    {"title": "Resource name", "url": ""},
    {"title": "Another resource", "url": ""}
  ],
  "lesson_structure": [
    {
      "stage": "Starter",
      "duration": "10 min",
      "teaching": "What the teacher does/says",
      "learning": "What students do",
      "assessing": "How to check understanding",
      "adapting": "Support for students with SEN, stretch for high achievers"
    },
    {
      "stage": "Main Activity 1",
      "duration": "20 min",
      "teaching": "What the teacher does/says",
      "learning": "What students do",
      "assessing": "How to check understanding",
      "adapting": "Support for students with SEN, stretch for high achievers"
    },
    {
      "stage": "Main Activity 2",
      "duration": "20 min",
      "teaching": "What the teacher does/says",
      "learning": "What students do",
      "assessing": "How to check understanding",
      "adapting": "Support for students with SEN, stretch for high achievers"
    },
    {
      "stage": "Plenary",
      "duration": "10 min",
      "teaching": "What the teacher does/says",
      "learning": "What students do",
      "assessing": "How to check understanding",
      "adapting": "Support for students with SEN, stretch for high achievers"
    }
  ]
}

Important guidelines:
- Make it age-appropriate for ${year_group}
- Include specific strategies for adapting to students with SEN (Special Educational Needs)
- Provide stretch and challenge for high achievers
- Include formative assessment opportunities throughout
- Use UK curriculum terminology and standards
- Make activities engaging and interactive
- Ensure progression throughout the lesson
- Return ONLY valid JSON, no markdown formatting or code blocks`;

    // Use gemini-2.5-flash (the model available in your API)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
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
    
    // Extract text from response
    let text = data.candidates[0].content.parts[0].text;

    // Clean up the response (remove markdown code blocks if present)
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
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    return NextResponse.json(lessonPlan);
  } catch (error) {
    console.error("Gemini API error:", error);

    let errorMessage = "Failed to generate lesson plan";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}