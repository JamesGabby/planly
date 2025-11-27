'use client'

import { useUserMode } from "@/components/UserModeContext";
import TeacherLessonPlansDashboard from "./dashboards/TeacherLessonPlansDashboard";
import TutorLessonPlansDashboard from "./dashboards/TutorLessonPlansDashboard";

export default function LessonPlansPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorLessonPlansDashboard />;
    case "teacher":
      return <TeacherLessonPlansDashboard />;
  }
}
