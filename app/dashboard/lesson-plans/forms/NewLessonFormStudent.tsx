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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { LessonStage } from "@/components/lesson-structure-editor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    { stage: "Starter", duration: "", teaching: "", learning: "", assessing: "", adapting: "" },
    { stage: "Plenary", duration: "", teaching: "", learning: "", assessing: "", adapting: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof LessonPlan, value: string) =>
    setLesson((prev) => ({ ...prev, [field]: value }));

  const updateStage = (index: number, field: keyof LessonStage, value: string) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const addStage = () => {
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
  };

  const clearStage = (index: number) => {
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
  };

  const removeStage = (index: number) =>
    setStages((prev) =>
      prev.filter(
        (_, i) => i !== index && !["Starter", "Plenary"].includes(prev[i].stage)
      )
    );

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
      toast.success("Lesson plan created successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Lesson plan created unsuccessfully.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Lesson Plan</h1>
          <p className="text-muted-foreground text-sm">
            Create a detailed lesson plan including pedagogical, safety, and adaptation details.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-xl font-semibold">Lesson Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* --- Basic Info --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Class</Label>
                  <Input value={lesson.class || ""} onChange={(e) => updateField("class", e.target.value)} placeholder="e.g. Year 7A" />
                </div>
                <div>
                  <Label>Date of Lesson</Label>
                  <Input type="date" value={lesson.date_of_lesson || ""} onChange={(e) => updateField("date_of_lesson", e.target.value)} />
                </div>
                <div>
                  <Label>Time of Lesson</Label>
                  <Input type="time" value={lesson.time_of_lesson || ""} onChange={(e) => updateField("time_of_lesson", e.target.value)} />
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input value={lesson.topic || ""} onChange={(e) => updateField("topic", e.target.value)} placeholder="Lesson topic..." />
                </div>
              </div>

              <Separator />

              {/* --- Objectives & Outcomes --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Objectives</Label>
                  <Textarea value={lesson.objectives || ""} onChange={(e) => updateField("objectives", e.target.value)} placeholder="• Learning goal 1" />
                </div>
                <div>
                  <Label>Outcomes</Label>
                  <Textarea value={lesson.outcomes || ""} onChange={(e) => updateField("outcomes", e.target.value)} placeholder="• Expected outcome 1" />
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

              {/* --- Lesson Structure --- */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Lesson Structure</h3>
                <div className="space-y-5">
                  {stages.map((stage, i) => (
                    <div key={i} className="border border-border/60 rounded-xl bg-background/70 shadow-sm p-4 md:p-5 hover:shadow-md transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{stage.stage}</h4>
                        {["Starter", "Plenary"].includes(stage.stage) ? (
                          <Button type="button" variant="ghost" size="sm" onClick={() => clearStage(i)}>Clear</Button>
                        ) : (
                          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeStage(i)}>
                            Remove
                          </Button>
                        )}
                      </div>

                      {/* Tooltip-enhanced fields */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div>
                          <div className="flex items-center gap-1">
                            <Label>Duration</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    tabIndex={0}
                                    className="focus:outline-none transition-opacity hover:opacity-80 focus:opacity-100"
                                  >
                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                  How long will each activity last and what time will it be?
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Input value={stage.duration} onChange={(e) => updateStage(i, "duration", e.target.value)} placeholder="e.g. 10 min" />
                        </div>

                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                          {["teaching", "learning", "assessing", "adapting"].map((field) => (
                            <div key={field}>
                              <div className="flex items-center gap-1">
                                <Label className="capitalize">{field}</Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        tabIndex={0}
                                        className="focus:outline-none transition-opacity hover:opacity-80 focus:opacity-100"
                                      >
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                      </button>
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
                              <Textarea value={stage[field as keyof LessonStage] || ""} onChange={(e) => updateStage(i, field as keyof LessonStage, e.target.value)} placeholder={`${field} details...`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addStage}>+ Add Stage</Button>
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
                <p className="text-sm text-muted-foreground mb-3">
                  How will you evaluate the lesson’s success?
                </p>
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
