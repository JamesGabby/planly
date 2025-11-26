'use client';

import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Loader2,
  Save,
  User,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudentProfileTutor } from "../../lesson-plans/types/student_profile_tutor";
import { motion, AnimatePresence } from "framer-motion";
import StudentProfileSkeleton from "../../lesson-plans/skeletons/StudentProfileSkeleton";

interface Props {
  params: Promise<{ id: string }>;
}

/* ---------- Helper types ---------- */
type TutorField = {
  key: keyof StudentProfileTutor;
  label: string;
  icon: ReactNode;
  highlight?: boolean;
  category: 'overview' | 'learning' | 'assessment';
};

/* ---------- EditableFieldCard (memoized) ---------- */
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

  // Sync when the initialValue changes from parent (e.g., after a successful save or initial load)
  useEffect(() => {
    setLocalValue(initialValue ?? "");
  }, [initialValue]);

  const onChange = (val: string) => {
    setLocalValue(val);
    // schedule debounced save (parent handles debouncing)
    scheduleSave(field.key as string, val);
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
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            <AnimatePresence mode="wait">
              {saving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              ) : lastSaved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
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
  // custom areEqual to minimize unnecessary rerenders:
  // Rerender only when: editMode changes, initialValue changes, saving changes or lastSaved changes
  return prevProps.editMode === nextProps.editMode
    && prevProps.initialValue === nextProps.initialValue
    && prevProps.saving === nextProps.saving
    && ((prevProps.lastSaved?.getTime() ?? 0) === (nextProps.lastSaved?.getTime() ?? 0));
});

/* ---------- Small helper: EditableNamePair (keeps header tidy) ---------- */
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
        <Input
          value={firstName}
          onChange={(e) => onFirstChange(e.target.value)}
          placeholder="First name"
          className="text-lg font-bold"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Last Name
        </label>
        <Input
          value={lastName}
          onChange={(e) => onLastChange(e.target.value)}
          placeholder="Last name"
          className="text-lg font-bold"
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

  const [student, setStudent] = useState<StudentProfileTutor | undefined>();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [lastSaved, setLastSaved] = useState<{ [key: string]: Date | null }>({});
  const [error, setError] = useState("");

  // Use ref to hold debounce timers (keyed by field)
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
        console.log(error, err);
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } finally {
      setLoading(false);
    }
  }

  /**
   * scheduleSave - parent-managed debounced save function.
   * - Called by child field components on change.
   * - Debounces per-field, sets saving true on first keystroke,
   *   writes to DB after debounce delay, updates parent student state on success.
   */
  const scheduleSave = useCallback((field: string, value: string) => {
    // clear previous timer for field
    const timers = debounceTimersRef.current;
    if (timers[field]) {
      clearTimeout(timers[field] as ReturnType<typeof setTimeout>);
    }

    // if not already showing saving state, set it
    setSaving(prev => {
      if (prev[field]) return prev;
      return { ...prev, [field]: true };
    });

    // set new timer
    const timer = setTimeout(async () => {
      try {
        const payload: Record<string, string> = { [field]: value };
        const { error } = await supabase
          .from("student_profiles")
          .update(payload)
          .eq("student_id", id);

        if (error) {
          console.error("Error saving field", field, error.message);
        } else {
          // update lastSaved
          setLastSaved(prev => ({ ...prev, [field]: new Date() }));

          // Update parent state only if it is actually different (avoid extra re-render)
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
        // clear timer reference
        debounceTimersRef.current[field] = null;
      }
    }, 1000); // 1000ms debounce for better typing UX

    debounceTimersRef.current[field] = timer;
  }, [supabase, id]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach((t) => {
        if (t) clearTimeout(t);
      });
    };
  }, []);

  // ----- Fields definition (same as before) -----
  const fields: TutorField[] = [
    { label: "Level", key: "level", icon: <BarChart3 className="h-4 w-4" />, category: 'overview' },
    {
      label: "Special Educational Needs (SEN)",
      key: "sen",
      icon: <AlertTriangle className="h-4 w-4" />,
      highlight: true,
      category: 'overview'
    },
    { label: "Goals", key: "goals", icon: <Target className="h-4 w-4" />, category: 'overview' },
    { label: "Interests", key: "interests", icon: <Sparkles className="h-4 w-4" />, category: 'learning' },
    { label: "Learning Preferences", key: "learning_preferences", icon: <BrainCircuit className="h-4 w-4" />, category: 'learning' },
    { label: "Strengths", key: "strengths", icon: <BicepsFlexed className="h-4 w-4" />, category: 'assessment' },
    { label: "Areas to Improve", key: "weaknesses", icon: <LineChart className="h-4 w-4" />, category: 'assessment' },
    { label: "Notes", key: "notes", icon: <FileText className="h-4 w-4" />, category: 'assessment' },
  ];

  const categorizedFields = {
    overview: fields.filter(f => f.category === 'overview'),
    learning: fields.filter(f => f.category === 'learning'),
    assessment: fields.filter(f => f.category === 'assessment'),
  };

  /* ---------- Loading / error states ---------- */
  if (loading) {
    return (
      <StudentProfileSkeleton />
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-destructive">Student Not Found</h2>
            <p className="text-muted-foreground text-sm">
              {error || "The student profile you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/student-profiles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Student Profiles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Header save indicator UI helper ---------- */
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

  /* ---------- Field value accessor with fallback ---------- */
  const getFieldValue = (key: keyof StudentProfileTutor) => {
    return (student && student[key]) ? String(student[key]) : "";
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Header */}
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
                    <User className="h-8 w-8 text-primary" />
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
                        <CardDescription className="mt-1">
                          Student Profile
                        </CardDescription>
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

        {/* Overview Section */}
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

        {/* Learning Style Section */}
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

        {/* Assessment Section */}
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