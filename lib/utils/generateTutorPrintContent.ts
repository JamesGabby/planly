// utils/generateTutorPrintContent.ts
import { LessonPlanTutor } from "@/app/dashboard/lesson-plans/types/lesson_tutor";
import { parseResources, prettyDate, prettyTime } from "@/app/dashboard/lesson-plans/utils/helpers";
import { TutorPrintOptions } from "@/components/TutorPrintPreviewDialog";

export function generateTutorPrintContent(
  lesson: LessonPlanTutor,
  sections: string[],
  options: TutorPrintOptions
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
        headerBg: "#f3f4f6",
        cardBg: "#f9fafb",
        border: "#d1d5db",
        text: "#111827",
        muted: "#6b7280",
      }
    : {
        primary: "#2563eb",
        headerBg: "#eff6ff",
        cardBg: "#f8fafc",
        border: "#e2e8f0",
        text: "#1e293b",
        muted: "#64748b",
      };

  const studentName = lesson.tutor_student_profiles
    ? `${lesson.tutor_student_profiles.first_name} ${lesson.tutor_student_profiles.last_name}`
    : "Unknown Student";

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
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: ${sizes.base};
      line-height: 1.6;
      color: ${colors.text};
      background: #fff;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .lesson-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 3px solid ${colors.primary};
    }

    .lesson-title {
      font-size: ${sizes.h1};
      font-weight: 700;
      color: ${colors.primary};
      margin-bottom: 16px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
    }

    .card {
      background: ${colors.cardBg};
      border: 1px solid ${colors.border};
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }

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

    .objectives-card {
      background: ${isGrayscale ? colors.cardBg : "#eff6ff"};
      border-left: 4px solid ${isGrayscale ? colors.primary : "#3b82f6"};
    }

    .outcomes-card {
      background: ${isGrayscale ? colors.cardBg : "#f0fdf4"};
      border-left: 4px solid ${isGrayscale ? colors.primary : "#22c55e"};
    }

    .card-title {
      font-size: ${sizes.h3};
      font-weight: 600;
      margin-bottom: 8px;
    }

    .stage-card {
      border: 1px solid ${colors.border};
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .stage-header {
      background: ${colors.headerBg};
      padding: 12px 16px;
      border-bottom: 1px solid ${colors.border};
    }

    .stage-number {
      font-size: 10px;
      text-transform: uppercase;
      color: ${colors.primary};
      font-weight: 600;
    }

    .stage-title {
      font-size: ${sizes.h3};
      font-weight: 600;
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
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot-blue { background: ${isGrayscale ? "#374151" : "#3b82f6"}; }
    .dot-green { background: ${isGrayscale ? "#6b7280" : "#22c55e"}; }
    .dot-amber { background: ${isGrayscale ? "#9ca3af" : "#f59e0b"}; }
    .dot-purple { background: ${isGrayscale ? "#4b5563" : "#8b5cf6"}; }

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

    .print-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid ${colors.border};
      font-size: 11px;
      color: ${colors.muted};
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body { padding: 0; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  ${sections.includes("header") ? `
    <header class="lesson-header">
      <h1 class="lesson-title">${lesson.topic || "Untitled Lesson Plan"}</h1>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Student</span>
          <span class="meta-value">${studentName}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Date</span>
          <span class="meta-value">${prettyDate(lesson.date_of_lesson)}</span>
        </div>
        ${lesson.time_of_lesson ? `
          <div class="meta-item">
            <span class="meta-label">Time</span>
            <span class="meta-value">${prettyTime(lesson.time_of_lesson)}</span>
          </div>
        ` : ""}
      </div>
    </header>
  ` : ""}

  ${sections.includes("objectives") && (lesson.objectives || lesson.outcomes) ? `
    <section class="section">
      <div class="two-col-grid">
        ${lesson.objectives ? `
          <div class="card objectives-card">
            <div class="card-title">🎯 Objectives</div>
            <div>${formatContent(lesson.objectives)}</div>
          </div>
        ` : ""}
        ${lesson.outcomes ? `
          <div class="card outcomes-card">
            <div class="card-title">🏆 Outcomes</div>
            <div>${formatContent(lesson.outcomes)}</div>
          </div>
        ` : ""}
      </div>
    </section>
  ` : ""}

  ${sections.includes("structure") && lessonStructure.length > 0 ? `
    <section class="section">
      <h2 class="section-title">📚 Lesson Structure</h2>
      ${lessonStructure.map((stage, i) => `
        <div class="stage-card">
          <div class="stage-header">
            <div class="stage-number">Stage ${i + 1} of ${lessonStructure.length}</div>
            <div class="stage-title">${stage.stage}</div>
            ${stage.duration ? `<div class="stage-duration">⏱ ${stage.duration}</div>` : ""}
          </div>
          <div class="stage-content">
            ${stage.teaching ? `
              <div class="stage-section">
                <div class="stage-section-title">
                  <span class="dot dot-blue"></span> Teaching Activities
                </div>
                <div>${formatContent(stage.teaching)}</div>
              </div>
            ` : ""}
            ${stage.learning ? `
              <div class="stage-section">
                <div class="stage-section-title">
                  <span class="dot dot-green"></span> Student Learning
                </div>
                <div>${formatContent(stage.learning)}</div>
              </div>
            ` : ""}
            ${stage.assessing ? `
              <div class="stage-section">
                <div class="stage-section-title">
                  <span class="dot dot-amber"></span> Assessment Methods
                </div>
                <div>${formatContent(stage.assessing)}</div>
              </div>
            ` : ""}
            ${stage.adapting ? `
              <div class="stage-section">
                <div class="stage-section-title">
                  <span class="dot dot-purple"></span> Differentiation
                </div>
                <div>${formatContent(stage.adapting)}</div>
              </div>
            ` : ""}
          </div>
        </div>
      `).join("")}
    </section>
  ` : ""}

  ${sections.includes("resources") && resources.length > 0 ? `
    <section class="section">
      <h2 class="section-title">📦 Resources</h2>
      <div class="resources-list">
        ${resources.map(r => `
          <div class="resource-item">→ ${r.title || r.url}</div>
        `).join("")}
      </div>
    </section>
  ` : ""}

  ${sections.includes("homework") && lesson.homework ? `
    <section class="section">
      <h2 class="section-title">📋 Homework</h2>
      <div class="card">${formatContent(lesson.homework)}</div>
    </section>
  ` : ""}

  ${sections.includes("evaluation_tips") && lesson.evaluation_tips ? `
    <section class="section">
      <h2 class="section-title">✅ Evaluation</h2>
      <div class="card">${formatContent(lesson.evaluation_tips)}</div>
    </section>
  ` : ""}

  ${sections.includes("evaluation_tips") && lesson.notes ? `
    <section class="section">
      <h2 class="section-title">📝 Notes</h2>
      <div class="card">${formatContent(lesson.notes)}</div>
    </section>
  ` : ""}

  ${options.includeFooter ? `
    <footer class="print-footer">
      <span>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
      <span>Student: ${studentName}</span>
    </footer>
  ` : ""}
</body>
</html>
  `;
}

function formatContent(content: string | null | undefined): string {
  if (!content || typeof content !== "string") return "";

  const parts = content.split(/•\s+/).filter((item) => item.trim());

  if (parts.length <= 1) {
    return content
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  }

  return `<ul>${parts
    .map(
      (item) =>
        `<li>${item
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br />")}</li>`
    )
    .join("")}</ul>`;
}