import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { parseResources, prettyDate, prettyTime } from "../utils/helpers";

/* --- EXPANDED LESSON VIEW --- */
export function ExpandedLessonView({ lesson }: { lesson: LessonPlan }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(lesson.notes ?? "");
  const [evaluation, setEvaluation] = useState(lesson.evaluation ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  async function handleSave(field: "notes" | "evaluation", value: string) {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("lesson_plans")
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

  return (
    <div className="space-y-6 text-foreground">
      {/* --- HEADER --- */}
      <header>
        <h2 className="text-2xl font-bold text-foreground">
          {lesson.topic ?? "Untitled"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lesson.class} • {prettyDate(lesson.date_of_lesson)}{" "}
          {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
        </p>
      </header>

      {/* --- OBJECTIVES --- */}
      {lesson.objectives && (
        <section>
          <h3 className="font-semibold mb-1 text-foreground">Objectives</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {lesson.objectives}
          </p>
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

      {/* --- NOTES & EVALUATION --- */}
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1 text-foreground">Notes</h3>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => handleSave("notes", notes)}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-1 text-foreground">Evaluation</h3>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            onBlur={() => handleSave("evaluation", evaluation)}
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
    </div>
  );
}
