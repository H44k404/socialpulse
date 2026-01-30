"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
export type BadgeSize = "sm" | "md";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pill?: boolean;
};

const variantMap: Record<BadgeVariant, string> = {
  success: "border-pulse-success/30 bg-pulse-success/12 text-pulse-success",
  warning: "border-pulse-warning/30 bg-pulse-warning/12 text-pulse-warning",
  error: "border-pulse-error/30 bg-pulse-error/12 text-pulse-error",
  info: "border-pulse-secondary/30 bg-pulse-secondary/12 text-pulse-secondary",
  neutral: "border-white/15 bg-white/5 text-pulse-text"
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs"
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  pill = true,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "glass inline-flex items-center gap-2 border shadow-glass",
        pill ? "rounded-full" : "rounded-lg",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", "bg-current opacity-80")} aria-hidden="true" />}
      {props.children}
    </span>
  );
}

