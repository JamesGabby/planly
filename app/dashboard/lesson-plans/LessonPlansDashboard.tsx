"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { LessonPlan } from "./types/lesson";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { LessonCard } from "./components/LessonCard";
import { MobileResponsiveModal } from "./components/MobileResponsiveModal";

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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load lesson plans");
    } finally {
      setLoading(false);
    }
  }

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

  // 🧠 Split lessons into Today, Upcoming, and Previous
  const today = new Date().toISOString().split("T")[0];
  const { todayLessons, upcoming, previous } = useMemo(() => {
    const todayLessons = filtered.filter(
      (l) => l.date_of_lesson === today
    );
    const upcoming = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson > today)
      .sort((a, b) => a.date_of_lesson!.localeCompare(b.date_of_lesson!));
    const previous = filtered
      .filter((l) => l.date_of_lesson && l.date_of_lesson < today)
      .sort((a, b) => b.date_of_lesson!.localeCompare(a.date_of_lesson!));
    return { todayLessons, upcoming, previous };
  }, [filtered]);

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("lesson_plans")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) {
      alert("Failed: " + error.message);
    } else {
      setLessons((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
  }

  const backgroundClass =
    selectedLesson || confirmDelete
      ? "scale-[0.987] blur-sm transition-all duration-300"
      : "transition-all duration-300";

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Lesson Plans</h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage and browse your lesson plans
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => fetchLessonPlans()}>Refresh</Button>
              <Button asChild>
                <a href="/dashboard/lesson-plans/new">New Plan</a>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="topic, class, objectives..."
                  />
                </div>

                <div>
                  <Label>Class</Label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">All</option>
                    {classes.map((c) => (
                      <option value={c} key={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>

                <div className="flex items-end justify-end">
                  <Button
                    onClick={() => {
                      setSearch("");
                      setSelectedClass("");
                      setDateFilter("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Lesson Sections */}
          {loading ? (
            <div className="text-center py-20">Loading…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              {/* Today */}
              {todayLessons.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-3 text-blue-700">
                    Today’s Lessons
                  </h2>
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
                        <LessonCard
                          lesson={lp}
                          onDelete={() => setConfirmDelete(lp)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-3 text-green-700">
                    Upcoming Lessons
                  </h2>
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                  >
                    {upcoming.map((lp) => (
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
                        <LessonCard
                          lesson={lp}
                          onDelete={() => setConfirmDelete(lp)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}

              {/* Previous */}
              <Separator className="my-8" />
              <h2 className="text-2xl font-semibold mb-3 text-slate-700">
                Previous Lessons
              </h2>
              {previous.length === 0 ? (
                <p className="text-slate-500 text-sm">No previous lessons yet.</p>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {previous.map((lp) => (
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
                      <LessonCard
                        lesson={lp}
                        onDelete={() => setConfirmDelete(lp)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
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
