"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient();

export default function NewTutorStudentProfileForm() {
  const router = useRouter();

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    level: "",
    goals: "",
    interests: "",
    learning_preferences: "",
    strengths: "",
    weaknesses: "",
    sen: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

  function updateField(field: keyof typeof student, value: string) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!student.first_name.trim()) errors.first_name = "First name is required.";
    if (!student.last_name.trim()) errors.last_name = "Last name is required.";
    if (!student.level.trim()) errors.level = "Level is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!validateForm()) {
      setSaving(false);
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to create a student profile.");

      const { error: insertError } = await supabase.from("student_profiles").insert([
        {
          ...student,
          created_by: user.id,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      toast.success("Student profile created successfully!");
      router.push("/dashboard/student-profiles");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Failed to create student profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-6 md:p-10 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Student Profile</h1>
          <p className="text-muted-foreground text-sm">
            Add a new student and their learning details.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-xl font-semibold">Student Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={formErrors.first_name ? "text-destructive" : ""}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={student.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    placeholder="First Name"
                  />
                  {formErrors.first_name && (
                    <p className="text-destructive text-xs mt-1">{formErrors.first_name}</p>
                  )}
                </div>
                <div>
                  <Label className={formErrors.last_name ? "text-destructive" : ""}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={student.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    placeholder="Last Name"
                  />
                  {formErrors.last_name && (
                    <p className="text-destructive text-xs mt-1">{formErrors.last_name}</p>
                  )}
                </div>
                <div>
                  <Label className={formErrors.level ? "text-destructive" : ""}>
                    Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={student.level}
                    onValueChange={(value) => updateField("level", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1</SelectItem>
                      <SelectItem value="A2">A2</SelectItem>
                      <SelectItem value="B1">B1</SelectItem>
                      <SelectItem value="B2">B2</SelectItem>
                      <SelectItem value="C1">C1</SelectItem>
                      <SelectItem value="C2">C2</SelectItem>
                      <SelectItem value="Uknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.level && (
                    <p className="text-destructive text-xs mt-1">{formErrors.level}</p>
                  )}
                </div>
              </div>

              <Separator />

              {[
                { label: "Special Educational Needs", key: "sen" },
                { label: "Goals", key: "goals" },
                { label: "Interests", key: "interests" },
                { label: "Learning Preferences", key: "learning_preferences" },
                { label: "Strengths", key: "strengths" },
                { label: "Weaknesses", key: "weaknesses" },
                { label: "Notes", key: "notes" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Textarea
                    value={student[key as keyof typeof student] || ""}
                    onChange={(e) => updateField(key as keyof typeof student, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="min-h-[100px]"
                  />
                </div>
              ))}

              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Student Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
