import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { useUserMode } from "./UserModeContext";

export function ModeSwitcher() {
  const { mode, setMode } = useUserMode();
  return (
    <Select value={mode} onValueChange={(value) => setMode(value as any)}>
      <SelectTrigger className="w-[180px]">
        <span className="capitalize">{mode} View</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard</SelectItem>
        <SelectItem value="extended">Extended</SelectItem>
        <SelectItem value="tutor">Tutor</SelectItem>
        <SelectItem value="student">Student</SelectItem>
      </SelectContent>
    </Select>
  );
}
