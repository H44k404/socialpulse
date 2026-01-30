"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
};

const sideClasses: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 -translate-y-2",
  bottom: "top-full left-1/2 -translate-x-1/2 translate-y-2",
  left: "right-full top-1/2 -translate-y-1/2 -translate-x-2",
  right: "left-full top-1/2 -translate-y-1/2 translate-x-2"
};

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            className={cn(
              "glass pointer-events-none absolute z-50 rounded-xl border border-white/10 px-3 py-2 text-xs text-pulse-text shadow-glass",
              sideClasses[side]
            )}
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

