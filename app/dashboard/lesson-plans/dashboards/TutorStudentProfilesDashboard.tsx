"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TutorStudentProfileFiltersCard } from "../../filters/student-tutor";
import { LessonCardSkeleton } from "../skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentCardTutor } from "../components/cards/student-cards/StudentCardTutor";
import Link from "next/link";
import { StudentProfileTutor } from "../types/student_profile_tutor";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { MobileResponsiveModalStudent } from "../components/MobileResponsiveModalStudent";

const supabase = createClient();

const ITEMS_PER_PAGE = 6;

export default function TutorStudentProfilesDashboard() {
  const [students, setStudents] = useState<StudentProfileTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<StudentProfileTutor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StudentProfileTutor | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        setUserId(user.id);
        await fetchStudents(user.id);
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Failed to authenticate");
        setLoading(false);
      }
    }

    load();
  }, []);

  async function fetchStudents(userId: string) {
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("tutor_student_profiles")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setStudents(data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load student profiles";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Extract unique student names
  const studentNames = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      const name = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [students]);

  // Extract unique levels
  const levels = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.level) set.add(s.level);
    });
    return Array.from(set).sort();
  }, [students]);

  // Apply filters
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const studentName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();

      // Student name filter
      if (selectedStudent && studentName !== selectedStudent) return false;

      // Level filter
      if (selectedLevel && s.level !== selectedLevel) return false;

      // Search filter
      if (!search) return true;
      const srch = search.toLowerCase();

      return (
        (s.first_name ?? "").toLowerCase().includes(srch) ||
        (s.last_name ?? "").toLowerCase().includes(srch) ||
        (s.level ?? "").toLowerCase().includes(srch) ||
        (s.goals ?? "").toLowerCase().includes(srch) ||
        (s.strengths ?? "").toLowerCase().includes(srch) ||
        (s.weaknesses ?? "").toLowerCase().includes(srch) ||
        (s.notes ?? "").toLowerCase().includes(srch) ||
        (s.interests ?? "").toLowerCase().includes(srch) ||
        (s.learning_preferences ?? "").toLowerCase().includes(srch) ||
        (s.sen ?? "").toLowerCase().includes(srch) ||
        studentName.toLowerCase().includes(srch)
      );
    });
  }, [students, search, selectedStudent, selectedLevel]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedStudent, selectedLevel]);

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from("tutor_student_profiles")
        .delete()
        .eq("student_id", confirmDelete.student_id);

      if (deleteError) throw deleteError;
      console.log(deleteError);

      setStudents((prev) => prev.filter((s) => s.student_id !== confirmDelete.student_id));
      toast.success("Student profile deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);

      const errorMessage =
        (typeof err === 'object' && err !== null && 'code' in err && err.code === '23503')
          ? "You have lessons created with this student. To remove the student, remove any lessons you have with the student first."
          : (err instanceof Error ? err.message : "Failed to delete student profile");
      toast.error(errorMessage);
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleDuplicateStudent(student: StudentProfileTutor) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { student_id, created_at, ...studentData } = student;

      const copy = {
        ...studentData,
        first_name: `${student.first_name} (Copy)`,
      };

      const { data, error: duplicateError } = await supabase
        .from("tutor_student_profiles")
        .insert([copy])
        .select()
        .single();

      if (duplicateError) throw duplicateError;

      if (data) {
        setStudents((prev) => [data, ...prev]);
        toast.success("Student profile duplicated successfully!");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      const errorMessage = err instanceof Error
        ? `Failed to duplicate: ${err.message}`
        : "Failed to duplicate student profile";
      toast.error(errorMessage);
    }
  }

  const backgroundClass = selectedStudentProfile || confirmDelete
    ? "scale-[0.987] blur-sm transition-all duration-300"
    : "transition-all duration-300";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto relative">
        <div className={backgroundClass}>
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Profiles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and browse your student profiles
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => userId && fetchStudents(userId)}
                disabled={loading || !userId}
              >
                Refresh
              </Button>
              <Button asChild>
                <Link href="/dashboard/student-profiles/new">Add Student</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Filters */}
          <TutorStudentProfileFiltersCard
            search={search}
            setSearch={setSearch}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            students={studentNames}
            levels={levels}
          />

          <Separator className="my-6" />

          {/* Students */}
          {error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
              <p className="text-destructive font-semibold mb-2">Error Loading Student Profiles</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => userId && fetchStudents(userId)}
                disabled={loading}
              >
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <LessonCardSkeleton key={`skeleton-${i}`} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No student profiles found</p>
              <p className="text-sm mb-6">
                Try adjusting your filters or add a new student profile
              </p>
              <Button asChild>
                <Link href="/dashboard/student-profiles/new">Add Student Profile</Link>
              </Button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
              >
                {paginated.map((student) => (
                  <motion.div
                    layoutId={student.student_id}
                    key={student.student_id}
                    className="cursor-pointer h-full"
                    onClick={() => setSelectedStudentProfile(student)}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <StudentCardTutor
                      student={student}
                      onDelete={() => setConfirmDelete(student)}
                      onDuplicate={() => handleDuplicateStudent(student)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {filtered.length > ITEMS_PER_PAGE && (
                <div className="mb-8">
                  <Pagination
                    totalItems={filtered.length}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Expanded modal */}
        <AnimatePresence>
          {selectedStudentProfile && (
            <MobileResponsiveModalStudent
              student={selectedStudentProfile}
              onClose={() => setSelectedStudentProfile(null)}
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