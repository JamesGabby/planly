"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LessonStage } from "@/components/lesson-structure-editor";
import { FormSkeleton } from "../skeletons/FormSkeleton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { TutorLessonPlan } from "../types/lesson_tutor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient();

export default function EditLessonFormTutor() {
  const { id } = useParams();
  const router = useRouter();

  const [stages, setStages] = useState<LessonStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [lesson, setLesson] = useState<Partial<TutorLessonPlan>>({
    date_of_lesson: "",
    time_of_lesson: "",
    topic: "",
    objectives: "",
    outcomes: "",
    resources: [],
    homework: "",
    evaluation: "",
    notes: "",
    student: "",
    subject: "",
  });

  useEffect(() => {
    if (id) fetchLesson();
  }, [id]);

  async function fetchLesson() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("tutor_lesson_plans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Lesson plan not found");

      let structure: LessonStage[] = Array.isArray(data.lesson_structure)
        ? data.lesson_structure
        : [];

      const ensureStage = (name: string) => ({
        stage: name,
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      });

      const hasStarter = structure.some((s) => s.stage === "Starter");
      const hasPlenary = structure.some((s) => s.stage === "Plenary");

      if (!hasStarter) structure.unshift(ensureStage("Starter"));
      if (!hasPlenary) structure.push(ensureStage("Plenary"));

      structure = [
        structure.find((s) => s.stage === "Starter")!,
        ...structure.filter(
          (s) => s.stage !== "Starter" && s.stage !== "Plenary"
        ),
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

  function updateField(field: keyof TutorLessonPlan, value: string) {
    if (!lesson) return;
    setLesson((prev) => prev && { ...prev, [field]: value });
  }

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    if (
      field === "stage" &&
      !["Starter", "Plenary"].includes(updated[index].stage)
    ) {
      value = value.replace(/^stage\s*/i, "Stage ");
    }
    updated[index][field] = value;
    setStages(updated);
  }

  function clearStage(index: number) {
    const stageName = stages[index].stage;
    const blankStage = {
      stage: stageName,
      duration: "",
      teaching: "",
      learning: "",
      assessing: "",
      adapting: "",
    };
    const updated = [...stages];
    updated[index] = blankStage;
    setStages(updated);
  }

  function addStage() {
    setStages((prev) => {
      const middleStages = prev.filter(
        (s) => s.stage !== "Starter" && s.stage !== "Plenary"
      );
      const nextNumber = middleStages.length + 1;
      const newStage = {
        stage: `Stage ${nextNumber}`,
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      };

      const updated = [
        prev.find((s) => s.stage === "Starter")!,
        ...middleStages,
        newStage,
        prev.find((s) => s.stage === "Plenary")!,
      ];
      return updated;
    });
  }

  function removeStage(index: number) {
    setStages((prev) => {
      const updated = [...prev];
      const target = updated[index];
      if (["Starter", "Plenary"].includes(target.stage)) return prev;
      updated.splice(index, 1);

      const middleStages = updated.filter(
        (s) => !["Starter", "Plenary"].includes(s.stage)
      );
      middleStages.forEach((s, i) => {
        s.stage = `Stage ${i + 1}`;
      });

      return [
        updated.find((s) => s.stage === "Starter") || {
          stage: "Starter",
          duration: "",
          teaching: "",
          learning: "",
          assessing: "",
          adapting: "",
        },
        ...middleStages,
        updated.find((s) => s.stage === "Plenary") || {
          stage: "Plenary",
          duration: "",
          teaching: "",
          learning: "",
          assessing: "",
          adapting: "",
        },
      ];
    });
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};

    if (!lesson.student?.trim()) errors.student = "Student is required.";
    if (!lesson.date_of_lesson?.trim()) errors.date_of_lesson = "Date is required.";
    if (!lesson.time_of_lesson?.trim()) errors.time_of_lesson = "Time is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    if (!lesson.objectives?.trim()) errors.objectives = "Objectives are required.";

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
              title: res.name || res.title || res.url,
              url: res.url?.trim() || "",
            }))
          : [];

      const { error: updateError } = await supabase
        .from("tutor_lesson_plans")
        .update({
          ...lesson,
          resources: formattedResources,
          lesson_structure: stages,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Card className="border shadow-md rounded-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold text-primary">
              Edit Lesson Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update every detail of your lesson plan, including structure and
              detailed pedagogy fields.
            </p>
          </CardHeader>

          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className={formErrors.student ? "text-destructive" : ""}>
                    Student <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lesson.student || ""}
                    onChange={(e) => updateField("student", e.target.value)}
                    placeholder="e.g. Marlene"
                  />
                  {formErrors.student && (
                    <p className="text-destructive text-xs mt-1">{formErrors.student}</p>
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
                  />
                  {formErrors.topic && (
                    <p className="text-destructive text-xs mt-1">{formErrors.topic}</p>
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
                  />
                  {formErrors.time_of_lesson && (
                    <p className="text-destructive text-xs mt-1">{formErrors.time_of_lesson}</p>
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
                    <SelectTrigger className={`mt-1`}>
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
              </div>

              <Separator className="my-8" />

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
                      // Ensure first bullet is always present
                      if (!value.startsWith("• ")) {
                        value = "• " + value.replace(/^\s+/, "");
                      }
                      updateField("objectives", value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      const target = e.target as HTMLTextAreaElement;
                      const { selectionStart, selectionEnd, value } = target;

                      // Enter → new bullet
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newValue =
                          value.substring(0, selectionStart) +
                          "\n• " +
                          value.substring(selectionEnd);
                        updateField("objectives", newValue);
                        // Restore cursor position after React state update
                        setTimeout(() => {
                          target.selectionStart = target.selectionEnd = selectionStart + 3;
                        }, 0);
                      }

                      // Backspace → remove bullet cleanly
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

              <Separator className="my-8" />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Lesson Structure
                </h3>
                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/50 rounded-xl bg-card/50 p-5 shadow-sm hover:shadow transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        {["Starter", "Plenary"].includes(stage.stage) ? (
                          <h4 className="font-semibold text-foreground">
                            {stage.stage}
                          </h4>
                        ) : (
                          <Input
                            value={stage.stage}
                            onChange={(e) =>
                              updateStage(i, "stage", e.target.value)
                            }
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
                        {/* Duration with tooltip */}
                        <div>
                          <div className="flex items-center gap-1">
                            <Label>Duration</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                  How long will each activity last and what
                                  time will it be?
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Input
                            value={stage.duration}
                            onChange={(e) =>
                              updateStage(i, "duration", e.target.value)
                            }
                            placeholder="e.g. 10 min"
                          />
                        </div>

                        {/* Teaching/Learning/Assessing/Adapting with tooltips */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                          {["teaching", "learning", "assessing", "adapting"].map(
                            (field) => (
                              <div key={field}>
                                <div className="flex items-center gap-1">
                                  <Label className="capitalize">{field}</Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs text-sm">
                                        {field === "teaching" &&
                                          "Explain how you are planning / organising / structuring / adapting your placement school’s materials. Include routines, expectations, task explanations, conditions of working, and phase transitions."}
                                        {field === "learning" &&
                                          "Detail pupil activity and clarify how pupils are engaged in learning at all times, during each phase of the lesson."}
                                        {field === "assessing" &&
                                          "Plot your learning checks to assess understanding and progress, including questioning sequences."}
                                        {field === "adapting" &&
                                          "Explain how you need to adapt learning for pupils who require support, guidance, LSA direction, and additional challenge."}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>

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

              <Separator className="my-8" />
              
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
                  How will you measure your student's progress? What worked?
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
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Lesson"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
