"use client";

import { useEffect, useState } from "react";

export function TypewriterText({ texts }: { texts: string[] }) {
  const [mounted, setMounted] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const text = texts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, mounted]);

  // Show the first text initially to avoid hydration mismatch
  if (!mounted) {
    return (
      <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
        {texts[0]}
        <span className="opacity-0">|</span>
      </span>
    );
  }

  return (
    <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}