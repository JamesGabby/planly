"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import FocusTrap from "focus-trap-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { LessonPlan } from "@/types/lesson";

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
        .from<LessonPlan>("lesson_plans")
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
                <a href="/dashboard/new">New Plan</a>
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

/* --- CARD --- */
function LessonCard({
  lesson,
  onDelete,
}: {
  lesson: LessonPlan;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="shadow hover:shadow-lg transition-all h-full flex flex-col justify-between">
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {lesson.topic ?? "Untitled"}
            </CardTitle>
            <p className="text-sm text-slate-500">{lesson.class ?? "Unknown"}</p>
            <p className="text-xs text-slate-400">
              {prettyDate(lesson.date_of_lesson)}{" "}
              {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
            </p>
          </div>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              >
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <a href={`/dashboard/${lesson.id}/edit`}>Edit</a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                  setTimeout(() => onDelete(), 100);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-6" />
      </CardContent>
    </Card>
  );
}

/* --- DELETE CONFIRM MODAL --- */
function DeleteConfirmModal({
  onCancel,
  onConfirm,
  lesson,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  lesson: LessonPlan;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <FocusTrap>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-50 text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <h2 className="text-xl font-semibold mb-2">
            Delete this lesson plan?
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Are you sure you want to delete{" "}
            <b>{lesson.topic || "Untitled"}</b>? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" ref={cancelRef} onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </motion.div>
      </FocusTrap>
    </motion.div>
  );
}

/* --- MOBILE MODAL --- */
function MobileResponsiveModal({
  lesson,
  onClose,
}: {
  lesson: LessonPlan;
  onClose: () => void;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progressColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#3b82f6", "#22c55e"]
  );

  return (
    <AnimatePresence>
      <motion.div
        key={lesson.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <FocusTrap>
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-50 flex flex-col ${
              isMobile ? "mt-auto" : ""
            }`}
            initial={{
              y: isMobile ? "100%" : 0,
              opacity: 0,
              scale: isMobile ? 1 : 0.95,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 25 },
            }}
            exit={{
              y: isMobile ? "100%" : 0,
              opacity: 0,
              scale: isMobile ? 1 : 0.95,
            }}
          >
            <motion.div
              className="sticky top-0 left-0 right-0 h-1 origin-left z-20 rounded-t-2xl"
              style={{ scaleX: scrollYProgress, backgroundColor: progressColor }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
            >
              ✕
            </button>
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[85vh] p-6"
              style={{ overscrollBehavior: "contain" }}
            >
              <ExpandedLessonView lesson={lesson} />
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}

/* --- EXPANDED LESSON VIEW --- */
function ExpandedLessonView({ lesson }: { lesson: LessonPlan }) {
  const supabase = createClient();
  const [notes, setNotes] = useState(lesson.notes ?? "");
  const [evaluation, setEvaluation] = useState(lesson.evaluation ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resources = parseResources(lesson.resources);
  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  async function handleSave(field: "notes" | "evaluation", value: string) {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("lesson_plans")
        .update({ [field]: value })
        .eq("id", lesson.id);
      if (error) throw error;
      setMessage("Saved!");
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage("Error saving changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">{lesson.topic ?? "Untitled"}</h2>
        <p className="text-sm text-slate-600">
          {lesson.class} • {prettyDate(lesson.date_of_lesson)}{" "}
          {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
        </p>
      </header>

      {lesson.objectives && (
        <section>
          <h3 className="font-semibold mb-1">Objectives</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {lesson.objectives}
          </p>
        </section>
      )}

      {lessonStructure.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Lesson Structure</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="text-left p-3 font-semibold border-r">Stage</th>
                  <th className="text-left p-3 font-semibold border-r">
                    Duration
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Teaching
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Learning
                  </th>
                  <th className="text-left p-3 font-semibold border-r">
                    Assessing
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Adapting
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessonStructure.map((stage, i) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i % 2 ? "bg-slate-50" : "bg-white"
                    } hover:bg-slate-100`}
                  >
                    <td className="p-3 font-medium border-r">{stage.stage}</td>
                    <td className="p-3 border-r">{stage.duration}</td>
                    <td className="p-3 border-r">{stage.teaching}</td>
                    <td className="p-3 border-r">{stage.learning}</td>
                    <td className="p-3 border-r">{stage.assessing}</td>
                    <td className="p-3">{stage.adapting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="list-disc list-inside text-sm text-blue-600">
            {resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {r.title || r.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* --- HELPERS --- */
function prettyDate(d?: string | null) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function prettyTime(t?: string | null) {
  if (!t) return "—";
  try {
    const dt = new Date(`1970-01-01T${t}`);
    let formatted = dt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    formatted = formatted.replace(/^0/, ""); // remove leading zero
    formatted = formatted.replace(/\bAM\b/, "am").replace(/\bPM\b/, "pm"); // lowercase am/pm
    return formatted;
  } catch {
    return t;
  }
}

function parseResources(res: any): { title: string; url: string }[] {
  if (!res) return [];
  try {
    if (Array.isArray(res)) return res;
    if (typeof res === "string") return JSON.parse(res);
  } catch {}
  return [];
}
