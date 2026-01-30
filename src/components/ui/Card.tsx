"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// ============================================================
// CARD COMPONENT - CUSTOMIZATION GUIDE
// ============================================================
// This component creates glass-effect cards with optional
// gradient borders and animations. Customize below.
// ============================================================

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  gradientBorder?: boolean;
  hoverLift?: boolean;
  animatedBorder?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

// CUSTOMIZE: Card padding options
// Adjust spacing inside cards: p-4 (16px), p-6 (24px), p-8 (32px)
const paddingMap: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",  // No padding
  sm: "p-4",    // Small padding (16px)
  md: "p-6",    // Medium padding (24px) - default
  lg: "p-8"     // Large padding (32px)
};

export function Card({
  className,
  gradientBorder = false,
  hoverLift = true,
  animatedBorder = false,
  padding = "md",
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  id,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl transition-all duration-300 ease-out",
        "glass",  // Uses glassmorphism from globals.css
        paddingMap[padding],
        className
      )}
      // CUSTOMIZE: Hover lift effect (vertical movement)
      // Change -4 to larger negative value for more movement (-8, -12, etc)
      // Change boxShadow for different shadow intensity
      whileHover={hoverLift ? { y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" } : {}}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      id={id}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {/* CUSTOMIZE: Gradient border effect
          Uses gradient from primary (cyan) → secondary (purple) → accent (pink)
          Remove this block or set gradientBorder={false} to disable */}
      {gradientBorder && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl p-[1px]",
            // CUSTOMIZE: Gradient colors and opacity
            // primary: #00D9FF (cyan), secondary: #A78BFA (purple), accent: #EC4899 (pink)
            // Change opacity values: /50, /40, /40 for more/less intensity
            "bg-gradient-to-r from-pulse-primary/50 via-pulse-secondary/40 to-pulse-accent/40"
          )}
        >
          <span className="block h-full w-full rounded-2xl bg-transparent" />
        </span>
      )}

      {/* CUSTOMIZE: Animated radial gradient border
          Creates a moving glow effect on the card
          Disable by setting animatedBorder={false} */}
      {animatedBorder && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-70",
            // Radial gradient creates the glow - rgba(0,217,255,0.28) is cyan primary color
            // Change 0.28 to adjust glow intensity (lower = subtle, higher = intense)
            "bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(0,217,255,0.28),transparent_45%)]"
          )}
        />
      )}

      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex items-start justify-between gap-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-pulse-text", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-pulse-muted", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex items-center justify-between gap-4", className)} {...props} />;
}

