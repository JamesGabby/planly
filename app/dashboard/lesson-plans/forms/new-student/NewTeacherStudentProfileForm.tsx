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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Class } from "../../types/class";

const supabase = createClient();

export default function NewTeacherStudentProfileForm() {
  const router = useRouter();

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    class_name: "",
    goals: "",
    interests: "",
    learning_preferences: "",
    strengths: "",
    weaknesses: "",
    special_educational_needs: "",
    notes: "",
  });

  const [customClass, setCustomClass] = useState(""); // NEW
  const [classes, setClasses] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

  // Fetch class list
  useEffect(() => {
    async function fetchClasses() {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("class_name")
          .order("class_name", { ascending: true });

        if (error) throw error;
        setClasses(data?.map((c) => c.class_name) || []);
      } catch (err) {
        console.error("Error loading classes:", err);
        toast.error("Failed to load class list.");
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, []);

  function updateField(field: keyof typeof student, value: string) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!student.first_name.trim()) errors.first_name = "First name is required.";
    if (!student.last_name.trim()) errors.last_name = "Last name is required.";
    if (!student.class_name.trim()) errors.level = "Class is required.";
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to create a student profile.");

      // Insert student
      const { data: newStudent, error: insertError } = await supabase
        .from("teacher_student_profiles")
        .insert([
          {
            ...student,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select("student_id")
        .single();

      if (insertError) throw insertError;

      // 1. Check if class already exists
      let { data: classRow, error: classLookupError } = await supabase
        .from("classes")
        .select("class_id")
        .eq("class_name", student.class_name)
        .maybeSingle(); // IMPORTANT: allows 0 rows without throwing

      if (classLookupError) throw classLookupError;

      // 2. If class doesn't exist, create it
      if (!classRow) {
        const { data: newClass, error: insertClassError } = await supabase
          .from("classes")
          .insert([{ class_name: student.class_name }])
          .select("class_id")
          .single();

        if (insertClassError) throw insertClassError;

        classRow = newClass; // now we have class_id
      }

      // Link class + student
      const { error: linkError } = await supabase
        .from("class_students")
        .insert([
          {
            class_id: classRow.class_id,
            student_id: newStudent.student_id,
          },
        ]);

      if (linkError) throw linkError;

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
                {/* First Name */}
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
                    <p className="text-destructive text-xs mt-1">
                      {formErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
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
                    <p className="text-destructive text-xs mt-1">
                      {formErrors.last_name}
                    </p>
                  )}
                </div>

                {/* Class Dropdown */}
                <div>
                  <Label className={formErrors.level ? "text-destructive" : ""}>
                    Class <span className="text-destructive">*</span>
                  </Label>

                  <Select
                    value={
                      classes.includes(student.class_name)
                        ? student.class_name
                        : "other"
                    }
                    onValueChange={(value) => {
                      if (value === "other") {
                        updateField("class_name", "");
                        setCustomClass("");
                      } else {
                        updateField("class_name", value);
                        setCustomClass("");
                      }
                    }}
                    disabled={loadingClasses}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingClasses ? "Loading classes..." : "Select a class"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {formErrors.level && (
                    <p className="text-destructive text-xs mt-1">{formErrors.level}</p>
                  )}

                  {/* Custom Class Input */}
                  {!classes.includes(student.class_name) && (
                    <div className="mt-2">
                      <Label>Custom Class Name</Label>
                      <Input
                        value={customClass}
                        onChange={(e) => {
                          setCustomClass(e.target.value);
                          updateField("class_name", e.target.value);
                        }}
                        placeholder="Enter custom class name"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Textarea fields */}
              {[
                { label: "Goals", key: "goals" },
                { label: "Interests", key: "interests" },
                { label: "Learning Preferences", key: "learning_preferences" },
                { label: "Strengths", key: "strengths" },
                { label: "Weaknesses", key: "weaknesses" },
                { label: "Special Educational Needs", key: "special_educational_needs" },
                { label: "Notes", key: "notes" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Textarea
                    value={student[key as keyof typeof student] || ""}
                    onChange={(e) =>
                      updateField(key as keyof typeof student, e.target.value)
                    }
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
