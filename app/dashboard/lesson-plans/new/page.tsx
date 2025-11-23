'use client'

import { useUserMode } from "@/components/UserModeContext";

import NewLessonFormStudent from "../forms/new-lesson/NewLessonFormStudent";
import NewLessonFormTutor from "../forms/new-lesson/NewLessonFormTutor";

export default function NewLessonPage() {
  const { mode } = useUserMode();

  switch (mode) {
    case "teacher":
      return <NewLessonFormStudent />;
    case "tutor":
      return <NewLessonFormTutor />;
  }
}
