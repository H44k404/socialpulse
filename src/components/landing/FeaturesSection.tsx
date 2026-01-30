"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  Wand2,
  Users,
  Target,
  Bell,
  Library,
  Bot,
  Link2,
  Smartphone
} from "lucide-react";

import { Card } from "@/components/ui/Card";

type Feature = {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Universal Post Scheduler",
    description: "Schedule across all platforms simultaneously with queue and bulk tools.",
    bullets: ["Best time suggestions with AI", "Bulk scheduling support", "Queue management"],
    icon: <Calendar className="h-5 w-5" />
  },
  {
    title: "Advanced Analytics Dashboard",
    description: "Real-time tracking, trends, competitor intel, and exportable custom reports.",
    bullets: ["Growth metrics & trends", "Competitor analysis", "Export to PDF/CSV"],
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    title: "AI Content Studio",
    description: "Generate captions, optimize hashtags, and iterate faster with templates.",
    bullets: ["AI caption generator", "Hashtag recommendations", "Template library"],
    icon: <Wand2 className="h-5 w-5" />
  },
  {
    title: "Team Collaboration",
    description: "Approval workflows, roles, comments, activity logs, and client management.",
    bullets: ["Roles & permissions", "Approval workflows", "Internal comments"],
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Progress Tracker & Goals",
    description: "Set targets, track KPIs, and celebrate milestones with gamification.",
    bullets: ["Visual progress bars", "Achievement milestones", "Performance alerts"],
    icon: <Target className="h-5 w-5" />
  },
  {
    title: "Smart Notifications",
    description: "Stay ahead with alerts for engagement, publishing reminders, and triggers.",
    bullets: ["Engagement alerts", "Publishing reminders", "Custom triggers"],
    icon: <Bell className="h-5 w-5" />
  },
  {
    title: "Content Library",
    description: "Centralized media storage with tagging, search, and versioning.",
    bullets: ["Smart tagging system", "Search & filters", "Version control"],
    icon: <Library className="h-5 w-5" />
  },
  {
    title: "AI Assistant",
    description: "Trend analysis, audience insights, and optimal posting recommendations.",
    bullets: ["Trend analysis", "Optimal posting times", "Chat support"],
    icon: <Bot className="h-5 w-5" />
  },
  {
    title: "Link in Bio Manager",
    description: "Build landing pages, track clicks, generate QR codes, and A/B test.",
    bullets: ["Click tracking", "QR code generator", "A/B testing"],
    icon: <Link2 className="h-5 w-5" />
  },
  {
    title: "Mobile App",
    description: "iOS + Android companion for on-the-go publishing and quick replies.",
    bullets: ["Push notifications", "On-the-go posting", "Quick replies"],
    icon: <Smartphone className="h-5 w-5" />
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm text-pulse-muted">Features</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
          Everything you need to run social at scale.
        </h2>
        <p className="mt-3 text-pulse-muted">
          From universal scheduling to deep analytics and AI workflows — each feature is designed to feel fast,
          fluid, and futuristic.
        </p>
      </div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
            }}
          >
            <Card className="group h-full" gradientBorder hoverLift padding="md">
              <div className="flex items-start gap-3">
                <div className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-pulse-secondary/20 via-white/5 to-pulse-primary/20 text-pulse-text transition group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-pulse-text">{f.title}</h3>
                  <p className="mt-1 text-sm text-pulse-muted">{f.description}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-pulse-muted">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse-secondary/80" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

