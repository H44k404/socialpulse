"use client";

import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePostStore } from "@/store/post-store";

export function ContentCalendar() {
  const { posts } = usePostStore();

  const now = new Date();
  const days = eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now)
  });

  return (
    <Card gradientBorder padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Content Calendar</CardTitle>
          <CardDescription>
            Month overview with scheduled, published, and draft posts across platforms.
          </CardDescription>
        </div>
        <Badge variant="info" dot>
          Month view
        </Badge>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-7 gap-2 text-[11px] text-pulse-muted">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-1 py-1 text-center font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-2 text-xs">
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayPosts = posts.filter((p) => p.scheduledAt.startsWith(dateKey));
            return (
              <div
                key={dateKey}
                className="glass-soft flex min-h-[80px] flex-col gap-1 rounded-xl border border-white/10 p-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-pulse-muted">{format(day, "d")}</span>
                  {dayPosts.length > 0 && (
                    <span className="rounded-full bg-pulse-primary/20 px-1 text-[10px] text-pulse-primary">
                      {dayPosts.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 overflow-hidden">
                  {dayPosts.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="truncate rounded-lg bg-white/8 px-1 py-0.5 text-[10px] text-pulse-text"
                    >
                      {p.title}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <p className="text-[10px] text-pulse-muted">+{dayPosts.length - 2} more…</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

