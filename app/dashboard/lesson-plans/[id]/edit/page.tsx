'use client'

import { useUserMode } from "@/components/UserModeContext";
import EditLessonFormStandard from "../../forms/EditLessonFormStandard";
import EditLessonFormAdvanced from "../../forms/EditLessonFormAdvanced";

export default function EditLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "extended":
      return <EditLessonFormAdvanced />;
    // case "tutor":
    //   return <NewLessonFormTutor />;
    // case "student":
    //   return <NewLessonFormStudent />;
    default:
      return <EditLessonFormStandard />;
  }
}
