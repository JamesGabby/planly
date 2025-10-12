"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

// shadcn/ui components (assumes you have shadcn set up)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Tailwind + shadcn ready. This file is meant to be used as a single-page dashboard
// at `app/lesson-plans/page.tsx` in a Next.js 15 (app dir) project configured with
// TypeScript, Tailwind and shadcn/ui.

// INSTALL (run once):
// npm install @supabase/supabase-js @radix-ui/react-dropdown-menu
// plus shadcn/UI setup (see project README for shadcn install steps)

// ENV (next.config / .env.local):
// NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key

// Types
type LessonPlan = {
  id: string;
  user_id: string;
  class: string | null;
  date_of_lesson: string | null; // ISO date
  time_of_lesson: string | null; // HH:MM:SS
  topic: string | null;
  objectives: string | null;
  outcomes: string | null;
  resources: any; // jsonb
  homework: string | null;
  specialist_subject_knowledge_required: string | null;
  knowledge_revisited: string | null;
  subject_pedagogies: string | null;
  literacy_opportunities: string | null;
  numeracy_opportunities: string | null;
  health_and_safety_considerations: string | null;
  timing: string | null;
  teaching: string | null;
  learning: string | null;
  assessing: string | null;
  adapting: string | null;
  evaluation: string | null;
  created_at?: string;
};

const supabase = createClient()

export default function LessonPlansDashboard() {
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | "">("");
  const [dateFilter, setDateFilter] = useState<string | "">("");
  const [error, setError] = useState<string | null>(null);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this lesson plan? This action cannot be undone.")) return;
    const { error } = await supabase.from("lesson_plans").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
      return;
    }
    setLessons((prev) => prev.filter((p) => p.id !== id));
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

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Lesson Plans</h1>
            <p className="text-sm text-slate-600 mt-1">Manage and browse lesson plans from Supabase</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchLessonPlans()}>Refresh</Button>
            <Button asChild>
              <a href="/lesson-plans/new">New Plan</a>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Search</Label>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="topic, class, objectives..." />
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
                <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>

              <div className="flex items-end justify-end">
                <Button onClick={() => { setSearch(""); setSelectedClass(""); setDateFilter(""); }}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {loading ? (
          <div className="text-center py-20">Loading…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lp) => (
              <LessonCard key={lp.id} lesson={lp} onDelete={() => handleDelete(lp.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LessonCard({ lesson, onDelete }: { lesson: LessonPlan; onDelete: () => void }) {
  const resources = parseResources(lesson.resources);

  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{lesson.topic ?? "Untitled"}</CardTitle>
            <p className="text-sm text-slate-500">{lesson.class ?? "Unknown class"}</p>
            <p className="text-xs text-slate-400">{prettyDate(lesson.date_of_lesson)} {lesson.time_of_lesson ? ` • ${lesson.time_of_lesson}` : ""}</p>
          </div>
          <div className="text-right">
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
        </div>
      </CardHeader>

      <CardContent>
        <section className="mb-3">
          <h3 className="font-semibold text-sm">Objectives</h3>
          <p className="text-sm text-slate-700">{lesson.objectives ?? "—"}</p>
        </section>

        <section className="mb-3">
          <h3 className="font-semibold text-sm">Outcomes</h3>
          <p className="text-sm text-slate-700">{lesson.outcomes ?? "—"}</p>
        </section>

        <section className="mb-3">
          <h3 className="font-semibold text-sm">Resources</h3>
          {resources.length ? (
            <ul className="list-disc pl-5 text-sm">
              {resources.map((r, i) => (
                <li key={i}>
                  {r.title ? (
                    <a className="underline" href={r.url ?? "#"} target="_blank" rel="noreferrer">
                      {r.title}
                    </a>
                  ) : (
                    <span>{r.url ?? JSON.stringify(r)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">—</p>
          )}
        </section>

        <Separator />

        <div className="mt-3 flex justify-between text-sm text-slate-600">
          <div>Timing: {lesson.timing ?? "—"}</div>
          <div>Assessment: {lesson.assessing ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}

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
