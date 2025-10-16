"use client";

import React, { useState } from "react";
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

const supabase = createClient();

export default function NewLessonPlanPage() {
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
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof LessonPlan, value: string) {
    setLesson((prev) => ({ ...prev, [field]: value }));
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
    setSaving(true);
    setError(null);

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
          },
        ]);

      if (insertError) throw insertError;

      router.push(`/dashboard/lesson-plans`);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
                  <Label>Class</Label>
                  <Input
                    value={lesson.class || ""}
                    onChange={(e) => updateField("class", e.target.value)}
                    placeholder="e.g. Grade 5A"
                  />
                </div>
                <div>
                  <Label>Date of Lesson</Label>
                  <Input
                    type="date"
                    value={lesson.date_of_lesson || ""}
                    onChange={(e) => updateField("date_of_lesson", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Time of Lesson</Label>
                  <Input
                    type="time"
                    value={lesson.time_of_lesson || ""}
                    onChange={(e) => updateField("time_of_lesson", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input
                    value={lesson.topic || ""}
                    onChange={(e) => updateField("topic", e.target.value)}
                    placeholder="Lesson topic..."
                  />
                </div>
              </div>

              <Separator />

              {/* Objectives & Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Objectives</Label>
                  <Textarea
                    value={lesson.objectives || ""}
                    onChange={(e) => updateField("objectives", e.target.value)}
                    placeholder="Learning goals for this lesson..."
                  />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={lesson.outcomes || ""}
                    onChange={(e) => updateField("outcomes", e.target.value)}
                    placeholder="Expected student outcomes..."
                  />
                </div>
              </div>

              <Separator />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Lesson Structure
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define each stage of your lesson, including timing and learning strategies.
                </p>

                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/60 rounded-xl bg-background/70 shadow-sm p-4 md:p-5 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{stage.stage}</h4>
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
                <div className="space-y-3">
                  {Array.isArray(lesson.resources) && lesson.resources.length > 0 ? (
                    lesson.resources.map((res: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row gap-2 md:items-center"
                      >
                        <Input
                          placeholder="Resource title"
                          value={res.title ?? ""}
                          onChange={(e) => {
                            const updated = lesson.resources!.map((r, idx) =>
                              idx === i ? { ...r, title: e.target.value } : r
                            );
                            setLesson((prev) => ({ ...prev, resources: updated }));
                          }}
                        />
                        <Input
                          placeholder="Resource URL"
                          value={res.url ?? ""}
                          onChange={(e) => {
                            const updated = lesson.resources!.map((r, idx) =>
                              idx === i ? { ...r, url: e.target.value } : r
                            );
                            setLesson((prev) => ({ ...prev, resources: updated }));
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
                            setLesson((prev) => ({ ...prev, resources: updated }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No resources added yet.
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setLesson((prev) => ({
                        ...prev,
                        resources: [
                          ...(Array.isArray(prev.resources)
                            ? prev.resources
                            : []),
                          { title: "", url: "" },
                        ],
                      }))
                    }
                  >
                    + Add Resource
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Homework & Evaluation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Homework</Label>
                  <Textarea
                    value={lesson.homework || ""}
                    onChange={(e) => updateField("homework", e.target.value)}
                    placeholder="Homework tasks..."
                  />
                </div>
                <div>
                  <Label>Evaluation</Label>
                  <Textarea
                    value={lesson.evaluation || ""}
                    onChange={(e) => updateField("evaluation", e.target.value)}
                    placeholder="Evaluation criteria..."
                  />
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any additional notes or reflections..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
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
