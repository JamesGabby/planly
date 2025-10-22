import { FocusTrap } from "focus-trap-react";
import { useScroll, useTransform, AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { LessonPlan } from "../types/lesson";
import { ExpandedLessonView } from "./ExpandedLessonView";
import { useUserMode } from "@/components/UserModeContext";
import { AdvancedExpandedLessonView } from "./AdvancedExpandedLessonView";

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
  const progressColor = useTransform(scrollYProgress, [0, 1], ["#3b82f6", "#22c55e"]);

  function renderExpandedLessonView(lesson: LessonPlan) {
    const { mode } = useUserMode();

    switch (mode) {
        case "advanced":
          return <AdvancedExpandedLessonView lesson={lesson} />;
        // case "tutor":
        //   return <NewLessonFormTutor />;
        // case "student":
        //   return <NewLessonFormStudent />;
        default:
          return <ExpandedLessonView lesson={lesson} />;
      }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={lesson.id}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* --- BACKDROP --- */}
        <motion.div
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <FocusTrap>
          {/* --- MAIN MODAL --- */}
          <motion.div
            className={`bg-card text-card-foreground rounded-2xl shadow-2xl border border-border w-full max-w-3xl relative z-50 flex flex-col ${
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
            {/* --- PROGRESS BAR --- */}
            <motion.div
              className="sticky top-0 left-0 right-0 h-1 origin-left z-20 rounded-t-2xl"
              style={{ scaleX: scrollYProgress, backgroundColor: progressColor }}
            />

            {/* --- CLOSE BUTTON --- */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 
                         bg-secondary/70 dark:bg-muted/70 
                         text-secondary-foreground dark:text-muted-foreground
                         border border-border 
                         rounded-full w-8 h-8 flex items-center justify-center 
                         hover:bg-accent hover:text-accent-foreground 
                         transition-colors duration-200 shadow-sm backdrop-blur-sm"
            >
              ✕
            </button>

            {/* --- CONTENT --- */}
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[85vh] p-6"
              style={{ overscrollBehavior: "contain" }}
            >
              {renderExpandedLessonView(lesson)}
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}
