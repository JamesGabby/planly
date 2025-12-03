import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UserMode, useUserMode } from "./UserModeContext";

export function ModeSwitcher() {
  const { mode, setMode } = useUserMode();

  const items = [
    { value: "teacher", label: "Teaching", description: "Manage your lessons, classes & students" },
    { value: "tutor", label: "Tutoring", description: "Manage your tutor sessions & students" },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <Select value={mode} onValueChange={(value) => setMode(value as UserMode)}>
        <SelectTrigger className="w-[110px] h-10 min-h-[40px] max-h-[40px]">
          <span className="capitalize">{mode === 'teacher' ? 'Teaching' : 'Tutoring'}</span>
        </SelectTrigger>
        <SelectContent>
          {items.map(({ value, label, description }) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <SelectItem value={value}>{label}</SelectItem>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="max-w-[200px] text-sm leading-snug">
                {description}
              </TooltipContent>
            </Tooltip>
          ))}
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
}