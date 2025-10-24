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
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { LessonStage } from "@/components/lesson-structure-editor";
import { FormSkeleton } from "../skeletons/FormSkeleton";

const supabase = createClient();

export default function EditLessonFormAdvanced() {
  const { id } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [stages, setStages] = useState<LessonStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function updateField(field: keyof LessonPlan, value: string) {
    if (!lesson) return;
    setLesson((prev) => prev && { ...prev, [field]: value });
  }

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    if (field === "stage" && !["Starter", "Plenary"].includes(updated[index].stage)) {
      // Normalize stage name (keep "Stage X" format)
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
      // Filter out the "middle" stages between Starter and Plenary
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

      // Prevent removing Starter or Plenary
      if (["Starter", "Plenary"].includes(target.stage)) return prev;

      // Remove the stage
      updated.splice(index, 1);

      // Re-number middle stages
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setSaving(true);
    setError(null);

    try {
      const formattedResources =
        Array.isArray(lesson.resources) && lesson.resources.length > 0
          ? lesson.resources.map((res: any) => ({
              title: res.name || res.title || res.url,
              url: res.url?.trim() || "",
            }))
          : [];

      const { error: updateError } = await supabase
        .from("lesson_plans")
        .update({
          ...lesson,
          resources: formattedResources,
          lesson_structure: stages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lesson.id);

      if (updateError) throw updateError;

      router.push("/dashboard/lesson-plans");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
              extended pedagogy fields.
            </p>
          </CardHeader>

          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* --- Basic Info --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>Class</Label>
                  <Input
                    value={lesson.class}
                    onChange={(e) => updateField("class", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date of Lesson</Label>
                  <Input
                    type="date"
                    value={lesson.date_of_lesson || ""}
                    onChange={(e) =>
                      updateField("date_of_lesson", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Time of Lesson</Label>
                  <Input
                    type="time"
                    value={lesson.time_of_lesson || ""}
                    onChange={(e) =>
                      updateField("time_of_lesson", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input
                    value={lesson.topic || ""}
                    onChange={(e) => updateField("topic", e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* --- Objectives & Outcomes --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Objectives</Label>
                  <Textarea
                    value={lesson.objectives || ""}
                    onChange={(e) => updateField("objectives", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={lesson.outcomes || ""}
                    onChange={(e) => updateField("outcomes", e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* --- Extended Fields --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Specialist Subject Knowledge Required</Label>
                  <Textarea
                    value={lesson.specialist_subject_knowledge_required || ""}
                    onChange={(e) =>
                      updateField(
                        "specialist_subject_knowledge_required",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Knowledge Revisited</Label>
                  <Textarea
                    value={lesson.knowledge_revisited || ""}
                    onChange={(e) =>
                      updateField("knowledge_revisited", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Subject Pedagogies</Label>
                  <Textarea
                    value={lesson.subject_pedagogies || ""}
                    onChange={(e) =>
                      updateField("subject_pedagogies", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Literacy Opportunities</Label>
                  <Textarea
                    value={lesson.literacy_opportunities || ""}
                    onChange={(e) =>
                      updateField("literacy_opportunities", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Numeracy Opportunities</Label>
                  <Textarea
                    value={lesson.numeracy_opportunities || ""}
                    onChange={(e) =>
                      updateField("numeracy_opportunities", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Health and Safety Considerations</Label>
                  <Textarea
                    value={lesson.health_and_safety_considerations || ""}
                    onChange={(e) =>
                      updateField(
                        "health_and_safety_considerations",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* --- Lesson Structure --- */}
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

              <Separator className="my-8" />

              {/* --- Homework, Evaluation, Notes --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Homework</Label>
                  <Textarea
                    value={lesson.homework || ""}
                    onChange={(e) => updateField("homework", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Evaluation</Label>
                  <Textarea
                    value={lesson.evaluation || ""}
                    onChange={(e) => updateField("evaluation", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={lesson.notes || ""}
                    onChange={(e) => updateField("notes", e.target.value)}
                  />
                </div>
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
