import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { UserMode, useUserMode } from "./UserModeContext";

export function ModeSwitcher() {
  const { mode, setMode } = useUserMode();

  const items = [
    { value: "teacher", label: "Teacher", description: "A minimal teacher view showing only the essentials so you can plan quickly" },
    { value: "extended", label: "Extended", description: "A detailed teacher view covering all lesson considerations so you can plan carefully and thoroughly" },
    { value: "tutor", label: "Tutor", description: "A view tailored for one-on-one tutoring" },
    { value: "student", label: "Student", description: "Same as extended view but with tips and guidance to plan your lessons following best teaching practices" },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <Select value={mode} onValueChange={(value) => setMode(value as UserMode)}>
        <SelectTrigger className="w-[110px]">
          <span className="capitalize">{mode}</span>
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
