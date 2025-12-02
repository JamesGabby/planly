"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClassesFiltersCard } from "../filters/class";
import { Pagination } from "@/components/pagination";
import { LessonCardSkeleton } from "../lesson-plans/skeletons/LessonCardSkeleton";
import Link from "next/link";
import { ClassCard } from "../lesson-plans/components/cards/class-cards/ClassCard";
import { Class, ClassStudentJoin, ClassWithStudents } from "../lesson-plans/types/class";
import { StudentProfileTeacher } from "../lesson-plans/types/student_profile_teacher";
import { useUserMode } from "@/components/UserModeContext";
import { redirect, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient();

export default function ClassesDashboard() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassWithStudents[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYearGroup, setSelectedYearGroup] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [userId, setUserId] = useState("");

  // Create class dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newYearGroup, setNewYearGroup] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Delete class states
  const [classToDelete, setClassToDelete] = useState<ClassWithStudents | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { mode } = useUserMode();
  if (mode === 'tutor') redirect('/dashboard/student-profiles');

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
        .eq("user_id", userId)
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
      await fetchClasses(user.id);
    }

    load();
  }, [fetchClasses]);

  // Create new class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClassName.trim()) {
      toast.error("Please enter a class name");
      return;
    }

    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the class
      const { data: newClass, error: createError } = await supabase
        .from("classes")
        .insert({
          class_name: newClassName.trim(),
          year_group: newYearGroup.trim() || null,
          user_id: user.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state with empty students array
      const newClassWithStudents: ClassWithStudents = {
        ...newClass,
        students: [],
      };

      setClasses((prev) => [newClassWithStudents, ...prev]);

      toast.success(`Class "${newClass.class_name}" has been created successfully.`);

      // Reset form and close dialog
      setNewClassName("");
      setNewYearGroup("");
      setCreateDialogOpen(false);

    } catch (err) {
      const errorObj = err as Error;

      // Handle unique constraint violation
      if (errorObj.message.includes("duplicate key") || errorObj.message.includes("unique")) {
        toast.error("A class with this name already exists. Please choose a different name.");
      } else {
        toast.error(errorObj.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Delete class
  const handleDeleteClass = async () => {
    if (!classToDelete) return;

    setIsDeleting(true);

    try {
      // First, delete all class_students associations
      const { error: studentsError } = await supabase
        .from("class_students")
        .delete()
        .eq("class_id", classToDelete.class_id);

      if (studentsError) throw studentsError;

      // Then delete the class
      const { error: classError } = await supabase
        .from("classes")
        .delete()
        .eq("class_id", classToDelete.class_id);

      if (classError) throw classError;

      // Update local state
      setClasses((prev) => prev.filter((c) => c.class_id !== classToDelete.class_id));

      toast.success(`Class "${classToDelete.class_name}" has been deleted successfully.`);

      setClassToDelete(null);

    } catch (err) {
      const errorObj = err as Error;
      toast.error(`Failed to delete class: ${errorObj.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit navigation
  const handleEditClass = (classId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/classes/${classId}`);
  };

  // Handle delete click
  const handleDeleteClick = (cls: ClassWithStudents, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setClassToDelete(cls);
  };

  // --- Memo for filter options ---
  // Extract unique class names
  const classNames = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => c.class_name && set.add(c.class_name));
    return Array.from(set).sort();
  }, [classes]);

  // Extract unique year groups
  const yearGroups = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => c.year_group && set.add(c.year_group));
    return Array.from(set).sort();
  }, [classes]);

  // Extract unique student names from all classes
  const studentNames = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => {
      c.students?.forEach((s: StudentProfileTeacher) => {
        const name = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
        if (name) set.add(name);
      });
    });
    return Array.from(set).sort();
  }, [classes]);

  // Apply filters
  const filtered = useMemo(() => {
    return classes.filter((c) => {
      // Class name filter
      if (selectedClass && c.class_name !== selectedClass) return false;

      // Year group filter
      if (selectedYearGroup && c.year_group !== selectedYearGroup) return false;

      // Student filter - check if selected student is in this class
      if (selectedStudent) {
        const hasStudent = c.students?.some((s: StudentProfileTeacher) => {
          const studentFullName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
          return studentFullName === selectedStudent;
        });
        if (!hasStudent) return false;
      }

      // Search filter
      if (!search) return true;
      const searchLower = search.toLowerCase();

      return (
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
        })
      );
    });
  }, [classes, search, selectedClass, selectedYearGroup, selectedStudent]);

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
              Manage your classes and their students
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={() => fetchClasses(userId)}>
              Refresh
            </Button>

            {/* Create Class Dialog */}
<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
  <DialogTrigger asChild>
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Create Class
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleCreateClass}>
      <DialogHeader>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogDescription>
          Add a new class to organize your students.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="className">
            Class Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="className"
            placeholder="e.g., 7X"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            disabled={isCreating}
            required
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            Choose a unique name for your class
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="yearGroup">Year Group (Optional)</Label>
          <Select
            value={newYearGroup || undefined}
            onValueChange={setNewYearGroup}
            disabled={isCreating}
          >
            <SelectTrigger id="yearGroup">
              <SelectValue placeholder="Select year group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Year 1">Year 1</SelectItem>
              <SelectItem value="Year 2">Year 2</SelectItem>
              <SelectItem value="Year 3">Year 3</SelectItem>
              <SelectItem value="Year 4">Year 4</SelectItem>
              <SelectItem value="Year 5">Year 5</SelectItem>
              <SelectItem value="Year 6">Year 6</SelectItem>
              <SelectItem value="Year 7">Year 7</SelectItem>
              <SelectItem value="Year 8">Year 8</SelectItem>
              <SelectItem value="Year 9">Year 9</SelectItem>
              <SelectItem value="Year 10">Year 10</SelectItem>
              <SelectItem value="Year 11">Year 11</SelectItem>
              <SelectItem value="Year 12">Year 12</SelectItem>
              <SelectItem value="Year 13">Year 13</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Helps organise classes by year group
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCreateDialogOpen(false);
            setNewClassName("");
            setNewYearGroup("");
          }}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Class"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Filters */}
        <ClassesFiltersCard
          search={search}
          setSearch={setSearch}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedYearGroup={selectedYearGroup}
          setSelectedYearGroup={setSelectedYearGroup}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          classes={classNames}
          yearGroups={yearGroups}
          students={studentNames}
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
            {classes.length === 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">No classes yet. Create your first class to get started.</p>
                <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Class
                </Button>
              </div>
            ) : (
              <p>No classes found. Try adjusting your filters.</p>
            )}
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
                    <ClassCard
                      class_data={cls}
                      onEdit={(e) => handleEditClass(cls.class_id, e)}
                      onDelete={(e) => handleDeleteClick(cls, e)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!classToDelete} onOpenChange={(open) => !open && setClassToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {classToDelete?.class_name}
                  </span>
                  ?
                </div>
                {classToDelete && classToDelete.students.length > 0 && (
                  <div className="text-amber-600 dark:text-amber-500 font-medium">
                    ⚠️ This class has {classToDelete.students.length} student{classToDelete.students.length !== 1 ? "s" : ""}.
                    They will be removed from this class but their profiles will not be deleted.
                  </div>
                )}
                <div className="text-muted-foreground">This action cannot be undone.</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Class"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}