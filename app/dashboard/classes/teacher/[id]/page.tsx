"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentProfileTeacher } from "../../../lesson-plans/types/student_profile_teacher";
import { LessonCardSkeleton } from "@/app/dashboard/lesson-plans/skeletons/LessonCardSkeleton";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { StudentCardClass } from "../../../lesson-plans/components/cards/class-cards/StudentCardClass";
import { ClassStudentJoin } from "../../../lesson-plans/types/class";
import { ArrowLeft, UserMinus, UserPlus, Search, Check, Plus, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";

interface Props {
  params: Promise<{ id: string }>;
}

const supabase = createClient();

export default function TeacherClassStudentsPage({ params }: Props) {
  const paramsObj = React.use(params);
  const { id } = paramsObj;

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProfileTeacher[]>([]);
  const [studentToRemove, setStudentToRemove] = useState<StudentProfileTeacher | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Add student dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentProfileTeacher[]>([]);
  const [addStudentSearch, setAddStudentSearch] = useState("");
  const [loadingAllStudents, setLoadingAllStudents] = useState(false);
  const [addingStudentId, setAddingStudentId] = useState<string | null>(null);

  // Create student dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const [className, setClassName] = useState<string | null>(null);
  const studentCount = students.length;

  const fetchStudentsForClass = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: classData, error: classError } = await supabase
        .from("teacher_classes")
        .select("class_name")
        .eq("class_id", id)
        .single();

      if (classError) throw classError;
      setClassName(classData?.class_name || "Unnamed Class");

      const { data, error } = await supabase
        .from("teacher_class_students")
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

  // Fetch all students when add dialog opens
  const fetchAllStudents = async () => {
    setLoadingAllStudents(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("teacher_student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("first_name", { ascending: true });

      if (error) throw error;
      setAllStudents(data || []);
    } catch (err) {
      const errorObj = err as Error;
      toast.error(errorObj.message);
    } finally {
      setLoadingAllStudents(false);
    }
  };

  // Open dialog and fetch students
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
    fetchAllStudents();
  };

  // Create new student and add to class
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStudentFirstName.trim() || !newStudentLastName.trim()) {
      toast.error("Please enter both first and last name");
      return;
    }

    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the student profile
      const { data: newStudent, error: createError } = await supabase
        .from("teacher_student_profiles")
        .insert({
          first_name: newStudentFirstName.trim(),
          last_name: newStudentLastName.trim(),
          class_name: className,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add student to class
      const { error: addError } = await supabase
        .from("teacher_class_students")
        .insert({
          class_id: id,
          student_id: newStudent.student_id,
        });

      if (addError) throw addError;

      // Update local state
      setStudents((prev) => [...prev, newStudent]);

      toast.success(`${newStudent.first_name} ${newStudent.last_name} has been created and added to ${className}.`);

      // Reset form and close dialog
      setNewStudentFirstName("");
      setNewStudentLastName("");
      setCreateDialogOpen(false);

    } catch (err) {
      const errorObj = err as Error;
      toast.error(errorObj.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Add student to class
  const handleAddStudent = async (student: StudentProfileTeacher) => {
    setAddingStudentId(student.student_id);

    try {
      const { error } = await supabase
        .from("teacher_class_students")
        .insert({
          class_id: id,
          student_id: student.student_id,
        });

      if (error) throw error;

      // Update local state optimistically
      setStudents((prev) => [...prev, student]);

      toast.success(`${student.first_name} ${student.last_name} has been added to ${className}.`);

      // Close dialog after short delay for better UX
      setTimeout(() => {
        setAddDialogOpen(false);
        setAddStudentSearch("");
      }, 500);

    } catch (err) {
      const errorObj = err as Error;
      toast.error(errorObj.message);
    } finally {
      setAddingStudentId(null);
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    setIsRemoving(true);

    try {
      const { error } = await supabase
        .from("teacher_class_students")
        .delete()
        .eq("class_id", id)
        .eq("student_id", studentToRemove.student_id);

      if (error) throw error;

      setStudents((prev) =>
        prev.filter((s) => s.student_id !== studentToRemove.student_id)
      );

      toast.success(`${studentToRemove.first_name} ${studentToRemove.last_name} has been removed from ${className}.`);

      setStudentToRemove(null);

    } catch (err) {
      const errorObj = err as Error;
      toast.error(errorObj.message);
    } finally {
      setIsRemoving(false);
    }
  };

  // Filter students for add dialog
  const studentsToAdd = useMemo(() => {
    const currentStudentIds = new Set(students.map(s => s.student_id));

    return allStudents
      .filter((s) => {
        // Filter out students already in class
        if (currentStudentIds.has(s.student_id)) return false;

        // Search filter
        if (!addStudentSearch) return true;
        const q = addStudentSearch.toLowerCase();
        return (
          s.first_name?.toLowerCase().includes(q) ||
          s.last_name?.toLowerCase().includes(q)
        );
      });
  }, [allStudents, students, addStudentSearch]);

  // Filters for main list
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
        <div className="mb-6">
          {/* Title Section */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {className ?? "Loading class..."}
            </h1>
            {className && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-sm sm:text-base text-muted-foreground">
                  {studentCount} student{studentCount !== 1 ? "s" : ""}
                </span>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  Viewing all students in this class
                </p>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={fetchStudentsForClass}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
              Refresh
            </Button>

            {/* Add to Class Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleOpenAddDialog}
                  className="w-full sm:w-auto gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add to Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[80vh] mx-4 sm:mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Add Students to {className}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Select students to add to this class. Students already in the class are not shown.
                  </DialogDescription>
                </DialogHeader>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={addStudentSearch}
                    onChange={(e) => setAddStudentSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Students list */}
                <ScrollArea className="h-[50vh] sm:h-[400px] pr-4">
                  {loadingAllStudents ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : studentsToAdd.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      {allStudents.length === 0 ? (
                        <>
                          <p>No student profiles found.</p>
                          <Button
                            onClick={() => {
                              setAddDialogOpen(false);
                              setCreateDialogOpen(true);
                            }}
                            className="mt-4"
                            size="sm"
                          >
                            Create Student Profile
                          </Button>
                        </>
                      ) : (
                        <p>
                          {addStudentSearch
                            ? "No students match your search."
                            : "All your students are already in this class."}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {studentsToAdd.map((student) => {
                        const isAdding = addingStudentId === student.student_id;
                        const hasSEN = !!student.special_educational_needs?.trim();

                        return (
                          <motion.div
                            key={student.student_id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium truncate">
                                    {student.first_name} {student.last_name}
                                  </p>
                                  {hasSEN && (
                                    <Badge className="bg-yellow-500/20 text-yellow-600 border border-yellow-500/40 text-xs flex-shrink-0">
                                      SEN
                                    </Badge>
                                  )}
                                </div>
                                {student.class_name && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    Current class: {student.class_name}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => handleAddStudent(student)}
                              disabled={isAdding}
                              className="w-full sm:w-auto gap-2 flex-shrink-0"
                            >
                              {isAdding ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" />
                                  Add
                                </>
                              )}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Create New Student Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
                  <span className="sm:hidden">New Student</span>
                  <span className="hidden sm:inline">Create New Student</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-auto">
                <form onSubmit={handleCreateStudent}>
                  <DialogHeader>
                    <DialogTitle>Create New Student</DialogTitle>
                    <DialogDescription>
                      Create a new student profile and add them to {className}.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={newStudentFirstName}
                        onChange={(e) => setNewStudentFirstName(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={newStudentLastName}
                        onChange={(e) => setNewStudentLastName(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="class">Class</Label>
                      <Input
                        id="class"
                        value={className || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Student will be automatically added to this class
                      </p>
                    </div>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateDialogOpen(false);
                        setNewStudentFirstName("");
                        setNewStudentLastName("");
                      }}
                      disabled={isCreating}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      {isCreating ? "Creating..." : "Create & Add"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students in this class..."
              className="pl-9"
            />
          </div>
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
            <p className="text-muted-foreground mb-4">
              {students.length === 0
                ? "No students in this class yet."
                : "No students match your search."}
            </p>
            {students.length === 0 && (
              <div className="flex gap-2 justify-center">
                <Button onClick={handleOpenAddDialog} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Students to Class
                </Button>
                <Button onClick={() => setCreateDialogOpen(true)} variant="outline" className="gap-2">
                  Create New Student
                </Button>
              </div>
            )}
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
                  className="h-full relative group"
                >
                  {/* Remove button - appears on hover */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStudentToRemove(student);
                    }}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>

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

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!studentToRemove} onOpenChange={(open) => !open && setStudentToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove student from class?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {studentToRemove?.first_name} {studentToRemove?.last_name}
              </span>{" "}
              from <span className="font-semibold">{className}</span>? This will not delete the student profile, only remove them from this class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStudent}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}