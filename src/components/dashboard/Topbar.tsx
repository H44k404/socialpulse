"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Bell, CalendarDays, ChevronDown, Plus, Search, Terminal } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { CommandPalette } from "@/components/dashboard/command-palette/CommandPalette";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

export const Topbar = memo(function TopbarComponent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const pushToast = useNotificationStore((s) => s.push);
  const [client, setClient] = React.useState<"Main Brand" | "Alt Brand">("Main Brand");
  const [commandOpen, setCommandOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (!meta) return;

      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        router.push("/dashboard/composer");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <>
      <header className="glass flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 sticky top-0 z-40 backdrop-blur-xl w-full safe-area-inset-top">
        {/* Mobile search and navigation */}
        <div className="flex w-full sm:hidden items-center gap-1.5 order-2 sm:order-1">
          <MobileSidebar />
          <div className="flex-1 min-w-0">
            <Input
              label="Search..."
              iconLeft={<Search className="h-4 w-4 flex-shrink-0" />}
              placeholder="Search"
              className="text-sm"
            />
          </div>
        </div>

        {/* Desktop search and command palette */}
        <div className="hidden sm:flex w-full sm:flex-1 items-center gap-1 md:gap-2 order-1">
          <div className="hidden w-full max-w-md md:flex flex-1 min-w-0">
            <Input
              label="Search posts, campaigns, clients..."
              iconLeft={<Search className="h-4 w-4 flex-shrink-0" />}
              placeholder="Search across YourAgencyName"
            />
          </div>
          <Tooltip content="Command palette (Cmd/Ctrl + K)">
            <button
              type="button"
              className="glass hidden items-center gap-1 rounded-xl border border-white/10 px-2 md:px-3 py-1.5 text-xs text-pulse-text font-medium md:inline-flex hover:bg-white/10 active:bg-white/15 transition-colors duration-200 flex-shrink-0 touch-manipulation"
              onClick={() => setCommandOpen(true)}
              onTouchEnd={() => setCommandOpen(true)}
              aria-label="Open command palette"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Cmd / Ctrl</span>
              <span className="rounded-md bg-pulse-primary/40 px-1.5 text-[10px]">K</span>
            </button>
          </Tooltip>
        </div>

        {/* Action buttons - optimized for mobile */}
        <div className="flex w-full sm:w-auto sm:flex-shrink-0 items-center justify-end gap-1 sm:gap-2 order-1 sm:order-3 safe-area-inset-right">
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<CalendarDays className="h-4 w-4 flex-shrink-0" />}
            onClick={() => router.push("/dashboard/calendar")}
            className="text-xs sm:text-sm"
            aria-label="Open calendar"
          >
            <span className="hidden sm:inline">Calendar</span>
          </Button>

          <Button
            size="sm"
            iconLeft={<Plus className="h-4 w-4 flex-shrink-0" />}
            onClick={() => router.push("/dashboard/composer")}
            className="bg-gradient-to-r from-pulse-primary via-pulse-secondary to-pulse-accent hover:shadow-lg hover:shadow-pulse-primary/50 transition-all duration-300 text-xs sm:text-sm"
            aria-label="Create new post"
          >
            <span className="hidden sm:inline">New Post</span>
          </Button>

          <Tooltip content="Notifications">
            <button
              type="button"
              onClick={() =>
                pushToast({
                  title: "All caught up",
                  description: "You have no new notifications",
                  variant: "info"
                })
              }
              className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-pulse-muted transition hover:bg-pulse-primary/20 hover:text-pulse-primary hover:border-pulse-primary/40 duration-200 min-h-[44px] sm:min-h-[40px] min-w-[44px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-pulse-primary text-[8px] text-white animate-pulse">
                3
              </span>
            </button>
          </Tooltip>

          <div className="hidden min-w-[150px] sm:block">
            <Dropdown
              label="Account"
              value={client}
              onChange={(value) => setClient(value as "Main Brand" | "Alt Brand")}
              options={[
                {
                  value: "Main Brand",
                  label: "Main Brand",
                  description: "Primary workspace"
                },
                {
                  value: "Alt Brand",
                  label: "Alt Brand",
                  description: "Secondary workspace"
                }
              ]}
            />
          </div>

          <button
            type="button"
            className="glass flex items-center gap-2 rounded-2xl border border-white/10 px-2 py-1.5 text-left text-xs text-pulse-text min-h-[44px] sm:min-h-[40px] min-w-[44px]"
            aria-label="User profile menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pulse-primary/60 text-[11px] font-semibold flex-shrink-0">
              {user?.name
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("") ?? "SP"}
            </div>
            <div className="hidden sm:block">
              <p className="truncate font-medium">{user?.name ?? "Guest"}</p>
              <p className="text-[10px] text-pulse-muted flex items-center gap-1">
                {client}
                <ChevronDown className="h-3 w-3" />
              </p>
            </div>
          </button>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
});

