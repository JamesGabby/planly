'use client'

import { useUserMode } from "@/components/UserModeContext";
import EditLessonFormAdvanced from "../../forms/EditLessonFormAdvanced";
import EditLessonFormStudent from "../../forms/EditLessonFormStudent";
import EditLessonFormTutor from "../../forms/EditLessonFormTutor";
import EditLessonFormStandard from "../../forms/EditLessonFormStandard";

export default function EditLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "extended":
      return <EditLessonFormAdvanced />;
    case "tutor":
      return <EditLessonFormTutor />;
    case "student":
      return <EditLessonFormStudent />;
    default:
      return <EditLessonFormStandard />;
  }
}
