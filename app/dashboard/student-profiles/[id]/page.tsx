'use client';

import { ReactNode, useEffect, useState } from "react";
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
  LineChart,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudentProfileTutor } from "../../lesson-plans/types/student_profile_tutor";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudentDetailTableWithTimestamp({ params }: Props) {
  const paramsObj = React.use(params);
  const { id } = paramsObj;
  const supabase = createClient();

  const [student, setStudent] = useState<StudentProfileTutor>();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [lastSaved, setLastSaved] = useState<{ [key: string]: Date | null }>({});
  const [error, setError] = useState("");

  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not logged in");
        console.log(error);
        setLoading(false);
        return;
      }

      await fetchStudent(user.id);
    }

    load();
  }, [id]);

  async function fetchStudent(userId: string) {
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("student_id", id)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      if (data) setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: string, value: string) => {
    if (!student) return;
    setStudent({ ...student, [field]: value });

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
    }, 800);

    setDebounceTimers((prev) => ({ ...prev, [field]: timer }));
  };

  if (loading) return <div>Loading...</div>;
  if (!student)
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="mb-4">
            <Button
              asChild
              variant="ghost"
              className="inline-flex items-center gap-1 px-2 py-1 text-sm w-auto"
            >
              <Link href="/dashboard/student-profiles">
                <ArrowLeft className="h-3 w-3" />
                Back
              </Link>
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-bold text-destructive">Student Not Found</h2>
      </div>
    );

  type TutorField = {
    key: keyof StudentProfileTutor;
    label: string;
    icon: ReactNode;
    highlight?: boolean;
  };

  // ✅ SEN added here (with yellow highlight + icon)
  const fields: TutorField[] = [
    { label: "Level", key: "level", icon: <BarChart3 /> },

    {
      label: "Special Educational Needs (SEN)",
      key: "sen",
      icon: <AlertTriangle />,
      highlight: true,
    },

    { label: "Goals", key: "goals", icon: <Target /> },
    { label: "Interests", key: "interests", icon: <Sparkles /> },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit /> },
    { label: "Strengths", key: "strengths", icon: <BicepsFlexed /> },
    { label: "Areas to Improve", key: "weaknesses", icon: <LineChart /> },
    { label: "Notes", key: "notes", icon: <FileText /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="mb-4">
        <Button
          asChild
          variant="ghost"
          className="inline-flex items-center gap-1 px-2 py-1 text-sm w-auto"
        >
          <Link href="/dashboard/student-profiles">
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-center">
        {student.first_name} {student.last_name}
      </h1>

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

      {/* Table wrapper */}
      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
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
                  className={`px-4 py-3 ${
                    field.highlight ? "text-yellow-600 font-medium" : "text-muted-foreground"
                  }`}
                >
                  {editMode ? (
                    <Textarea
                      value={student[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={field.key === "notes" ? 5 : 2}
                      className="resize-none w-full"
                    />
                  ) : student[field.key] ? (
                    <span className="whitespace-pre-wrap flex items-center gap-1">
                      {student[field.key]}
                    </span>
                  ) : (
                    <span className="italic opacity-60">Not provided</span>
                  )}

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

        {/* Mobile */}
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
                <p
                  className={`whitespace-pre-wrap text-muted-foreground ${
                    field.highlight ? "text-yellow-600 font-medium" : ""
                  }`}
                >
                  {student[field.key]}
                </p>
              ) : (
                <p className="italic text-muted-foreground opacity-60">Not provided</p>
              )}

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
  );
}
