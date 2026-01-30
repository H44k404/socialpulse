"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[96vw] min-h-[92vh]"
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, size = "md", children, footer }: ModalProps) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label="Close modal"
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-md"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn("glass relative w-full rounded-2xl border border-white/10 p-6 shadow-glass", sizeClasses[size])}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <h2 className="text-lg font-semibold text-pulse-text">{title}</h2>}
                {description && <p className="mt-1 text-sm text-pulse-muted">{description}</p>}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="glass rounded-xl border border-white/10 p-2 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">{children}</div>

            {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

