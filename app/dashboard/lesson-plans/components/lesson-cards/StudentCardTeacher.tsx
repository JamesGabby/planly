"use client";

import { motion } from "framer-motion";
import {
  Star,
  Sparkles,
  BicepsFlexed,
  Target,
  AlertTriangle,
  GraduationCap
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StudentProfileTeacher } from "../../types/student_profile_teacher";

export function StudentCardTeacher({
  student,
}: {
  student: StudentProfileTeacher;
}) {
  const fullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    "Unnamed Student";

  const noData =
    !student.special_educational_needs &&
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
          "group relative cursor-pointer bg-card text-card-foreground border border-border shadow-sm transition-all duration-200 flex flex-col h-[300px] sm:h-[320px] justify-between",
          "hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
        )}
      >

        {/* HEADER */}
        <CardHeader className="p-4 sm:p-5 space-y-1.5">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {fullName}
          </CardTitle>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5" />
            Classes: {student.class_name}
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-4 sm:p-5 space-y-3 flex-1 overflow-hidden">
          {noData ? (
            <div className="flex flex-col items-center justify-center text-center py-6 text-sm text-muted-foreground italic">
              <span>No additional information has been provided for this student.</span>
            </div>
          ) : (
            <>
              {/* SEN */}
              {student.special_educational_needs && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5 text-yellow-500">
                  <AlertTriangle className="w-3.5 h-3.5 mt-1 shrink-0 text-yellow-500" />
                  {student.special_educational_needs}
                </p>
              )}

              {/* Goals */}
              {student.goals && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 mt-1 shrink-0" />
                  {student.goals}
                </p>
              )}

              {/* Interests */}
              {student.interests && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 mt-1 shrink-0" />
                  {student.interests}
                </p>
              )}

              {/* Strengths */}
              {student.strengths && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <BicepsFlexed className="w-3.5 h-3.5 mt-1 shrink-0" />
                  {student.strengths}
                </p>
              )}

              {/* Weaknesses */}
              {student.weaknesses && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 mt-1 shrink-0" />
                  {student.weaknesses}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
