"use client";

import { motion } from "framer-motion";
import {
  User,
  Users,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ClassWithStudents } from "../../../types/class";
import { StudentProfileTeacher } from "../../../types/student_profile_teacher";

interface ClassCardProps {
  class_data: ClassWithStudents;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function ClassCard({ class_data, onEdit, onDelete }: ClassCardProps) {
  
  // Count SEN students
  const studentsWithSEN = class_data.students.filter(
    (s) => s.special_educational_needs?.trim()
  );

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
          "border-border"
        )}
      >
        {/* HEADER */}
        <CardHeader className="p-4 sm:p-5 space-y-1.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex-1 min-w-0 pr-2">
              {class_data.class_name}
            </CardTitle>

            {/* Actions Menu */}
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Class actions"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Class
                    </DropdownMenuItem>
                  )}
                  {onEdit && onDelete && <DropdownMenuSeparator />}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* SEN Badge */}
            {studentsWithSEN.length > 0 && (
              <Badge
                className="bg-yellow-500/20 text-yellow-600 border border-yellow-500/40 shrink-0"
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
              {class_data.students.map((student: StudentProfileTeacher) => {
                const hasSEN = student.special_educational_needs?.trim();
                
                return (
                  <div
                    key={student.student_id}
                    className={cn(
                      "text-sm flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
                      hasSEN 
                        ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 font-medium" 
                        : "text-foreground"
                    )}
                  >
                    <User className={cn(
                      "w-3.5 h-3.5",
                      hasSEN ? "text-yellow-600 dark:text-yellow-500" : "text-muted-foreground"
                    )} />
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