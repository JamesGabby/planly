'use client'

import { useUserMode } from "@/components/UserModeContext";
import TutorStudentProfilesDashboard from "../lesson-plans/dashboards/TutorStudentProfilesDashboard";
import StudentProfilesDashboard from "../lesson-plans/dashboards/StudentProfilesDashboard";

export default function LessonPlansPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorStudentProfilesDashboard />;
    default:
      return <StudentProfilesDashboard />;
  }
}
