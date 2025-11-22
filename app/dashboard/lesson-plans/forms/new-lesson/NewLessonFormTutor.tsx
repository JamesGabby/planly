              "use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const supabase = createClient();

export default function NewLessonFormTutor() {
  const router = useRouter();

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

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

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

      toast.success("✨ Tutoring session plan generated successfully! Review and personalize as needed.");

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

  async function createStudentProfile(
    firstName?: string,
    lastName?: string
  ): Promise<string> {
    if (!firstName?.trim() || !lastName?.trim()) {
      throw new Error("Student first and last name are required.");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("You must be logged in to create a student profile.");

    const timestamp = new Date().toISOString();

    const { data, error } = await supabase
      .from("student_profiles")
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          user_id: user.id,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
      .select("student_id")
      .single();

    if (error) throw error;

    return data.student_id;
  }

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
      if (!user) throw new Error("You must be logged in to create a lesson plan.");

      const studentId = await createStudentProfile(
        lesson.first_name,
        lesson.last_name
      );

      const formattedResources =
        Array.isArray(lesson.resources)
          ? lesson.resources.map((res: Resource) => ({
              title: res.title || res.url || "",
              url: res.url?.trim() || "",
            }))
          : [];

      const timestamp = new Date().toISOString();

      const { error: insertError } = await supabase
        .from("tutor_lesson_plans")
        .insert([
          {
            ...lesson,
            user_id: user.id,
            student_id: studentId,
            resources: formattedResources,
            lesson_structure: stages,
            created_at: timestamp,
            updated_at: timestamp,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Tutoring lesson plan created successfully!");
      router.push(`/dashboard/lesson-plans`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Lesson plan creation failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Tutoring Session Plan</h1>
          <p className="text-muted-foreground text-sm">
            Create a personalized 1-on-1 tutoring session plan, or let AI help you generate one.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-xl font-semibold">Session Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-destructive text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={formErrors.first_name ? "text-destructive" : ""}>
                    Student First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lesson.first_name || ""}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    placeholder="e.g. Marlene"
                    className={formErrors.first_name ? "border-destructive" : ""}
                  />
                  {formErrors.first_name && (
                    <p className="text-destructive text-xs mt-1">{formErrors.first_name}</p>
                  )}
                </div>
                <div>
                  <Label>Student Last Name</Label>
                  <Input
                    value={lesson.last_name || ""}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    placeholder="e.g. Smith"
                  />
                </div>
                <div>
                  <Label className={formErrors.topic ? "text-destructive" : ""}>
                    Topic <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lesson.topic || ""}
                    onChange={(e) => updateField("topic", e.target.value)}
                    placeholder="Session topic..."
                    className={formErrors.topic ? "border-destructive" : ""}
                  />
                  {formErrors.topic && (
                    <p className="text-destructive text-xs mt-1">{formErrors.topic}</p>
                  )}
                </div>
                <div>
                  <Label className={formErrors.subject ? "text-destructive" : ""}>
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={lesson.subject || ""}
                    onValueChange={(value) => updateField("subject", value)}
                  >
                    <SelectTrigger className={`mt-1 ${formErrors.subject ? "border-destructive" : ""}`}>
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
                <div>
                  <Label className={formErrors.date_of_lesson ? "text-destructive" : ""}>
                    Date of Session <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={lesson.date_of_lesson || ""}
                    onChange={(e) => updateField("date_of_lesson", e.target.value)}
                    className={formErrors.date_of_lesson ? "border-destructive" : ""}
                  />
                  {formErrors.date_of_lesson && (
                    <p className="text-destructive text-xs mt-1">{formErrors.date_of_lesson}</p>
                  )}
                </div>
                <div>
                  <Label className={formErrors.time_of_lesson ? "text-destructive" : ""}>
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
                    className={formErrors.time_of_lesson ? "border-destructive" : ""}
                  />
                  {formErrors.time_of_lesson && (
                    <p className="text-destructive text-xs mt-1">{formErrors.time_of_lesson}</p>
                  )}
                </div>
              </div>

              {/* AI GENERATE BUTTON */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={generateLessonPlan}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Tutoring Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Tutoring Session with AI
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Objectives & Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={formErrors.objectives ? "text-destructive" : ""}>
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
                    placeholder="What you want the student to achieve in this session"
                    className={formErrors.objectives ? "border-destructive" : ""}
                  />
                  {formErrors.objectives && (
                    <p className="text-destructive text-xs mt-1">{formErrors.objectives}</p>
                  )}
                </div>

                <div>
                  <Label>Outcomes</Label>
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
                    placeholder="What the student will be able to do by the end"
                  />
                </div>
              </div>

              <Separator />
              
              {/* Session Structure - Enhanced for tutoring */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Session Structure</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Plan each phase of your tutoring session with personalized support strategies.
                </p>

                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/60 rounded-xl bg-background/70 shadow-sm transition-all hover:shadow-md"
                    >
                      {/* Stage Header */}
                      <div className="px-5 py-4 border-b border-border/50 bg-muted/30 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{stage.stage}</h4>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`duration-${i}`} className="text-sm text-muted-foreground">
                                Duration:
                              </Label>
                              <Input
                                id={`duration-${i}`}
                                value={stage.duration}
                                onChange={(e) => updateStage(i, "duration", e.target.value)}
                                placeholder="10 min"
                                className="w-24 h-8 text-sm"
                              />
                            </div>
                          </div>

                          {["Starter", "Plenary"].includes(stage.stage) ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => clearStage(i)}
                            >
                              Clear
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeStage(i)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Stage Content for Tutoring */}
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Tutor Actions */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">{"What You'll Do"}</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Your teaching approach and methods for this phase
                              </p>
                            </div>
                            <Textarea
                              value={stage.teaching || ""}
                              onChange={(e) => updateStage(i, "teaching", e.target.value)}
                              placeholder="e.g., Use visual aids to explain the concept, demonstrate problem-solving steps on whiteboard, guide through worked examples..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Student Activities */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Student Activities</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                What the student will do during this phase
                              </p>
                            </div>
                            <Textarea
                              value={stage.learning || ""}
                              onChange={(e) => updateStage(i, "learning", e.target.value)}
                              placeholder="e.g., Practice problems with guidance, explain their thinking process, work through examples independently..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Assessment Strategy */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Check Understanding</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {"How you'll assess progress and comprehension"}
                              </p>
                            </div>
                            <Textarea
                              value={stage.assessing || ""}
                              onChange={(e) => updateStage(i, "assessing", e.target.value)}
                              placeholder="e.g., Ask student to explain concept back, observe problem-solving approach, quick verbal quiz, check workings..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Differentiation */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Adapt & Support</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                How to adjust if student struggles or excels
                              </p>
                            </div>
                            <Textarea
                              value={stage.adapting || ""}
                              onChange={(e) => updateStage(i, "adapting", e.target.value)}
                              placeholder="e.g., If struggling: break down into smaller steps, use manipulatives. If excelling: introduce challenge problems, explore real-world applications..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="secondary" onClick={addStage}>
                    + Add Session Phase
                  </Button>
                </div>
              </div>
              <Separator />

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add materials, worksheets, or helpful links for this session.
                </p>

                <div className="space-y-3">
                  {(lesson.resources || []).map((res: Resource, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                      <Input
                        placeholder="Resource title"
                        value={res.title || ""}
                        onChange={(e) => {
                          const updated = [...(lesson.resources || [])];
                          updated[index].title = e.target.value;
                          updateField("resources", updated as Resource[]);
                        }}
                      />

                      <Input
                        placeholder="https://example.com"
                        value={res.url || ""}
                        onChange={(e) => {
                          const updated = [...(lesson.resources || [])];
                          updated[index].url = e.target.value;
                          updateField("resources", updated as Resource[]);
                        }}
                      />

                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        type="button"
                        onClick={() =>
                          updateField(
                            "resources",
                            (lesson.resources || []).filter((_, i) => i !== index) as Resource[]
                          )
                        }
                      >
                        Remove
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
                  >
                    + Add Resource
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Homework */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Practice/Homework</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Optional practice task for the student to complete independently.
                </p>
                <Textarea
                  placeholder="• Practice task for the student..."
                  value={lesson.homework || ""}
                  onChange={(e) => updateField("homework", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Separator />

              {/* Evaluation */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Session Evaluation</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {"Reflect on the student's progress and what worked well."}
                </p>
                <Textarea
                  placeholder="• How did the student respond?&#10;• What progress was made?&#10;• Areas to focus on next time..."
                  value={lesson.evaluation || ""}
                  onChange={(e) => updateField("evaluation", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Session Notes</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Important observations, parent communication, or reminders for next time.
                </p>
                <Textarea
                  placeholder="• Observations about student engagement&#10;• What to tell parents&#10;• Prep for next session..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/lesson-plans")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Tutoring Session Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}