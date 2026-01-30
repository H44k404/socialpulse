"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

export function ProgressTrackerSection() {
  const goals = [
    { label: "Monthly Posts", value: 72 },
    { label: "Engagement KPI", value: 58 },
    { label: "Follower Growth", value: 64 },
    { label: "Response Rate", value: 94 }
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-pulse-muted">Progress</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
            Goals that feel like leveling up.
          </h2>
          <p className="mt-3 max-w-2xl text-pulse-muted">
            Track monthly targets, weekly streaks, platform performance, and unlock achievement badges — all inside a
            live glass dashboard.
          </p>
        </div>
        <Badge variant="success" dot>
          Gamified milestones
        </Badge>
      </div>

      <motion.div
        className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_1fr]"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
      >
        <Card gradientBorder animatedBorder padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-pulse-text">Monthly goal tracker</p>
              <p className="mt-1 text-sm text-pulse-muted">Live progress bars with performance alerts.</p>
            </div>
            <div className="glass flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-pulse-text">
              <Sparkles className="h-5 w-5 text-pulse-secondary" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {goals.map((g) => (
              <Progress key={g.label} label={g.label} value={g.value} />
            ))}
          </div>
        </Card>

        <Card padding="lg" className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute -inset-10 bg-[radial-gradient(700px_circle_at_20%_20%,rgba(245,158,11,0.10),transparent_55%),radial-gradient(800px_circle_at_90%_40%,rgba(139,92,246,0.14),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-pulse-text">Achievements</p>
                <p className="mt-1 text-sm text-pulse-muted">Badges, streaks, and celebrations.</p>
              </div>
              <div className="glass flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-pulse-text">
                <Trophy className="h-5 w-5 text-pulse-accent" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Consistency King 👑", desc: "Posted 5 days in a row", variant: "success" as const },
                { title: "Engagement Master 🌟", desc: "10k interactions reached", variant: "info" as const },
                { title: "On Fire 🔥", desc: "3 viral posts this month", variant: "warning" as const },
                { title: "Support Pro 💬", desc: "90% response rate", variant: "success" as const }
              ].map((b) => (
                <div key={b.title} className="glass rounded-2xl border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-pulse-text">{b.title}</p>
                    <Badge variant={b.variant} dot>
                      Earned
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-pulse-muted">{b.desc}</p>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-6 rounded-2xl border border-pulse-success/25 bg-pulse-success/10 p-4 text-sm text-pulse-text"
              animate={{ boxShadow: ["0 0 0 rgba(16,185,129,0)", "0 0 28px rgba(16,185,129,0.25)", "0 0 0 rgba(16,185,129,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="font-semibold">Goal reached!</p>
              <p className="mt-1 text-xs text-pulse-muted">Celebration effects (confetti) are ready to plug in.</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

