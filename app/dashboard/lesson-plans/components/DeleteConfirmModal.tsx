import { Button } from "@/components/ui/button";
import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { FocusTrap } from "focus-trap-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useUserMode } from "@/components/UserModeContext";
import { StudentProfileTutor } from "../types/student_profile_tutor";

/* --- DELETE CONFIRM MODAL --- */
export function DeleteConfirmModal({
  onCancel,
  onConfirm,
  data,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  data: LessonPlanTeacher & StudentProfileTutor;
}) {
  const { mode } = useUserMode();
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);

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
            Delete this lesson plan?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete{" "}
            <b className="text-foreground">{mode !== 'tutor' ? data.topic || "Untitled" : data.first_name || data.topic || "Unnamed Student"}</b>? This
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
