"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Printer } from "lucide-react";

export interface StudentProfile {
  student_id: number;
  first_name: string | null;
  last_name: string | null;
  level?: string | null;
  goals?: string | null;
  interests?: string | null;
  learning_preferences?: string | null;
  strengths?: string | null;
  weaknesses?: string | null;
  notes?: string | null;
}

export function ExpandedStudentView({ student }: { student: StudentProfile }) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [goals, setGoals] = useState(student.goals ?? "");
  const [interests, setInterests] = useState(student.interests ?? "");
  const [learningPreferences, setLearningPreferences] = useState(student.learning_preferences ?? "");
  const [strengths, setStrengths] = useState(student.strengths ?? "");
  const [weaknesses, setWeaknesses] = useState(student.weaknesses ?? "");
  const [notes, setNotes] = useState(student.notes ?? "");

  async function handleSave(
    field:
      | "goals"
      | "interests"
      | "learning_preferences"
      | "strengths"
      | "weaknesses"
      | "notes",
    value: string
  ) {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("student_profiles")
        .update({ [field]: value })
        .eq("student_id", student.student_id);

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
    const printElement = document.getElementById("student-print");
    if (!printElement) return;

    const clone = printElement.cloneNode(true) as HTMLElement;

    const textareas = clone.querySelectorAll("textarea");
    textareas.forEach((ta) => {
      const p = document.createElement("p");
      p.textContent = ta.value;
      p.style.whiteSpace = "pre-wrap";
      ta.parentNode?.replaceChild(p, ta);
    });

    const newWindow = window.open("", "", "width=800,height=600");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Student Profile</title>
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
            button, input {
              display: none !important;
            }
            section {
              page-break-inside: avoid;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>${clone.outerHTML}</body>
      </html>
    `);

    newWindow.document.close();
    newWindow.print();
    newWindow.close();
  };

  const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();

  return (
    <div id="student-print" className="ExpandedStudentView space-y-6 text-foreground">
      {/* HEADER */}
      <header>
        <h2 className="text-2xl font-bold text-foreground">
          {fullName || "Unnamed Student"}
        </h2>
        {student.level && (
          <p className="text-sm text-muted-foreground">Level: {student.level}</p>
        )}
      </header>

      {/* EDITABLE FIELDS */}
      {[
        { label: "Goals", value: goals, setter: setGoals, key: "goals" },
        { label: "Interests", value: interests, setter: setInterests, key: "interests" },
        { label: "Learning Preferences", value: learningPreferences, setter: setLearningPreferences, key: "learning_preferences" },
        { label: "Strengths", value: strengths, setter: setStrengths, key: "strengths" },
        { label: "Weaknesses", value: weaknesses, setter: setWeaknesses, key: "weaknesses" },
        { label: "Notes", value: notes, setter: setNotes, key: "notes" },
      ].map(({ label, value, setter, key }) => (
        <section key={key}>
          <h3 className="font-semibold mb-1 text-foreground">{label}</h3>
          <textarea
            className="w-full min-h-[80px] rounded-md border border-input bg-background text-foreground text-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
            value={value}
            onChange={(e) => setter(e.target.value)}
            onBlur={() => handleSave(key as any, value)}
          />
        </section>
      ))}

      {/* SAVE MESSAGE */}
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

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end items-center">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md 
                     bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          <Printer size={18} /> Print / Export PDF
        </button>
      </div>
    </div>
  );
}
