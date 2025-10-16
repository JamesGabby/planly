import FocusTrap from "focus-trap-react";
import { useScroll, useTransform, AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { LessonPlan } from "../types/lesson";
import { ExpandedLessonView } from "./ExpandedLessonView";

/* --- MOBILE MODAL --- */
export function MobileResponsiveModal({
  lesson,
  onClose,
}: {
  lesson: LessonPlan;
  onClose: () => void;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progressColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#3b82f6", "#22c55e"]
  );

  return (
    <AnimatePresence>
      <motion.div
        key={lesson.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <FocusTrap>
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-50 flex flex-col ${
              isMobile ? "mt-auto" : ""
            }`}
            initial={{
              y: isMobile ? "100%" : 0,
              opacity: 0,
              scale: isMobile ? 1 : 0.95,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 25 },
            }}
            exit={{
              y: isMobile ? "100%" : 0,
              opacity: 0,
              scale: isMobile ? 1 : 0.95,
            }}
          >
            <motion.div
              className="sticky top-0 left-0 right-0 h-1 origin-left z-20 rounded-t-2xl"
              style={{ scaleX: scrollYProgress, backgroundColor: progressColor }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm"
            >
              ✕
            </button>
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[85vh] p-6"
              style={{ overscrollBehavior: "contain" }}
            >
              <ExpandedLessonView lesson={lesson} />
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}