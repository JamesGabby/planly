"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const supabase = createClient();

interface LessonStage {
  stage: string;
  duration: string;
  teaching: string;
  learning: string;
  assessing: string;
  adapting: string;
}

export default function NewLessonPlanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    class: "",
    date_of_lesson: "",
    time_of_lesson: "",
    topic: "",
    objectives: "",
    outcomes: "",
    resources: "",
    homework: "",
    specialist_subject_knowledge_required: "",
    knowledge_revisited: "",
    subject_pedagogies: "",
    literacy_opportunities: "",
    numeracy_opportunities: "",
    health_and_safety_considerations: "",
    evaluation: "",
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

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { error: insertError } = await supabase.from("lesson_plans").insert({
        user_id: user.id,
        ...form,
        lesson_structure: stages,
      });

      if (insertError) throw insertError;

      router.push("/lesson-plans");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Lesson Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Class</Label>
                  <Input
                    value={form.class}
                    onChange={(e) => updateForm("class", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Date of Lesson</Label>
                  <Input
                    type="date"
                    value={form.date_of_lesson}
                    onChange={(e) => updateForm("date_of_lesson", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Time of Lesson</Label>
                  <Input
                    type="time"
                    value={form.time_of_lesson}
                    onChange={(e) => updateForm("time_of_lesson", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input
                    value={form.topic}
                    onChange={(e) => updateForm("topic", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Objectives</Label>
                  <Textarea
                    value={form.objectives}
                    onChange={(e) => updateForm("objectives", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea
                    value={form.outcomes}
                    onChange={(e) => updateForm("outcomes", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Lesson Structure Section */}
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
                          <div>
                            <Label>Teaching</Label>
                            <Textarea
                              value={stage.teaching}
                              onChange={(e) =>
                                updateStage(i, "teaching", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Learning</Label>
                            <Textarea
                              value={stage.learning}
                              onChange={(e) =>
                                updateStage(i, "learning", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Assessing</Label>
                            <Textarea
                              value={stage.assessing}
                              onChange={(e) =>
                                updateStage(i, "assessing", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Adapting</Label>
                            <Textarea
                              value={stage.adapting}
                              onChange={(e) =>
                                updateStage(i, "adapting", e.target.value)
                              }
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

              <div>
                <Label>Resources (JSON or text)</Label>
                <Textarea
                  value={form.resources}
                  onChange={(e) => updateForm("resources", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Homework</Label>
                  <Textarea
                    value={form.homework}
                    onChange={(e) => updateForm("homework", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Evaluation</Label>
                  <Textarea
                    value={form.evaluation}
                    onChange={(e) => updateForm("evaluation", e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
