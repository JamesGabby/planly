'use client'

import { useUserMode } from "@/components/UserModeContext";
import TutorClassesDashboard from "./tutor/page";
import TeacherClassesDashboard from "./teacher/page";

export default function ClassesPage() {
  const { mode } = useUserMode();
  
  switch (mode) {
    case "tutor":
      return <TutorClassesDashboard />;
    case "teacher":
      return <TeacherClassesDashboard />;
  }
}
