"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LessonStage } from "@/components/lesson-structure-editor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LessonPlanTutor, Resource } from "../../types/lesson_tutor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useUserMode } from "@/components/UserModeContext";
import { EditTutoringSessionSkeleton } from "../../skeletons/EditTutoringSessionSkeleton";

const supabase = createClient();

export default function EditLessonFormTutor() {
  const { id } = useParams();
  const router = useRouter();
  const { mode } = useUserMode();

  const [lesson, setLesson] = useState<Partial<LessonPlanTutor>>({
    date_of_lesson: "",
    time_of_lesson: "",
    topic: "",
    objectives: "",
    outcomes: "",
    resources: [],
    homework: "",
    evaluation: "",
    notes: "",
    first_name: "",
    last_name: "",
    subject: "",
  });

  const [stages, setStages] = useState<LessonStage[]>([
    {
      stage: "Starter",
      duration: "",
      teaching: "",
      learning: "",
      assessing: "",
      adapting: "",
    },
    {
      stage: "Plenary",
      duration: "",
      teaching: "",
      learning: "",
      assessing: "",
      adapting: "",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [students, setStudents] = useState<{ student_id: string; first_name: string; last_name: string }[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [showNewStudentInputs, setShowNewStudentInputs] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  useEffect(() => {
    if (mode !== "tutor") {
      return;
    }
    
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

  // Fetch existing lesson data
  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      setError(null);

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("You must be logged in");

        const { data, error: fetchError } = await supabase
          .from("tutor_lesson_plans")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Tutoring session plan not found");

        // Parse lesson structure
        let parsedStages: LessonStage[] = [];

        if (data.lesson_structure) {
          if (Array.isArray(data.lesson_structure)) {
            parsedStages = data.lesson_structure;
          } else if (typeof data.lesson_structure === 'string') {
            try {
              parsedStages = JSON.parse(data.lesson_structure);
            } catch (e) {
              console.error("Error parsing lesson_structure:", e);
              parsedStages = [];
            }
          }
        }

        // Only add blank Starter/Plenary if the array is completely empty
        if (parsedStages.length === 0) {
          parsedStages = [
            {
              stage: "Starter",
              duration: "",
              teaching: "",
              learning: "",
              assessing: "",
              adapting: "",
            },
            {
              stage: "Plenary",
              duration: "",
              teaching: "",
              learning: "",
              assessing: "",
              adapting: "",
            },
          ];
        } else {
          // If we have stages, ensure Starter is first and Plenary is last
          const hasStarter = parsedStages.some((s) => s.stage === "Starter");
          const hasPlenary = parsedStages.some((s) => s.stage === "Plenary");

          if (!hasStarter) {
            parsedStages.unshift({
              stage: "Starter",
              duration: "",
              teaching: "",
              learning: "",
              assessing: "",
              adapting: "",
            });
          }

          if (!hasPlenary) {
            parsedStages.push({
              stage: "Plenary",
              duration: "",
              teaching: "",
              learning: "",
              assessing: "",
              adapting: "",
            });
          }
        }

        setLesson(data);
        // In your existing fetchLesson function, after setLesson(data), add:
        if (data.student_id) {
          setSelectedStudentId(data.student_id);
        }
        setStages(parsedStages);

      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError(err instanceof Error ? err.message : "Failed to load tutoring session plan");
        toast.error("Failed to load tutoring session plan");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLesson();
    }
  }, [id]);

  const updateField = <K extends keyof LessonPlanTutor>(
    key: K,
    value: LessonPlanTutor[K]
  ) => {
    setLesson((prev) => ({ ...prev, [key]: value }));
  };

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  }

  function clearStage(index: number) {
    setStages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      };
      return updated;
    });
  }

  function addStage() {
    setStages((prev) => {
      const newStage = {
        stage: `Stage ${prev.length - 1}`,
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      };
      const updated = [...prev];
      updated.splice(prev.length - 1, 0, newStage);
      return updated;
    });
  }

  function removeStage(index: number) {
    setStages((prev) => {
      if (["Starter", "Plenary"].includes(prev[index].stage)) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function validateBasicFields() {
    const errors: { [key: string]: string } = {};
    if (!lesson.first_name?.trim()) errors.first_name = "Student first name is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};

    if (!lesson.first_name?.trim()) errors.first_name = "First Name is required.";
    if (!lesson.date_of_lesson?.trim()) errors.date_of_lesson = "Date is required.";
    if (!lesson.time_of_lesson?.trim()) errors.time_of_lesson = "Time is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    if (!lesson.objectives?.trim()) errors.objectives = "Objectives are required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function generateLessonPlan() {
    if (!validateBasicFields()) {
      toast.error("Please fill in Student Name, Subject, and Topic before generating.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const studentName = `${lesson.first_name || ""} ${lesson.last_name || ""}`.trim();

      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: "tutor",
          topic: lesson.topic,
          subject: lesson.subject,
          student_name: studentName,
          objectives: lesson.objectives,
          outcomes: lesson.outcomes,
          duration: "60 minutes",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate lesson plan");
      }

      const generatedPlan = await response.json();

      // Update form fields with AI-generated content
      updateField("objectives", generatedPlan.objectives || lesson.objectives);
      updateField("outcomes", generatedPlan.outcomes || lesson.outcomes);
      updateField("homework", generatedPlan.homework || "");
      updateField("evaluation", generatedPlan.evaluation || "");
      updateField("notes", generatedPlan.notes || "");

      if (generatedPlan.resources && Array.isArray(generatedPlan.resources)) {
        updateField("resources", generatedPlan.resources);
      }

      if (generatedPlan.lesson_structure && Array.isArray(generatedPlan.lesson_structure)) {
        setStages(generatedPlan.lesson_structure);
      }

      toast.success("✨ Tutoring session plan regenerated successfully! Review and personalise as needed.");

      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }, 500);

    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate lesson plan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  }

  function handleStudentChange(value: string) {
    if (value === "other") {
      setShowNewStudentInputs(true);
      setSelectedStudentId("");
      updateField("first_name", "");
      updateField("last_name", "");
    } else {
      setShowNewStudentInputs(false);
      setSelectedStudentId(value);

      // Find the selected student and populate the fields
      const selectedStudent = students.find(s => s.student_id === value);
      if (selectedStudent) {
        updateField("first_name", selectedStudent.first_name);
        updateField("last_name", selectedStudent.last_name);
      }
    }
  }

  // Add this function after your existing functions
const fetchStudents = useCallback(async () => {
  try {
    setLoadingStudents(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) return;

    const { data, error } = await supabase
      .from("student_profiles")
      .select("student_id, first_name, last_name")
      .eq("user_id", user.id)
      .order("first_name", { ascending: true });

    if (error) throw error;

    setStudents(data || []);
  } catch (err) {
    console.error("Error fetching students:", err);
    toast.error("Failed to load students");
  } finally {
    setLoadingStudents(false);
  }
}, []);

useEffect(() => {
  fetchStudents();
}, [fetchStudents]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!validateForm()) {
      setSaving(false);
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user = userData?.user;
      if (!user) throw new Error("You must be logged in to update a lesson plan.");

      const formattedResources =
        Array.isArray(lesson.resources)
          ? lesson.resources.map((res: Resource) => ({
            title: res.title || res.url || "",
            url: res.url?.trim() || "",
          }))
          : [];

      // Determine the student_id to use
      let studentIdToUse = selectedStudentId;

      // If "other" was selected and new student info provided, create new student
      if (showNewStudentInputs && lesson.first_name && lesson.last_name) {
        const timestamp = new Date().toISOString();

        const { data: newStudent, error: studentError } = await supabase
          .from("student_profiles")
          .insert([
            {
              first_name: lesson.first_name.trim(),
              last_name: lesson.last_name.trim(),
              user_id: user.id,
              created_at: timestamp,
              updated_at: timestamp,
            },
          ])
          .select("student_id")
          .single();

        if (studentError) throw studentError;

        studentIdToUse = newStudent.student_id;

        // Refresh students list
        await fetchStudents();
      }

      const { error: updateError } = await supabase
        .from("tutor_lesson_plans")
        .update({
          ...lesson,
          student_id: studentIdToUse,
          resources: formattedResources,
          lesson_structure: stages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast.success("Tutoring lesson plan updated successfully!");
      router.push(`/dashboard/lesson-plans`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Lesson plan update failed.");
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <EditTutoringSessionSkeleton />
    );
  }

  // Error state
  if (error && !lesson.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={() => router.push("/dashboard/lesson-plans")}>
                Back to Lesson Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Edit Tutoring Session Plan
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl">
            Update your tutoring session details, or use AI to regenerate sections.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">Session Details</CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
                  <p className="text-destructive text-xs sm:text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Student Information Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Student Information</h3>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  {/* Student Dropdown */}
                  <div>
                    <Label className={`text-sm ${formErrors.first_name ? "text-destructive" : ""}`}>
                      Select Student <span className="text-destructive">*</span>
                    </Label>

                    <Select
                      value={showNewStudentInputs ? "other" : selectedStudentId}
                      onValueChange={handleStudentChange}
                      disabled={loadingStudents}
                    >
                      <SelectTrigger className={`mt-1 w-full ${formErrors.first_name ? "border-destructive" : ""}`}>
                        <SelectValue placeholder={loadingStudents ? "Loading students..." : "Select a student..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.student_id} value={student.student_id}>
                            {student.first_name} {student.last_name}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">+ Add New Student</SelectItem>
                      </SelectContent>
                    </Select>

                    {formErrors.first_name && (
                      <p className="text-destructive text-xs mt-1">{formErrors.first_name}</p>
                    )}
                  </div>

                  {/* New Student Input Fields - Only show when "other" is selected */}
                  {showNewStudentInputs && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className={`text-sm ${formErrors.first_name ? "text-destructive" : ""}`}>
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={lesson.first_name || ""}
                          onChange={(e) => updateField("first_name", e.target.value)}
                          placeholder="e.g. Sarah"
                          className={`mt-1 ${formErrors.first_name ? "border-destructive" : ""}`}
                          autoFocus
                        />
                        {formErrors.first_name && (
                          <p className="text-destructive text-xs mt-1">{formErrors.first_name}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm">Last Name</Label>
                        <Input
                          value={lesson.last_name || ""}
                          onChange={(e) => updateField("last_name", e.target.value)}
                          placeholder="e.g. Johnson"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Session Details Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Session Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className={`text-sm ${formErrors.subject ? "text-destructive" : ""}`}>
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={lesson.subject || ""}
                      onValueChange={(value) => updateField("subject", value)}
                    >
                      <SelectTrigger className={`mt-1 w-full ${formErrors.subject ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maths">Maths</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Languages">Languages</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Drama">Drama</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.subject && (
                      <p className="text-destructive text-xs mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label className={`text-sm ${formErrors.topic ? "text-destructive" : ""}`}>
                      Topic/Focus Area <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={lesson.topic || ""}
                      onChange={(e) => updateField("topic", e.target.value)}
                      placeholder="e.g., Fractions, Essay Writing, Photosynthesis"
                      className={`mt-1 ${formErrors.topic ? "border-destructive" : ""}`}
                    />
                    {formErrors.topic && (
                      <p className="text-destructive text-xs mt-1">{formErrors.topic}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`text-sm ${formErrors.date_of_lesson ? "text-destructive" : ""}`}>
                      Date of Session <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={lesson.date_of_lesson || ""}
                      onChange={(e) => updateField("date_of_lesson", e.target.value)}
                      className={`mt-1 ${formErrors.date_of_lesson ? "border-destructive" : ""}`}
                    />
                    {formErrors.date_of_lesson && (
                      <p className="text-destructive text-xs mt-1">{formErrors.date_of_lesson}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`text-sm ${formErrors.time_of_lesson ? "text-destructive" : ""}`}>
                      Time of Session <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="time"
                      value={lesson.time_of_lesson || ""}
                      onFocus={() => {
                        if (!lesson.time_of_lesson) {
                          const now = new Date();
                          const hours = String(now.getHours()).padStart(2, "0");
                          const defaultTime = `${hours}:00`;
                          updateField("time_of_lesson", defaultTime);
                        }
                      }}
                      onChange={(e) => updateField("time_of_lesson", e.target.value)}
                      className={`mt-1 ${formErrors.time_of_lesson ? "border-destructive" : ""}`}
                    />
                    {formErrors.time_of_lesson && (
                      <p className="text-destructive text-xs mt-1">{formErrors.time_of_lesson}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* AI GENERATE BUTTON */}
              <div className="flex justify-center py-2">
                <Button
                  type="button"
                  onClick={generateLessonPlan}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                      <span className="text-sm sm:text-base">Regenerating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                      <span className="text-sm sm:text-base">Regenerate with AI</span>
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Learning Goals Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Learning Goals</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={`text-sm ${formErrors.objectives ? "text-destructive" : ""}`}>
                      Session Objectives <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={lesson.objectives || ""}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("• ")) {
                          value = "• " + value.replace(/^\s+/, "");
                        }
                        updateField("objectives", value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        const target = e.target as HTMLTextAreaElement;
                        const { selectionStart, selectionEnd, value } = target;

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart) +
                            "\n• " +
                            value.substring(selectionEnd);
                          updateField("objectives", newValue);
                          setTimeout(() => {
                            target.selectionStart = target.selectionEnd = selectionStart + 3;
                          }, 0);
                        }

                        if (
                          e.key === "Backspace" &&
                          selectionStart >= 2 &&
                          value.substring(selectionStart - 2, selectionStart) === "• "
                        ) {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart - 2) +
                            value.substring(selectionEnd);
                          updateField("objectives", newValue);
                        }
                      }}
                      placeholder="e.g.&#10;• Understand how to add fractions&#10;• Build confidence with word problems"
                      className={`min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm ${formErrors.objectives ? "border-destructive" : ""}`}
                    />
                    {formErrors.objectives && (
                      <p className="text-destructive text-xs mt-1">{formErrors.objectives}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Success Outcomes</Label>
                    <Textarea
                      value={lesson.outcomes || ""}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("• ")) {
                          value = "• " + value.replace(/^\s+/, "");
                        }
                        updateField("outcomes", value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        const target = e.target as HTMLTextAreaElement;
                        const { selectionStart, selectionEnd, value } = target;

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart) +
                            "\n• " +
                            value.substring(selectionEnd);
                          updateField("outcomes", newValue);
                          setTimeout(() => {
                            target.selectionStart = target.selectionEnd = selectionStart + 3;
                          }, 0);
                        }

                        if (
                          e.key === "Backspace" &&
                          selectionStart >= 2 &&
                          value.substring(selectionStart - 2, selectionStart) === "• "
                        ) {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart - 2) +
                            value.substring(selectionEnd);
                          updateField("outcomes", newValue);
                        }
                      }}
                      placeholder="e.g.&#10;• Student can solve 5 fraction problems independently&#10;• Student demonstrates understanding through explanation"
                      className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Session Structure - Enhanced for tutoring */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Session Structure</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Plan each phase of your tutoring session with personalised support strategies.
                </p>

                <div className="space-y-4">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/60 rounded-xl bg-background/70 shadow-sm transition-all hover:shadow-md overflow-hidden"
                    >
                      {/* Stage Header */}
                      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/50 bg-muted/30">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h4 className="font-semibold text-base sm:text-lg">{stage.stage}</h4>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`duration-${i}`} className="text-xs sm:text-sm text-muted-foreground">
                                Duration:
                              </Label>
                              <Input
                                id={`duration-${i}`}
                                value={stage.duration}
                                onChange={(e) => updateStage(i, "duration", e.target.value)}
                                placeholder="10 min"
                                className="w-20 sm:w-24 h-7 sm:h-8 text-xs sm:text-sm"
                              />
                            </div>
                          </div>

                          {["Starter", "Plenary"].includes(stage.stage) ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => clearStage(i)}
                              className="text-xs sm:text-sm"
                            >
                              Clear
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                              onClick={() => removeStage(i)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Stage Content for Tutoring */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Tutor Actions */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">{"What You'll Do"}</Label>
                            <Textarea
                              value={stage.teaching || ""}
                              onChange={(e) => updateStage(i, "teaching", e.target.value)}
                              placeholder="e.g., Use visual aids to explain the concept, demonstrate problem-solving steps..."
                              className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                            />
                          </div>

                          {/* Student Activities */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Student Activities</Label>
                            <Textarea
                              value={stage.learning || ""}
                              onChange={(e) => updateStage(i, "learning", e.target.value)}
                              placeholder="e.g., Practice problems with guidance, explain their thinking process..."
                              className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                            />
                          </div>

                          {/* Assessment Strategy */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Check Understanding</Label>
                            <Textarea
                              value={stage.assessing || ""}
                              onChange={(e) => updateStage(i, "assessing", e.target.value)}
                              placeholder="e.g., Ask student to explain concept back, observe problem-solving approach..."
                              className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                            />
                          </div>

                          {/* Differentiation */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Adapt & Support</Label>
                            <Textarea
                              value={stage.adapting || ""}
                              onChange={(e) => updateStage(i, "adapting", e.target.value)}
                              placeholder="e.g., If struggling: break down steps. If excelling: introduce challenges..."
                              className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addStage}
                    className="w-full sm:w-auto"
                  >
                    + Add Session Phase
                  </Button>
                </div>
              </section>

              <Separator />

              {/* Resources */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Resources</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Add materials, worksheets, or helpful links for this session.
                </p>

                <div className="space-y-3">
                  {(lesson.resources || []).map((res: Resource, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          placeholder="Resource title"
                          value={res.title || ""}
                          onChange={(e) => {
                            const updated = [...(lesson.resources || [])];
                            updated[index].title = e.target.value;
                            updateField("resources", updated as Resource[]);
                          }}
                          className="text-sm"
                        />

                        <Input
                          placeholder="https://example.com (optional)"
                          value={res.url || ""}
                          onChange={(e) => {
                            const updated = [...(lesson.resources || [])];
                            updated[index].url = e.target.value;
                            updateField("resources", updated as Resource[]);
                          }}
                          className="text-sm"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                        type="button"
                        size="sm"
                        onClick={() =>
                          updateField(
                            "resources",
                            (lesson.resources || []).filter((_, i) => i !== index) as Resource[]
                          )
                        }
                      >
                        Remove Resource
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() =>
                      updateField("resources", [
                        ...(lesson.resources || []),
                        { title: "", url: "" },
                      ] as Resource[])
                    }
                    className="w-full sm:w-auto"
                  >
                    + Add Resource
                  </Button>
                </div>
              </section>

              <Separator />

              {/* Homework */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Practice/Homework</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Optional practice task for the student to complete independently.
                </p>

                <Textarea
                  placeholder="• Practice problems to reinforce learning...&#10;• Specific exercises or worksheets...&#10;• Real-world application tasks..."
                  value={lesson.homework || ""}
                  onChange={(e) => updateField("homework", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              <Separator />

              {/* Evaluation */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Session Evaluation</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  {"Reflect on the student's progress and what worked well."}
                </p>

                <Textarea
                  placeholder="• How did the student respond to different teaching methods?&#10;• What progress was made toward objectives?&#10;• Areas to focus on next session..."
                  value={lesson.evaluation || ""}
                  onChange={(e) => updateField("evaluation", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              <Separator />

              {/* Notes */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Session Notes</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Important observations, parent communication, or reminders for next time.
                </p>

                <Textarea
                  placeholder="• Student's mood and engagement level&#10;• Parent feedback or requests&#10;• Materials to prepare for next session&#10;• Learning style observations..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/lesson-plans")}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto order-1 sm:order-2"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Tutoring Session Plan"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}