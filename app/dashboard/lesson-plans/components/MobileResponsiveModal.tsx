import { FocusTrap } from "focus-trap-react";
import { useScroll, useTransform, AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { ExpandedLessonView } from "./expanded-lesson-card/ExpandedLessonView";
import { useUserMode } from "@/components/UserModeContext";
import { DetailedExpandedLessonView } from "./expanded-lesson-card/DetailedExpandedLessonView";
import { TutorExpandedLessonView } from "./expanded-lesson-card/TutorExpandedLessonView";
import { LessonPlanTeacher } from "../types/lesson_teacher";

/* --- MOBILE MODAL --- */
export function MobileResponsiveModal({
  lesson,
  onClose,
}: {
  lesson: LessonPlanTeacher;
  onClose: () => void;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progressColor = useTransform(scrollYProgress, [0, 1], ["#3b82f6", "#22c55e"]);

  const { mode } = useUserMode();

  function renderExpandedLessonView(lesson: LessonPlanTeacher) {

    switch (mode) {
      case "detailed":
      case "student":
        return <DetailedExpandedLessonView lesson={lesson} />;
      case "tutor":
        return <TutorExpandedLessonView lesson={lesson} />;
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
            className={`bg-card text-card-foreground rounded-2xl shadow-2xl border border-border w-full max-w-6xl relative z-50 flex flex-col ${
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
              aria-label="Close"
              className="
                absolute top-3 right-5 z-30
                flex items-center justify-center
                w-10 h-10
                rounded-full
                border border-border/60
                bg-secondary/80 dark:bg-muted/80
                text-secondary-foreground dark:text-muted-foreground
                shadow-md backdrop-blur-sm
                hover:bg-accent hover:text-accent-foreground hover:scale-105
                active:scale-95 active:shadow-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                transition-all duration-200 ease-out
              "
            >
              <span className="text-lg leading-none">✕</span>
            </button>

            {/* --- CONTENT --- */}
            <div
              ref={scrollRef}
              className="
                overflow-y-auto max-h-[85vh] p-6
                scrollbar-thin scrollbar-thumb-rounded-full
                scroll-smooth
              "
              style={{
                overscrollBehavior: "contain",
              }}
            >
              {renderExpandedLessonView(lesson)}
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}
