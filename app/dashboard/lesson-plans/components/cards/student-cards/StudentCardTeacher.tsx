"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  TrendingUp,
  Target,
  AlertCircle,
  GraduationCap,
  TrendingDown,
  MoreVertical,
  Info,
  ExternalLink,
  Plus,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StudentProfileTeacher } from "../../../types/student_profile_teacher";
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
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface StudentCardTeacherProps {
  student: StudentProfileTeacher;
  onDelete: () => void;
  onDuplicate: () => void;
}

interface StudentClass {
  class_id: string;
  class_name: string;
}

interface ClassStudentData {
  class_id: string;
  classes: {
    class_id: string;
    class_name: string;
  } | null;
}

// Helper function to get year group styling based on school level
function getYearGroupStyle(yearGroup: string | null | undefined) {
  if (!yearGroup) return null;

  // Extract year number from strings like "Year 7" or "7"
  const yearMatch = yearGroup.match(/\d+/);
  const yearNumber = yearMatch ? parseInt(yearMatch[0], 10) : null;

  if (yearNumber === null) {
    return {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-300 dark:border-gray-600",
      label: yearGroup,
      stage: "Other",
    };
  }

  // Primary School: Years 1-6 (Key Stage 1 & 2)
  if (yearNumber >= 1 && yearNumber <= 6) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800",
      label: yearGroup,
      stage: yearNumber <= 2 ? "KS1" : "KS2",
      level: "Primary",
    };
  }

  // Secondary School: Years 7-11 (Key Stage 3 & 4)
  if (yearNumber >= 7 && yearNumber <= 11) {
    return {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      label: yearGroup,
      stage: yearNumber <= 9 ? "KS3" : "KS4",
      level: "Secondary",
    };
  }

  // Sixth Form: Years 12-13 (Key Stage 5)
  if (yearNumber >= 12 && yearNumber <= 13) {
    return {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
      label: yearGroup,
      stage: "KS5",
      level: "Sixth Form",
    };
  }

  return {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-300 dark:border-gray-600",
    label: yearGroup,
    stage: "Other",
  };
}

export function StudentCardTeacher({
  student,
  onDelete,
  onDuplicate,
}: StudentCardTeacherProps) {
  const router = useRouter();
  const supabase = createClient();
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [showAllClasses, setShowAllClasses] = useState(false);

  const MAX_VISIBLE_CLASSES = 3;

  const yearGroupStyle = getYearGroupStyle(student.year_group);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const { data, error } = await supabase
          .from("class_students")
          .select(`
            class_id,
            classes:class_id (
              class_id,
              class_name
            )
          `)
          .eq("student_id", student.student_id);

        if (error) throw error;

        const typedData = data as unknown as ClassStudentData[];
        
        const studentClasses = typedData
          ?.map((item) => item.classes)
          .filter((c): c is NonNullable<typeof c> => c !== null)
          .map((c) => ({
            class_id: c.class_id,
            class_name: c.class_name,
          })) || [];

        setClasses(studentClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [student.student_id, supabase]);

  const fullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    "Unnamed Student";

  const visibleClasses = showAllClasses 
    ? classes 
    : classes.slice(0, MAX_VISIBLE_CLASSES);
  const remainingCount = classes.length - MAX_VISIBLE_CLASSES;

  const sections = [
    {
      key: "goals",
      icon: Target,
      label: "Goals",
      value: student.goals,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      key: "interests",
      icon: Sparkles,
      label: "Interests",
      value: student.interests,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      key: "strengths",
      icon: TrendingUp,
      label: "Strengths",
      value: student.strengths,
      color: "text-green-600 dark:text-green-400",
    },
    {
      key: "weaknesses",
      icon: TrendingDown,
      label: "Areas for Growth",
      value: student.weaknesses,
      color: "text-orange-600 dark:text-orange-400",
    },
  ].filter((section) => section.value);

  const hasProfileData = sections.length > 0 || !!student.special_educational_needs?.trim();

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/student-profiles/teacher/${student.student_id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/student-profiles/teacher/${student.student_id}`);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleClassClick = (classId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/classes/${classId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative bg-card text-card-foreground border shadow-sm transition-all duration-200 h-full flex flex-col",
          "hover:shadow-lg hover:border-primary/50"
        )}
      >
        {/* Header */}
        <CardHeader className="p-4 sm:p-5 pb-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            {/* Student Info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Name and Year Group Row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Student Avatar/Icon */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4.5 h-4.5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <CardTitle
                    className={cn(
                      "text-base sm:text-lg font-semibold transition-colors break-words leading-tight",
                      "group-hover:text-primary"
                    )}
                  >
                    {fullName}
                  </CardTitle>
                </div>

                {/* Year Group Badge */}
                {yearGroupStyle && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium shrink-0 transition-colors cursor-default",
                            yearGroupStyle.bg,
                            yearGroupStyle.text,
                            yearGroupStyle.border
                          )}
                        >
                          <span className="font-semibold">{yearGroupStyle.label}</span>
                          {yearGroupStyle.stage && (
                            <span className="opacity-70 text-[10px]">
                              {yearGroupStyle.stage}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{yearGroupStyle.label}</p>
                          {yearGroupStyle.level && (
                            <p className="text-xs text-muted-foreground">
                              {yearGroupStyle.level} • {yearGroupStyle.stage}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Classes Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">
                    {loadingClasses 
                      ? "Loading classes..." 
                      : classes.length === 0 
                        ? "No classes assigned" 
                        : `${classes.length} ${classes.length === 1 ? "class" : "classes"}`
                    }
                  </span>
                </div>

                {/* Class Badges */}
                {!loadingClasses && classes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {visibleClasses.map((cls) => (
                      <TooltipProvider key={cls.class_id}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80 transition-colors text-xs px-2 py-0.5 max-w-[120px]"
                              onClick={(e) => handleClassClick(cls.class_id, e)}
                            >
                              <span className="truncate">{cls.class_name}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View class: {cls.class_name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                    {/* Show More Button */}
                    {!showAllClasses && remainingCount > 0 && (
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-accent transition-colors text-xs px-2 py-0.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAllClasses(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-0.5" />
                              {remainingCount}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show {remainingCount} more {remainingCount === 1 ? "class" : "classes"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {/* Show Less Button */}
                    {showAllClasses && classes.length > MAX_VISIBLE_CLASSES && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent transition-colors text-xs px-2 py-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllClasses(false);
                        }}
                      >
                        Show less
                      </Badge>
                    )}
                  </div>
                )}

                {/* No Classes State */}
                {!loadingClasses && classes.length === 0 && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground border-dashed">
                      Not assigned to any class
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label="Open student actions menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleViewProfile}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 sm:p-5 pt-0 flex-1">
          {!hasProfileData ? (
            <div className="flex flex-col items-center justify-center text-center py-6 px-4 space-y-3 border-2 border-dashed border-muted rounded-lg bg-muted/20">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Info className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  No profile information yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to add student details
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleEdit}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Details
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* SEN Details */}
              {student.special_educational_needs && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-1">
                        Special Educational Needs
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-300 line-clamp-2">
                        {student.special_educational_needs}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Sections */}
              <div className="space-y-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.key}
                      className="flex items-start gap-2.5 group/item"
                    >
                      <div
                        className={cn(
                          "mt-0.5 shrink-0 p-1.5 rounded-md bg-muted transition-colors",
                          "group-hover/item:bg-muted/80"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5", section.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          {section.label}
                        </p>
                        <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                          {section.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer - Quick Actions on Hover */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 mt-auto">
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
              onClick={handleViewProfile}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
              onClick={handleEdit}
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}