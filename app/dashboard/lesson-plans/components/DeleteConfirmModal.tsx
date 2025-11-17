import { Button } from "@/components/ui/button";
import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { FocusTrap } from "focus-trap-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { StudentProfileTutor } from "../types/student_profile_tutor";
import { LessonPlanTutor } from "../types/lesson_tutor";

/* --- DELETE CONFIRM MODAL --- */
export function DeleteConfirmModal({
  onCancel,
  onConfirm,
  data,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  data: LessonPlanTeacher | LessonPlanTutor | StudentProfileTutor;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);

  // Type guards
  const isLesson = (d: typeof data): d is LessonPlanTeacher | LessonPlanTutor => {
    return 'topic' in d;
  };

  const isStudent = (d: typeof data): d is StudentProfileTutor => {
    return 'first_name' in d && !('topic' in d);
  };

  // Get display name based on type
  const getDisplayName = () => {
    if (isStudent(data)) {
      return data.first_name || "Unnamed Student";
    }
    if (isLesson(data)) {
      return data.topic || "Untitled";
    }
    return "this item";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* --- BACKDROP --- */}
      <motion.div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <FocusTrap>
        {/* --- MODAL CONTENT --- */}
        <motion.div
          className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-6 max-w-sm w-full relative z-50 text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            {isStudent(data) ? "Delete this student?" : "Delete this lesson plan?"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete{" "}
            <b className="text-foreground">{getDisplayName()}</b>? This
            action cannot be undone.
          </p>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              ref={cancelRef}
              onClick={onCancel}
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Delete
            </Button>
          </div>
        </motion.div>
      </FocusTrap>
    </motion.div>
  );
}