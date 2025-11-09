'use client'

import { useUserMode } from "@/components/UserModeContext";
import NewTutorStudentProfileForm from "../../lesson-plans/forms/NewTutorStudentProfileForm";

export default function NewLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    
    case "tutor":
      return <NewTutorStudentProfileForm />;
    default:
      return ;
  }
}
