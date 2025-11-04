"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { LessonStage } from "@/components/lesson-structure-editor";
import { FormSkeleton } from "../skeletons/FormSkeleton";

const supabase = createClient();

export default function EditLessonFormStandard() {
  const { id } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<Partial<LessonPlan> | null>(null);
  const [stages, setStages] = useState<LessonStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) fetchLesson();
  }, [id]);

  async function fetchLesson() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("lesson_plans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Lesson plan not found");

      let structure: LessonStage[] = Array.isArray(data.lesson_structure)
        ? data.lesson_structure
        : [];

      const hasStarter = structure.some((s) => s.stage === "Starter");
      const hasPlenary = structure.some((s) => s.stage === "Plenary");

      if (!hasStarter) structure.unshift(blankStage("Starter"));
      if (!hasPlenary) structure.push(blankStage("Plenary"));

      structure = [
        structure.find((s) => s.stage === "Starter")!,
        ...structure.filter((s) => s.stage !== "Starter" && s.stage !== "Plenary"),
        structure.find((s) => s.stage === "Plenary")!,
      ];

      setLesson(data);
      setStages(structure);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function blankStage(name: string): LessonStage {
    return {
      stage: name,
      duration: "",
      teaching: "",
      learning: "",
      assessing: "",
      adapting: "",
    };
  }

  function updateField(field: keyof LessonPlan, value: string) {
    if (!lesson) return;
    setLesson((prev) => prev && { ...prev, [field]: value });
  }

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  }

  function clearStage(index: number) {
    const updated = [...stages];
    updated[index] = blankStage(updated[index].stage);
    setStages(updated);
  }

  function addStage() {
    setStages((prev) => {
      const middleStages = prev.filter((s) => s.stage !== "Starter" && s.stage !== "Plenary");
      const nextNumber = middleStages.length + 1;
      const newStage = blankStage(`Stage ${nextNumber}`);
      return [
        prev.find((s) => s.stage === "Starter")!,
        ...middleStages,
        newStage,
        prev.find((s) => s.stage === "Plenary")!,
      ];
    });
  }

  function removeStage(index: number) {
    setStages((prev) => {
      const updated = [...prev];
      if (["Starter", "Plenary"].includes(updated[index].stage)) return prev;
      updated.splice(index, 1);

      // Renumber middle stages
      const middleStages = updated.filter((s) => !["Starter", "Plenary"].includes(s.stage));
      middleStages.forEach((s, i) => (s.stage = `Stage ${i + 1}`));

      return [
        updated.find((s) => s.stage === "Starter") || blankStage("Starter"),
        ...middleStages,
        updated.find((s) => s.stage === "Plenary") || blankStage("Plenary"),
      ];
    });
  }

  function validateForm() {
    if (!lesson) return false;
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setSaving(true);
    setError(null);

    if (!validateForm()) {
      setSaving(false);
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    try {
      const formattedResources =
        Array.isArray(lesson.resources) && lesson.resources.length > 0
          ? lesson.resources.map((res: any) => ({
              title: res.title || res.url || "",
              url: res.url?.trim() || "",
            }))
          : [];

      const yearNum = parseInt(lesson.year_group?.replace("Year ", "") || "0");
      const isGCSE = yearNum >= 10 && yearNum <= 11;
      const isAlevel = yearNum >= 12 && yearNum <= 13;
      const showExamBoard = isGCSE || isAlevel;

      const finalExamBoard = showExamBoard
        ? lesson.exam_board === "Other"
          ? lesson.custom_exam_board?.trim() || "Other (unspecified)"
          : lesson.exam_board
        : null;

      const { error: updateError } = await supabase
        .from("lesson_plans")
        .update({
          ...lesson,
          resources: formattedResources,
          lesson_structure: stages,
          exam_board: finalExamBoard,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lesson.id);

      if (updateError) throw updateError;

      router.push("/dashboard/lesson-plans");
      toast.success("Lesson plan edited successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FormSkeleton />;

  if (error)
    return (
      <div className="p-10 text-center text-destructive">
        Error: {error}
        <div className="mt-4">
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );

  if (!lesson) return null;

  const yearNum = parseInt(lesson.year_group?.replace("Year ", "") || "0");
  const isGCSE = yearNum >= 10 && yearNum <= 11;
  const isAlevel = yearNum >= 12 && yearNum <= 13;
  const showExamBoard = isGCSE || isAlevel;

  const boardOptions = [
    ...(isGCSE || isAlevel ? ["AQA", "OCR", "Edexcel", "WJEC", "Eduqas"] : []),
    ...(isAlevel ? ["Cambridge", "IB"] : []),
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Lesson Plan</h1>
          <p className="text-muted-foreground text-sm">
            Update lesson objectives, structure, and notes
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
                  {formErrors.class && <p className="text-destructive text-xs mt-1">{formErrors.class}</p>}
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
                        <SelectItem key={i} value={`Year ${i + 1}`}>Year {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.year_group && <p className="text-destructive text-xs mt-1">{formErrors.year_group}</p>}
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
                  {formErrors.date_of_lesson && <p className="text-destructive text-xs mt-1">{formErrors.date_of_lesson}</p>}
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
                        updateField("time_of_lesson", `${hours}:00`);
                      }
                    }}
                    onChange={(e) => updateField("time_of_lesson", e.target.value)}
                    className={formErrors.time_of_lesson ? "border-destructive" : ""}
                  />
                  {formErrors.time_of_lesson && <p className="text-destructive text-xs mt-1">{formErrors.time_of_lesson}</p>}
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
                  {formErrors.topic && <p className="text-destructive text-xs mt-1">{formErrors.topic}</p>}
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
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="col-span-1 md:col-span-2">
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
                    {formErrors.exam_board && <p className="text-destructive text-xs mt-1">{formErrors.exam_board}</p>}
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

              {/* Objectives & Outcomes */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={formErrors.objectives ? "text-destructive" : ""}>Objectives <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={lesson.objectives || ""}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("• ")) value = "• " + value.replace(/^\s+/, "");
                      updateField("objectives", value);
                    }}
                    onKeyDown={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      const { selectionStart, selectionEnd, value } = target;
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newValue = value.substring(0, selectionStart) + "\n• " + value.substring(selectionEnd);
                        updateField("objectives", newValue);
                        setTimeout(() => { target.selectionStart = target.selectionEnd = selectionStart + 3; }, 0);
                      }
                      if (e.key === "Backspace" && selectionStart >= 2 && value.substring(selectionStart - 2, selectionStart) === "• ") {
                        e.preventDefault();
                        const newValue = value.substring(0, selectionStart - 2) + value.substring(selectionEnd);
                        updateField("objectives", newValue);
                      }
                    }}
                    placeholder={"What you intend to teach or what students will learn during instruction"}
                    className={formErrors.objectives ? "border-destructive" : ""}
                  />
                  {formErrors.objectives && <p className="text-destructive text-xs mt-1">{formErrors.objectives}</p>}
                </div>

                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={lesson.outcomes || ""}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("• ")) value = "• " + value.replace(/^\s+/, "");
                      updateField("outcomes", value);
                    }}
                    onKeyDown={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      const { selectionStart, selectionEnd, value } = target;
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newValue = value.substring(0, selectionStart) + "\n• " + value.substring(selectionEnd);
                        updateField("outcomes", newValue);
                        setTimeout(() => { target.selectionStart = target.selectionEnd = selectionStart + 3; }, 0);
                      }
                    }}
                    placeholder={"What the students will be able to do independently after learning takes place"}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  Lesson Structure
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define timing, teaching, learning, assessment, and adaptations
                  for each stage.
                </p>

                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/50 rounded-xl bg-card/50 p-5 shadow-sm hover:shadow transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        {["Starter", "Plenary"].includes(stage.stage) ? (
                          <h4 className="font-semibold text-foreground">{stage.stage}</h4>
                        ) : (
                          <Input
                            value={stage.stage}
                            onChange={(e) => updateStage(i, "stage", e.target.value)}
                            className="font-semibold w-40"
                          />
                        )}
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

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={stage.duration}
                            onChange={(e) =>
                              updateStage(i, "duration", e.target.value)
                            }
                            placeholder="e.g. 10 min"
                          />
                        </div>

                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3">
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
                                  placeholder={`Describe ${field}...`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addStage}
                    className="mt-2"
                  >
                    + Add Stage
                  </Button>
                </div>
              </div>

              {/* ✅ Resources Section */}
              <Separator className="my-8" />
              <div>
                <h3 className="text-lg font-semibold mb-3">Resources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add links or names of lesson materials.
                </p>

                <div className="space-y-3">
                  {(lesson.resources || []).map((res: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Resource title or link"
                        value={res.title || res.name || res.url || ""}
                        onChange={(e) => {
                          const updated = [...(lesson.resources || [])];
                          updated[index] = { ...updated[index], title: e.target.value };
                          updateField("resources", updated as any);
                        }}
                      />
                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          updateField(
                            "resources",
                            (lesson.resources || []).filter((_: any, i: number) => i !== index) as any
                          );
                        }}
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
                        { title: "" },
                      ] as any)
                    }
                  >
                    + Add Resource
                  </Button>
                </div>
              </div>

              {/* ✅ Homework Section */}
              <Separator className="my-8" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Homework</h3>
                <Textarea
                  placeholder="• Homework task..."
                  value={lesson.homework || ""}
                  onChange={(e) => updateField("homework", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* ✅ Evaluation Section */}
              <Separator className="my-8" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Evaluation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  How will you measure student progress? What worked?
                </p>
                <Textarea
                  placeholder="• Evaluation notes..."
                  value={lesson.evaluation || ""}
                  onChange={(e) => updateField("evaluation", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* ✅ Notes Section */}
              <Separator className="my-8" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Teacher Notes</h3>
                <Textarea
                  placeholder="Additional reminders or ideas..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
