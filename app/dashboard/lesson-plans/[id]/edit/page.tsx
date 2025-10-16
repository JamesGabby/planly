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

const supabase = createClient();

export default function EditLessonPlanPage() {
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

      setLesson(data);
      setStages(
        Array.isArray(data.lesson_structure)
          ? data.lesson_structure
          : [
              {
                stage: "Starter",
                duration: "",
                teaching: "",
                learning: "",
                assessing: "",
                adapting: "",
              },
            ]
      );
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
    updated[index][field] = value;
    setStages(updated);
  }

  function addStage() {
    setStages((prev) => [
      ...prev,
      {
        stage: `Stage ${prev.length + 1}`,
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      },
    ]);
  }

  function removeStage(index: number) {
    setStages((prev) => prev.filter((_, i) => i !== index));
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

  if (loading)
    return (
      <div className="p-10 text-center text-muted-foreground animate-pulse">
        Loading lesson plan…
      </div>
    );

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10 p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto">
        <Card className="border border-border/60 shadow-md rounded-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
              Edit Lesson Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update lesson objectives, structure, and notes
            </p>
          </CardHeader>

          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>Class</Label>
                  <Input
                    value={lesson.class}
                    onChange={(e) => updateField("class", e.target.value)}
                    placeholder="e.g. Grade 8A"
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
                    placeholder="e.g. Introduction to Fractions"
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Objectives and Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Objectives</Label>
                  <Textarea
                    value={lesson.objectives || ""}
                    onChange={(e) => updateField("objectives", e.target.value)}
                    placeholder="List what students should learn..."
                  />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={lesson.outcomes || ""}
                    onChange={(e) => updateField("outcomes", e.target.value)}
                    placeholder="Describe expected learning outcomes..."
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
                        <h4 className="font-semibold text-foreground">
                          {stage.stage}
                        </h4>
                        {stages.length > 1 && (
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

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  Resources
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add links or titles for supporting materials.
                </p>

                <div className="space-y-3">
                  {Array.isArray(lesson.resources) &&
                  lesson.resources.length > 0 ? (
                    lesson.resources.map((res: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row gap-3 items-start md:items-center"
                      >
                        <Input
                          placeholder="Resource title"
                          value={res.title ?? ""}
                          onChange={(e) => {
                            const updated = lesson.resources!.map((r, idx) =>
                              idx === i ? { ...r, title: e.target.value } : r
                            );
                            setLesson((prev) =>
                              prev ? { ...prev, resources: updated } : prev
                            );
                          }}
                        />
                        <Input
                          placeholder="Resource URL"
                          value={res.url ?? ""}
                          onChange={(e) => {
                            const updated = lesson.resources!.map((r, idx) =>
                              idx === i ? { ...r, url: e.target.value } : r
                            );
                            setLesson((prev) =>
                              prev ? { ...prev, resources: updated } : prev
                            );
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            const updated = lesson.resources!.filter(
                              (_, idx) => idx !== i
                            );
                            setLesson((prev) =>
                              prev ? { ...prev, resources: updated } : prev
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No resources added yet.
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setLesson((prev) =>
                        prev
                          ? {
                              ...prev,
                              resources: [
                                ...(Array.isArray(prev.resources)
                                  ? prev.resources
                                  : []),
                                { title: "", url: "" },
                              ],
                            }
                          : null
                      )
                    }
                  >
                    + Add Resource
                  </Button>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Homework / Evaluation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Homework</Label>
                  <Textarea
                    value={lesson.homework || ""}
                    onChange={(e) => updateField("homework", e.target.value)}
                    placeholder="Assignments or follow-up tasks..."
                  />
                </div>
                <div>
                  <Label>Evaluation</Label>
                  <Textarea
                    value={lesson.evaluation || ""}
                    onChange={(e) => updateField("evaluation", e.target.value)}
                    placeholder="Self or student evaluation notes..."
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any additional notes, reflections, or observations..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
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
