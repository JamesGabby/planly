'use client'

import { useUserMode } from "@/components/UserModeContext";
import TutorStudentProfilesDashboard from "../lesson-plans/dashboards/TutorStudentProfilesDashboard";
import TeacherStudentProfilesDashboard from "../lesson-plans/dashboards/TeacherStudentProfilesDashboard";

export default function LessonPlansPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorStudentProfilesDashboard />;
    default:
      return <TeacherStudentProfilesDashboard />;
  }
}
