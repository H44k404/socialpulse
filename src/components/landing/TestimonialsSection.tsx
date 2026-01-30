"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Testimonial = {
  name: string;
  company: string;
  quote: string;
  platform: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Ava Chen",
    company: "PulseWorks Studio",
    quote:
      "YourAgencyName feels like flying a spaceship. Scheduling across 12+ platforms and reporting takes minutes, not hours.",
    platform: "Instagram + TikTok"
  },
  {
    name: "Mateo Rivera",
    company: "Northwind Agency",
    quote:
      "The analytics are unreal — especially the best-time heatmap. Our engagement jumped 22% in the first month.",
    platform: "LinkedIn + X"
  },
  {
    name: "Priya Nair",
    company: "Aurora Brands",
    quote:
      "Team approvals and content library eliminated chaos. It’s the cleanest workflow we’ve had across clients.",
    platform: "YouTube + Facebook"
  }
];

export function TestimonialsSection() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  const t = testimonials[index]!;

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-pulse-muted">Testimonials</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
            Loved by teams who ship daily.
          </h2>
          <p className="mt-3 max-w-2xl text-pulse-muted">
            A carousel of real-world workflows — agencies, creators, and brands managing social at scale.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}>
            Prev
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIndex((i) => (i + 1) % testimonials.length)}>
            Next
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Card className="relative overflow-hidden" gradientBorder padding="lg">
              <div aria-hidden="true" className="absolute -inset-10 bg-[radial-gradient(700px_circle_at_20%_20%,rgba(6,182,212,0.12),transparent_60%),radial-gradient(700px_circle_at_80%_60%,rgba(139,92,246,0.14),transparent_55%)]" />

              <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <div className="flex items-center gap-1 text-pulse-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                        <Star className="h-4 w-4 fill-pulse-accent" />
                      </motion.span>
                    ))}
                  </div>

                  <p className="mt-4 text-lg leading-relaxed text-pulse-text">“{t.quote}”</p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="glass flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-pulse-text">
                      {t.name
                        .split(" ")
                        .slice(0, 2)
                        .map((s) => s[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-pulse-text">{t.name}</p>
                      <p className="text-sm text-pulse-muted">{t.company}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                  <Badge variant="info" dot>
                    {t.platform}
                  </Badge>
                  <p className="text-xs text-pulse-muted">Slide {index + 1} / {testimonials.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

