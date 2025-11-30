"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  Calendar,
  Clock,
  User,
  Copy,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LessonPlanTutor } from "@/app/dashboard/lesson-plans/types/lesson_tutor";
import { prettyDate, prettyTime } from "../../../utils/helpers";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ------------------------------------ */
/* IMPROVED LESSON CARD COMPONENT       */
/* ------------------------------------ */

interface LessonCardTutorProps {
  lesson: LessonPlanTutor;
  onDelete: () => void;
  onDuplicate: () => void;
  onView?: () => void;
}

export function LessonCardTutor({
  lesson,
  onDelete,
  onDuplicate,
  onView,
}: LessonCardTutorProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/lesson-plans/edit-tutor/${lesson.id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView();
    } else {
      router.push(`/dashboard/lesson-plans/lesson/tutor/${lesson.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDuplicating(true);
    try {
      await onDuplicate();
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative bg-card text-card-foreground border border-border shadow-sm transition-all duration-200 h-full flex flex-col",
          "hover:shadow-lg hover:border-primary/50",
          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        {/* ---------- HEADER ---------- */}
        <CardHeader className="p-4 sm:p-6 space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* --- Lesson Info --- */}
            <div className="flex-1">
              <button
                onClick={handleView}
                className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm group/title w-full"
                aria-label={`View details for ${lesson.topic || "Untitled Lesson"}`}
              >
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover/title:text-primary transition-colors line-clamp-2 mb-2">
                  {lesson.topic || "Untitled Lesson"}
                </CardTitle>
              </button>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5" aria-label="Student information">
                  <User className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium">
                    {lesson.student_profiles?.first_name} {lesson.student_profiles?.last_name}
                  </span>
                </span>
                <span className="flex items-center gap-1.5" aria-label="Lesson date">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  {prettyDate(lesson.date_of_lesson)}
                </span>
                {lesson.time_of_lesson && (
                  <span className="flex items-center gap-1.5" aria-label="Lesson time">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    {prettyTime(lesson.time_of_lesson)}
                  </span>
                )}
              </div>
            </div>

            {/* --- Actions Menu --- */}
            <div onClick={handleDropdownClick}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 data-[state=open]:bg-muted"
                    aria-label="Lesson plan actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    <Edit3 className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDuplicate} 
                    disabled={isDuplicating}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{isDuplicating ? "Duplicating..." : "Duplicate"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {/* ---------- CONTENT ---------- */}
        <CardContent className="p-4 sm:p-6 pt-0 flex-1 flex flex-col">
          {/* --- Objectives --- */}
          {lesson.objectives && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Learning Objectives
              </h3>
              <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed whitespace-pre-line">
                {lesson.objectives}
              </p>
            </div>
          )}

          {/* --- Footer --- */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-border/50">
            {/* Status Badge */}
            <span 
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
              aria-label="Lesson status"
            >
              Tutoring
            </span>

            {/* Quick Actions - Desktop Only */}
            <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="h-8 text-xs"
                aria-label="Edit lesson plan"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleView}
                className="h-8 text-xs"
                aria-label="View lesson plan details"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                View
              </Button>
            </div>

            {/* Mobile CTA */}
            <Button
              size="sm"
              variant="default"
              onClick={handleView}
              className="sm:hidden h-8 text-xs"
              aria-label="View lesson plan details"
            >
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}