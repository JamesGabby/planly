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

export default function NewLessonFormAdvanced() {
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
    specialist_subject_knowledge_required: "",
    knowledge_revisited: "",
    subject_pedagogies: "",
    literacy_opportunities: "",
    numeracy_opportunities: "",
    health_and_safety_considerations: "",
    timing: "",
    teaching: "",
    learning: "",
    assessing: "",
    adapting: "",
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

  function updateField(field: keyof LessonPlan, value: string) {
    setLesson((prev) => ({ ...prev, [field]: value }));
  }

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
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

  function clearStage(index: number) {
    const updated = [...stages];
    updated[index] = {
      ...updated[index],
      duration: "",
      teaching: "",
      learning: "",
      assessing: "",
      adapting: "",
    };
    setStages(updated);
  }

  function removeStage(index: number) {
    setStages((prev) =>
      prev.filter(
        (_, i) => i !== index && !["Starter", "Plenary"].includes(prev[i].stage)
      )
    );
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

      const { error: insertError } = await supabase.from("lesson_plans").insert([
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

      router.push("/dashboard/lesson-plans");
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Lesson Plan (Advanced)</h1>
          <p className="text-muted-foreground text-sm">
            Create a detailed, advanced lesson plan including pedagogical, safety, and adaptation details.
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

              {/* Objectives / Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Objectives</Label>
                  <Textarea
                    value={lesson.objectives || ""}
                    onChange={(e) => updateField("objectives", e.target.value)}
                    placeholder="• Learning goal 1"
                  />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={lesson.outcomes || ""}
                    onChange={(e) => updateField("outcomes", e.target.value)}
                    placeholder="• Expected outcome 1"
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
                  <Label>Subject Pedagogies</Label>
                  <Textarea
                    value={lesson.subject_pedagogies || ""}
                    onChange={(e) => updateField("subject_pedagogies", e.target.value)}
                    placeholder="Pedagogical approaches used..."
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
                  <Label>Numeracy Opportunities</Label>
                  <Textarea
                    value={lesson.numeracy_opportunities || ""}
                    onChange={(e) => updateField("numeracy_opportunities", e.target.value)}
                    placeholder="Opportunities for numeracy practice..."
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

              {/* Timing, Teaching, Learning, Assessing, Adapting (summary fields) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["timing", "teaching", "learning", "assessing", "adapting"].map((field) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <Textarea
                      value={lesson[field as keyof LessonPlan] || ""}
                      onChange={(e) => updateField(field as keyof LessonPlan, e.target.value)}
                      placeholder={`General ${field} overview...`}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Homework, Evaluation, Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Homework</Label>
                  <Textarea
                    value={lesson.homework || ""}
                    onChange={(e) => updateField("homework", e.target.value)}
                    placeholder="Homework assigned..."
                  />
                </div>
                <div>
                  <Label>Evaluation</Label>
                  <Textarea
                    value={lesson.evaluation || ""}
                    onChange={(e) => updateField("evaluation", e.target.value)}
                    placeholder="Lesson evaluation..."
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={lesson.notes || ""}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Advanced Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
