"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  PenSquare,
  BarChart3,
  Library,
  Link2,
  Target,
  Users,
  Settings
} from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

// ============================================================
// SIDEBAR COMPONENT - CUSTOMIZATION GUIDE
// ============================================================
// Left navigation sidebar for the dashboard.
// Customize navigation items, colors, and styling below.
// ============================================================

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// CUSTOMIZE: Navigation menu items
// Add, remove, or reorder items as needed
// Icons from lucide-react: https://lucide.dev
const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Calendar", href: "/dashboard/calendar", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Composer", href: "/dashboard/composer", icon: <PenSquare className="h-4 w-4" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Content Library", href: "/dashboard/content", icon: <Library className="h-4 w-4" /> },
  { label: "Platforms", href: "/dashboard/platforms", icon: <Link2 className="h-4 w-4" /> },
  { label: "Progress", href: "/dashboard/progress", icon: <Target className="h-4 w-4" /> },
  { label: "Team", href: "/dashboard/team", icon: <Users className="h-4 w-4" /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> }
];

export type SidebarProps = {
  variant?: "desktop" | "drawer";
  className?: string;
};

export const Sidebar = memo(function SidebarComponent({ variant = "desktop", className }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={cn(
        "h-full flex-col gap-4",
        variant === "desktop" ? "hidden lg:flex" : "flex",
        className
      )}
    >
      {/* CUSTOMIZE: Logo/branding section
          Colors: pulse-primary (cyan) and pulse-secondary (purple) */}
      <div className="glass flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* CUSTOMIZE: Logo background - currently uses cyan/purple gradient */}
          <span className="glass flex h-8 w-8 items-center justify-center rounded-xl border border-pulse-primary/50 bg-gradient-to-br from-pulse-primary/25 via-white/5 to-pulse-secondary/25 text-xs font-semibold text-pulse-text">
            SP
          </span>
          <div>
            <p className="text-sm font-semibold text-pulse-text">{APP_NAME}</p>
            <p className="text-[11px] text-pulse-muted">Command Center</p>
          </div>
        </Link>
      </div>

      {/* Navigation menu */}
      <nav className="glass flex flex-1 flex-col justify-between rounded-2xl border border-white/10 p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                  // CUSTOMIZE: Active link styling
                  // Currently: Gradient from cyan to purple with cyan glow
                  // Change colors by replacing pulse-primary and pulse-secondary
                  active
                    ? "bg-gradient-to-r from-pulse-primary/30 via-pulse-secondary/20 to-transparent text-pulse-text shadow-[0_0_0_1px_rgba(0,217,255,0.35)]"
                    : "text-pulse-muted hover:bg-white/5 hover:text-pulse-text"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border border-transparent bg-white/0 text-pulse-muted transition",
                    active &&
                      "border-pulse-primary/50 bg-gradient-to-br from-pulse-primary/40 via-pulse-secondary/20 to-pulse-accent/20 text-pulse-text shadow-[0_0_22px_rgba(0,217,255,0.5)]",
                    !active && "group-hover:bg-white/8 group-hover:text-pulse-text"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-pulse-muted/80">Profile</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="glass flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-pulse-text">
              {user?.name
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("") ?? "SP"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-pulse-text">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-[11px] text-pulse-muted">
                {user ? (user.role === "owner" ? "Workspace Owner" : "Team Member") : "Not signed in"}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
});

