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
import { LessonPlan } from "@/types/lesson";
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
      // ✅ Ensure resources are stored correctly as {title, url}
      const formattedResources =
        Array.isArray(lesson.resources) && lesson.resources.length > 0
          ? lesson.resources.map((res: any) => {
              const title = res.name || res.title || res.url;
              return {
                title,
                url: res.url?.trim() || "",
              };
            })
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

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className="p-8 text-center text-slate-600">Loading lesson plan…</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
        <div className="mt-4">
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Lesson Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Separator />

              {/* Objectives and Outcomes */}
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

              <Separator />

              {/* Lesson Structure */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Lesson Structure (Timing, Teaching, Learning, Assessing, Adapting)
                </h3>

                <div className="space-y-4">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 bg-white shadow-sm relative"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-slate-700">
                          {stage.stage}
                        </h4>
                        {stages.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
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
                            onChange={(e) =>
                              updateStage(i, "duration", e.target.value)
                            }
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
                  {Array.isArray(lesson.resources) &&
                  lesson.resources.length > 0 ? (
                    lesson.resources.map((res: any, i: number) => (
                      <div key={i} className="flex gap-2 items-center">
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
                          variant="destructive"
                          size="sm"
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
                    <p className="text-slate-500 text-sm">
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

              <Separator />

              {/* Homework / Evaluation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <Separator />

              {/* Notes Section */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any additional notes, reflections, or observations..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </div>

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
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
