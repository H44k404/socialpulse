"use client";

import { motion } from "framer-motion";
import {
  Activity,
  MessageCircle,
  Radio,
  Sparkles,
  Video,
  Users,
  Globe,
  Hash,
  Send
} from "lucide-react";

import { PLATFORMS, type PlatformKey } from "@/lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const platformIcon: Record<PlatformKey, React.ReactNode> = {
  facebook: <Users className="h-5 w-5" />,
  instagram: <Sparkles className="h-5 w-5" />,
  x: <Hash className="h-5 w-5" />,
  linkedin: <Users className="h-5 w-5" />,
  youtube: <Video className="h-5 w-5" />,
  tiktok: <Video className="h-5 w-5" />,
  pinterest: <Globe className="h-5 w-5" />,
  snapchat: <Radio className="h-5 w-5" />,
  whatsapp_business: <MessageCircle className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
  reddit: <Activity className="h-5 w-5" />,
  discord: <Users className="h-5 w-5" />,
  twitch: <Radio className="h-5 w-5" />,
  threads: <Hash className="h-5 w-5" />,
  mastodon: <Globe className="h-5 w-5" />,
  bereal: <Sparkles className="h-5 w-5" />,
  google_business_profile: <Globe className="h-5 w-5" />
};

export function PlatformsSection() {
  return (
    <section id="platforms" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-pulse-muted">Platforms</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
            One dashboard. Every major network.
          </h2>
          <p className="mt-3 max-w-2xl text-pulse-muted">
            Connect all platforms in minutes. Schedule posts, manage content formats, and track performance with
            consistent workflows everywhere.
          </p>
        </div>

        <Badge variant="info" dot>
          17 platforms supported
        </Badge>
      </div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {PLATFORMS.map((p) => (
          <motion.div
            key={p.key}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
            }}
          >
            <Card className="group h-full overflow-hidden" gradientBorder hoverLift padding="md">
              <CardHeader className="mb-3">
                <div className="flex items-center gap-3">
                  <div className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-pulse-primary/20 via-white/5 to-pulse-secondary/20 text-pulse-text transition group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                    {platformIcon[p.key]}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{p.name}</CardTitle>
                    <CardDescription className="text-xs">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-pulse-warning/80" />
                        Disconnected
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {p.features.slice(0, 3).map((f) => (
                    <Badge key={f} size="sm" variant="neutral">
                      {f}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

