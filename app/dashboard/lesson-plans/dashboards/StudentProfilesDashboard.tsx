"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentProfileTeacher } from "../types/student_profile_teacher";
import { FiltersCardNoDate } from "../components/FiltersCardNoDate";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { StudentCardTeacher } from "../components/lesson-cards/StudentCardTeacher";

const supabase = createClient();

export default function StudentProfilesDashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | "">("");
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProfileTeacher[]>([]);
  const [selectedStudent, ] = useState(null);
  const [userId, setUserId] = useState("");

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

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

      // Store userId if you want to reuse it elsewhere
      setUserId(user.id);

      fetchStudents(user.id);
    }

    load();
  }, []);


  // ---------------------------
  // FETCH STUDENTS
  // ---------------------------

  async function fetchStudents(userId: string) {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("teacher_student_profiles")
        .select("*")
        .eq("user_id", userId)                // ← same fix here
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStudents(data ?? []);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Error fetching students";
      setError(message);
    } finally {
      setLoading(false);
    }
  }
  
  // Extract unique "classes" (students)
    const extractedClasses = useMemo(() => {
      const set = new Set<string>();
      students.forEach((s: StudentProfileTeacher) => {
        const name = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
        if (name) set.add(name);
      });
      return Array.from(set).sort();
    }, [students]);
  
    // Apply filters
    const filtered = useMemo(() => {
      return students.filter((s: StudentProfileTeacher) => {
        const studentName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
  
        if (selectedClass && studentName !== selectedClass) return false;
  
        if (!search) return true;
        const srch = search.toLowerCase();
  
        return (
          (s.first_name ?? "").toLowerCase().includes(srch) ||
          (s.last_name ?? "").toLowerCase().includes(srch) ||
          (s.goals ?? "").toLowerCase().includes(srch) ||
          (s.strengths ?? "").toLowerCase().includes(srch) ||
          (s.weaknesses ?? "").toLowerCase().includes(srch) ||
          (s.notes ?? "").toLowerCase().includes(srch) ||
          (s.interests ?? "").toLowerCase().includes(srch) ||
          studentName.toLowerCase().includes(srch)
        );
      });
    }, [students, search, selectedClass]);

  
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const backgroundClass =
    selectedStudent 
      ? "scale-[0.987] blur-sm transition-all duration-300"
      : "transition-all duration-300";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Profiles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your student roster
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={() => fetchStudents(userId)}>
                Refresh
              </Button>
              <Button asChild>
                <Link href="/dashboard/student-profiles/new">Add Student</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Filters */}
          <FiltersCardNoDate
            search={search}
            setSearch={setSearch}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            classes={extractedClasses}
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
                <a href="/dashboard/student-profiles/new">Add Student</a>
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
                      href={`/dashboard/student-profiles/teacher/${student.student_id}`}
                      className="block cursor-pointer h-full"
                    >
                      <StudentCardTeacher
                        student={student}
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