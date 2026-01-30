"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  iconLeft?: React.ReactNode;
  error?: string;
  success?: boolean;
  counter?: { current: number; max: number };
  onClear?: () => void;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, iconLeft, error, success, counter, onClear, value, placeholder, ...props },
  ref
) {
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const showClear = Boolean(onClear && hasValue && !props.disabled);
  const displayPlaceholder = label ? (hasValue ? "" : "") : placeholder;

  return (
    <div className="w-full">
      <div
        className={cn(
          "glass group relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3",
          "border transition-all duration-200 ease-out",
          error ? "border-pulse-error/50 bg-pulse-error/5" : success ? "border-pulse-success/50 bg-pulse-success/5" : "border-white/20 bg-white/8",
          "focus-within:border-cyan-400/60 focus-within:bg-white/12 focus-within:shadow-lg focus-within:shadow-cyan-500/30",
          "hover:border-white/40 hover:bg-white/12 active:bg-white/15",
          "touch-manipulation safe-area-inset",
          className
        )}
      >
        {iconLeft && <span className="text-cyan-400/70 group-focus-within:text-cyan-400 flex-shrink-0 transition-colors duration-200">{iconLeft}</span>}

        <div className="relative flex-1 min-w-0">
          {label && (
            <motion.label
              initial={false}
              animate={{
                y: hasValue ? -14 : 0,
                scale: hasValue ? 0.85 : 1,
                opacity: hasValue ? 0.85 : 0.7
              }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 origin-left text-sm font-medium text-cyan-300",
                "transition-colors duration-200"
              )}
            >
              {label}
            </motion.label>
          )}

          <input
            ref={ref}
            {...(value !== undefined && value !== null ? { value: String(value) } : {})}
            placeholder={displayPlaceholder || (label ? "" : placeholder)}
            className={cn(
              "w-full bg-transparent py-2 text-base font-medium text-white outline-none placeholder:text-white/40 transition-colors duration-200",
              "touch-manipulation select-none",
              label ? "pt-4" : ""
            )}
            {...props}
          />
        </div>

        {showClear && (
          <motion.button
            type="button"
            onClick={onClear}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg p-1 text-pulse-muted transition-all duration-300 hover:bg-white/10 hover:text-cyan-400 active:scale-90"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-xs">
          {error ? (
            <motion.p
              initial={{ x: 0 }}
              animate={{ x: [0, -4, 4, -3, 3, 0] }}
              transition={{ duration: 0.35 }}
              className="text-pulse-error"
            >
              {error}
            </motion.p>
          ) : (
            <span className="text-pulse-muted/70" />
          )}
        </div>

        {counter && (
          <p className={cn("text-xs", counter.current > counter.max ? "text-pulse-error" : "text-pulse-muted")}>
            {counter.current}/{counter.max}
          </p>
        )}
      </div>
    </div>
  );
});

