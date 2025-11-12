import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { parseResources, prettyDate, prettyTime } from "../../utils/helpers";
import { User, Calendar, Clock, Printer } from "lucide-react";
import Link from "next/link";
import { TutorLessonPlan } from "../../types/lesson_tutor";

/* --- EXPANDED LESSON VIEW --- */
export function TutorExpandedLessonView({ lesson }: { lesson: TutorLessonPlan }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(lesson.notes ?? "");
  const [evaluation, setEvaluation] = useState(lesson.evaluation ?? "");
  const [homework, setHomework] = useState(lesson.homework ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  async function handleSave(field: "notes" | "evaluation" | "homework", value: string) {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("tutor_lesson_plans")
        .update({ [field]: value })
        .eq("id", lesson.id);
      if (error) throw error;
      setMessage("Saved!");
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage("Error saving changes");
    } finally {
      setSaving(false);
    }
  }

  const handlePrint = () => {
    const printElement = document.getElementById('lesson-print');
    if (!printElement) return;

    // Clone the element to manipulate without affecting the UI
    const clone = printElement.cloneNode(true) as HTMLElement;

    // Replace textareas with their content as paragraphs
    const textareas = clone.querySelectorAll('textarea');
    textareas.forEach((ta) => {
      const p = document.createElement('p');
      p.textContent = ta.value;
      p.style.whiteSpace = 'pre-wrap'; // preserve line breaks
      ta.parentNode?.replaceChild(p, ta);
    });

    const newWindow = window.open('', '', 'width=800,height=600');
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Lesson Plan</title>
          <style>
            body {
              font-family: sans-serif;
              margin: 20px;
              color: #000;
              background: #fff;
            }
            h2, h3 {
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: left;
            }
            ul {
              padding-left: 20px;
            }
            button, input {
              display: none !important;
            }
            section {
              page-break-inside: avoid;
              margin-bottom: 15px;
            }
            .meta-space {
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          ${clone.outerHTML}
        </body>
      </html>
    `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div id="lesson-print" className="ExpandedLessonView space-y-6 text-foreground">
      {/* --- HEADER --- */}
      <header>
        <h2 className="text-2xl font-bold text-foreground">
          {lesson.topic ?? "Untitled"}
        </h2>
        <p className="text-sm text-muted-foreground">
          <Link href={`/dashboard/student-profiles/${lesson.student_id}`}><User size={20} className="inline" /> {lesson.first_name}{" "}{lesson.last_name} <span className="meta-space" /></Link>
          <Calendar size={17} className="inline ml-4" /> {prettyDate(lesson.date_of_lesson)}{" "} <span className="meta-space" />
          <Clock size={17} className="inline ml-4" /> {lesson.time_of_lesson && ` ${prettyTime(lesson.time_of_lesson)}`}
        </p>
      </header>

      {/* --- OBJECTIVES & OUTCOMES INLINE --- */}
      {(lesson.objectives || lesson.outcomes) && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.objectives && (
              <div>
                <h4 className="font-medium text-foreground">Objectives</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {lesson.objectives}
                </p>
              </div>
            )}

            {lesson.outcomes && (
              <div>
                <h4 className="font-medium text-foreground">Outcomes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {lesson.outcomes}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- LESSON STRUCTURE --- */}
      {lessonStructure.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2 text-foreground">
            Lesson Structure
          </h3>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-semibold border-r border-border">
                    Stage
                  </th>
                  <th className="text-left p-3 font-semibold border-r border-border">
                    Duration
                  </th>
                  <th className="text-left p-3 font-semibold border-r border-border">
                    Teaching
                  </th>
                  <th className="text-left p-3 font-semibold border-r border-border">
                    Learning
                  </th>
                  <th className="text-left p-3 font-semibold border-r border-border">
                    Assessing
                  </th>
                  <th className="text-left p-3 font-semibold">Adapting</th>
                </tr>
              </thead>
              <tbody>
                {lessonStructure.map((stage, i) => (
                  <tr
                    key={i}
                    className={`border-t border-border transition-colors ${
                      i % 2 ? "bg-muted/50" : "bg-background"
                    } hover:bg-accent`}
                  >
                    <td className="p-3 font-medium border-r border-border">
                      {stage.stage}
                    </td>
                    <td className="p-3 border-r border-border">
                      {stage.duration}
                    </td>
                    <td className="p-3 border-r border-border">
                      {stage.teaching}
                    </td>
                    <td className="p-3 border-r border-border">
                      {stage.learning}
                    </td>
                    <td className="p-3 border-r border-border">
                      {stage.assessing}
                    </td>
                    <td className="p-3">{stage.adapting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- RESOURCES --- */}
      {resources.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2 text-foreground">Resources</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {r.title || r.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- HOMEWORK (editable) --- */}
      <section>
        <h3 className="font-semibold mb-1 text-foreground">Homework</h3>

        <textarea
          className="w-full min-h-[80px] rounded-md border border-input bg-background 
                    text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
          value={homework}
          onChange={(e) => setHomework(e.target.value)}
          onBlur={() => handleSave("homework", homework)}
        />
      </section>

      {/* --- NOTES & EVALUATION --- */}
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1 text-foreground">Evaluation</h3>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            onBlur={() => handleSave("evaluation", evaluation)}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-1 text-foreground">Notes</h3>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => handleSave("notes", notes)}
          />
        </div>

        {message && (
          <p
            className={`text-sm ${
              message === "Saved!"
                ? "text-green-600 dark:text-green-400"
                : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}
      </section>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-muted-foreground">
          Created: {new Date(lesson.created_at).toLocaleString()} • Updated:{" "}
          {new Date(lesson.updated_at).toLocaleString()}
        </span>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          <Printer size={18} />
          Print / Export PDF
        </button>
      </div>
    </div>
  );
}
