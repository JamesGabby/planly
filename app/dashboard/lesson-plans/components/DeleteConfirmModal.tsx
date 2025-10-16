import { Button } from "@/components/ui/button";
import { LessonPlan } from "@/app/dashboard/lesson-plans/types/lesson";
import FocusTrap from "focus-trap-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

/* --- DELETE CONFIRM MODAL --- */
export function DeleteConfirmModal({
  onCancel,
  onConfirm,
  lesson,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  lesson: LessonPlan;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <FocusTrap>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-50 text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <h2 className="text-xl font-semibold mb-2">
            Delete this lesson plan?
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Are you sure you want to delete{" "}
            <b>{lesson.topic || "Untitled"}</b>? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" ref={cancelRef} onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </motion.div>
      </FocusTrap>
    </motion.div>
  );
}