"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FiltersCardNoDate } from "../lesson-plans/components/FiltersCardNoDate";
import { Pagination } from "@/components/pagination";
import { LessonCardSkeleton } from "../lesson-plans/skeletons/LessonCardSkeleton";
import Link from "next/link";
import { ClassCard } from "../lesson-plans/components/lesson-cards/ClassCard";
import { Class, ClassStudentJoin, ClassWithStudents } from "../lesson-plans/types/class";
import { StudentProfileTeacher } from "../lesson-plans/types/student_profile_teacher";
import { useUserMode } from "@/components/UserModeContext";
import { redirect } from "next/navigation";

const supabase = createClient();

export default function ClassesDashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassWithStudents[]>([]); // ✅ Changed from Class[]
  const [selectedClass, setSelectedClass] = useState("");
  const [userId, setUserId] = useState("");

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const { mode } = useUserMode();
  if (mode === 'tutor') redirect('/dashboard/student-profiles')

  
      // Inline fetchClasses so it's NOT a dependency
  const fetchClasses = useCallback(async (userId: string) => {
  setLoading(true);
  setError(null);

  try {
    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        students:class_students(
          student:teacher_student_profiles(*)
        )
      `)
      .eq("user_id", userId) // safe: always a string
      .returns<(Class & { students: ClassStudentJoin[] })[]>();

    if (error) throw error;

    const normalized: ClassWithStudents[] =
      (data ?? []).map((cls) => ({
        ...cls,
        students: cls.students
          .map((s) => s.student)
          .filter((s): s is StudentProfileTeacher => s !== null),
      }));

      setClasses(normalized);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message);
    } finally {
      setLoading(false);
    }
  }, []);

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

      setUserId(user.id);

      await fetchClasses(user.id); // safe
    }

    load();
  }, [fetchClasses]);

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        !search ||
        c.class_name?.toLowerCase().includes(searchLower) ||
        c.year_group?.toLowerCase().includes(searchLower) ||
        c.students?.some((s: StudentProfileTeacher) => {
          const first = s.first_name?.toLowerCase() || "";
          const last = s.last_name?.toLowerCase() || "";
          const full = `${first} ${last}`;

          return (
            first.includes(searchLower) ||
            last.includes(searchLower) ||
            full.includes(searchLower)
          );
        });

      const matchesClass =
        !selectedClass || c.class_name === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [classes, search, selectedClass]);

  const filteredClasses = useMemo(() => {
      const set = new Set<string>();
      classes.forEach((l) => l.class_name && set.add(l.class_name));
      return Array.from(set).sort();
    }, [classes]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your classes
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={() => fetchClasses(userId)}>
              Refresh
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
          classes={filteredClasses}
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
            <p>No classes found.</p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {paginated.map((cls) => (
                <motion.div
                  key={cls.class_id}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Link
                    href={`/dashboard/classes/${cls.class_id}`}
                    className="block cursor-pointer h-full"
                  >
                    <ClassCard class_data={cls} />
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