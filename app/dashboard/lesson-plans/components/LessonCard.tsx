import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
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
    <Card className="shadow hover:shadow-lg transition-all h-full flex flex-col justify-between">
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {lesson.topic ?? "Untitled"}
            </CardTitle>
            <p className="text-sm text-slate-500">{lesson.class ?? "Unknown"}</p>
            <p className="text-xs text-slate-400">
              {prettyDate(lesson.date_of_lesson)}{" "}
              {lesson.time_of_lesson && `• ${prettyTime(lesson.time_of_lesson)}`}
            </p>
          </div>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              >
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <a href={`/dashboard/lesson-plans/${lesson.id}/edit`}>Edit</a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                  setTimeout(() => onDelete(), 100);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-6" />
      </CardContent>
    </Card>
  );
}