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
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                ⋮
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-[150px] rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 animate-in fade-in-0 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu.Item
                  asChild
                  className="cursor-pointer px-3 py-2 text-sm rounded-md outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <a href={`/dashboard/lesson-plans/${lesson.id}/edit`}>
                    Edit
                  </a>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    setTimeout(() => onDelete(), 100);
                  }}
                  className="cursor-pointer px-3 py-2 text-sm text-destructive rounded-md outline-none hover:bg-destructive/10 hover:text-destructive"
                >
                  Delete
                </DropdownMenu.Item>
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
