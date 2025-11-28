"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentProfileTeacher } from "../../lesson-plans/types/student_profile_teacher";
import { LessonCardSkeleton } from "@/app/dashboard/lesson-plans/skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { StudentCardClass } from "../../lesson-plans/components/cards/class-cards/StudentCardClass";
import { ClassStudentJoin } from "../../lesson-plans/types/class";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>; // params is now a Promise
}

const supabase = createClient();

export default function ClassStudentsPage({ params }: Props) {
  const paramsObj = React.use(params); // unwrap the promise
  const { id } = paramsObj;

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProfileTeacher[]>([]);


  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const [className, setClassName] = useState<string | null>(null);
  const studentCount = students.length;

  // Wrap it to avoid re-creation
  const fetchStudentsForClass = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("class_name")
        .eq("class_id", id)
        .single();

      if (classError) throw classError;
      setClassName(classData?.class_name || "Unnamed Class");

      const { data, error } = await supabase
        .from("class_students")
        .select(`
          student:teacher_student_profiles(*)
        `)
        .eq("class_id", id)
        .returns<ClassStudentJoin[]>();

      if (error) throw error;

      const studentsClean = data
        .map((row) => row.student)
        .filter((s): s is StudentProfileTeacher => s !== null);

      setStudents(studentsClean);

    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    fetchStudentsForClass();
  }, [fetchStudentsForClass]); 

  // Filters
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();

      const matchesSearch =
        !search ||
        s.first_name?.toLowerCase().includes(q) ||
        s.last_name?.toLowerCase().includes(q) ||
        s.goals?.toLowerCase().includes(q) ||
        s.strengths?.toLowerCase().includes(q) ||
        s.weaknesses?.toLowerCase().includes(q) ||
        s.notes?.toLowerCase().includes(q) ||
        s.special_educational_needs?.toLowerCase().includes(q) ||
        s.interests?.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [students, search]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className="pb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Link href="/dashboard/classes">
              <ArrowLeft className="h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
        </div>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {className ?? "Loading class..."}
              {className && (
                <span className="text-muted-foreground font-normal"> — {studentCount} student{studentCount !== 1 ? "s" : ""}</span>
              )}
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Viewing all students in {className ?? "this class"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchStudentsForClass}>
              Refresh
            </Button>
            <Button asChild>
              <Link href="/dashboard/student-profiles/new">Add Student</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

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
            <p>No students found in this class.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/student-profiles/new">Add Student</Link>
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
                    <StudentCardClass student={student} />
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
  );
}
