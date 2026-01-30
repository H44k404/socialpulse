"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type ProgressProps = {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  gradient?: boolean;
  glowOnComplete?: boolean;
  className?: string;
};

export function Progress({
  value,
  label,
  showPercent = true,
  gradient = true,
  glowOnComplete = true,
  className
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const complete = clamped >= 100;

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-pulse-muted">{label}</p>
          {showPercent && (
            <p className={cn("text-sm", complete ? "text-pulse-success" : "text-pulse-muted")}>
              {Math.round(clamped)}%
            </p>
          )}
        </div>
      )}

      <div className={cn("glass-soft h-3 w-full overflow-hidden rounded-full border border-white/10")}>
        <motion.div
          className={cn(
            "h-full rounded-full",
            gradient
              ? "bg-gradient-to-r from-pulse-secondary via-pulse-primary to-pulse-accent"
              : "bg-pulse-primary",
            glowOnComplete && complete && "shadow-[0_0_24px_rgba(16,185,129,0.35)]"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

