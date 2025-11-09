'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Target,
  Sparkles,
  BrainCircuit,
  ThumbsUp,
  AlertTriangle,
  FileText,
} from "lucide-react";
import React from "react";

interface Props {
  params: Promise<{ id: string }>; // params is now a Promise
}

export default function StudentDetailTableWithTimestamp({ params }: Props) {
  const paramsObj = React.use(params); // unwrap the promise
  const { id } = paramsObj;
  const supabase = createClient();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [lastSaved, setLastSaved] = useState<{ [key: string]: Date | null }>({});

  // Store debounce timers
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // Fetch student
  useEffect(() => {
    async function fetchStudent() {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("student_id", id)
        .single();

      if (!error && data) setStudent(data);
      setLoading(false);
    }
    fetchStudent();
  }, [id, supabase]);

  // Handle input change with debounce
  const handleChange = (field: string, value: string) => {
    if (!student) return;
    setStudent({ ...student, [field]: value });

    // Clear previous timer
    if (debounceTimers[field]) clearTimeout(debounceTimers[field]);

    setSaving((prev) => ({ ...prev, [field]: true }));

    const timer = setTimeout(async () => {
      const { error } = await supabase
        .from("student_profiles")
        .update({ [field]: value })
        .eq("student_id", id);

      setSaving((prev) => ({ ...prev, [field]: false }));
      if (!error) setLastSaved((prev) => ({ ...prev, [field]: new Date() }));
      if (error) console.error("Error saving field", field, error.message);
    }, 800); // 800ms debounce

    setDebounceTimers((prev) => ({ ...prev, [field]: timer }));
  };

  if (loading) return <div>Loading...</div>;
  if (!student)
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h2 className="text-xl font-bold text-destructive">Student Not Found</h2>
      </div>
    );

  const fields = [
    { label: "Level", key: "level", icon: <BarChart3 /> },
    { label: "Goals", key: "goals", icon: <Target /> },
    { label: "Interests", key: "interests", icon: <Sparkles /> },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit /> },
    { label: "Strengths", key: "strengths", icon: <ThumbsUp /> },
    { label: "Weaknesses", key: "weaknesses", icon: <AlertTriangle /> },
    { label: "Notes", key: "notes", icon: <FileText /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {student.first_name} {student.last_name}
      </h1>

      {/* Edit Mode Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editMode}
            onChange={() => setEditMode(!editMode)}
            className="w-5 h-5 rounded border border-input bg-background accent-primary"
          />
          <span className="text-foreground font-medium">Edit</span>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        <table className="w-full table-fixed text-sm">
          <tbody className="divide-y">
            {fields.map((field) => (
              <tr
                key={field.key}
                className="divide-x border-b hover:bg-accent transition-colors"
              >
                <td className="w-56 px-4 py-3 font-medium text-foreground flex items-center gap-2 align-top">
                  {field.icon} {field.label}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {editMode ? (
                    <Textarea
                      value={student[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={field.key === "notes" ? 5 : 2}
                      className="resize-none"
                    />
                  ) : student[field.key] ? (
                    <span className="whitespace-pre-wrap">{student[field.key]}</span>
                  ) : (
                    <span className="italic opacity-60">Not provided</span>
                  )}

                  {/* Saving indicator */}
                  {saving[field.key] && editMode && (
                    <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                      Saving...
                    </span>
                  )}

                  {/* Last saved timestamp */}
                  {!saving[field.key] && lastSaved[field.key] && editMode && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      Saved at {lastSaved[field.key]?.toLocaleTimeString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
