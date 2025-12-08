"use client";

import { motion } from "framer-motion";
import {
  Users,
  MoreVertical,
  Edit,
  Trash2,
  GraduationCap,
  AlertCircle,
  UserPlus,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ClassWithStudents } from "../../../types/class";
import { StudentProfileTeacher } from "../../../types/student_profile_teacher";

interface ClassCardProps {
  class_data: ClassWithStudents;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onAddStudent?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

// Get initials from name
const getInitials = (firstName?: string | null, lastName?: string | null) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
};

// Generate consistent color based on name
const getAvatarColor = (name?: string | null) => {
  const colors = [
    "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    "bg-green-500/20 text-green-600 dark:text-green-400",
    "bg-purple-500/20 text-purple-600 dark:text-purple-400",
    "bg-pink-500/20 text-pink-600 dark:text-pink-400",
    "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    "bg-teal-500/20 text-teal-600 dark:text-teal-400",
  ];
  const safeName = name || "";
  const index = safeName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

// Student Avatar Component
const StudentAvatar = ({
  student,
  showTooltip = true
}: {
  student: StudentProfileTeacher;
  showTooltip?: boolean;
}) => {
  const hasSEN = student.special_educational_needs?.trim();
  const initials = getInitials(student.first_name, student.last_name);
  const colorClass = getAvatarColor(`${student.first_name}${student.last_name}`);

  const avatar = (
    <Avatar className={cn(
      "h-8 w-8 border-2 border-background transition-transform hover:scale-110 hover:z-10",
      hasSEN && "ring-2 ring-yellow-500/50 ring-offset-1 ring-offset-background"
    )}>
      <AvatarFallback className={cn("text-xs font-medium", colorClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip) return avatar;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {avatar}
        </TooltipTrigger>
        <TooltipContent side="top" className="flex flex-col gap-1">
          <span className="font-medium">
            {student.first_name} {student.last_name}
          </span>
          {hasSEN && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              SEN: {student.special_educational_needs}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Stacked Avatars Component
const StackedAvatars = ({
  students,
  maxDisplay = 5
}: {
  students: StudentProfileTeacher[];
  maxDisplay?: number;
}) => {
  const displayStudents = students.slice(0, maxDisplay);
  const remainingCount = students.length - maxDisplay;

  return (
    <div className="flex items-center -space-x-2">
      {displayStudents.map((student) => (
        <StudentAvatar key={student.student_id} student={student} />
      ))}
      {remainingCount > 0 && (
        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};

// Stats Badge Component
const StatsBadge = ({
  icon: Icon,
  value,
  label,
  variant = "default"
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  variant?: "default" | "warning";
}) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "warning" && "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
        )}>
          <Icon className="w-3 h-3" />
          <span>{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{value} {label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ClassCard({
  class_data,
  onEdit,
  onDelete,
  onAddStudent,
  onClick
}: ClassCardProps) {
  const studentsWithSEN = class_data.students.filter(
    (s) => s.special_educational_needs?.trim()
  );
  const totalStudents = class_data.students.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={cn(
          "group relative bg-card text-card-foreground border shadow-sm",
          "transition-all duration-300 ease-out",
          "flex flex-col h-[340px] sm:h-[360px]",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
          onClick && "cursor-pointer active:scale-[0.98]"
        )}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* HEADER */}
        <CardHeader className="p-4 sm:p-5 pb-3 space-y-3">
          {/* Top row: Icon, Title, Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Class Icon */}
              <div className={cn(
                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-primary/10 text-primary",
                "group-hover:bg-primary group-hover:text-primary-foreground",
                "transition-colors duration-300"
              )}>
                <GraduationCap className="w-5 h-5" />
              </div>

              {/* Title & Year Group */}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {class_data.class_name}
                </CardTitle>
                {class_data.year_group && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {class_data.year_group}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "shrink-0 h-8 w-8 rounded-lg",
                      "opacity-0 group-hover:opacity-100",
                      "hover:bg-accent transition-all duration-200"
                    )}
                    aria-label="Class actions"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit} className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Class
                    </DropdownMenuItem>
                  )}
                  {onAddStudent && (
                    <DropdownMenuItem onClick={onAddStudent} className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Add Student
                    </DropdownMenuItem>
                  )}
                  {(onEdit || onAddStudent) && onDelete && <DropdownMenuSeparator />}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Class
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatsBadge
              icon={Users}
              value={totalStudents}
              label={totalStudents === 1 ? "student" : "students"}
            />
            {studentsWithSEN.length > 0 && (
              <StatsBadge
                icon={AlertCircle}
                value={studentsWithSEN.length}
                label="students with SEN"
                variant="warning"
              />
            )}
          </div>
        </CardHeader>

        {/* FOOTER */}
        <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/50 mt-auto">
          <div className="flex items-center justify-between w-full">
            {/* Stacked Avatars Preview */}
            {totalStudents > 0 ? (
              <StackedAvatars students={class_data.students} maxDisplay={4} />
            ) : (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Ready for students
              </div>
            )}

            {/* Quick Action */}
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                View Details
                <motion.span
                  className="ml-1"
                  initial={{ x: 0 }}
                  whileHover={{ x: 2 }}
                >
                  →
                </motion.span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
