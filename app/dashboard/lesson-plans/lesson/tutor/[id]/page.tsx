"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TutorExpandedLessonView } from "../../../components/expanded-lesson-card/TutorExpandedLessonView";
import { LessonPlanTutor } from "../../../types/lesson_tutor";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ViewTutorLessonPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [lesson, setLesson] = useState<LessonPlanTutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        setLoading(true);
        setError(null);

        const lessonId = params.id as string;

        if (!lessonId) {
          setError("No lesson ID provided");
          setLoading(false);
          return;
        }

        // Fetch the tutor lesson with student profile data
        const { data, error: fetchError } = await supabase
          .from("tutor_lesson_plans")
          .select(`
            *,
            tutor_student_profiles (
              first_name,
              last_name
            )
          `)
          .eq("id", lessonId)
          .single();

        if (fetchError) {
          console.error("Error fetching lesson:", fetchError);
          setError("Failed to load lesson plan");
          setLoading(false);
          return;
        }

        if (!data) {
          setError("Lesson plan not found");
          setLoading(false);
          return;
        }

        setLesson(data as LessonPlanTutor);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [params.id, supabase]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading lesson plan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {error || "Lesson Not Found"}
          </h1>
          <p className="text-muted-foreground">
            {error === "Lesson plan not found" 
              ? "The lesson plan you're looking for doesn't exist or has been deleted."
              : "We couldn't load this lesson plan. Please try again later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the lesson
  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <TutorExpandedLessonView lesson={lesson} />
    </div>
  );
}