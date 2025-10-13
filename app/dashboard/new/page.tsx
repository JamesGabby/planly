"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const supabase = createClient();

export default function NewLessonPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // ✅ Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be signed in to create a lesson plan.");
      setLoading(false);
      return;
    }

    const lesson = {
      user_id: user.id, // ✅ required for your table
      class: formData.get("class") as string,
      date_of_lesson: formData.get("date_of_lesson") as string,
      time_of_lesson: formData.get("time_of_lesson") as string,
      topic: formData.get("topic") as string,
      objectives: formData.get("objectives") as string,
      outcomes: formData.get("outcomes") as string,
      resources: formData.get("resources") as string,
      homework: formData.get("homework") as string,
      specialist_subject_knowledge_required: formData.get("specialist_subject_knowledge_required") as string,
      knowledge_revisited: formData.get("knowledge_revisited") as string,
      subject_pedagogies: formData.get("subject_pedagogies") as string,
      literacy_opportunities: formData.get("literacy_opportunities") as string,
      numeracy_opportunities: formData.get("numeracy_opportunities") as string,
      health_and_safety_considerations: formData.get("health_and_safety_considerations") as string,
      timing: formData.get("timing") as string,
      teaching: formData.get("teaching") as string,
      learning: formData.get("learning") as string,
      assessing: formData.get("assessing") as string,
      adapting: formData.get("adapting") as string,
      evaluation: formData.get("evaluation") as string,
    };

    const { error: insertError } = await supabase.from("lesson_plans").insert(lesson);

    setLoading(false);

    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      return;
    }

    router.push("/lesson-plans");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">New Lesson Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input id="class" name="class" required />
                </div>

                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" name="topic" required />
                </div>

                <div>
                  <Label htmlFor="date_of_lesson">Date</Label>
                  <Input id="date_of_lesson" name="date_of_lesson" type="date" required />
                </div>

                <div>
                  <Label htmlFor="time_of_lesson">Time</Label>
                  <Input id="time_of_lesson" name="time_of_lesson" type="time" />
                </div>
              </div>

              {/* Main content fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="objectives">Objectives</Label>
                  <Textarea id="objectives" name="objectives" rows={3} />
                </div>
                <div>
                  <Label htmlFor="outcomes">Outcomes</Label>
                  <Textarea id="outcomes" name="outcomes" rows={3} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resources">Resources (JSON or comma-separated)</Label>
                  <Textarea id="resources" name="resources" rows={2} placeholder='e.g. [{"title":"Worksheet","url":"https://..."}, ...]' />
                </div>
                <div>
                  <Label htmlFor="homework">Homework</Label>
                  <Textarea id="homework" name="homework" rows={2} />
                </div>
              </div>

              {/* Extended fields */}
              {[
                ["specialist_subject_knowledge_required", "Specialist Subject Knowledge Required"],
                ["knowledge_revisited", "Knowledge Revisited"],
                ["subject_pedagogies", "Subject Pedagogies"],
                ["literacy_opportunities", "Literacy Opportunities"],
                ["numeracy_opportunities", "Numeracy Opportunities"],
                ["health_and_safety_considerations", "Health and Safety Considerations"],
                ["timing", "Timing"],
                ["teaching", "Teaching"],
                ["learning", "Learning"],
                ["assessing", "Assessing"],
                ["adapting", "Adapting"],
                ["evaluation", "Evaluation"],
              ].map(([id, label]) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Textarea id={id} name={id} rows={2} />
                </div>
              ))}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
