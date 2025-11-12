"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FiltersCard } from "../components/FiltersCard";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import "react-toastify/dist/ReactToastify.css";
import { StudentCard } from "../components/lesson-cards/StudentCard";
import Link from "next/link";

const supabase = createClient();

export default function TutorStudentProfilesDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedClass, setSelectedClass] = useState<string | "">("");
  const [dateFilter, setDateFilter] = useState<string | "">("");


  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStudents(data ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  const classes = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.level && set.add(s.level));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (selectedClass && s.level !== selectedClass) return false;
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        (s.first_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.last_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.goals ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.strengths ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.weaknesses ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.notes ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.special_educational_needs ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.interests ?? "").toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [students, search, selectedClass, dateFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const backgroundClass =
    selectedStudent || confirmDelete
      ? "scale-[0.987] blur-sm transition-all duration-300"
      : "transition-all duration-300";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Student Profiles
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your student roster
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fetchStudents()}>
                Refresh
              </Button>
              <Button asChild>
                <a href="/dashboard/student-profiles/new">Add Student</a>
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

          {error ? (
            <p className="text-destructive">{error}</p>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <LessonCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p>No students found.</p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/students/new">Add Student</a>
              </Button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {paginated.map((student) => (
                  <motion.div
                    key={student.student_id}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    <Link
                      href={`/dashboard/student-profiles/${student.student_id}`}
                      className="block cursor-pointer h-full"
                    >
                      <StudentCard
                        student={student}
                        onDelete={(e) => {
                          e.preventDefault(); // Prevent link click when deleting
                          setConfirmDelete(student);
                        }}
                      />
                    </Link>
                  </motion.div>

                ))}
              </motion.div>

              <Pagination
                totalItems={filtered.length}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
