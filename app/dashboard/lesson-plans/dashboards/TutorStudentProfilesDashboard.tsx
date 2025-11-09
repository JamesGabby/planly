"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { FiltersCard } from "../components/FiltersCard";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentCard } from "../components/lesson-cards/StudentCard";
import { StudentMobileResponsiveModal } from "../components/StudentMobileResponsiveModal";

const supabase = createClient();

export default function TutorStudentProfilesDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedLevel, setSelectedLevel] = useState<string | "">("");

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
        .order("student_id", { ascending: true });

      if (error) throw error;

      setStudents(data ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  const levels = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.level && set.add(s.level));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (selectedLevel && s.level !== selectedLevel) return false;
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        (s.first_name ?? "").toLowerCase().includes(term) ||
        (s.last_name ?? "").toLowerCase().includes(term) ||
        (s.interests ?? "").toLowerCase().includes(term)
      );
    });
  }, [students, search, selectedLevel]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("student_profiles")
        .delete()
        .eq("student_id", confirmDelete.student_id);

      if (error) {
        toast.error(`Failed: ${error.message}`);
      } else {
        setStudents((prev) =>
          prev.filter((p) => p.student_id !== confirmDelete.student_id)
        );
        toast.success("Student removed ✔");
      }
    } catch (err) {
      toast.error("Unexpected error");
    } finally {
      setConfirmDelete(null);
    }
  }

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
            selectedClass={selectedLevel} // ✅ Reuse as level
            setSelectedClass={setSelectedLevel}
            classes={levels} // ✅ Reuse classes dropdown for levels
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
                    className="cursor-pointer h-full"
                    onClick={() => setSelectedStudent(student)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <StudentCard
                      student={student}
                      onDelete={() => setConfirmDelete(student)}
                    />
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

        {/* Expanded Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <StudentMobileResponsiveModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
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
