'use client'

import { useUserMode } from "@/components/UserModeContext";
import NewLessonFormStandard from "../forms/NewLessonFormStandard ";
import NewLessonFormAdvanced from "../forms/NewLessonFormAdvanced";
import NewLessonFormStudent from "../forms/NewLessonFormStudent";
import NewLessonFormTutor from "../forms/NewLessonFormTutor";

export default function NewLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "extended":
      return <NewLessonFormAdvanced />;
    case "tutor":
      return <NewLessonFormTutor />;
    case "student":
      return <NewLessonFormStudent />;
    default:
      return <NewLessonFormStandard />;
  }
}
