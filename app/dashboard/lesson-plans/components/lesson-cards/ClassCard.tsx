"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  User,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Class } from "../../types/class";

export function ClassCard({ class_data }: { class_data: Class }) {
  
  // 🟡 1. Identify SEN students
  const studentsWithSEN = class_data.students.filter(
    (s) => s.special_educational_needs?.trim()
  );
  const hasSEN = studentsWithSEN.length > 0;

  // 🟡 2. Sort students: SEN first
  const sortedStudents = [...class_data.students].sort((a, b) => {
    const aHas = a.special_educational_needs?.trim()?.length > 0;
    const bHas = b.special_educational_needs?.trim()?.length > 0;
    return Number(bHas) - Number(aHas);
  });

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
          "group relative cursor-pointer bg-card text-card-foreground border shadow-sm transition-all duration-200 flex flex-col h-[300px] sm:h-[320px] justify-between",
          "hover:shadow-md active:scale-[0.99]",
          hasSEN
            ? "border-yellow-500/70 shadow-[0_0_10px_rgba(234,179,8,0.35)]"
            : "border-border"
        )}
      >
        {/* HEADER */}
        <CardHeader className="p-4 sm:p-5 space-y-1.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {class_data.class_name}
            </CardTitle>

            {/* 🟡 SEN Badge */}
            {hasSEN && (
              <Badge
                className="bg-yellow-500/20 text-yellow-600 border border-yellow-500/40"
              >
                {studentsWithSEN.length} SEN
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {class_data.students.length} student
            {class_data.students.length !== 1 ? "s" : ""}
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-4 sm:p-5 space-y-3 flex-1 overflow-hidden">
          {class_data.students.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">
              No students assigned to this class yet.
            </p>
          ) : (
            <div className="space-y-1 overflow-y-auto max-h-[160px] pr-1">
              {sortedStudents.map((student: any) => {
                const hasSEN =
                  student.special_educational_needs?.trim()?.length > 0;

                return (
                  <TooltipProvider key={student.student_id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "text-sm flex items-center gap-2 cursor-default",
                            hasSEN
                              ? "text-yellow-500 font-medium"
                              : "text-foreground"
                          )}
                        >
                          {hasSEN ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                          )}

                          {student.first_name} {student.last_name}
                        </div>
                      </TooltipTrigger>

                      {/* 🟡 Tooltip with SEN details */}
                      {hasSEN && (
                        <TooltipContent className="max-w-xs bg-yellow-50 text-yellow-800 border border-yellow-300">
                          {student.special_educational_needs}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
