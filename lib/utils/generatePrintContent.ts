// utils/generatePrintContent.ts
import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { parseResources, prettyDate, prettyTime } from "@/app/dashboard/lesson-plans/utils/helpers";

interface PrintOptions {
  paperSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
  fontSize: "small" | "medium" | "large";
  includeHeader: boolean;
  includeFooter: boolean;
  colorMode: "color" | "grayscale";
}

export function generatePrintContent(
  lesson: LessonPlanTeacher,
  sections: string[],
  options: PrintOptions
): string {
  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  const fontSizes = {
    small: { base: "12px", h1: "20px", h2: "16px", h3: "14px" },
    medium: { base: "14px", h1: "24px", h2: "18px", h3: "16px" },
    large: { base: "16px", h1: "28px", h2: "20px", h3: "18px" },
  };

  const sizes = fontSizes[options.fontSize];
  const isGrayscale = options.colorMode === "grayscale";

  const colors = isGrayscale
    ? {
        primary: "#374151",
        secondary: "#6b7280",
        accent: "#9ca3af",
        headerBg: "#f3f4f6",
        cardBg: "#f9fafb",
        border: "#d1d5db",
        text: "#111827",
        muted: "#6b7280",
      }
    : {
        primary: "#2563eb",
        secondary: "#3b82f6",
        accent: "#60a5fa",
        headerBg: "#eff6ff",
        cardBg: "#f8fafc",
        border: "#e2e8f0",
        text: "#1e293b",
        muted: "#64748b",
        objectivesBg: "#eff6ff",
        outcomesBg: "#f0fdf4",
        stageBg: "#f8fafc",
      };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lesson Plan - ${lesson.topic || "Untitled"}</title>
  <style>
    @page {
      size: ${options.paperSize} ${options.orientation};
      margin: 20mm;
      ${
        options.includeFooter
          ? `
        @bottom-center {
          content: "Page " counter(page) " of " counter(pages);
          font-size: 10px;
          color: ${colors.muted};
        }
      `
          : ""
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
      font-size: ${sizes.base};
      line-height: 1.6;
      color: ${colors.text};
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .print-container {
      max-width: 100%;
      padding: 0;
    }

    /* Header Styles */
    .lesson-header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 3px solid ${colors.primary};
    }

    .lesson-title {
      font-size: ${sizes.h1};
      font-weight: 700;
      color: ${colors.primary};
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      background: ${colors.headerBg};
      padding: 16px;
      border-radius: 8px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${colors.muted};
      margin-bottom: 2px;
    }

    .meta-value {
      font-weight: 600;
      color: ${colors.text};
    }

    /* Section Styles */
    .section {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: ${sizes.h2};
      font-weight: 600;
      color: ${colors.text};
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid ${colors.border};
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    /* Card Styles */
    .card {
      background: ${colors.cardBg};
      border: 1px solid ${colors.border};
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }

    .card-title {
      font-size: ${sizes.h3};
      font-weight: 600;
      margin-bottom: 8px;
      color: ${colors.text};
    }

    /* Two Column Grid */
    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media print {
      .two-col-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Objectives & Outcomes */
    .objectives-card {
      background: ${isGrayscale ? colors.cardBg : "#eff6ff"};
      border-left: 4px solid ${isGrayscale ? colors.primary : "#3b82f6"};
    }

    .outcomes-card {
      background: ${isGrayscale ? colors.cardBg : "#f0fdf4"};
      border-left: 4px solid ${isGrayscale ? colors.primary : "#22c55e"};
    }

    /* Lesson Structure */
    .stage-card {
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid ${colors.border};
      page-break-inside: avoid;
    }

    .stage-header {
      background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.cardBg} 100%);
      padding: 12px 16px;
      border-bottom: 1px solid ${colors.border};
    }

    .stage-number {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${colors.primary};
      font-weight: 600;
    }

    .stage-title {
      font-size: ${sizes.h3};
      font-weight: 600;
      color: ${colors.text};
      margin-top: 4px;
    }

    .stage-duration {
      font-size: 12px;
      color: ${colors.muted};
      margin-top: 4px;
    }

    .stage-content {
      padding: 16px;
    }

    .stage-section {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px dashed ${colors.border};
    }

    .stage-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .stage-section-title {
      font-size: 12px;
      font-weight: 600;
      color: ${colors.muted};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .dot-blue { background: ${isGrayscale ? "#374151" : "#3b82f6"}; }
    .dot-green { background: ${isGrayscale ? "#6b7280" : "#22c55e"}; }
    .dot-amber { background: ${isGrayscale ? "#9ca3af" : "#f59e0b"}; }
    .dot-purple { background: ${isGrayscale ? "#4b5563" : "#8b5cf6"}; }

    /* Lists */
    ul {
      list-style: none;
      padding-left: 0;
    }

    li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 6px;
    }

    li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${colors.primary};
      font-weight: bold;
    }

    /* Resources */
    .resources-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .resource-item {
      padding: 8px 12px;
      background: ${colors.cardBg};
      border: 1px solid ${colors.border};
      border-radius: 6px;
      font-size: 13px;
    }

    /* Info Cards Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .info-card {
      padding: 12px;
      background: ${colors.cardBg};
      border: 1px solid ${colors.border};
      border-radius: 8px;
    }

    .info-card-title {
      font-size: 12px;
      font-weight: 600;
      color: ${colors.muted};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    /* Footer */
    .print-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid ${colors.border};
      font-size: 11px;
      color: ${colors.muted};
      display: flex;
      justify-content: space-between;
    }

    /* Watermark (optional) */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(0, 0, 0, 0.03);
      pointer-events: none;
      white-space: nowrap;
      z-index: -1;
    }

    /* Print-specific styles */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      .avoid-break {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    ${
      sections.includes("header")
        ? `
      <header class="lesson-header">
        <h1 class="lesson-title">${lesson.topic || "Untitled Lesson Plan"}</h1>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Class</span>
            <span class="meta-value">${lesson.class}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Year Group</span>
            <span class="meta-value">${lesson.year_group}</span>
          </div>
          ${
            lesson.exam_board
              ? `
            <div class="meta-item">
              <span class="meta-label">Exam Board</span>
              <span class="meta-value">${lesson.exam_board}</span>
            </div>
          `
              : ""
          }
          <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">${prettyDate(lesson.date_of_lesson)}</span>
          </div>
          ${
            lesson.time_of_lesson
              ? `
            <div class="meta-item">
              <span class="meta-label">Time</span>
              <span class="meta-value">${prettyTime(lesson.time_of_lesson)}</span>
            </div>
          `
              : ""
          }
        </div>
      </header>
    `
        : ""
    }

    ${
      sections.includes("objectives") && (lesson.objectives || lesson.outcomes)
        ? `
      <section class="section">
        <div class="two-col-grid">
          ${
            lesson.objectives
              ? `
            <div class="card objectives-card">
              <div class="card-title">🎯 Objectives</div>
              <div>${formatContent(lesson.objectives)}</div>
            </div>
          `
              : ""
          }
          ${
            lesson.outcomes
              ? `
            <div class="card outcomes-card">
              <div class="card-title">🏆 Outcomes</div>
              <div>${formatContent(lesson.outcomes)}</div>
            </div>
          `
              : ""
          }
        </div>
      </section>
    `
        : ""
    }

    ${
      sections.includes("structure") && lessonStructure.length > 0
        ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon" style="background: ${colors.headerBg};">📚</span>
          Lesson Structure
        </h2>
        ${lessonStructure
          .map(
            (stage, i) => `
          <div class="stage-card avoid-break">
            <div class="stage-header">
              <div class="stage-number">Stage ${i + 1} of ${lessonStructure.length}</div>
              <div class="stage-title">${stage.stage}</div>
              ${stage.duration ? `<div class="stage-duration">⏱ ${stage.duration}</div>` : ""}
            </div>
            <div class="stage-content">
              ${
                stage.teaching
                  ? `
                <div class="stage-section">
                  <div class="stage-section-title">
                    <span class="dot dot-blue"></span>
                    Teaching Activities
                  </div>
                  <div>${formatContent(stage.teaching)}</div>
                </div>
              `
                  : ""
              }
              ${
                stage.learning
                  ? `
                <div class="stage-section">
                  <div class="stage-section-title">
                    <span class="dot dot-green"></span>
                    Student Learning
                  </div>
                  <div>${formatContent(stage.learning)}</div>
                </div>
              `
                  : ""
              }
              ${
                stage.assessing
                  ? `
                <div class="stage-section">
                  <div class="stage-section-title">
                    <span class="dot dot-amber"></span>
                    Assessment Methods
                  </div>
                  <div>${formatContent(stage.assessing)}</div>
                </div>
              `
                  : ""
              }
              ${
                stage.adapting
                  ? `
                <div class="stage-section">
                  <div class="stage-section-title">
                    <span class="dot dot-purple"></span>
                    Differentiation
                  </div>
                  <div>${formatContent(stage.adapting)}</div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}
      </section>
    `
        : ""
    }

    ${
      sections.includes("details")
        ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon" style="background: ${colors.headerBg};">💡</span>
          Additional Details
        </h2>
        <div class="info-grid">
          ${
            lesson.specialist_subject_knowledge_required
              ? `
            <div class="info-card">
              <div class="info-card-title">🧠 Specialist Knowledge</div>
              <div>${formatContent(lesson.specialist_subject_knowledge_required)}</div>
            </div>
          `
              : ""
          }
          ${
            lesson.knowledge_revisited
              ? `
            <div class="info-card">
              <div class="info-card-title">📖 Knowledge Revisited</div>
              <div>${formatContent(lesson.knowledge_revisited)}</div>
            </div>
          `
              : ""
          }
          ${
            lesson.numeracy_opportunities
              ? `
            <div class="info-card">
              <div class="info-card-title">🔢 Numeracy Opportunities</div>
              <div>${formatContent(lesson.numeracy_opportunities)}</div>
            </div>
          `
              : ""
          }
          ${
            lesson.literacy_opportunities
              ? `
            <div class="info-card">
              <div class="info-card-title">📝 Literacy Opportunities</div>
              <div>${formatContent(lesson.literacy_opportunities)}</div>
            </div>
          `
              : ""
          }
          ${
            lesson.health_and_safety_considerations
              ? `
            <div class="info-card">
              <div class="info-card-title">🛡️ Health & Safety</div>
              <div>${formatContent(lesson.health_and_safety_considerations)}</div>
            </div>
          `
              : ""
          }
        </div>
      </section>
    `
        : ""
    }

    ${
      sections.includes("resources") && resources.length > 0
        ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon" style="background: ${colors.headerBg};">📦</span>
          Resources
        </h2>
        <div class="resources-list">
          ${resources.map((r) => `<div class="resource-item">→ ${r.title || r.url}</div>`).join("")}
        </div>
      </section>
    `
        : ""
    }

    ${
      sections.includes("homework") && lesson.homework
        ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon" style="background: ${colors.headerBg};">📋</span>
          Homework
        </h2>
        <div class="card">
          ${formatContent(lesson.homework)}
        </div>
      </section>
    `
        : ""
    }

    ${
      sections.includes("evaluation")
        ? `
      ${
        lesson.evaluation
          ? `
        <section class="section">
          <h2 class="section-title">
            <span class="section-icon" style="background: ${colors.headerBg};">✅</span>
            Evaluation
          </h2>
          <div class="card">
            ${formatContent(lesson.evaluation)}
          </div>
        </section>
      `
          : ""
      }
      ${
        lesson.notes
          ? `
        <section class="section">
          <h2 class="section-title">
            <span class="section-icon" style="background: ${colors.headerBg};">📝</span>
            Notes
          </h2>
          <div class="card">
            ${formatContent(lesson.notes)}
          </div>
        </section>
      `
          : ""
      }
    `
        : ""
    }

    ${
      options.includeFooter
        ? `
      <footer class="print-footer">
        <span>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
        <span>Created: ${new Date(lesson.created_at).toLocaleDateString()}</span>
      </footer>
    `
        : ""
    }
  </div>
</body>
</html>
  `;
}

function formatContent(content: string | null | undefined): string {
  if (!content || typeof content !== "string") return "";

  // Handle bullet points
  const parts = content.split(/•\s+/).filter((item) => item.trim());

  if (parts.length <= 1) {
    return content
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  }

  return `<ul>${parts.map((item) => `<li>${item.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />")}</li>`).join("")}</ul>`;
}