"use client";

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

export function CustomToastContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2500}
      hideProgressBar
      closeOnClick
      pauseOnHover={false}
      transition={Slide}
      newestOnTop
      draggable={false}
      role="alert"
      theme={theme === "dark" ? "dark" : "light"}
      className="z-[9999] fixed pointer-events-none"
      toastClassName={() =>
        [
          "pointer-events-auto relative flex items-center gap-2",
          "!bg-card !text-foreground !rounded-lg !shadow-sm !border !border-border",
          "!p-3 !min-h-0 !w-fit !text-sm !leading-tight",
          "!pr-8" // 👈 adds space for the close button
        ].join(" ")
      }
      bodyClassName="!m-0 !p-0"
      progressClassName="!bg-primary/40"
      closeButton={({ closeToast }) => (
  <button
    onClick={closeToast}
    aria-label="Close"
    className="absolute right-2 top-2 text-muted-foreground/70 hover:text-foreground transition-colors"
  >
    <X size={14} strokeWidth={2} />
  </button>
      )}
    />
  );
}
