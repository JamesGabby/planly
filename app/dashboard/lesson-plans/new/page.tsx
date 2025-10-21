'use client'

import { useUserMode } from "@/components/UserModeContext";
import NewLessonFormStandard from "../forms/NewLessonFormStandard ";
import NewLessonFormAdvanced from "../forms/NewLessonFormAdvanced";

export default function NewLessonPage() {
  const { mode } = useUserMode();
  console.log(mode);
  switch (mode) {
    
    case "advanced":
      return <NewLessonFormAdvanced />;
    // case "tutor":
    //   return <NewLessonFormTutor />;
    // case "student":
    //   return <NewLessonFormStudent />;
    default:
      return <NewLessonFormStandard />;
  }
}
