"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export type DropdownProps<T extends string> = {
  label?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function Dropdown<T extends string>({ label, value, options, onChange, className }: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!buttonRef.current) return;
      const target = e.target as Node | null;
      if (target && !buttonRef.current.parentElement?.contains(target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className={cn("relative w-full", className)}>
      {label && <p className="mb-2 text-xs text-pulse-muted">{label}</p>}
      <button
        ref={buttonRef}
        type="button"
        className="glass flex h-11 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-left text-sm text-pulse-text transition hover:border-white/20 hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-pulse-muted transition", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 shadow-glass"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <ul role="listbox" className="max-h-72 overflow-auto py-1">
              {options.map((opt) => {
                const active = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm transition",
                        active ? "bg-pulse-primary/20 text-pulse-text" : "text-pulse-text hover:bg-white/10"
                      )}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {active && <span className="text-xs text-pulse-secondary">Selected</span>}
                      </div>
                      {opt.description && <p className="mt-0.5 text-xs text-pulse-muted">{opt.description}</p>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

