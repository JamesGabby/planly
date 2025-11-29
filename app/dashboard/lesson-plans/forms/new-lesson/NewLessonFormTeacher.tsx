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
import { LessonPlanTeacher, Resource } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { LessonStage } from "@/components/lesson-structure-editor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Loader2, Sparkles } from "lucide-react";

const supabase = createClient();

export default function NewLessonFormTeacher() {
  const router = useRouter();

  const [lesson, setLesson] = useState<Partial<LessonPlanTeacher>>({
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
    exam_board: "",
    subject: "",
    year_group: "",
    specialist_subject_knowledge_required: "",
    knowledge_revisited: "",
    numeracy_opportunities: "",
    literacy_opportunities: "",
    subject_pedagogies: "",
    health_and_safety_considerations: "",
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
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // New state for classes dropdown
  const [classes, setClasses] = useState<{ class_id: string; class_name: string }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [showCustomClassInput, setShowCustomClassInput] = useState(false);
  const [customClassName, setCustomClassName] = useState("");

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    try {
      setLoadingClasses(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      const { data, error } = await supabase
        .from("classes")
        .select("class_id, class_name")
        .eq("user_id", user.id)
        .order("class_name", { ascending: true });

      if (error) throw error;

      setClasses(data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      toast.error("Failed to load classes");
    } finally {
      setLoadingClasses(false);
    }
  }

  // Handle class selection from dropdown
  function handleClassChange(value: string) {
    if (value === "other") {
      setShowCustomClassInput(true);
      updateField("class", "");
      setCustomClassName("");
    } else {
      setShowCustomClassInput(false);
      setCustomClassName("");
      updateField("class", value);
    }
  }

  // Handle custom class input
  function handleCustomClassInput(value: string) {
    setCustomClassName(value);
    updateField("class", value);
  }

  useEffect(() => {
    if (error || Object.keys(formErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, formErrors]);

  const year = parseInt(lesson.year_group?.replace("Year ", "") || "0");
  const isGCSE = year >= 10 && year <= 11;
  const isAlevel = year >= 12 && year <= 13;
  const showExamBoard = isGCSE || isAlevel;

  const boardOptions = [
    ...(isGCSE || isAlevel ? ["AQA", "OCR", "Edexcel", "WJEC", "Eduqas"] : []),
    ...(isAlevel ? ["Cambridge", "IB"] : []),
    "Other"
  ];

  const updateField = <K extends keyof LessonPlanTeacher>(
    key: K,
    value: LessonPlanTeacher[K]
  ) => {
    setLesson((prev) => ({ ...prev, [key]: value }));
  };

  function updateStage(index: number, field: keyof LessonStage, value: string) {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  }

  function clearStage(index: number) {
    setStages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        duration: "",
        teaching: "",
        learning: "",
        assessing: "",
        adapting: "",
      };
      return updated;
    });
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

  function removeStage(index: number) {
    setStages((prev) => {
      if (["Starter", "Plenary"].includes(prev[index].stage)) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function validateBasicFields() {
    const errors: { [key: string]: string } = {};
    if (!lesson.class?.trim()) errors.class = "Class is required.";
    if (!lesson.year_group?.trim()) errors.year_group = "Year group is required.";
    if (!lesson.topic?.trim()) errors.topic = "Topic is required.";
    if (!lesson.subject?.trim()) errors.subject = "Subject is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};

    const isEmptyString = (value: string | null | undefined): boolean => {
      return !value || (typeof value === 'string' && !value.trim());
    };

    if (isEmptyString(lesson.class)) errors.class = "Class is required.";
    if (isEmptyString(lesson.year_group)) errors.year_group = "Year group is required.";
    if (isEmptyString(lesson.date_of_lesson)) errors.date_of_lesson = "Date is required.";
    if (isEmptyString(lesson.time_of_lesson)) errors.time_of_lesson = "Time is required.";
    if (isEmptyString(lesson.topic)) errors.topic = "Topic is required.";
    if (isEmptyString(lesson.subject)) errors.subject = "Subject is required.";
    if (isEmptyString(lesson.objectives)) errors.objectives = "Objectives are required.";

    const yearNum = parseInt(lesson.year_group?.replace("Year ", "") || "0");
    const isGCSE = yearNum >= 10 && yearNum <= 11;
    const isAlevel = yearNum >= 12 && yearNum <= 13;
    const showExamBoard = isGCSE || isAlevel;

    if (showExamBoard && isEmptyString(lesson.exam_board)) {
      errors.exam_board = "Exam board is required for this year group.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function generateLessonPlan() {
    if (!validateBasicFields()) {
      toast.error("Please fill in Class, Year Group, Subject, and Topic before generating.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: "detailed",
          topic: lesson.topic,
          subject: lesson.subject,
          year_group: lesson.year_group,
          class: lesson.class,
          exam_board: lesson.exam_board === "Other" ? lesson.custom_exam_board : lesson.exam_board,
          objectives: lesson.objectives,
          outcomes: lesson.outcomes,
          specialist_subject_knowledge_required: lesson.specialist_subject_knowledge_required,
          knowledge_revisited: lesson.knowledge_revisited,
          numeracy_opportunities: lesson.numeracy_opportunities,
          literacy_opportunities: lesson.literacy_opportunities,
          subject_pedagogies: lesson.subject_pedagogies,
          health_and_safety_considerations: lesson.health_and_safety_considerations,
          duration: "60 minutes",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate lesson plan");
      }

      const generatedPlan = await response.json();

      type BulletPointObject = {
        text?: string;
        content?: string;
        value?: string;
        description?: string;
        [key: string]: unknown;
      };

      type BulletPointData =
        | string
        | number
        | boolean
        | null
        | undefined
        | BulletPointObject
        | BulletPointData[];

      const formatAsBulletPoints = (data: BulletPointData): string => {
        if (!data) return "";

        if (Array.isArray(data)) {
          return data.map(item => {
            if (typeof item === 'object' && item !== null) {
              const obj = item as BulletPointObject;
              return `• ${obj.text || obj.content || obj.value || obj.description || JSON.stringify(item)}`;
            }
            return `• ${item}`;
          }).join('\n');
        }

        if (typeof data === 'object' && data !== null) {
          const obj = data as BulletPointObject;
          const text = obj.text || obj.content || obj.value || obj.description;
          if (text) {
            return Array.isArray(text) ? formatAsBulletPoints(text) : `• ${text}`;
          }
          console.warn('Unexpected object structure:', data);
          return `• ${JSON.stringify(data)}`;
        }

        if (typeof data === 'string') {
          if (data.trim() && !data.startsWith('•')) {
            if (!data.includes('\n')) {
              return `• ${data}`;
            }
            return data.split('\n').map(line => line.trim()).filter(line => line).map(line => `• ${line}`).join('\n');
          }
          return data;
        }

        return `• ${String(data)}`;
      };

      updateField("objectives", formatAsBulletPoints(generatedPlan.objectives) || lesson.objectives || "");
      updateField("outcomes", formatAsBulletPoints(generatedPlan.outcomes) || lesson.outcomes || "");
      updateField("homework", formatAsBulletPoints(generatedPlan.homework) || "");
      updateField("evaluation", formatAsBulletPoints(generatedPlan.evaluation) || "");
      updateField("notes", formatAsBulletPoints(generatedPlan.notes) || "");

      updateField("specialist_subject_knowledge_required",
        formatAsBulletPoints(generatedPlan.specialist_subject_knowledge_required) || ""
      );
      updateField("knowledge_revisited",
        formatAsBulletPoints(generatedPlan.knowledge_revisited) || ""
      );
      updateField("numeracy_opportunities",
        formatAsBulletPoints(generatedPlan.numeracy_opportunities) || ""
      );
      updateField("literacy_opportunities",
        formatAsBulletPoints(generatedPlan.literacy_opportunities) || ""
      );
      updateField("subject_pedagogies",
        formatAsBulletPoints(generatedPlan.subject_pedagogies) || ""
      );
      updateField("health_and_safety_considerations",
        formatAsBulletPoints(generatedPlan.health_and_safety_considerations) || ""
      );

      if (generatedPlan.resources && Array.isArray(generatedPlan.resources)) {
        updateField("resources", generatedPlan.resources);
      }

      if (generatedPlan.lesson_structure && Array.isArray(generatedPlan.lesson_structure)) {
        setStages(generatedPlan.lesson_structure);
      }

      toast.success("✨ Lesson plan generated successfully! Review and edit as needed.");

      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }, 500);

    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate lesson plan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  }

  async function insertClass(className: string, userId: string) {
    try {
      // Check if class already exists
      const { data: existingClass } = await supabase
        .from("classes")
        .select("*")
        .eq("class_name", className)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingClass) {
        return existingClass;
      }

      // Insert new class
      const { data, error } = await supabase
        .from("classes")
        .insert([
          {
            class_name: className,
            created_by: userId,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select("*")
        .single();

      if (error) throw error;

      // Refresh classes list
      await fetchClasses();

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown class insert error");
      throw err;
    }
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
      if (!user) throw new Error("You must be logged in to create a lesson plan.");

      if (!lesson.class) {
        throw new Error("Class name is missing.");
      }

      await insertClass(lesson.class, user.id);

      // CAPITALIZATION HELPER FUNCTIONS
      const capitalizeFirstLetter = (str: string | undefined | null): string => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      const toProperTitleCase = (str: string | undefined | null): string => {
        if (!str) return "";

        // Words that should remain lowercase unless they're the first or last word
        const minorWords = new Set([
          'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'at', 'by', 'for', 'from',
          'in', 'into', 'of', 'on', 'onto', 'to', 'with', 'as', 'up', 'yet', 'so'
        ]);

        return str.replace(/\w\S*/g, (word, index, array) => {
          const lowerWord = word.toLowerCase();
          const isFirstWord = index === 0;
          const isLastWord = index + word.length === str.length;

          // Always capitalize first and last words, or if not a minor word
          if (isFirstWord || isLastWord || !minorWords.has(lowerWord)) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }

          // Keep minor words lowercase
          return lowerWord;
        });
      };

      const capitalizeText = (str: string | undefined | null): string => {
        if (!str) return "";
        // For longer text fields, capitalize first letter while preserving bullet points and formatting
        return str.replace(/^(\s*[•\-*]?\s*)([a-z])/, (match, prefix, firstChar) => {
          return prefix + firstChar.toUpperCase();
        });
      };

      const capitalizeMultilineText = (str: string | undefined | null): string => {
        if (!str) return "";
        // Capitalize first letter of each line that starts with bullet points
        return str.replace(/^(\s*[•\-*]?\s*)([a-z])/gm, (match, prefix, firstChar) => {
          return prefix + firstChar.toUpperCase();
        });
      };

      // Format resources with capitalized titles
      const formattedResources =
        Array.isArray(lesson.resources)
          ? lesson.resources.map((res: Resource) => ({
            title: capitalizeFirstLetter(res.title || res.url || ""),
            url: res.url?.trim() || "",
          }))
          : [];

      // Format lesson structure with capitalized content
      const formattedStages = stages.map(stage => ({
        ...stage,
        stage: capitalizeFirstLetter(stage.stage),
        teaching: capitalizeText(stage.teaching),
        learning: capitalizeText(stage.learning),
        assessing: capitalizeText(stage.assessing),
        adapting: capitalizeText(stage.adapting),
      }));

      const finalExamBoard = showExamBoard
        ? (lesson.exam_board === "Other"
          ? capitalizeFirstLetter(lesson.custom_exam_board?.trim()) || "Other (unspecified)"
          : lesson.exam_board)
        : null;

      const { error: insertError } = await supabase
        .from("lesson_plans")
        .insert([
          {
            ...lesson,
            // Basic fields - capitalize first letter
            class: lesson.class?.toUpperCase(), // Class codes are typically uppercase (e.g., "7S")
            subject: capitalizeFirstLetter(lesson.subject),
            topic: toProperTitleCase(lesson.topic), // Proper English title case
            custom_exam_board: capitalizeFirstLetter(lesson.custom_exam_board),

            // Longer text fields - capitalize appropriately while preserving formatting
            objectives: capitalizeMultilineText(lesson.objectives),
            outcomes: capitalizeMultilineText(lesson.outcomes),
            homework: capitalizeMultilineText(lesson.homework),
            evaluation: capitalizeMultilineText(lesson.evaluation),
            notes: capitalizeMultilineText(lesson.notes),
            specialist_subject_knowledge_required: capitalizeMultilineText(lesson.specialist_subject_knowledge_required),
            knowledge_revisited: capitalizeMultilineText(lesson.knowledge_revisited),
            numeracy_opportunities: capitalizeMultilineText(lesson.numeracy_opportunities),
            literacy_opportunities: capitalizeMultilineText(lesson.literacy_opportunities),
            subject_pedagogies: capitalizeMultilineText(lesson.subject_pedagogies),
            health_and_safety_considerations: capitalizeMultilineText(lesson.health_and_safety_considerations),

            // Other fields
            user_id: user.id,
            resources: formattedResources,
            lesson_structure: formattedStages,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            exam_board: finalExamBoard,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Lesson plan created successfully!");
      router.push("/dashboard/lesson-plans");

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Lesson plan creation failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            New Lesson Plan
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl">
            Create a comprehensive lesson plan with pedagogical details, or let AI help you generate one.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/60 pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">Lesson Details</CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
                  <p className="text-destructive text-xs sm:text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Basic Info Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className={`text-sm ${formErrors.class ? "text-destructive" : ""}`}>
                      Class <span className="text-destructive">*</span>
                    </Label>

                    <Select
                      value={showCustomClassInput ? "other" : (lesson.class || "")}
                      onValueChange={handleClassChange}
                      disabled={loadingClasses}
                    >
                      <SelectTrigger className={`mt-1 w-full ${formErrors.class ? "border-destructive" : ""}`}>
                        <SelectValue placeholder={loadingClasses ? "Loading classes..." : "Select class..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.class_id} value={cls.class_name}>
                            {cls.class_name}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">+ Add New Class</SelectItem>
                      </SelectContent>
                    </Select>

                    {showCustomClassInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          value={customClassName}
                          onChange={(e) => handleCustomClassInput(e.target.value)}
                          placeholder="Enter new class name (e.g., 7S)"
                          className="mt-2"
                          autoFocus
                        />
                      </motion.div>
                    )}

                    {formErrors.class && (
                      <p className="text-destructive text-xs mt-1">{formErrors.class}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`text-sm ${formErrors.year_group ? "text-destructive" : ""}`}>
                      Year Group <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={lesson.year_group || ""}
                      onValueChange={(value) => updateField("year_group", value)}
                    >
                      <SelectTrigger className={`mt-1 w-full ${formErrors.year_group ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select year..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }).map((_, i) => (
                          <SelectItem key={i} value={`Year ${i + 1}`}>
                            Year {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.year_group && (
                      <p className="text-destructive text-xs mt-1">{formErrors.year_group}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <Label className={`text-sm ${formErrors.subject ? "text-destructive" : ""}`}>
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={lesson.subject || ""}
                      onChange={(e) => updateField("subject", e.target.value)}
                      placeholder="e.g., Maths, English, Science..."
                      className={`mt-1 ${formErrors.subject ? "border-destructive" : ""}`}
                    />
                    {formErrors.subject && (
                      <p className="text-destructive text-xs mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`text-sm ${formErrors.date_of_lesson ? "text-destructive" : ""}`}>
                      Date of Lesson <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={lesson.date_of_lesson || ""}
                      onChange={(e) => updateField("date_of_lesson", e.target.value)}
                      className={`mt-1 ${formErrors.date_of_lesson ? "border-destructive" : ""}`}
                    />
                    {formErrors.date_of_lesson && (
                      <p className="text-destructive text-xs mt-1">{formErrors.date_of_lesson}</p>
                    )}
                  </div>

                  <div>
                    <Label className={`text-sm ${formErrors.time_of_lesson ? "text-destructive" : ""}`}>
                      Time of Lesson <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="time"
                      value={lesson.time_of_lesson || ""}
                      onFocus={() => {
                        if (!lesson.time_of_lesson) {
                          const now = new Date();
                          const hours = String(now.getHours()).padStart(2, "0");
                          const defaultTime = `${hours}:00`;
                          updateField("time_of_lesson", defaultTime);
                        }
                      }}
                      onChange={(e) => updateField("time_of_lesson", e.target.value)}
                      className={`mt-1 ${formErrors.time_of_lesson ? "border-destructive" : ""}`}
                    />
                    {formErrors.time_of_lesson && (
                      <p className="text-destructive text-xs mt-1">{formErrors.time_of_lesson}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <Label className={`text-sm ${formErrors.topic ? "text-destructive" : ""}`}>
                      Topic <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={lesson.topic || ""}
                      onChange={(e) => updateField("topic", e.target.value)}
                      placeholder="e.g., Quadratic Equations, Shakespeare's Macbeth..."
                      className={`mt-1 ${formErrors.topic ? "border-destructive" : ""}`}
                    />
                    {formErrors.topic && (
                      <p className="text-destructive text-xs mt-1">{formErrors.topic}</p>
                    )}
                  </div>

                  {showExamBoard && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="col-span-1 sm:col-span-2 lg:col-span-3"
                    >
                      <Label className={`text-sm ${formErrors.exam_board ? "text-destructive" : ""}`}>
                        Exam Board <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={lesson.exam_board || ""}
                        onValueChange={(value) => updateField("exam_board", value)}
                      >
                        <SelectTrigger className={`mt-1 w-full ${formErrors.exam_board ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Select exam board..." />
                        </SelectTrigger>
                        <SelectContent>
                          {boardOptions.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.exam_board && (
                        <p className="text-destructive text-xs mt-1">{formErrors.exam_board}</p>
                      )}

                      {lesson.exam_board === "Other" && (
                        <Input
                          className="mt-2"
                          placeholder="Enter exam board..."
                          value={lesson.custom_exam_board || ""}
                          onChange={(e) => updateField("custom_exam_board", e.target.value)}
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              </section>

              {/* AI GENERATE BUTTON */}
              <div className="flex justify-center py-4">
                <Button
                  type="button"
                  onClick={generateLessonPlan}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto text-sm sm:text-base"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                      Generating Lesson Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                      Generate Lesson Plan with AI
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Objectives & Outcomes Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Learning Goals</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Objectives */}
                  <div className="space-y-2">
                    <div className={`flex items-center gap-1 ${formErrors.objectives ? "text-destructive" : ""}`}>
                      <Label className="text-sm">Objectives<span className="text-destructive ml-1">*</span></Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="focus:outline-none"
                            >
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            What students will learn <i>during</i> instruction.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.objectives || ""}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("• ")) {
                          value = "• " + value.replace(/^\s+/, "");
                        }
                        updateField("objectives", value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        const target = e.target as HTMLTextAreaElement;
                        const { selectionStart, selectionEnd, value } = target;

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart) +
                            "\n• " +
                            value.substring(selectionEnd);
                          updateField("objectives", newValue);
                        }
                      }}
                      placeholder="What you intend to teach or what students will learn during instruction"
                      className={`min-h-[120px] text-sm ${formErrors.objectives ? "border-destructive" : ""}`}
                    />
                    {formErrors.objectives && (
                      <p className="text-destructive text-xs mt-1">{formErrors.objectives}</p>
                    )}
                  </div>

                  {/* Outcomes */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Outcomes</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="focus:outline-none"
                            >
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            What students can do <i>independently</i> after learning.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.outcomes || ""}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("• ")) {
                          value = "• " + value.replace(/^\s+/, "");
                        }
                        updateField("outcomes", value);
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        const target = e.target as HTMLTextAreaElement;
                        const { selectionStart, selectionEnd, value } = target;

                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart) +
                            "\n• " +
                            value.substring(selectionEnd);
                          updateField("outcomes", newValue);
                          setTimeout(() => {
                            target.selectionStart = target.selectionEnd = selectionStart + 3;
                          }, 0);
                        }

                        if (
                          e.key === "Backspace" &&
                          selectionStart >= 2 &&
                          value.substring(selectionStart - 2, selectionStart) === "• "
                        ) {
                          e.preventDefault();
                          const newValue =
                            value.substring(0, selectionStart - 2) +
                            value.substring(selectionEnd);
                          updateField("outcomes", newValue);
                        }
                      }}
                      placeholder="What the students will be able to do independently after learning takes place"
                      className="min-h-[120px] text-sm"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Pedagogical Fields */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Pedagogical Details</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Teaching considerations and subject-specific information
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Specialist Subject Knowledge</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            What you must know in advance.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.specialist_subject_knowledge_required || ""}
                      onChange={(e) =>
                        updateField("specialist_subject_knowledge_required", e.target.value)
                      }
                      placeholder="Key concepts, theories, or skills you need to understand before teaching this lesson..."
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Knowledge Revisited</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            Prior learning being built upon.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.knowledge_revisited || ""}
                      onChange={(e) => updateField("knowledge_revisited", e.target.value)}
                      placeholder="What have students learned previously that connects to this lesson?"
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Numeracy Opportunities</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            Embedded maths skills in lesson
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.numeracy_opportunities || ""}
                      onChange={(e) => updateField("numeracy_opportunities", e.target.value)}
                      placeholder="How will students use mathematical thinking, calculations, or data analysis?"
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Literacy Opportunities</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            Embedded reading/writing/speaking
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.literacy_opportunities || ""}
                      onChange={(e) => updateField("literacy_opportunities", e.target.value)}
                      placeholder="How will students develop reading, writing, or communication skills?"
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Subject Pedagogies</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            How subject-specific methods are applied
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.subject_pedagogies || ""}
                      onChange={(e) => updateField("subject_pedagogies", e.target.value)}
                      placeholder="What teaching methods are specific to this subject? (e.g., scientific inquiry, historical analysis)"
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Health & Safety Considerations</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            Hazards + safety controls
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={lesson.health_and_safety_considerations || ""}
                      onChange={(e) =>
                        updateField("health_and_safety_considerations", e.target.value)
                      }
                      placeholder="Any safety considerations for activities, equipment, or classroom management?"
                      className="min-h-[100px] text-sm"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Lesson Structure */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-base sm:text-lg font-semibold">Lesson Structure</h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground -mt-2 mb-4">
                  Define each stage of your lesson, including timing and learning strategies.
                </p>

                <div className="space-y-4">
                  {stages.map((stage, i) => (
                    <div
                      key={i}
                      className="border border-border/60 rounded-xl bg-background/70 shadow-sm transition-all hover:shadow-md overflow-hidden"
                    >
                      {/* Stage Header */}
                      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/50 bg-muted/30">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h4 className="font-semibold text-base sm:text-lg">{stage.stage}</h4>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Label htmlFor={`duration-${i}`} className="text-xs sm:text-sm text-muted-foreground">
                                Duration:
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      tabIndex={0}
                                      className="focus:outline-none"
                                    >
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-sm">
                                    How long will each activity last?
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Input
                                id={`duration-${i}`}
                                value={stage.duration}
                                onChange={(e) => updateStage(i, "duration", e.target.value)}
                                placeholder="10 min"
                                className="w-20 sm:w-24 h-7 sm:h-8 text-xs sm:text-sm"
                              />
                            </div>
                          </div>

                          {["Starter", "Plenary"].includes(stage.stage) ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => clearStage(i)}
                              className="text-xs sm:text-sm"
                            >
                              Clear
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                              onClick={() => removeStage(i)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Stage Content */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {[
                            {
                              field: "teaching",
                              label: "Teaching",
                              tooltip: "Explain how you are planning/organising/structuring/adapting your placement school's materials.",
                              placeholder: "e.g., Explain the concept using visual aids, demonstrate the method on the board..."
                            },
                            {
                              field: "learning",
                              label: "Learning",
                              tooltip: "Detail pupil activity and clarify how pupils are engaged in learning at all times.",
                              placeholder: "e.g., Students work in pairs to solve problems, take notes..."
                            },
                            {
                              field: "assessing",
                              label: "Assessing",
                              tooltip: "Plot your learning checks to assess understanding and progress.",
                              placeholder: "e.g., Question and answer, mini whiteboard activities..."
                            },
                            {
                              field: "adapting",
                              label: "Adapting",
                              tooltip: "Explain how you need to adapt learning for pupils who require support or challenge.",
                              placeholder: "e.g., Extension tasks for advanced learners, scaffolding for struggling students..."
                            }
                          ].map((item) => (
                            <div key={item.field} className="space-y-2">
                              <div className="flex items-center gap-1">
                                <Label className="text-sm font-medium">{item.label}</Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        tabIndex={0}
                                        className="focus:outline-none"
                                      >
                                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs text-sm">
                                      {item.tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Textarea
                                value={stage[item.field as keyof LessonStage] || ""}
                                onChange={(e) => updateStage(i, item.field as keyof LessonStage, e.target.value)}
                                placeholder={item.placeholder}
                                className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addStage}
                    className="w-full sm:w-auto"
                  >
                    + Add Stage
                  </Button>
                </div>
              </section>

              <Separator />

              {/* Resources */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <div className="flex items-center gap-1">
                    <h3 className="text-base sm:text-lg font-semibold">Resources</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="focus:outline-none">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          Add links or names of teaching materials used during the lesson.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-3">
                  {(lesson.resources || []).map((res: Resource, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          placeholder="Resource title"
                          value={res.title || ""}
                          onChange={(e) => {
                            const updated = [...(lesson.resources || [])];
                            updated[index].title = e.target.value;
                            updateField("resources", updated as Resource[]);
                          }}
                          className="text-sm"
                        />

                        <Input
                          placeholder="https://example.com (optional)"
                          value={res.url || ""}
                          onChange={(e) => {
                            const updated = [...(lesson.resources || [])];
                            updated[index].url = e.target.value;
                            updateField("resources", updated as Resource[]);
                          }}
                          className="text-sm"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                        type="button"
                        size="sm"
                        onClick={() =>
                          updateField(
                            "resources",
                            (lesson.resources || []).filter((_, i) => i !== index) as Resource[]
                          )
                        }
                      >
                        Remove Resource
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
                      ] as Resource[])
                    }
                    className="w-full sm:w-auto"
                  >
                    + Add Resource
                  </Button>
                </div>
              </section>

              <Separator />

              {/* Homework */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <div className="flex items-center gap-1">
                    <h3 className="text-base sm:text-lg font-semibold">Homework</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="focus:outline-none">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          Independent work extending learning
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Textarea
                  placeholder="• Task students must complete at home..."
                  value={lesson.homework || ""}
                  onChange={(e) => updateField("homework", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              <Separator />

              {/* Evaluation */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <div className="flex items-center gap-1">
                    <h3 className="text-base sm:text-lg font-semibold">Evaluation</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="focus:outline-none">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          How successful was the lesson?
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Textarea
                  placeholder="• Reflection on students' progress...&#10;• What worked well?&#10;• What could be improved?"
                  value={lesson.evaluation || ""}
                  onChange={(e) => updateField("evaluation", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              <Separator />

              {/* Notes */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <div className="flex items-center gap-1">
                    <h3 className="text-base sm:text-lg font-semibold">Teacher Notes</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="focus:outline-none">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          Professional reminders or context
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Textarea
                  placeholder="Additional comments, reminders, or observations for future reference..."
                  value={lesson.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </section>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/lesson-plans")}
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
                    "Create Lesson Plan"
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