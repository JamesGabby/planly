// components/ui/subject-badge.tsx

import { cn } from "@/lib/utils";
import { getSubjectColors, getSubjectDisplayName } from "@/lib/utils/subjectColors";

interface SubjectBadgeProps {
  subject: string;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

export function SubjectBadge({
  subject,
  size = "md",
  showDot = true,
  className,
}: SubjectBadgeProps) {
  const colors = getSubjectColors(subject);
  const displayName = getSubjectDisplayName(subject);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border transition-colors",
        colors.bg,
        colors.text,
        colors.border,
        colors.bgHover,
        sizeClasses[size],
        className
      )}
      aria-label={`Subject: ${displayName}`}
    >
      {showDot && (
        <span
          className={cn("rounded-full flex-shrink-0", colors.dot, dotSizeClasses[size])}
          aria-hidden="true"
        />
      )}
      {displayName}
    </span>
  );
}