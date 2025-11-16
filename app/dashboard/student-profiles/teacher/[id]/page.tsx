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
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
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

  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // Fetch student
  useEffect(() => {
    async function fetchStudent() {
      const { data, error } = await supabase
        .from("teacher_student_profiles")
        .select(`
          *,
          classes:class_students(
            class:classes(class_name)
          )
        `)
        .eq("student_id", id)
        .single();

      if (!error && data) {
        const classNames = (data.classes ?? [])
          .map((c: any) => c.class?.class_name)
          .filter(Boolean)
          .join(", ");
        setStudent({ ...data, class_name: classNames });
      }

      setLoading(false);
    }
    fetchStudent();
  }, [id, supabase]);

  // Handle input change with debounce
  const handleChange = (field: string, value: string) => {
    if (!student) return;
    setStudent({ ...student, [field]: value });

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
    }, 800);

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

  // Move SEN above Goals
  const fields = [
    { label: "Classes", key: "class_name", icon: <GraduationCap />, readOnly: true },
    { label: "Special Educational Needs", key: "special_educational_needs", icon: <AlertTriangle /> },
    { label: "Goals", key: "goals", icon: <Target /> },
    { label: "Interests", key: "interests", icon: <Sparkles /> },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit /> },
    { label: "Strengths", key: "strengths", icon: <BicepsFlexed /> },
    { label: "Areas to Improve", key: "weaknesses", icon: <ChartLine /> },
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
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          {/* Desktop Table */}
          <table className="hidden md:table w-full table-fixed text-sm">
            <tbody className="divide-y">
              {fields.map((field) => (
                <tr key={field.key} className="divide-x border-b hover:bg-accent transition-colors">
                  <td className="w-56 px-4 py-3 font-medium text-foreground align-top">
                    <div className="flex items-center gap-2">
                      {field.icon} {field.label}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 align-top",
                      field.key === "special_educational_needs" ? "text-yellow-500 font-medium" : "text-muted-foreground"
                    )}
                  >
                    {student[field.key] ? (
                      <div className="inline-flex items-center gap-1.5">
                        {student[field.key]}
                      </div>
                    ) : (
                      <span className="italic opacity-60">Not provided</span>
                    )}

                    {/* Edit Mode */}
                    {editMode && !field.readOnly && (
                      <Textarea
                        value={student[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        rows={field.key === "notes" ? 5 : 2}
                        className="resize-none w-full mt-1"
                      />
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

          {/* Mobile Card Version */}
          <div className="md:hidden divide-y">
            {fields.map((field) => (
              <div
                key={field.key}
                className="p-4 space-y-2 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 font-semibold">
                  {field.icon} {field.label}
                </div>

                {student[field.key] ? (
                  <div className={cn(
                    "inline-flex items-center gap-1.5",
                    field.key === "special_educational_needs" ? "text-yellow-500 font-medium" : "text-muted-foreground"
                  )}>
                    {student[field.key]}
                    {field.key === "special_educational_needs" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                ) : (
                  <span className="italic opacity-60">Not provided</span>
                )}

                {/* Edit Mode */}
                {editMode && !field.readOnly && (
                  <Textarea
                    value={student[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.key === "notes" ? 5 : 2}
                    className="resize-none w-full mt-1"
                  />
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
