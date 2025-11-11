'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Target,
  Sparkles,
  BrainCircuit,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Pencil,
  ArrowLeft,
  BicepsFlexed,
  GraduationCap,
  ChartLine,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        .from("teacher_student_profiles")
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
        .from("teacher_student_profiles")
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
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2 pl-0">
            <Link href="/dashboard/student-profiles">
              <ArrowLeft className="h-4 w-4" />
              Go to Student Profiles
            </Link>
          </Button>
        </div>
        <h2 className="text-xl font-bold text-destructive">Student Not Found</h2>
      </div>
    );

  const fields = [
    { label: "Class", key: "class_name", icon: <GraduationCap /> },
    { label: "Goals", key: "goals", icon: <Target /> },
    { label: "Interests", key: "interests", icon: <Sparkles /> },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit /> },
    { label: "Strengths", key: "strengths", icon: <BicepsFlexed /> },
    { label: "Areas to Improve", key: "weaknesses", icon: <ChartLine /> },
    { label: "Special Educational Needs", key: "special_educational_needs", icon: <AlertTriangle /> },
    { label: "Notes", key: "notes", icon: <FileText /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="mb-6">
        <Button asChild variant="ghost" className="flex items-center gap-2 pl-0">
          <Link href="/dashboard/student-profiles">
            <ArrowLeft className="h-4 w-4" />
            Go to Student Profiles
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">
        {student.first_name} {student.last_name}
      </h1>

      {/* Edit Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {editMode ? "Editing – changes save automatically" : "View only mode"}
        </span>

        <Button
          variant={editMode ? "default" : "outline"}
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 transition-all"
        >
          {editMode ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Done
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        {/* Responsive Table / Card Layout */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <table className="hidden md:table w-full table-fixed text-sm">
            <tbody className="divide-y">
              {fields.map((field) => (
                <tr key={field.key} className="divide-x border-b hover:bg-accent transition-colors">
                  <td className="w-56 px-4 py-3 font-medium text-foreground align-top">
                    <div className="flex items-center gap-2">
                      {field.icon} {field.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {editMode ? (
                      <Textarea
                        value={student[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        rows={field.key === "notes" ? 5 : 2}
                        className="resize-none w-full"
                      />
                    ) : student[field.key] ? (
                      <span className="whitespace-pre-wrap">{student[field.key]}</span>
                    ) : (
                      <span className="italic opacity-60">Not provided</span>
                    )}

                    {/* Saving indicator */}
                    {saving[field.key] && editMode && (
                      <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                        Saving…
                      </span>
                    )}
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

          {/* ✅ Mobile card version */}
          <div className="md:hidden divide-y">
            {fields.map((field) => (
              <div key={field.key} className="p-4 space-y-2 hover:bg-accent transition-colors">
                <div className="flex items-center gap-2 font-semibold">
                  {field.icon} {field.label}
                </div>

                {editMode ? (
                  <Textarea
                    value={student[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.key === "notes" ? 5 : 2}
                    className="resize-none w-full"
                  />
                ) : student[field.key] ? (
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {student[field.key]}
                  </p>
                ) : (
                  <p className="italic text-muted-foreground opacity-60">
                    Not provided
                  </p>
                )}

                {/* Saving & timestamps */}
                {saving[field.key] && editMode && (
                  <span className="text-xs text-muted-foreground animate-pulse block">
                    Saving…
                  </span>
                )}
                {!saving[field.key] && lastSaved[field.key] && editMode && (
                  <span className="text-xs text-muted-foreground block">
                    Saved at {lastSaved[field.key]?.toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
