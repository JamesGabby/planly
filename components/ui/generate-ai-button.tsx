"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { Sparkles, Loader2, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

const sparkleVariants: Variants = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      delay: i * 0.4,
      ease: "easeInOut" as const,
    },
  }),
};

const floatingParticles = [
  { size: 4, x: -20, y: -15, delay: 0 },
  { size: 3, x: 25, y: -20, delay: 0.3 },
  { size: 5, x: -30, y: 10, delay: 0.6 },
  { size: 3, x: 30, y: 15, delay: 0.9 },
  { size: 4, x: 0, y: -25, delay: 1.2 },
];

const loadingMessages = [
  "Crafting your lesson plan...",
  "Adding educational magic...",
  "Structuring learning objectives...",
  "Polishing the details...",
  "Almost there...",
];

export function AIGenerateButton({
  onClick,
  isGenerating,
  disabled = false,
  label = "Generate with AI",
  className,
}: AIGenerateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Cycle through loading messages
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [isGenerating]);

  const handleClick = () => {
    setHasInteracted(true);
    onClick();
  };

  const shimmerTransition: Transition = {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 1,
    ease: "easeInOut" as const,
  };

  const orbitTransition = (delay: number): Transition => ({
    duration: 2,
    repeat: Infinity,
    delay,
    ease: "easeInOut" as const,
  });

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Subtle hint text */}
      <AnimatePresence>
        {!hasInteracted && !isGenerating && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-muted-foreground text-center"
          >
            ✨ Let AI help you create a comprehensive lesson plan
          </motion.p>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl blur-xl opacity-50"
          animate={{
            background: isGenerating
              ? [
                  "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
                ]
              : isHovered
              ? "radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)",
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating particles on hover */}
        <AnimatePresence>
          {(isHovered || isGenerating) && (
            <>
              {floatingParticles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, particle.x],
                    y: [0, particle.y],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeOut" as const,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.div
          whileHover={{ scale: disabled || isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: disabled || isGenerating ? 1 : 0.98 }}
        >
          <Button
            type="button"
            onClick={handleClick}
            disabled={disabled || isGenerating}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "relative overflow-hidden w-full sm:w-auto min-w-[280px] h-12 sm:h-14",
              "bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600",
              "hover:from-purple-500 hover:via-violet-500 hover:to-blue-500",
              "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
              "border border-purple-400/20",
              "transition-all duration-300",
              "disabled:opacity-70 disabled:cursor-not-allowed",
              className
            )}
            size="lg"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                ],
                x: ["-100%", "100%"],
              }}
              transition={shimmerTransition}
              style={{ backgroundSize: "200% 100%" }}
            />

            {/* Button content */}
            <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-2"
                  >
                    {/* Animated loader */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                    
                    {/* Cycling messages */}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {loadingMessages[messageIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-2"
                  >
                    {/* Animated icon */}
                    <motion.div
                      animate={
                        isHovered
                          ? {
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    {label}
                    
                    {/* Small sparkle accents */}
                    <motion.div
                      className="absolute -right-1 -top-1"
                      variants={sparkleVariants}
                      initial="initial"
                      animate={isHovered ? "animate" : "initial"}
                      custom={0}
                    >
                      <Stars className="h-3 w-3 text-yellow-300" />
                    </motion.div>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </Button>
        </motion.div>

        {/* Orbiting dots when generating */}
        <AnimatePresence>
          {isGenerating && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: -4,
                    marginTop: -4,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 60 * Math.cos((i * 2 * Math.PI) / 3), 0],
                    y: [0, 60 * Math.sin((i * 2 * Math.PI) / 3), 0],
                    scale: [0, 1, 0],
                  }}
                  transition={orbitTransition(i * 0.3)}
                  exit={{ opacity: 0, scale: 0 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator when generating */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Animated progress bar */}
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 15,
                  ease: "easeInOut" as const,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This may take a few moments
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}