"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { MobileResponsiveModal } from "../components/MobileResponsiveModal";
import { LessonTutorFiltersCard } from "../../filters/lesson-tutor";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LessonCardTutor } from "../components/lesson-cards/LessonCardTutor";
import { LessonPlanTutor } from "../types/lesson_tutor";
import Link from "next/link";

const supabase = createClient();

export default function TutorLessonPlansDashboard() {
  const [lessons, setLessons] = useState<LessonPlanTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonPlanTutor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LessonPlanTutor | null>(null);

  const ITEMS_PER_PAGE = 6;
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not logged in");
        setLoading(false);
        return;
      }
      setUserId(user.id);
      fetchTutorLessonPlans(user.id);
    }

    load();
  }, []);

  async function fetchTutorLessonPlans(userId: string) {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("tutor_lesson_plans")
        .select("*")
        .eq("user_id", userId)
        .order("date_of_lesson", { ascending: true });

      if (error) throw error;

      setLessons(data ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load lesson plans");
    } finally {
      setLoading(false);
    }
  }

  // --- Compute dates OUTSIDE memos ---
  const today = new Date().toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // --- Memo for filter options ---
  // Extract unique students
  const students = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l: LessonPlanTutor) => {
      const name = `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [lessons]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l) => l.subject && set.add(l.subject));
    return Array.from(set).sort();
  }, [lessons]);

  const examBoards = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l) => {
      if (l.exam_board) set.add(l.exam_board);
    });
    return Array.from(set).sort();
  }, [lessons]);

  // --- Filtered lessons ---
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const studentName = `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim();

      // Student filter
      if (selectedStudent && studentName !== selectedStudent) return false;

      // Subject filter
      if (selectedSubject && l.subject !== selectedSubject) return false;

      // Exam board filter
      if (selectedExamBoard && l.exam_board !== selectedExamBoard) return false;

      // Specific date filter
      if (dateFilter && l.date_of_lesson !== dateFilter) return false;

      // Date range filter
      if (dateRange.from && l.date_of_lesson) {
        const lessonDate = new Date(l.date_of_lesson);
        if (lessonDate < dateRange.from) return false;
        if (dateRange.to && lessonDate > dateRange.to) return false;
      }

      // Search filter
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (l.topic ?? "").toLowerCase().includes(s) ||
        (l.objectives ?? "").toLowerCase().includes(s) ||
        studentName.toLowerCase().includes(s) ||
        (l.subject ?? "").toLowerCase().includes(s) ||
        (l.exam_board ?? "").toLowerCase().includes(s)
      );
    });
  }, [
    lessons,
    search,
    selectedStudent,
    selectedSubject,
    selectedExamBoard,
    dateFilter,
    dateRange,
  ]);

  // --- Memo using today + tomorrowStr ---
  const { todayLessons, tomorrowLessons, upcoming, previous } = useMemo(() => {
    const todayLessons = filtered.filter((l) => l.date_of_lesson === today);
    const tomorrowLessons = filtered.filter((l) => l.date_of_lesson === tomorrowStr);

    const upcoming = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson > tomorrowStr)
      .sort((a, b) => a.date_of_lesson!.localeCompare(b.date_of_lesson!));

    const previous = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson < today)
      .sort((a, b) => b.date_of_lesson!.localeCompare(a.date_of_lesson!));

    return { todayLessons, tomorrowLessons, upcoming, previous };
  }, [filtered, today, tomorrowStr]);

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("tutor_lesson_plans")
        .delete()
        .eq("id", confirmDelete.id);

      if (error) {
        toast.error(`Failed to delete: ${error.message}`);
      } else {
        setLessons((prev) => prev.filter((p) => p.id !== confirmDelete.id));
        toast.success("Lesson deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred during deletion.");
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleDuplicateLesson(lesson: LessonPlanTutor) {
    try {
      const newLesson = {
        user_id: lesson.user_id,
        student_id: lesson.student_id,
        first_name: lesson.first_name,
        last_name: lesson.last_name,

        date_of_lesson: lesson.date_of_lesson,
        time_of_lesson: lesson.time_of_lesson,

        topic: `${lesson.topic} (Copy)`,
        objectives: lesson.objectives,
        outcomes: lesson.outcomes,
        resources: lesson.resources,
        homework: lesson.homework,
        knowledge_revisited: lesson.knowledge_revisited,
        subject_pedagogies: lesson.subject_pedagogies,
        literacy_opportunities: lesson.literacy_opportunities,
        numeracy_opportunities: lesson.numeracy_opportunities,
        timing: lesson.timing,
        teaching: lesson.teaching,
        learning: lesson.learning,
        assessing: lesson.assessing,
        adapting: lesson.adapting,
        evaluation: lesson.evaluation,
        lesson_structure: lesson.lesson_structure,
        notes: lesson.notes,
        exam_board: lesson.exam_board,
        subject: lesson.subject,

        // new timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("tutor_lesson_plans")
        .insert(newLesson)
        .select()
        .single();

      if (error) throw error;

      setLessons((prev) => [data, ...prev]);
      toast.success("Lesson duplicated successfully!");
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate lesson.");
    }
  }

  const paginatedUpcoming = useMemo(() => {
    const start = (upcomingPage - 1) * ITEMS_PER_PAGE;
    return upcoming.slice(start, start + ITEMS_PER_PAGE);
  }, [upcoming, upcomingPage]);

  const paginatedPrevious = useMemo(() => {
    const start = (previousPage - 1) * ITEMS_PER_PAGE;
    return previous.slice(start, start + ITEMS_PER_PAGE);
  }, [previous, previousPage]);

  const backgroundClass =
    selectedLesson || confirmDelete
      ? "scale-[0.987] blur-sm transition-all duration-300"
      : "transition-all duration-300";

  const renderLessonCard = (lp: LessonPlanTutor) => {
    const commonProps = {
      onDelete: () => setConfirmDelete(lp),
      onDuplicate: () => handleDuplicateLesson(lp),
    };

    return <LessonCardTutor lesson={lp} {...commonProps} />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Lesson Plans</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and browse your lesson plans
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={() => fetchTutorLessonPlans(userId)}>
                Refresh
              </Button>
              <Button asChild>
                <Link href="/dashboard/lesson-plans/new">New Plan</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Filters */}
          <LessonTutorFiltersCard
            search={search}
            setSearch={setSearch}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            students={students}
            subjects={subjects}
            examBoards={examBoards}
          />

          <Separator className="my-6" />

          {/* Lessons */}
          {error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            <>
              {/* Show skeletons while loading */}
              {loading ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <LessonCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </motion.div>
              ) : (
                <>
                  {/* No Lessons Available */}
                  {!loading && filtered.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      <p>
                        No lessons found. Try adjusting your filters or create a new lesson
                        plan.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/lesson-plans/new">Create Lesson Plan</Link>
                      </Button>
                    </div>
                  )}

                  {/* Today */}
                  {todayLessons.length > 0 && (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">{"Today's Lessons"}</h2>
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                      >
                        {todayLessons.map((lp) => (
                          <motion.div
                            layoutId={lp.id}
                            key={lp.id}
                            className="cursor-pointer h-full"
                            onClick={() => setSelectedLesson(lp)}
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            {renderLessonCard(lp)}
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  )}

                  {/* Tomorrow */}
                  {tomorrowLessons.length > 0 && (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">{"Tomorrow's Lessons"}</h2>
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                      >
                        {tomorrowLessons.map((lp) => (
                          <motion.div
                            layoutId={lp.id}
                            key={lp.id}
                            className="cursor-pointer h-full"
                            onClick={() => setSelectedLesson(lp)}
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            {renderLessonCard(lp)}
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  )}

                  {/* Upcoming */}
                  {upcoming.length > 0 && (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">Upcoming Lessons</h2>
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                      >
                        {paginatedUpcoming.map((lp) => (
                          <motion.div
                            layoutId={lp.id}
                            key={lp.id}
                            className="cursor-pointer h-full"
                            onClick={() => setSelectedLesson(lp)}
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            {renderLessonCard(lp)}
                          </motion.div>
                        ))}
                      </motion.div>
                      <Pagination
                        totalItems={upcoming.length}
                        currentPage={upcomingPage}
                        onPageChange={setUpcomingPage}
                      />
                    </>
                  )}

                  {/* Previous */}
                  {previous.length > 0 && (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">Previous Lessons</h2>
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                      >
                        {paginatedPrevious.map((lp) => (
                          <motion.div
                            layoutId={lp.id}
                            key={lp.id}
                            className="cursor-pointer h-full"
                            onClick={() => setSelectedLesson(lp)}
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            {renderLessonCard(lp)}
                          </motion.div>
                        ))}
                      </motion.div>
                      <Pagination
                        totalItems={previous.length}
                        currentPage={previousPage}
                        onPageChange={setPreviousPage}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Expanded modal */}
        <AnimatePresence>
          {selectedLesson && (
            <MobileResponsiveModal
              lesson={selectedLesson}
              onClose={() => setSelectedLesson(null)}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {confirmDelete && (
            <DeleteConfirmModal
              onCancel={() => setConfirmDelete(null)}
              onConfirm={handleDeleteConfirm}
              data={confirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}