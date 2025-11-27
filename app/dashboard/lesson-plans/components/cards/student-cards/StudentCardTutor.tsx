"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  BicepsFlexed,
  Target,
  AlertTriangle,
  Star,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StudentProfileTutor } from "../../../types/student_profile_tutor";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function StudentCard({
  student,
  onDelete,
  onDuplicate,
}: {
  student: StudentProfileTutor;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const fullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    "Unnamed Student";

  const hasSEN = !!student.sen?.trim();

  const noData =
    !student.sen &&
    !student.goals &&
    !student.interests &&
    !student.strengths &&
    !student.weaknesses;

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
          "group relative cursor-pointer bg-card text-card-foreground border shadow-sm transition-all duration-200 h-full flex flex-col justify-between",
          "hover:shadow-md hover:border-primary/30 active:scale-[0.99]",
          hasSEN && "border-yellow-500/70 shadow-[0_0_10px_rgba(234,179,8,0.35)]"
        )}
      >
        {/* ---------- HEADER ---------- */}
        <CardHeader className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* --- Student Info --- */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle
                  className={cn(
                    "text-base sm:text-lg font-semibold transition-colors line-clamp-2",
                    hasSEN ? "text-yellow-500" : "text-foreground group-hover:text-primary"
                  )}
                >
                  {fullName}
                </CardTitle>

                {hasSEN && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 border border-yellow-500/40 shrink-0">
                    SEN
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground leading-relaxed">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  Level: {student.level}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400">
                  Profile
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* ---------- CONTENT ---------- */}
        <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
          {noData ? (
            <div className="flex flex-col items-center justify-center text-center py-6 text-sm text-muted-foreground italic">
              <span>No additional information has been provided for this student.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* SEN */}
              {student.sen && (
                <p className="text-sm line-clamp-2 flex items-start gap-1.5 text-yellow-500 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{student.sen}</span>
                </p>
              )}

              {/* Goals */}
              {student.goals && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{student.goals}</span>
                </p>
              )}

              {/* Interests */}
              {student.interests && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{student.interests}</span>
                </p>
              )}

              {/* Strengths */}
              {student.strengths && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <BicepsFlexed className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{student.strengths}</span>
                </p>
              )}

              {/* Weaknesses */}
              {student.weaknesses && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <LineChart className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{student.weaknesses}</span>
                </p>
              )}
            </div>
          )}

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
                      e.currentTarget.blur();
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
                      window.location.href = `/dashboard/student-profiles/tutor/${student.student_id}`;
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
                      window.location.href = `/dashboard/student-profiles/${student.student_id}`;
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