'use client'

import { useUserMode } from "@/components/UserModeContext";
import NewLessonFormStandard from "../forms/new-lesson/NewLessonFormStandard";
import NewLessonFormAdvanced from "../forms/new-lesson/NewLessonFormAdvanced";
import NewLessonFormStudent from "../forms/new-lesson/NewLessonFormStudent";
import NewLessonFormTutor from "../forms/new-lesson/NewLessonFormTutor";

export default function NewLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "detailed":
      return <NewLessonFormAdvanced />;
    case "tutor":
      return <NewLessonFormTutor />;
    case "student":
      return <NewLessonFormStudent />;
    default:
      return <NewLessonFormStandard />;
  }
}
