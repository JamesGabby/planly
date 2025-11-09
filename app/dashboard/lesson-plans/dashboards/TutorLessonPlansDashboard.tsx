"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { MobileResponsiveModal } from "../components/MobileResponsiveModal";
import { FiltersCard } from "../components/FiltersCard";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LessonCardTutor } from "../components/lesson-cards/LessonCardTutor";
import { TutorLessonPlan } from "../types/lesson_tutor";

const supabase = createClient();

export default function TutorLessonPlansDashboard() {
  const [lessons, setLessons] = useState<TutorLessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | "">("");
  const [dateFilter, setDateFilter] = useState<string | "">("");
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TutorLessonPlan | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TutorLessonPlan | null>(null);

  const ITEMS_PER_PAGE = 6;
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  useEffect(() => {
    fetchTutorLessonPlans();
  }, []);

  async function fetchTutorLessonPlans() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("tutor_lesson_plans")
        .select("*")
        .order("date_of_lesson", { ascending: true });
      if (error) throw error;
      setLessons(data ?? []);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load lesson plans");
      }
    } finally {
      setLoading(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const classes = useMemo(() => {
    const set = new Set<string>();
    lessons.forEach((l) => l.student && set.add(l.student));
    return Array.from(set).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (selectedClass && l.student !== selectedClass) return false;
      if (dateFilter && l.date_of_lesson !== dateFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (l.topic ?? "").toLowerCase().includes(s) ||
        (l.objectives ?? "").toLowerCase().includes(s) ||
        (l.student ?? "").toLowerCase().includes(s)
      );
    });
  }, [lessons, search, selectedClass, dateFilter]);

  const today = new Date().toISOString().split("T")[0];
  const { todayLessons, tomorrowLessons, upcoming, previous } = useMemo(() => {
  const todayLessons = filtered.filter((l) => l.date_of_lesson === today);
  const tomorrowLessons = filtered.filter((l) => l.date_of_lesson === tomorrowStr);
  const upcoming = filtered
    .filter(
      (l) =>
        l.date_of_lesson &&
        l.date_of_lesson > tomorrowStr
    )
    .sort((a, b) => a.date_of_lesson!.localeCompare(b.date_of_lesson!));
  const previous = filtered
    .filter((l) => l.date_of_lesson && l.date_of_lesson < today)
    .sort((a, b) => b.date_of_lesson!.localeCompare(a.date_of_lesson!));
  return { todayLessons, tomorrowLessons, upcoming, previous };
}, [filtered]);

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

  async function handleDuplicateLesson(lesson: TutorLessonPlan) {
    try {
      // Remove fields Supabase auto-generates
      const { id, created_at, updated_at, ...copy } = lesson;

      const newLesson = {
        ...copy,
        topic: `${lesson.topic} (Copy)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        date_of_lesson: lesson.date_of_lesson,
      };

      const { data, error } = await supabase
        .from("tutor_lesson_plans")
        .insert([newLesson])
        .select()
        .single();

      if (error) throw error;

      setLessons((prev) => [data, ...prev]);
      toast.success("Lesson duplicated successfully!");
    } catch (err) {
      console.error("Duplicate error:", err);

      if (err instanceof Error) {
        toast.error("Failed to duplicate lesson: " + err.message);
      } else {
        toast.error("Failed to duplicate lesson: Unknown error");
      }
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

  const renderLessonCard = (lp: TutorLessonPlan) => {
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
              <Button variant="outline" onClick={() => fetchTutorLessonPlans()}>
                Refresh
              </Button>
              <Button asChild>
                <a href="/dashboard/lesson-plans/new">New Plan</a>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Filters */}
          <FiltersCard
            search={search}
            setSearch={setSearch}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            classes={classes}
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
                      <p>No lessons found. Try adjusting your filters or create a new lesson plan.</p>
                      <Button className="mt-4" asChild>
                        <a href="/dashboard/lesson-plans/new">Create Lesson Plan</a>
                      </Button>
                    </div>
                  )}
                  {/* Today */}
                  {todayLessons.length > 0 && (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">Today’s Lessons</h2>
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
                      <h2 className="text-2xl font-semibold mb-3">Tomorrow’s Lessons</h2>
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
