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
import { LessonCardTutor } from "../components/cards/lesson-cards/LessonCardTutor";
import { LessonPlanTutor } from "../types/lesson_tutor";
import { TutorCalendarView } from "../components/calendars/TutorCalendarView";
import Link from "next/link";
import { LayoutGrid, Calendar } from "lucide-react";

const supabase = createClient();

const ITEMS_PER_PAGE = 6;

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
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [viewType, setViewType] = useState<"grid" | "calendar">("grid");

  // Memoize date calculations to prevent hydration issues
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  const tomorrowStr = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }
        
        setUserId(user.id);
        await fetchTutorLessonPlans(user.id);
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Failed to authenticate");
        setLoading(false);
      }
    }

    load();
  }, []);

  async function fetchTutorLessonPlans(userId: string) {
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("tutor_lesson_plans")
        .select(`
          *,
          student_profiles!fk_student (
            first_name,
            last_name
          )
        `)
        .eq("user_id", userId)
        .order("date_of_lesson", { ascending: true });

      if (fetchError) throw fetchError;

      setLessons(data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load lesson plans";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

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
    lessons.forEach((l) => {
      if (l.subject) set.add(l.subject);
    });
    return Array.from(set).sort();
  }, [lessons]);

  const examBoards = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l) => {
      if (l.exam_board) set.add(l.exam_board);
    });
    return Array.from(set).sort();
  }, [lessons]);

  // Filtered lessons with proper null/undefined handling
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const studentName = `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim();

      // Student filter
      if (selectedStudent && studentName !== selectedStudent) return false;

      // Subject filter
      if (selectedSubject && l.subject !== selectedSubject) return false;

      // Exam board filter
      if (selectedExamBoard && l.exam_board !== selectedExamBoard) return false;

      // Specific date filter (takes precedence over date range)
      if (dateFilter) {
        return l.date_of_lesson === dateFilter;
      }

      // Date range filter
      if (dateRange.from && l.date_of_lesson) {
        const lessonDate = new Date(l.date_of_lesson);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        
        if (lessonDate < fromDate) return false;
        
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (lessonDate > toDate) return false;
        }
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const searchableFields = [
          l.topic,
          l.objectives,
          studentName,
          l.subject,
          l.exam_board,
        ];

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchLower)
        );
      }

      return true;
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

  // Categorized lessons
  const { todayLessons, tomorrowLessons, upcoming, previous } = useMemo(() => {
    const todayLessons = filtered.filter((l) => l.date_of_lesson === today);
    const tomorrowLessons = filtered.filter((l) => l.date_of_lesson === tomorrowStr);

    const upcoming = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson > tomorrowStr)
      .sort((a, b) => (a.date_of_lesson || "").localeCompare(b.date_of_lesson || ""));

    const previous = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson < today)
      .sort((a, b) => (b.date_of_lesson || "").localeCompare(a.date_of_lesson || ""));

    return { todayLessons, tomorrowLessons, upcoming, previous };
  }, [filtered, today, tomorrowStr]);

  // Paginated results
  const paginatedUpcoming = useMemo(() => {
    const start = (upcomingPage - 1) * ITEMS_PER_PAGE;
    return upcoming.slice(start, start + ITEMS_PER_PAGE);
  }, [upcoming, upcomingPage]);

  const paginatedPrevious = useMemo(() => {
    const start = (previousPage - 1) * ITEMS_PER_PAGE;
    return previous.slice(start, start + ITEMS_PER_PAGE);
  }, [previous, previousPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setUpcomingPage(1);
    setPreviousPage(1);
  }, [search, selectedStudent, selectedSubject, selectedExamBoard, dateFilter, dateRange]);

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from("tutor_lesson_plans")
        .delete()
        .eq("id", confirmDelete.id);

      if (deleteError) throw deleteError;

      setLessons((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      toast.success("Lesson deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete lesson";
      toast.error(errorMessage);
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleDuplicateLesson(lesson: LessonPlanTutor) {
    try {
      // Destructure and exclude auto-generated fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, ...lessonData } = lesson;

      const copy = {
        ...lessonData,
        topic: `${lesson.topic} (Copy)`,
      };

      const { data, error: duplicateError } = await supabase
        .from("tutor_lesson_plans")
        .insert([copy])
        .select()
        .single();

      if (duplicateError) throw duplicateError;

      if (data) {
        setLessons((prev) => [data, ...prev]);
        toast.success("Lesson duplicated successfully!");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      const errorMessage = err instanceof Error 
        ? `Failed to duplicate: ${err.message}` 
        : "Failed to duplicate lesson";
      toast.error(errorMessage);
    }
  }

  const backgroundClass = selectedLesson || confirmDelete
    ? "scale-[0.987] blur-sm transition-all duration-300"
    : "transition-all duration-300";

  const renderLessonCard = (lp: LessonPlanTutor) => {
    return (
      <LessonCardTutor
        lesson={lp}
        onDelete={() => setConfirmDelete(lp)}
        onDuplicate={() => handleDuplicateLesson(lp)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Lesson Plans</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and browse your lesson plans
              </p>
            </div>

            <div className="flex gap-2 shrink-0 flex-wrap">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewType === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("grid")}
                  className="h-9"
                >
                  <LayoutGrid className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewType === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("calendar")}
                  className="h-9"
                >
                  <Calendar className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={() => userId && fetchTutorLessonPlans(userId)}
                disabled={loading || !userId}
              >
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
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedExamBoard={selectedExamBoard}
            setSelectedExamBoard={setSelectedExamBoard}
            dateRange={dateRange}
            setDateRange={setDateRange}
            students={students}
            subjects={subjects}
            examBoards={examBoards}
          />

          <Separator className="my-6" />

          {/* Conditional View Rendering */}
          {error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
              <p className="text-destructive font-semibold mb-2">Error Loading Lessons</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => userId && fetchTutorLessonPlans(userId)}
                disabled={loading}
              >
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <LessonCardSkeleton key={`skeleton-${i}`} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No lessons found</p>
              <p className="text-sm mb-6">
                Try adjusting your filters or create a new lesson plan
              </p>
              <Button asChild>
                <Link href="/dashboard/lesson-plans/new">Create Lesson Plan</Link>
              </Button>
            </div>
          ) : viewType === "calendar" ? (
            /* Calendar View */
            <TutorCalendarView
              lessons={filtered}
              onLessonClick={setSelectedLesson}
              loading={loading}
            />
          ) : (
            /* Grid View */
            <>
              {/* Today's Lessons */}
              {todayLessons.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-3">Today&apos;s Lessons</h2>
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

              {/* Tomorrow's Lessons */}
              {tomorrowLessons.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-3">Tomorrow&apos;s Lessons</h2>
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

              {/* Upcoming Lessons */}
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
                  {upcoming.length > ITEMS_PER_PAGE && (
                    <div className="mb-8">
                      <Pagination
                        totalItems={upcoming.length}
                        currentPage={upcomingPage}
                        onPageChange={setUpcomingPage}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Previous Lessons */}
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
                  {previous.length > ITEMS_PER_PAGE && (
                    <div className="mb-8">
                      <Pagination
                        totalItems={previous.length}
                        currentPage={previousPage}
                        onPageChange={setPreviousPage}
                      />
                    </div>
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