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
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">{lesson.topic ?? "Untitled"}</h2>
        <p className="text-sm text-slate-600">
          {lesson.class} • {prettyDate(lesson.date_of_lesson)}{" "}
          {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
        </p>
      </header>

      {lesson.objectives && (
        <section>
          <h3 className="font-semibold mb-1">Objectives</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {lesson.objectives}
          </p>
        </section>
      )}

      {lessonStructure.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Lesson Structure</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="text-left p-3 font-semibold border-r">Stage</th>
                  <th className="text-left p-3 font-semibold border-r">
                    Duration
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Teaching
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Learning
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Assessing
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Adapting
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessonStructure.map((stage, i) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i % 2 ? "bg-slate-50" : "bg-white"
                    } hover:bg-slate-100`}
                  >
                    <td className="p-3 font-medium border-r">{stage.stage}</td>
                    <td className="p-3 border-r">{stage.duration}</td>
                    <td className="p-3 border-r">{stage.teaching}</td>
                    <td className="p-3 border-r">{stage.learning}</td>
                    <td className="p-3 border-r">{stage.assessing}</td>
                    <td className="p-3">{stage.adapting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="list-disc list-inside text-sm text-blue-600">
            {resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {r.title || r.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}