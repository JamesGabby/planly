"use client";

import { motion } from "framer-motion";
import { GraduationCap, User, Users, AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Class } from "../../types/class";

export function ClassCard({ class_data }: { class_data: Class }) {
  
  // 🟡 1. Sort students: SEN first
  const sortedStudents = [...class_data.students].sort((a, b) => {
    const aHasSEN = a.special_educational_needs?.trim()?.length > 0;
    const bHasSEN = b.special_educational_needs?.trim()?.length > 0;

    return Number(bHasSEN) - Number(aHasSEN);
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
          "group relative cursor-pointer bg-card text-card-foreground border border-border shadow-sm transition-all duration-200 flex flex-col h-[300px] sm:h-[320px] justify-between",
          "hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
        )}
      >
        {/* HEADER */}
        <CardHeader className="p-4 sm:p-5 space-y-1.5">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {class_data.class_name}
          </CardTitle>

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
                const hasSEN = student.special_educational_needs?.trim()?.length > 0;

                return (
                  <div
                    key={student.student_id}
                    className={cn(
                      "text-sm flex items-center gap-2",
                      hasSEN ? "text-yellow-500 font-medium" : "text-foreground"
                    )}
                  >
                    {hasSEN ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    )}

                    {student.first_name} {student.last_name}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
