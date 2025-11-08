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
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { LessonStage } from "@/components/lesson-structure-editor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const supabase = createClient();

export default function NewLessonFormStandard() {
  const router = useRouter();

  const [lesson, setLesson] = useState<Partial<LessonPlan>>({
    class: "",
    date_of_lesson: "",
    time_of_lesson: "",
    topic: "",
    objectives: "",
    outcomes: "",
    resources: [],
    homework: "",
    evaluation: "",
    notes: "",
    exam_board: "",
    subject: "",
    year_group: "",
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
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Scroll to top when errors occur
  useEffect(() => {
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

  const year = parseInt(lesson.year_group?.replace("Year ", "") || "0");
  const isGCSE = year >= 10 && year <= 11;
  const isAlevel = year >= 12 && year <= 13;
  const showExamBoard = isGCSE || isAlevel;

  const boardOptions = [
    ...(isGCSE || isAlevel ? ["AQA", "OCR", "Edexcel", "WJEC", "Eduqas"] : []),
    ...(isAlevel ? ["Cambridge", "IB"] : []),
    "Other"
  ];

  function updateField(field: keyof LessonPlan, value: string) {
    setLesson((prev) => ({ ...prev, [field]: value }));
  }

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
      // Insert new stage before the last (Plenary)
      const updated = [...prev];
      updated.splice(prev.length - 1, 0, newStage);
      return updated;
    });
  }

  function removeStage(index: number) {
    setStages((prev) =>
      prev.filter(
        (_, i) => i !== index && !["Starter", "Plenary"].includes(prev[i].stage)
      )
    );
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};

    if (!lesson.class?.trim()) errors.class = "Class is required.";
    if (!lesson.year_group?.trim()) errors.year_group = "Year group is required.";
    if (!lesson.date_of_lesson?.trim()) errors.date_of_lesson = "Date is required.";
    if (!lesson.time_of_lesson?.trim()) errors.time_of_lesson = "Time is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    if (!lesson.objectives?.trim()) errors.objectives = "Objectives are required.";

    // Exam board required if GCSE or A-Level
    const yearNum = parseInt(lesson.year_group?.replace("Year ", "") || "0");
    const isGCSE = yearNum >= 10 && yearNum <= 11;
    const isAlevel = yearNum >= 12 && yearNum <= 13;
    const showExamBoard = isGCSE || isAlevel;

    if (showExamBoard && !lesson.exam_board?.trim()) {
      errors.exam_board = "Exam board is required for this year group.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to create a lesson plan.");

      const formattedResources =
        Array.isArray(lesson.resources) && lesson.resources.length > 0
          ? lesson.resources.map((res: any) => ({
              title: res.title || res.url || "",
              url: res.url?.trim() || "",
            }))
          : [];

      const finalExamBoard =
        showExamBoard
          ? (lesson.exam_board === "Other"
              ? lesson.custom_exam_board?.trim() || "Other (unspecified)"
              : lesson.exam_board)
          : null;

      const { error: insertError } = await supabase.from("lesson_plans").insert([
        {
          ...lesson,
          user_id: user.id,
          resources: formattedResources,
          lesson_structure: stages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          exam_board: finalExamBoard,
        },
      ]);

      if (insertError) throw insertError;

      router.push(`/dashboard/lesson-plans`);
      toast.success("Lesson plan created successfully!")
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Lesson plan created unsuccessfully.")
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Lesson Plan</h1>
          <p className="text-muted-foreground text-sm">
            Create a structured and detailed lesson plan.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-xl font-semibold">Lesson Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={formErrors.class ? "text-destructive" : ""}>
                    Class <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lesson.class || ""}
                    onChange={(e) => updateField("class", e.target.value)}
                    placeholder="e.g. 7S"
                    className={formErrors.class ? "border-destructive" : ""}
                  />
                  {formErrors.class && (
                    <p className="text-destructive text-xs mt-1">{formErrors.class}</p>
                  )}
                </div>

                <div>
                  <Label className={formErrors.year_group ? "text-destructive" : ""}>
                    Year Group <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={lesson.year_group || ""}
                    onValueChange={(value) => updateField("year_group", value)}
                  >
                    <SelectTrigger className={`mt-1 ${formErrors.year_group ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Year..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 13 }).map((_, i) => (
                        <SelectItem key={i} value={`Year ${i + 1}`}>
                          Year {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.year_group && (
                    <p className="text-destructive text-xs mt-1">{formErrors.year_group}</p>
                  )}
                </div>

                <div>
                  <Label className={formErrors.date_of_lesson ? "text-destructive" : ""}>
                    Date of Lesson <span className="text-destructive">*</span>
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
                    Time of Lesson <span className="text-destructive">*</span>
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

                <div>
                  <Label className={formErrors.topic ? "text-destructive" : ""}>
                    Topic <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lesson.topic || ""}
                    onChange={(e) => updateField("topic", e.target.value)}
                    placeholder="Lesson topic..."
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

                {showExamBoard && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="col-span-1 md:col-span-2"
                  >
                    <Label className={formErrors.exam_board ? "text-destructive" : ""}>
                      Exam Board <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={lesson.exam_board || ""}
                      onValueChange={(value) => updateField("exam_board", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select exam board..." />
                      </SelectTrigger>
                      <SelectContent>
                        {boardOptions.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.exam_board && (
                      <p className="text-destructive text-xs mt-1">{formErrors.exam_board}</p>
                    )}

                    {lesson.exam_board === "Other" && (
                      <Input
                        className="mt-2"
                        placeholder="Enter exam board..."
                        value={lesson.custom_exam_board || ""}
                        onChange={(e) => updateField("custom_exam_board", e.target.value)}
                      />
                    )}
                  </motion.div>
                )}
              </div>

              <Separator />

              {/* Objectives & Outcomes with bullet points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Objectives */}
                <div>
                  <Label className={formErrors.objectives ? "text-destructive" : ""}>
                    Objectives <span className="text-destructive">*</span>
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
                    placeholder={"What you intend to teach or what students will learn during instruction"}
                    className={formErrors.objectives ? "border-destructive" : ""}
                  />
                  {formErrors.objectives && (
                    <p className="text-destructive text-xs mt-1">{formErrors.objectives}</p>
                  )}
                </div>

                {/* Outcomes */}
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
                    placeholder={"What the students will be able to do independently after learning takes place"}
                  />
                </div>
              </div>

              <Separator />

              {/* Pedagogical Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Specialist Subject Knowledge Required</Label>
                  <Textarea
                    value={lesson.specialist_subject_knowledge_required || ""}
                    onChange={(e) =>
                      updateField("specialist_subject_knowledge_required", e.target.value)
                    }
                    placeholder="Knowledge needed before teaching..."
                  />
                </div>
                <div>
                  <Label>Knowledge Revisited</Label>
                  <Textarea
                    value={lesson.knowledge_revisited || ""}
                    onChange={(e) => updateField("knowledge_revisited", e.target.value)}
                    placeholder="What prior learning is being built upon?"
                  />
                </div>
                <div>
                  <Label>Numeracy Opportunities</Label>
                  <Textarea
                    value={lesson.numeracy_opportunities || ""}
                    onChange={(e) => updateField("numeracy_opportunities", e.target.value)}
                    placeholder="Opportunities for numeracy practice..."
                  />
                </div>
                <div>
                  <Label>Literacy Opportunities</Label>
                  <Textarea
                    value={lesson.literacy_opportunities || ""}
                    onChange={(e) => updateField("literacy_opportunities", e.target.value)}
                    placeholder="Opportunities for literacy skill development..."
                  />
                </div>
                <div>
                  <Label>Subject Pedagogies</Label>
                  <Textarea
                    value={lesson.subject_pedagogies || ""}
                    onChange={(e) => updateField("subject_pedagogies", e.target.value)}
                    placeholder="Pedagogical approaches used..."
                  />
                </div>
                <div>
                  <Label>Health & Safety Considerations</Label>
                  <Textarea
                    value={lesson.health_and_safety_considerations || ""}
                    onChange={(e) =>
                      updateField("health_and_safety_considerations", e.target.value)
                    }
                    placeholder="Potential hazards or safety measures..."
                  />
                </div>
              </div>

              <Separator />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Lesson Structure</h3>
                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/60 rounded-xl bg-background/70 shadow-sm p-4 md:p-5 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{stage.stage}</h4>
                        {["Starter", "Plenary"].includes(stage.stage) ? (
                          <Button type="button" variant="ghost" size="sm" onClick={() => clearStage(i)}>
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

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={stage.duration}
                            onChange={(e) => updateStage(i, "duration", e.target.value)}
                            placeholder="e.g. 10 min"
                          />
                        </div>
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                          {["teaching", "learning", "assessing", "adapting"].map(
                            (field) => (
                              <div key={field}>
                                <Label className="capitalize">{field}</Label>
                                <Textarea
                                  value={stage[field as keyof LessonStage] || ""}
                                  onChange={(e) =>
                                    updateStage(
                                      i,
                                      field as keyof LessonStage,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`${field} details...`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="secondary" onClick={addStage}>
                    + Add Stage
                  </Button>
                </div>
              </div>
              
              <Separator />

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add links or names of teaching materials used during the lesson.
                </p>

                <div className="space-y-3">
                  {(lesson.resources || []).map((res: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                      {/* Title */}
                      <Input
                        placeholder="Resource title"
                        value={res.title || ""}
                        onChange={(e) => {
                          const updated = [...(lesson.resources || [])];
                          updated[index].title = e.target.value;
                          updateField("resources", updated as any);
                        }}
                      />

                      {/* URL */}
                      <Input
                        placeholder="https://example.com"
                        value={res.url || ""}
                        onChange={(e) => {
                          const updated = [...(lesson.resources || [])];
                          updated[index].url = e.target.value;
                          updateField("resources", updated as any);
                        }}
                      />

                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        type="button"
                        onClick={() =>
                          updateField(
                            "resources",
                            (lesson.resources || []).filter((_, i) => i !== index) as any
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
                      ] as any)
                    }
                  >
                    + Add Resource
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Homework */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Homework</h3>
                <Textarea
                  placeholder="• Task students must complete at home..."
                  value={lesson.homework || ""}
                  onChange={(e) => updateField("homework", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Separator />

              {/* Evaluation */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Evaluation</h3>
                <Textarea
                  placeholder="• Reflection on students’ progress..."
                  value={lesson.evaluation || ""}
                  onChange={(e) => updateField("evaluation", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Teacher Notes</h3>
                <Textarea
                  placeholder="Any additional comments or reminders..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
