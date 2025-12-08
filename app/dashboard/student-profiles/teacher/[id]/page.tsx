'use client';

import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import {
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
  Loader2,
  Save,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudentProfileTeacher } from "@/app/dashboard/lesson-plans/types/student_profile_teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import StudentProfileSkeleton from "@/app/dashboard/lesson-plans/skeletons/StudentProfileSkeleton";

interface Props {
  params: Promise<{ id: string }>;
}

/* ---------- Field type ---------- */
type TutorField = {
  key: keyof StudentProfileTeacher;
  label: string;
  icon: ReactNode;
  readOnly?: boolean;
  highlight?: boolean;
  category: 'overview' | 'learning' | 'assessment';
};

/* ---------- Memoized EditableFieldCard ---------- */
const EditableFieldCard = React.memo(function EditableFieldCard(props: {
  field: TutorField;
  initialValue: string;
  editMode: boolean;
  scheduleSave: (fieldKey: string, value: string) => void;
  saving?: boolean;
  lastSaved?: Date | null;
}) {
  const { field, initialValue, editMode, scheduleSave, saving, lastSaved } = props;
  const [localValue, setLocalValue] = useState(initialValue ?? "");

  useEffect(() => {
    setLocalValue(initialValue ?? "");
  }, [initialValue]);

  const onChange = (val: string) => {
    setLocalValue(val);
    scheduleSave(String(field.key), val);
  };

  return (
    <Card className={`transition-all hover:shadow-md ${field.highlight ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${field.highlight ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-primary/10 text-primary'}`}>
              {field.icon}
            </div>
            <CardTitle className="text-base font-semibold">{field.label}</CardTitle>
          </div>
          {field.highlight && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-300">
              Important
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {editMode ? (
          <>
            <Textarea
              value={localValue}
              onChange={(e) => onChange(e.target.value)}
              rows={field.key === "notes" ? 5 : 3}
              className="resize-none w-full"
              placeholder={field.readOnly ? "Read only" : `Enter ${field.label.toLowerCase()}...`}
              disabled={field.readOnly}
            />
            <AnimatePresence mode="wait">
              {saving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              ) : lastSaved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : (
          (initialValue && initialValue.length > 0) ? (
            <p className={`whitespace-pre-wrap text-sm leading-relaxed ${field.highlight ? 'text-yellow-800 dark:text-yellow-200 font-medium' : 'text-muted-foreground'}`}>
              {initialValue}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/60">Not provided</p>
          )
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render when relevant props change
  return prevProps.editMode === nextProps.editMode
    && prevProps.initialValue === nextProps.initialValue
    && prevProps.saving === nextProps.saving
    && ((prevProps.lastSaved?.getTime() ?? 0) === (nextProps.lastSaved?.getTime() ?? 0));
});

/* ---------- EditableNamePair (header) ---------- */
function EditableNamePair(props: {
  id: string;
  firstNameInitial: string;
  lastNameInitial: string;
  scheduleSave: (fieldKey: string, value: string) => void;
}) {
  const { firstNameInitial, lastNameInitial, scheduleSave } = props;
  const [firstName, setFirstName] = useState(firstNameInitial ?? "");
  const [lastName, setLastName] = useState(lastNameInitial ?? "");

  useEffect(() => setFirstName(firstNameInitial ?? ""), [firstNameInitial]);
  useEffect(() => setLastName(lastNameInitial ?? ""), [lastNameInitial]);

  const onFirstChange = (v: string) => {
    setFirstName(v);
    scheduleSave("first_name", v);
  };

  const onLastChange = (v: string) => {
    setLastName(v);
    scheduleSave("last_name", v);
  };

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          First Name
        </label>
        <input
          className="w-full text-lg font-bold bg-transparent border border-input px-2 py-1 rounded"
          value={firstName}
          onChange={(e) => onFirstChange(e.target.value)}
          placeholder="First name"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Last Name
        </label>
        <input
          className="w-full text-lg font-bold bg-transparent border border-input px-2 py-1 rounded"
          value={lastName}
          onChange={(e) => onLastChange(e.target.value)}
          placeholder="Last name"
        />
      </div>
    </>
  );
}

/* ---------- Main component ---------- */
export default function StudentDetailTableWithTimestamp({ params }: Props) {
  const paramsObj = React.use(params) as { id: string };
  const { id } = paramsObj;
  const supabase = createClient();

  const [student, setStudent] = useState<StudentProfileTeacher | undefined>();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [lastSaved, setLastSaved] = useState<{ [key: string]: Date | null }>({});
  const [error, setError] = useState("");

  // timers ref (per-field)
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  useEffect(() => {
    async function load() {
      try {
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
      } catch (err) {
        setError("Failed to fetch user");
        console.log(err);
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchStudent(userId: string) {
    try {
      const { data, error } = await supabase
        .from("teacher_student_profiles")
        .select(`
          *,
          classes:teacher_class_students(
            class:teacher_classes(class_name)
          )
        `)
        .eq("student_id", id)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const classNames = (data.classes ?? [])
          .map((c: { class: { class_name: string } | null }) => c.class?.class_name)
          .filter(Boolean)
          .join(", ");

        setStudent({ ...data, class_name: classNames } as StudentProfileTeacher);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- scheduleSave (debounced per field) ---------- */
  const scheduleSave = useCallback((field: string, value: string) => {
    // clear existing timer
    const timers = debounceTimersRef.current;
    if (timers[field]) {
      clearTimeout(timers[field] as ReturnType<typeof setTimeout>);
    }

    // show saving indicator (only set true if not already)
    setSaving(prev => {
      if (prev[field]) return prev;
      return { ...prev, [field]: true };
    });

    const timer = setTimeout(async () => {
      try {
        const payload: Record<string, string> = { [field]: value };
        const { error } = await supabase
          .from("teacher_student_profiles")
          .update(payload)
          .eq("student_id", id);

        if (error) {
          console.error("Error saving field", field, error.message);
        } else {
          setLastSaved(prev => ({ ...prev, [field]: new Date() }));
          // update parent state only if changed
          setStudent(prev => {
            if (!prev) return prev;
            // @ts-expect-error no type needed
            if (prev[field] === value) return prev;
            return { ...prev, [field]: value };
          });
        }
      } catch (err) {
        console.error("Error saving field", field, err);
      } finally {
        setSaving(prev => ({ ...prev, [field]: false }));
        debounceTimersRef.current[field] = null;
      }
    }, 1000); // 1000ms debounce

    debounceTimersRef.current[field] = timer;
  }, [supabase, id]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((t) => {
        if (t) clearTimeout(t);
      });
    };
  }, []);

  /* ---------- Loading / Error UI ---------- */
  if (loading) {
    return (
      <StudentProfileSkeleton />
    );
  }

  if (!student) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
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
        <h2 className="text-xl font-bold text-destructive">Student Not Found</h2>
      </div>
    );
  }

  /* ---------- Fields (categorized) ---------- */
  const fields: TutorField[] = [
    { label: "Classes", key: "class_name", icon: <GraduationCap />, readOnly: true, category: 'overview' },
    { label: "Special Educational Needs (SEN)", key: "special_educational_needs", icon: <AlertTriangle />, highlight: true, category: 'overview' },
    { label: "Goals", key: "goals", icon: <Target />, category: 'overview' },
    { label: "Interests", key: "interests", icon: <Sparkles />, category: 'learning' },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit />, category: 'learning' },
    { label: "Strengths", key: "strengths", icon: <BicepsFlexed />, category: 'assessment' },
    { label: "Areas to Improve", key: "weaknesses", icon: <ChartLine />, category: 'assessment' },
    { label: "Notes", key: "notes", icon: <FileText />, category: 'assessment' },
  ];

  const categorizedFields = {
    overview: fields.filter(f => f.category === 'overview'),
    learning: fields.filter(f => f.category === 'learning'),
    assessment: fields.filter(f => f.category === 'assessment'),
  };

  /* ---------- Header save indicator helper ---------- */
  const NameSaveIndicator = () => {
    const firstSaving = saving["first_name"];
    const lastSaving = saving["last_name"];
    const firstSaved = lastSaved["first_name"];
    const lastSavedTime = lastSaved["last_name"];

    if (firstSaving || lastSaving) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving name...</span>
        </div>
      );
    }

    if (firstSaved || lastSavedTime) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          <span>Name saved</span>
        </div>
      );
    }

    return null;
  };

  const getFieldValue = (key: keyof StudentProfileTeacher) => {
    return (student && student[key]) ? String(student[key]) : "";
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Back button + header card */}
        <div className="space-y-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Link href="/dashboard/student-profiles">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </Button>

          <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editMode ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <EditableNamePair
                            id={id}
                            firstNameInitial={getFieldValue("first_name")}
                            lastNameInitial={getFieldValue("last_name")}
                            scheduleSave={scheduleSave}
                          />
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <NameSaveIndicator />
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
                          {student.first_name} {student.last_name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">Student Profile</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:ml-4">
                  {editMode && (
                    <Badge variant="secondary" className="gap-1.5 whitespace-nowrap">
                      <Save className="h-3 w-3" />
                      Auto-saving
                    </Badge>
                  )}
                  <Button
                    variant={editMode ? "default" : "outline"}
                    onClick={() => setEditMode(!editMode)}
                    className="gap-2 w-full sm:w-auto whitespace-nowrap"
                  >
                    {editMode ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Done Editing
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-semibold">Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedFields.overview.map((field) => (
              <EditableFieldCard
                key={String(field.key)}
                field={field}
                initialValue={getFieldValue(field.key)}
                editMode={editMode}
                scheduleSave={scheduleSave}
                saving={!!saving[String(field.key)]}
                lastSaved={lastSaved[String(field.key)] ?? null}
              />
            ))}
          </div>
        </section>

        <Separator />

        {/* Learning */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-semibold">Learning Style</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorizedFields.learning.map((field) => (
              <EditableFieldCard
                key={String(field.key)}
                field={field}
                initialValue={getFieldValue(field.key)}
                editMode={editMode}
                scheduleSave={scheduleSave}
                saving={!!saving[String(field.key)]}
                lastSaved={lastSaved[String(field.key)] ?? null}
              />
            ))}
          </div>
        </section>

        <Separator />

        {/* Assessment */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-xl font-semibold">Assessment & Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorizedFields.assessment.map((field) => (
              <EditableFieldCard
                key={String(field.key)}
                field={field}
                initialValue={getFieldValue(field.key)}
                editMode={editMode}
                scheduleSave={scheduleSave}
                saving={!!saving[String(field.key)]}
                lastSaved={lastSaved[String(field.key)] ?? null}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
