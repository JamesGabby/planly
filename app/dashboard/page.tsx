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

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  // Lock scroll + Esc key handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedLesson(null);
    };
    if (selectedLesson) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [selectedLesson]);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this lesson plan?")) return;
    const { error } = await supabase.from("lesson_plans").delete().eq("id", id);
    if (error) return alert("Failed: " + error.message);
    setLessons((prev) => prev.filter((p) => p.id !== id));
  }

  const backgroundClass = selectedLesson
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

          {/* Lessons */}
          {loading ? (
            <div className="text-center py-20">Loading…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((lp) => (
                <motion.div
                  layoutId={lp.id}
                  key={lp.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedLesson(lp)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <LessonCard lesson={lp} onDelete={() => handleDelete(lp.id)} />
                </motion.div>
              ))}
            </motion.div>
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
      </div>
    </div>
  );
}

/* Compact card */
function LessonCard({
  lesson,
  onDelete,
}: {
  lesson: LessonPlan;
  onDelete: () => void;
}) {
  const resources = parseResources(lesson.resources);
  return (
    <Card className="shadow hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{lesson.topic ?? "Untitled"}</CardTitle>
            <p className="text-sm text-slate-500">{lesson.class ?? "Unknown"}</p>
            <p className="text-xs text-slate-400">
              {prettyDate(lesson.date_of_lesson)}{" "}
              {lesson.time_of_lesson && `• ${lesson.time_of_lesson}`}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">•••</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a href={`/lesson-plans/${lesson.id}/edit`}>Edit</a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <section className="mb-3">
          <h3 className="font-semibold text-sm">Objectives</h3>
          <p className="text-sm text-slate-700">{lesson.objectives ?? "—"}</p>
        </section>
        <Separator />
        <div className="mt-3 flex justify-between text-sm text-slate-600">
          <div>Timing: {lesson.timing ?? "—"}</div>
          <div>Assessing: {lesson.assessing ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* Fixed MobileResponsiveModal: backdrop handles clicks directly */
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

  // Animate progress bar color + fade
  const progressColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#3b82f6", "#22c55e"]
  );
  const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  return (
    <AnimatePresence>
      <motion.div
        key={lesson.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP: handle clicks here explicitly */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 40 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // <- reliable click-away close
        />

        {/* Modal content (above backdrop) */}
        <FocusTrap>
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl ${
              isMobile ? "mt-auto max-h-[90vh]" : "max-h-[90vh]"
            } overflow-y-auto relative z-50`}
            onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
            ref={scrollRef}
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
            {/* Scroll progress bar */}
            <motion.div
              className="sticky top-0 left-0 right-0 h-1 origin-left z-20 rounded-t-2xl"
              style={{
                scaleX: scrollYProgress,
                backgroundColor: progressColor,
                opacity: progressOpacity,
              }}
            />

            {/* Sticky close button */}
            <motion.button
              onClick={onClose}
              className="sticky top-0 right-0 z-30 ml-auto mr-4 mt-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
            >
              ✕
            </motion.button>

            {/* Expanded content */}
            <ExpandedLessonView lesson={lesson} />
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}

/* Expanded lesson view content */
function ExpandedLessonView({ lesson }: { lesson: LessonPlan }) {
  const resources = parseResources(lesson.resources);

  const lessonStructure = Array.isArray(lesson.lesson_structure)
    ? lesson.lesson_structure
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{lesson.topic}</h2>
        <p className="text-sm text-slate-500">
          {lesson.class} — {prettyDate(lesson.date_of_lesson)}{" "}
          {lesson.time_of_lesson && `• ${lesson.time_of_lesson}`}
        </p>
      </div>

      <Separator />

      {/* Core Lesson Info */}
      {[
        ["Objectives", lesson.objectives],
        ["Outcomes", lesson.outcomes],
        ["Homework", lesson.homework],
        ["Specialist Knowledge", lesson.specialist_subject_knowledge_required],
        ["Knowledge Revisited", lesson.knowledge_revisited],
        ["Subject Pedagogies", lesson.subject_pedagogies],
        ["Literacy Opportunities", lesson.literacy_opportunities],
        ["Numeracy Opportunities", lesson.numeracy_opportunities],
        ["Health & Safety", lesson.health_and_safety_considerations],
        ["Evaluation", lesson.evaluation],
      ].map(([label, value]) => (
        <section key={label as string}>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-slate-700 text-sm whitespace-pre-wrap">
            {value || "—"}
          </p>
        </section>
      ))}

      {/* Lesson Structure Section */}
      {lessonStructure.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Lesson Structure</h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-3 font-semibold border-r">Stage</th>
                  <th className="text-left p-3 font-semibold border-r">Duration</th>
                  <th className="text-left p-3 font-semibold border-r">Teaching</th>
                  <th className="text-left p-3 font-semibold border-r">Learning</th>
                  <th className="text-left p-3 font-semibold border-r">Assessing</th>
                  <th className="text-left p-3 font-semibold">Adapting</th>
                </tr>
              </thead>
              <tbody>
                {lessonStructure.map((stage: any, i: number) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } align-top`}
                  >
                    <td className="p-3 font-medium border-r">
                      {stage.stage || "—"}
                    </td>
                    <td className="p-3 border-r whitespace-nowrap">
                      {stage.duration || "—"}
                    </td>
                    <td className="p-3 border-r whitespace-pre-wrap">
                      {stage.teaching || "—"}
                    </td>
                    <td className="p-3 border-r whitespace-pre-wrap">
                      {stage.learning || "—"}
                    </td>
                    <td className="p-3 border-r whitespace-pre-wrap">
                      {stage.assessing || "—"}
                    </td>
                    <td className="p-3 whitespace-pre-wrap">
                      {stage.adapting || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section>
        <h3 className="font-semibold">Resources</h3>
        {resources.length ? (
          <ul className="list-disc pl-5 text-sm">
            {resources.map((r, i) => (
              <li key={i}>
                {r.title ? (
                  <a
                    href={r.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {r.title}
                  </a>
                ) : (
                  <span>{r.url ?? JSON.stringify(r)}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">—</p>
        )}
      </section>
    </div>
  );
}

/* Helpers */
function parseResources(resources: any) {
  if (!resources) return [];
  if (Array.isArray(resources)) return resources;
  try {
    if (typeof resources === "string") return JSON.parse(resources);
  } catch {
    return [];
  }
  return resources;
}

function prettyDate(d?: string | null) {
  if (!d) return "—";
  try {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
