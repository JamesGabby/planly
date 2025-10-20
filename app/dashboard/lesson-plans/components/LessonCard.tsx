"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { prettyDate, prettyTime } from "../utils/helpers";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

/* ------------------------------------ */
/* MAIN LESSON CARD COMPONENT           */
/* ------------------------------------ */
export function LessonCard({
  lesson,
  onDelete,
}: {
  lesson: LessonPlan;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
                  {lesson.class ?? "Unknown class"}
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

              {lesson.status && (
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                    lesson.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400"
                  )}
                >
                  {lesson.status}
                </span>
              )}
            </div>

            {/* --- Dropdown Menu --- */}
            <div className="self-end sm:self-start">
              <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More options"
                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="z-50 min-w-[160px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="p-1"
                    >
                      <DropdownMenu.Item asChild>
                        <a
                          href={`/dashboard/lesson-plans/${lesson.id}/edit`}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </a>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                          setTimeout(() => onDelete(), 120);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenu.Item>
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/dashboard/lesson-plans/${lesson.id}/edit`;
              }}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* --- Desktop Hover Quick Actions --- */}
          <div className="hidden sm:flex absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
