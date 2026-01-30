"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, CalendarDays, PenSquare, BarChart3 } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const actions = [
  { label: "Go to Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Open Calendar", href: "/dashboard/calendar", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Compose new post", href: "/dashboard/composer", icon: <PenSquare className="h-4 w-4" /> },
  { label: "View Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> }
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Quick actions"
      description="Jump anywhere in YourAgencyName with your keyboard."
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Search actions"
          iconLeft={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations and commands..."
        />

        <div className="max-h-72 space-y-1 overflow-auto text-sm">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-pulse-muted">No matching actions.</p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.href}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-pulse-text transition hover:bg-white/10"
                onClick={() => {
                  router.push(a.href);
                  onOpenChange(false);
                }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-pulse-muted">
                  {a.icon}
                </span>
                <span>{a.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

