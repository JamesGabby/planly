import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { prettyDate, prettyTime } from "../utils/helpers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";

/* --- CARD --- */
export function LessonCard({
  lesson,
  onDelete,
}: {
  lesson: LessonPlan;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start">
          {/* --- Lesson Info --- */}
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground">
              {lesson.topic ?? "Untitled"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {lesson.class ?? "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {prettyDate(lesson.date_of_lesson)}{" "}
              {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
            </p>
          </div>

          {/* --- Dropdown Menu --- */}
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
              asChild
              className="z-50 min-w-[160px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="p-1"
              >
                {/* --- Edit --- */}
                <DropdownMenu.Item asChild>
                  <a
                    href={`/dashboard/lesson-plans/${lesson.id}/edit`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </a>
                </DropdownMenu.Item>

                {/* --- Delete --- */}
                <DropdownMenu.Item
                  onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    setTimeout(() => onDelete(), 120);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive transition-colors",
                    "hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-6" />
      </CardContent>
    </Card>
  );
}
