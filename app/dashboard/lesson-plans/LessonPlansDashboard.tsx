"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LessonPlan } from "./types/lesson";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { LessonCard } from "./components/lesson-cards/LessonCard";
import { MobileResponsiveModal } from "./components/MobileResponsiveModal";
import { FiltersCard } from "./components/FiltersCard";
import { LessonCardSkeleton } from "./skeletons/LessonCardSkeleton";
import { useUserMode } from "@/components/UserModeContext";
import { LessonCardAdvanced } from "./components/lesson-cards/LessonCardAdvanced";
import { Pagination } from "@/components/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LessonCardStudent } from "./components/lesson-cards/LessonCardStudent";
import { LessonCardTutor } from "./components/lesson-cards/LessonCardTutor";
import { ModeSwitcher } from "@/components/ModeSwitcher";

const supabase = createClient();

export default function LessonPlansDashboard() {
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | "">("");
  const [dateFilter, setDateFilter] = useState<string | "">("");
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonPlan | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LessonPlan | null>(null);

  const ITEMS_PER_PAGE = 6;
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  async function fetchLessonPlans() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("lesson_plans")
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
    lessons.forEach((l) => l.class && set.add(l.class));
    return Array.from(set).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (selectedClass && l.class !== selectedClass) return false;
      if (dateFilter && l.date_of_lesson !== dateFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (l.topic ?? "").toLowerCase().includes(s) ||
        (l.objectives ?? "").toLowerCase().includes(s) ||
        (l.class ?? "").toLowerCase().includes(s)
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
        .from("lesson_plans")
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

  async function handleDuplicateLesson(lesson: LessonPlan) {
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
        .from("lesson_plans")
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

  const { mode } = useUserMode();

  const renderLessonCard = (lp: LessonPlan) => {
    const commonProps = {
      onDelete: () => setConfirmDelete(lp),
      onDuplicate: () => handleDuplicateLesson(lp),
    };

    switch (mode) {
      case "extended":
        return <LessonCardAdvanced lesson={lp} {...commonProps} />;
      case "student":
        return <LessonCardStudent lesson={lp} {...commonProps} />;
      case "tutor":
        return <LessonCardTutor lesson={lp} {...commonProps} />;
      default:
        return <LessonCard lesson={lp} {...commonProps} />;
    }
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
              <Button variant="outline" onClick={() => fetchLessonPlans()}>
                Refresh
              </Button>
              <Button asChild>
                <a href="/dashboard/lesson-plans/new">New Plan</a>
              </Button>
            </div>
          </div>

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

          <p className="text-sm text-muted-foreground mb-1">
            Select the view you would like
          </p>
          <ModeSwitcher />

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
                  <Separator className="my-8" />
                  <h2 className="text-2xl font-semibold mb-3">Previous Lessons</h2>
                  {previous.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No previous lessons yet.</p>
                  ) : (
                    <>
                      <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
              lesson={confirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
