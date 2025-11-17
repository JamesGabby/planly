"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  Calendar,
  Clock,
  GraduationCap,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { prettyDate, prettyTime } from "../../utils/helpers";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

/* ------------------------------------ */
/* ADVANCED LESSON CARD COMPONENT       */
/* ------------------------------------ */
export function LessonCardStudent({
  lesson,
  onDelete,
  onDuplicate,
}: {
  lesson: LessonPlanTeacher;
  onDelete: () => void;
  onDuplicate: () => void;
}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative cursor-pointer bg-card text-card-foreground border border-border shadow-sm transition-all duration-200 h-full flex flex-col justify-between",
          "hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
        )}
      >
        {/* ---------- HEADER ---------- */}
        <CardHeader className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* --- Lesson Info --- */}
            <div className="space-y-2">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {lesson.topic ?? "Untitled Lesson"}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground leading-relaxed">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {lesson.year_group}{` • `}{lesson.class}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {prettyDate(lesson.date_of_lesson)}
                </span>
                {lesson.time_of_lesson && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {prettyTime(lesson.time_of_lesson)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400">
                  Student
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* ---------- CONTENT ---------- */}
        <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {lesson.objectives || "No description available."}
          </p>

          {/* --- Mobile Quick Actions --- */}
          <div className="flex sm:hidden justify-start gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.blur(); // removes focus immediately
                      onDuplicate();
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/dashboard/lesson-plans/${lesson.id}/edit`;
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* --- Desktop Hover Quick Actions --- */}
          <div className="hidden sm:flex absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/dashboard/lesson-plans/${lesson.id}/edit`;
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
