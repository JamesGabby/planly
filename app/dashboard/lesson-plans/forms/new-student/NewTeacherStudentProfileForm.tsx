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
import { Loader2 } from "lucide-react";

const supabase = createClient();

const YEAR_GROUPS = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
];

export default function NewTeacherStudentProfileForm() {
  const router = useRouter();

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    class_name: "",
    year_group: "",
    goals: "",
    interests: "",
    learning_preferences: "",
    strengths: "",
    weaknesses: "",
    special_educational_needs: "",
    notes: "",
  });

  const [customClass, setCustomClass] = useState("");
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

  useEffect(() => {
    async function fetchClasses() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("No authenticated user");
        }

        const { data, error } = await supabase
          .from("teacher_classes")
          .select("class_name")
          .eq("user_id", user.id)
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
    if (!student.year_group) errors.year_group = "Year group is required.";
    if (!student.class_name.trim() || student.class_name === "_custom")
      errors.level = "Class is required.";
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

      // CAPITALIZATION HELPER FUNCTIONS
      const capitalizeProperName = (str: string | undefined | null): string => {
        if (!str) return "";
        return str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      };

      const capitalizeMultilineText = (str: string | undefined | null): string => {
        if (!str) return "";
        return str
          .replace(/^([a-z])/gm, (match, firstChar) => {
            return firstChar.toUpperCase();
          })
          .replace(/(\.\s+)([a-z])/g, (match, punctuation, firstChar) => {
            return punctuation + firstChar.toUpperCase();
          });
      };

      // Format the student data with proper capitalization
      const formattedStudent = {
        ...student,
        first_name: capitalizeProperName(student.first_name),
        last_name: capitalizeProperName(student.last_name),
        class_name: student.class_name?.toUpperCase(),
        year_group: student.year_group,
        goals: capitalizeMultilineText(student.goals),
        interests: capitalizeMultilineText(student.interests),
        learning_preferences: capitalizeMultilineText(student.learning_preferences),
        strengths: capitalizeMultilineText(student.strengths),
        weaknesses: capitalizeMultilineText(student.weaknesses),
        special_educational_needs: capitalizeMultilineText(student.special_educational_needs),
        notes: capitalizeMultilineText(student.notes),
      };

      // Insert student
      const { data: newStudent, error: insertError } = await supabase
        .from("teacher_student_profiles")
        .insert([
          {
            ...formattedStudent,
            created_by: user.id,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select("student_id")
        .single();

      if (insertError) throw insertError;

      // Use the formatted class_name for class operations
      const finalClassName = formattedStudent.class_name;

      // 1. Check if class already exists
      let { data: classRow } = await supabase
        .from("teacher_classes")
        .select("class_id")
        .eq("class_name", finalClassName)
        .maybeSingle();

      // 2. If class doesn't exist, create it
      if (!classRow) {
        const { data: newClass, error: insertClassError } = await supabase
          .from("teacher_classes")
          .insert([
            {
              class_name: finalClassName,
              user_id: user.id,
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select("class_id")
          .single();

        if (insertClassError) throw insertClassError;

        classRow = newClass;
      }

      // Link class + student
      const { error: linkError } = await supabase.from("teacher_class_students").insert([
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
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            New Student Profile
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl">
            Create a detailed profile to personalise learning and track student progress.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Student Information
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
                  <p className="text-destructive text-xs sm:text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Basic Information Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <Label
                      className={`text-sm ${formErrors.first_name ? "text-destructive" : ""}`}
                    >
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={student.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      placeholder="e.g., Sarah"
                      className={`mt-1 ${formErrors.first_name ? "border-destructive" : ""}`}
                    />
                    {formErrors.first_name && (
                      <p className="text-destructive text-xs mt-1">{formErrors.first_name}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label
                      className={`text-sm ${formErrors.last_name ? "text-destructive" : ""}`}
                    >
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={student.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      placeholder="e.g., Johnson"
                      className={`mt-1 ${formErrors.last_name ? "border-destructive" : ""}`}
                    />
                    {formErrors.last_name && (
                      <p className="text-destructive text-xs mt-1">{formErrors.last_name}</p>
                    )}
                  </div>

                  {/* Year Group Dropdown */}
                  <div>
                    <Label
                      className={`text-sm ${formErrors.year_group ? "text-destructive" : ""}`}
                    >
                      Year Group <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={student.year_group}
                      onValueChange={(value) => updateField("year_group", value)}
                    >
                      <SelectTrigger
                        className={`mt-1 w-full ${formErrors.year_group ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEAR_GROUPS.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.year_group && (
                      <p className="text-destructive text-xs mt-1">{formErrors.year_group}</p>
                    )}
                  </div>

                  {/* Class Dropdown */}
                  <div>
                    <Label className={`text-sm ${formErrors.level ? "text-destructive" : ""}`}>
                      Class <span className="text-destructive">*</span>
                    </Label>

                    <Select
                      value={
                        student.class_name && classes.includes(student.class_name)
                          ? student.class_name
                          : student.class_name && !classes.includes(student.class_name)
                            ? "other"
                            : ""
                      }
                      onValueChange={(value) => {
                        if (value === "other") {
                          updateField("class_name", "_custom");
                          setCustomClass("");
                        } else {
                          updateField("class_name", value);
                          setCustomClass("");
                        }
                      }}
                      disabled={loadingClasses}
                    >
                      <SelectTrigger
                        className={`mt-1 w-full ${formErrors.level ? "border-destructive" : ""}`}
                      >
                        <SelectValue
                          placeholder={loadingClasses ? "Loading classes..." : "Select a class"}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {classes
                          .filter((name) => name.trim() !== "")
                          .map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        <SelectItem value="other">+ Add New Class</SelectItem>
                      </SelectContent>
                    </Select>

                    {formErrors.level && (
                      <p className="text-destructive text-xs mt-1">{formErrors.level}</p>
                    )}

                    {/* Custom Class Input */}
                    {student.class_name === "_custom" ||
                    (student.class_name &&
                      !classes.includes(student.class_name) &&
                      student.class_name !== "") ? (
                      <div className="mt-2">
                        <Input
                          value={customClass}
                          onChange={(e) => {
                            setCustomClass(e.target.value);
                            updateField("class_name", e.target.value);
                          }}
                          placeholder="Enter new class name (e.g., 7S)"
                          autoFocus
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>

              <Separator />

              {/* Special Educational Needs Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">
                    Special Educational Needs (SEN)
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Document any special educational needs, accommodations, or support requirements.
                </p>

                <Textarea
                  value={student.special_educational_needs || ""}
                  onChange={(e) => updateField("special_educational_needs", e.target.value)}
                  placeholder="e.g., Dyslexia - requires extra time for reading tasks, prefers audio instructions..."
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              <Separator />

              {/* Learning Profile Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Learning Profile</h3>
                </div>

                <div className="space-y-6">
                  {/* Goals */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Learning Goals</Label>
                    <p className="text-xs text-muted-foreground">
                      What does the student want to achieve?
                    </p>
                    <Textarea
                      value={student.goals || ""}
                      onChange={(e) => updateField("goals", e.target.value)}
                      placeholder="e.g., Improve essay writing skills, prepare for GCSE exams, build confidence in public speaking..."
                      className="min-h-[100px] text-xs sm:text-sm"
                    />
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Interests & Hobbies</Label>
                    <p className="text-xs text-muted-foreground">
                      Use these to make lessons more engaging and relevant.
                    </p>
                    <Textarea
                      value={student.interests || ""}
                      onChange={(e) => updateField("interests", e.target.value)}
                      placeholder="e.g., Football, gaming, reading fantasy novels, music production..."
                      className="min-h-[100px] text-xs sm:text-sm"
                    />
                  </div>

                  {/* Learning Preferences */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Learning Preferences</Label>
                    <p className="text-xs text-muted-foreground">
                      How does the student learn best?
                    </p>
                    <Textarea
                      value={student.learning_preferences || ""}
                      onChange={(e) => updateField("learning_preferences", e.target.value)}
                      placeholder="e.g., Visual learner - responds well to diagrams and videos, prefers hands-on activities, needs frequent breaks..."
                      className="min-h-[100px] text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Strengths & Areas for Development Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">
                    Strengths & Development Areas
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Strengths</Label>
                    <p className="text-xs text-muted-foreground">
                      What does the student excel at?
                    </p>
                    <Textarea
                      value={student.strengths || ""}
                      onChange={(e) => updateField("strengths", e.target.value)}
                      placeholder="e.g., Strong verbal communication, excellent memory for facts, creative thinking, good problem solver..."
                      className="min-h-[120px] text-xs sm:text-sm"
                    />
                  </div>

                  {/* Areas for Development */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Areas for Development</Label>
                    <p className="text-xs text-muted-foreground">
                      What skills need more practice?
                    </p>
                    <Textarea
                      value={student.weaknesses || ""}
                      onChange={(e) => updateField("weaknesses", e.target.value)}
                      placeholder="e.g., Struggles with time management, needs work on written expression, difficulty staying focused..."
                      className="min-h-[120px] text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Additional Notes Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Additional Notes</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Any other important information about the student.
                </p>

                <Textarea
                  value={student.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="e.g., Parent preferences, behavioral considerations, medication schedules, preferred communication methods..."
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/student-profiles")}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto order-1 sm:order-2"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Create Student Profile"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}