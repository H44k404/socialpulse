/* eslint-disable react/button-has-type */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// ============================================================
// BUTTON COMPONENT - CUSTOMIZATION GUIDE
// ============================================================
// This component defines all button styles and variants.
// Customize colors, sizes, and effects below.
// ============================================================

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl",
    "text-sm font-medium transition-all duration-200 ease-out will-change-transform",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-secondary/80 focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:active:scale-100",
    "select-none touch-manipulation active:scale-95 sm:active:scale-100 sm:hover:scale-105"
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "glass border-pulse-primary/30 bg-gradient-to-r from-pulse-primary/20 to-pulse-secondary/20 text-pulse-text hover:from-pulse-primary/30 hover:to-pulse-secondary/30 active:from-pulse-primary/40 active:to-pulse-secondary/40",
        secondary:
          "glass border-white/15 bg-white/5 text-pulse-text hover:bg-white/10 hover:border-white/20 active:bg-white/15",
        ghost:
          "border border-transparent bg-transparent text-pulse-text hover:bg-white/8 hover:border-white/10",
        danger:
          "glass border-pulse-error/30 bg-pulse-error/15 text-pulse-text hover:bg-pulse-error/25 active:bg-pulse-error/35",
        success:
          "glass border-pulse-success/30 bg-pulse-success/15 text-pulse-text hover:bg-pulse-success/25 active:bg-pulse-success/35"
      },
      size: {
        sm: "h-10 px-3 text-xs sm:text-sm md:h-9 md:min-w-0",
        md: "h-12 px-4 text-sm md:h-11",
        lg: "h-13 px-5 text-[15px] md:h-12",
        xl: "h-14 px-6 text-base"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      },
      glassEffect: {
        true: "",
        false: "backdrop-blur-0 shadow-none"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      glassEffect: true
    }
  }
);

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  glassEffect,
  loading,
  iconLeft,
  iconRight,
  disabled,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  type,
  form,
  formAction,
  formEncType,
  formMethod,
  formNoValidate,
  formTarget,
  name,
  value,
  autoFocus,
  tabIndex
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const [isPressed, setIsPressed] = React.useState(false);

  const finalClass = cn(
    "group",
    buttonVariants({ variant, size, fullWidth, glassEffect }),
    "overflow-hidden",
    className,
    // append size & safe-area classes explicitly to keep order deterministic
    "min-h-[44px] sm:min-h-[40px] min-w-[44px] safe-area-inset"
  );

  return (
    <motion.button
      type={type ?? "button"}
      suppressHydrationWarning
      className={finalClass}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      form={form}
      formAction={formAction}
      formEncType={formEncType}
      formMethod={formMethod}
      formNoValidate={formNoValidate}
      formTarget={formTarget}
      name={name}
      value={value}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      whileHover={!isDisabled ? { y: -2, scale: 1.02 } : {}}
      whileTap={!isDisabled ? { y: 1, scale: 0.98 } : {}}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* subtle animated border glow */}
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0",
          "bg-[radial-gradient(1200px_circle_at_50%_-20%,rgba(139,92,246,0.55),transparent_45%),radial-gradient(900px_circle_at_10%_120%,rgba(6,182,212,0.35),transparent_55%)]"
        )}
        animate={{
          opacity: isPressed ? 0.8 : 0,
          transition: { duration: 0.3 }
        }}
      />

      <span className="relative inline-flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-pulse-text" aria-hidden="true" />
        ) : (
          iconLeft
        )}
        <span>{children}</span>
        {iconRight}
      </span>
    </motion.button>
  );
}

