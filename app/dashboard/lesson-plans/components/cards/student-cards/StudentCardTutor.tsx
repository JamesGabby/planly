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
  Star,
  TrendingDown,
  MoreVertical,
  Info,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StudentProfileTutor } from "../../../types/student_profile_tutor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentCardProps {
  student: StudentProfileTutor;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function StudentCardTutor({
  student,
  onDelete,
  onDuplicate,
}: StudentCardProps) {
  const router = useRouter();

  const fullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    "Unnamed Student";

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

  const hasProfileData = sections.length > 0 || !!student.sen?.trim();

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/student-profiles/tutor/${student.student_id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/student-profiles/tutor/${student.student_id}`);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
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
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start gap-2">
                <CardTitle
                  className={cn(
                    "text-base sm:text-lg font-semibold transition-colors break-words",
                    "group-hover:text-primary"
                  )}
                >
                  {fullName}
                </CardTitle>
              </div>

              {/* Level Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Level: {student.level}</span>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
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
            <div className="flex flex-col items-center justify-center text-center py-6 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Info className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  No profile information yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Add student details to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* SEN Details */}
              {student.sen && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-400 mb-1">
                        Special Educational Needs
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-300 line-clamp-2">
                        {student.sen}
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
      </Card>
    </motion.div>
  );
}