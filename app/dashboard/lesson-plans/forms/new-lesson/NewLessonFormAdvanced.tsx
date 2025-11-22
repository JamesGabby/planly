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
import { LessonPlanTeacher, Resource } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { LessonStage } from "@/components/lesson-structure-editor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const supabase = createClient();

export default function NewLessonFormDetailed() {
  const router = useRouter();

  const [lesson, setLesson] = useState<Partial<LessonPlanTeacher>>({
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
    specialist_subject_knowledge_required: "",
    knowledge_revisited: "",
    numeracy_opportunities: "",
    literacy_opportunities: "",
    subject_pedagogies: "",
    health_and_safety_considerations: "",
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

  const year = parseInt(lesson.year_group?.replace("Year ", "") || "0");
  const isGCSE = year >= 10 && year <= 11;
  const isAlevel = year >= 12 && year <= 13;
  const showExamBoard = isGCSE || isAlevel;

  const boardOptions = [
    ...(isGCSE || isAlevel ? ["AQA", "OCR", "Edexcel", "WJEC", "Eduqas"] : []),
    ...(isAlevel ? ["Cambridge", "IB"] : []),
    "Other"
  ];

  const updateField = <K extends keyof LessonPlanTeacher>(
    key: K,
    value: LessonPlanTeacher[K]
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
    if (!lesson.class?.trim()) errors.class = "Class is required.";
    if (!lesson.year_group?.trim()) errors.year_group = "Year group is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  async function generateLessonPlan() {
    if (!validateBasicFields()) {
      toast.error("Please fill in Class, Year Group, Subject, and Topic before generating.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: "detailed",
          topic: lesson.topic,
          subject: lesson.subject,
          year_group: lesson.year_group,
          class: lesson.class,
          exam_board: lesson.exam_board === "Other" ? lesson.custom_exam_board : lesson.exam_board,
          objectives: lesson.objectives,
          outcomes: lesson.outcomes,
          specialist_subject_knowledge_required: lesson.specialist_subject_knowledge_required,
          knowledge_revisited: lesson.knowledge_revisited,
          numeracy_opportunities: lesson.numeracy_opportunities,
          literacy_opportunities: lesson.literacy_opportunities,
          subject_pedagogies: lesson.subject_pedagogies,
          health_and_safety_considerations: lesson.health_and_safety_considerations,
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
      
      // Update detailed-specific fields
      updateField("specialist_subject_knowledge_required", generatedPlan.specialist_subject_knowledge_required || "");
      updateField("knowledge_revisited", generatedPlan.knowledge_revisited || "");
      updateField("numeracy_opportunities", generatedPlan.numeracy_opportunities || "");
      updateField("literacy_opportunities", generatedPlan.literacy_opportunities || "");
      updateField("subject_pedagogies", generatedPlan.subject_pedagogies || "");
      updateField("health_and_safety_considerations", generatedPlan.health_and_safety_considerations || "");

      if (generatedPlan.resources && Array.isArray(generatedPlan.resources)) {
        updateField("resources", generatedPlan.resources);
      }

      if (generatedPlan.lesson_structure && Array.isArray(generatedPlan.lesson_structure)) {
        setStages(generatedPlan.lesson_structure);
      }

      toast.success("✨ Detailed lesson plan generated successfully! Review and edit as needed.");
      
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

  async function insertClass(className: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from("classes")
        .insert([
          {
            class_name: className,
            created_by: userId,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select("*")
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown class insert error");
      throw err;
    }
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to create a lesson plan.");

      if (!lesson.class) {
        throw new Error("Class name is missing.");
      }

      await insertClass(lesson.class, user.id);

      const formattedResources =
        Array.isArray(lesson.resources)
          ? lesson.resources.map((res: Resource) => ({
              title: res.title || res.url || "",
              url: res.url?.trim() || "",
            }))
          : [];

      const finalExamBoard = showExamBoard
        ? (lesson.exam_board === "Other"
            ? lesson.custom_exam_board?.trim() || "Other (unspecified)"
            : lesson.exam_board)
        : null;

      const { error: insertError } = await supabase
        .from("lesson_plans")
        .insert([
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

      toast.success("Lesson plan created successfully!");
      router.push("/dashboard/lesson-plans");

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
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Detailed Lesson Plan</h1>
          <p className="text-muted-foreground text-sm">
            Create a comprehensive and pedagogically detailed lesson plan, or let AI help you generate one.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-xl font-semibold">Lesson Details</CardTitle>
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
                      Generating Detailed Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Detailed Lesson Plan with AI
                    </>
                  )}
                </Button>
              </div>

              <Separator />
              
              {/* Objectives & Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="What you intend to teach or what students will learn during instruction"
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
                    placeholder="What the students will be able to do independently after learning takes place"
                  />
                </div>
              </div>

              <Separator />

              {/* Pedagogical Fields */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pedagogical Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed teaching considerations and subject-specific information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Specialist Subject Knowledge Required</Label>
                    <Textarea
                      value={lesson.specialist_subject_knowledge_required || ""}
                      onChange={(e) =>
                        updateField("specialist_subject_knowledge_required", e.target.value)
                      }
                      placeholder="Knowledge needed before teaching..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Knowledge Revisited</Label>
                    <Textarea
                      value={lesson.knowledge_revisited || ""}
                      onChange={(e) => updateField("knowledge_revisited", e.target.value)}
                      placeholder="What prior learning is being built upon?"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Numeracy Opportunities</Label>
                    <Textarea
                      value={lesson.numeracy_opportunities || ""}
                      onChange={(e) => updateField("numeracy_opportunities", e.target.value)}
                      placeholder="Opportunities for numeracy practice..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Literacy Opportunities</Label>
                    <Textarea
                      value={lesson.literacy_opportunities || ""}
                      onChange={(e) => updateField("literacy_opportunities", e.target.value)}
                      placeholder="Opportunities for literacy skill development..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Subject Pedagogies</Label>
                    <Textarea
                      value={lesson.subject_pedagogies || ""}
                      onChange={(e) => updateField("subject_pedagogies", e.target.value)}
                      placeholder="Pedagogical approaches used..."
                      className="min-h-[100px]"
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
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Lesson Structure</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define each stage of your lesson, including timing and learning strategies.
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

                      {/* Stage Content */}
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Teaching */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Teaching</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                What will you do as the teacher? Include methods and strategies.
                              </p>
                            </div>
                            <Textarea
                              value={stage.teaching || ""}
                              onChange={(e) => updateStage(i, "teaching", e.target.value)}
                              placeholder="e.g., Explain the concept using visual aids, demonstrate the method on the board..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Learning */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Learning</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                What will students do? Describe their activities and engagement.
                              </p>
                            </div>
                            <Textarea
                              value={stage.learning || ""}
                              onChange={(e) => updateStage(i, "learning", e.target.value)}
                              placeholder="e.g., Students work in pairs to solve problems, take notes, participate in discussion..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Assessing */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Assessing</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                How will you check understanding and progress?
                              </p>
                            </div>
                            <Textarea
                              value={stage.assessing || ""}
                              onChange={(e) => updateStage(i, "assessing", e.target.value)}
                              placeholder="e.g., Question and answer, mini whiteboard activities, observation of group work..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>

                          {/* Adapting */}
                          <div className="space-y-2">
                            <div>
                              <Label className="text-base font-medium">Adapting</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                How will you differentiate for various learning needs?
                              </p>
                            </div>
                            <Textarea
                              value={stage.adapting || ""}
                              onChange={(e) => updateStage(i, "adapting", e.target.value)}
                              placeholder="e.g., Extension tasks for advanced learners, scaffolding for struggling students..."
                              className="min-h-[100px] text-sm"
                            />
                          </div>
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
                  placeholder="• Reflection on students' progress..."
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
                  placeholder="Additional comments or reminders..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Detailed Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}