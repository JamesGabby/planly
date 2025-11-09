'use client'

import { useUserMode } from "@/components/UserModeContext";
import LessonPlansDashboard from "./dashboards/LessonPlansDashboard";
import TutorLessonPlansDashboard from "./dashboards/TutorLessonPlansDashboard";

export default function LessonPlansPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorLessonPlansDashboard />;
    default:
      return <LessonPlansDashboard />;
  }
}
