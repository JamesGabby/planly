'use client'

import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { parseResources, prettyDate, prettyTime } from "../../utils/helpers";
import { Calendar, Clock, GraduationCap, Printer } from "lucide-react";
import Link from "next/link";

/* --- EXPANDED LESSON VIEW --- */
export function ExpandedLessonView({ lesson }: { lesson: LessonPlanTeacher }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(lesson.notes ?? "");
  const [evaluation, setEvaluation] = useState(lesson.evaluation ?? "");
  const [homework, setHomework] = useState(lesson.homework ?? "");
  const [, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  
  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure) ? lesson.lesson_structure : [];

  // Fetch the class_id based on class_name and user_id
  useEffect(() => {
    async function fetchClassId() {
      if (!lesson.class || !lesson.user_id) return;
      
      try {
        // First, try to get the class by both class_name and user_id
        const { data, error } = await supabase
          .from("classes")
          .select("class_id")
          .eq("class_name", lesson.class)
          .eq("user_id", lesson.user_id)
          .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setClassId(data.class_id);
        } else {
          // If no class found with user_id match, try to get any class with this name
          // This handles cases where classes might be shared or have different ownership
          const { data: anyClassData, error: anyClassError } = await supabase
            .from("classes")
            .select("class_id")
            .eq("class_name", lesson.class)
            .limit(1)
            .maybeSingle();
            
          if (anyClassError && anyClassError.code !== 'PGRST116') {
            throw anyClassError;
          }
          
          if (anyClassData) {
            setClassId(anyClassData.class_id);
          }
        }
      } catch (err) {
        console.error("Error fetching class ID:", err);
      }
    }
    
    fetchClassId();
  }, [lesson.class, lesson.user_id, supabase]);

  async function handleSave(field: "notes" | "evaluation" | "homework", value: string) {
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
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Error saving changes";
      setMessage(message);
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
            body { font-family: sans-serif; margin: 20px; color: #000; background: #fff; }
            h2, h3 { color: #000; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
            ul { padding-left: 20px; }
            button, input, a { display: none !important; }
            section { page-break-inside: avoid; margin-bottom: 15px; }
            .meta-space { margin-right: 55px; }
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
        <p className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <GraduationCap size={20} className="inline" />
            {lesson.year_group}
          </span>
          <span>•</span>
          {classId ? (
            <Link 
              href={`/dashboard/classes/${classId}`}
              className="text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {lesson.class}
            </Link>
          ) : (
            <span>{lesson.class}</span>
          )}
          {lesson.exam_board && (
            <>
              <span>•</span>
              <span>{lesson.exam_board}</span>
            </>
          )}
          <span className="meta-space" />
          <span className="flex items-center gap-1">
            <Calendar size={17} className="inline" />
            {prettyDate(lesson.date_of_lesson)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={17} className="inline" />
            {lesson.time_of_lesson && `${prettyTime(lesson.time_of_lesson)}`}
          </span>
        </p>
      </header>

      {/* --- OBJECTIVES & OUTCOMES --- */}
      {(lesson.objectives || lesson.outcomes) && (
        <section className="grid md:grid-cols-2 gap-4">
          {lesson.objectives && (
            <div>
              <h3 className="font-semibold mb-1 text-foreground">Objectives</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {lesson.objectives}
              </p>
            </div>
          )}
          {lesson.outcomes && (
            <div>
              <h3 className="font-semibold mb-1 text-foreground">Outcomes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {lesson.outcomes}
              </p>
            </div>
          )}
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
        <span className="text-xs text-muted-foreground flex flex-col md:flex-row md:items-center md:gap-2">
          <span>Created: {new Date(lesson.created_at).toLocaleString()}</span>
          <span>Updated: {new Date(lesson.updated_at).toLocaleString()}</span>
        </span>

        <button
          onClick={handlePrint}
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          <Printer size={18} />
          Print / Export PDF
        </button>
      </div>
    </div>
  );
}
