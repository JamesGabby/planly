'use client'

import { useUserMode } from "@/components/UserModeContext";
import EditLessonFormDetailed from "../../forms/edit-lesson/EditLessonFormDetailed";
import EditLessonFormStudent from "../../forms/edit-lesson/EditLessonFormStudent";
import EditLessonFormTutor from "../../forms/edit-lesson/EditLessonFormTutor";
import EditLessonFormStandard from "../../forms/edit-lesson/EditLessonFormStandard";

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
