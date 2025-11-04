'use client'

import { useUserMode } from "@/components/UserModeContext";
import EditLessonFormDetailed from "../../forms/EditLessonFormDetailed";
import EditLessonFormStudent from "../../forms/EditLessonFormStudent";
import EditLessonFormTutor from "../../forms/EditLessonFormTutor";
import EditLessonFormStandard from "../../forms/EditLessonFormStandard";

export default function EditLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "teacher":
      return <EditLessonFormStandard />;
    case "detailed":
      return <EditLessonFormDetailed />;
    case "student":
      return <EditLessonFormStudent />;
    case "tutor":
      return <EditLessonFormTutor />;
  }
}
