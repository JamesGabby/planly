"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUserMode } from "@/components/UserModeContext";

export function LevelSelect({
  levels,
  selectedLevel,
  setSelectedLevel,
}: {
  levels: string[];
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const mode = useUserMode();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="class-select">Level</Label>

      {isMobile ? (
        // ✅ Native select for mobile
        <select
          id="class-select"
          value={selectedLevel || "all"}
          onChange={(e) => setSelectedLevel(e.target.value === "all" ? "" : e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All</option>
          {levels.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      ) : (
        // 💻 Fancy shadcn select for desktop
        <Select
          value={selectedLevel || "all"}
          onValueChange={(val) => setSelectedLevel(val === "all" ? "" : val)}
        >
          <SelectTrigger
            id="class-select"
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={4}
            position="popper"
            avoidCollisions={false}
            className="max-h-56 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          >
            <SelectItem value="all">All</SelectItem>
            {levels.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
