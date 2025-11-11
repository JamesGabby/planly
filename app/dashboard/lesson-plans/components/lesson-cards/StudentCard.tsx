"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  Star,
  Sparkles,
  BicepsFlexed,
  Target,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type StudentProfile = {
  student_id: number;
  first_name: string | null;
  last_name: string | null;
  level: string | null;
  goals: string | null;
  interests: string | null;
  learning_preferences: string | null;
  strengths: string | null;
  weaknesses: string | null;
  notes: string | null;
};

export function StudentCard({
  student,
  onDelete,
  onEdit,
}: {
  student: StudentProfile;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const fullName =
    `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
    "Unnamed Student";

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

          {student.level && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5" />
              Level: {student.level}
            </div>
          )}
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-4 sm:p-5 space-y-3 flex-1 overflow-hidden">
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

          {/* Mobile Quick Actions */}
          <div className="flex sm:hidden justify-start gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="secondary" onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}>
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

          {/* Desktop Hover Quick Actions */}
          <div className="hidden sm:flex absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
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
