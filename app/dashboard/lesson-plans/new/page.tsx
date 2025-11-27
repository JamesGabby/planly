'use client'

import { useUserMode } from "@/components/UserModeContext";

import NewLessonFormTutor from "../forms/new-lesson/NewLessonFormTutor";
import NewLessonFormTeacher from "../forms/new-lesson/NewLessonFormTeacher";

export default function NewLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "teacher":
      return <NewLessonFormTeacher />
    case "tutor":
      return <NewLessonFormTutor />;
  }
}
