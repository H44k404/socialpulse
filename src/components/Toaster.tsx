"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";

import { useNotificationStore } from "@/store/notification-store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useNotificationStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-end px-4 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const variant = toast.variant ?? "info";
            const Icon = variant === "success" ? CheckCircle2 : variant === "error" ? XCircle : Info;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "pointer-events-auto glass flex items-start gap-3 rounded-2xl border px-3 py-3 shadow-glass",
                  variant === "success"
                    ? "border-pulse-success/35"
                    : variant === "error"
                    ? "border-pulse-error/35"
                    : "border-white/10"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full",
                    variant === "success"
                      ? "bg-pulse-success/15 text-pulse-success"
                      : variant === "error"
                      ? "bg-pulse-error/15 text-pulse-error"
                      : "bg-pulse-secondary/15 text-pulse-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-pulse-text">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-pulse-muted">{toast.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  className="rounded-full p-1 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                  onClick={() => dismiss(toast.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

