'use client'

import { useUserMode } from "@/components/UserModeContext";
import TutorStudentProfilesDashboard from "../dashboards/TutorStudentProfilesDashboard";
import TeacherStudentProfilesDashboard from "../dashboards/TeacherStudentProfilesDashboard";

export default function LessonPlansPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorStudentProfilesDashboard />;
    default:
      return <TeacherStudentProfilesDashboard />;
  }
}
