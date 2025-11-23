'use client'

import { useUserMode } from "@/components/UserModeContext";

import EditLessonFormStudent from "../../forms/edit-lesson/EditLessonFormStudent";
import EditLessonFormTutor from "../../forms/edit-lesson/EditLessonFormTutor";

export default function EditLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "teacher":
      return <EditLessonFormStudent />;
    case "tutor":
      return <EditLessonFormTutor />;
  }
}
