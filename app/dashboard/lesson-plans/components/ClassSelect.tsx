import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ClassSelect({
  classes,
  selectedClass,
  setSelectedClass,
}: {
  classes: string[];
  selectedClass: string;
  setSelectedClass: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="class-select">Class</Label>

      <Select
        value={selectedClass || "all"}
        onValueChange={(val) => setSelectedClass(val === "all" ? "" : val)}
      >
        {/* ---------- TRIGGER (styled to match Input) ---------- */}
        <SelectTrigger
          id="class-select"
          className={
            // exact same base styling as your Input + identical focus ring
            "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground" +
            // Match Input's focus ring exactly (use focus-visible for keyboard users)
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          }
        >
          <SelectValue placeholder="All classes" />
        </SelectTrigger>

        {/* ---------- CONTENT ---------- */}
        <SelectContent
          side="bottom"
          sideOffset={4}
          position="popper"
          avoidCollisions={false}
          className="max-h-56 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          <SelectItem value="all">All</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
