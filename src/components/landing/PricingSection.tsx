"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Billing = "monthly" | "yearly";

type Tier = {
  name: string;
  priceMonthly: number;
  features: string[];
  highlighted?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    priceMonthly: 29,
    features: ["5 social accounts", "50 scheduled posts/month", "Basic analytics", "1 user", "7-day content calendar"]
  },
  {
    name: "Professional",
    priceMonthly: 79,
    highlighted: true,
    features: [
      "25 social accounts",
      "Unlimited posts",
      "Advanced analytics",
      "5 team members",
      "AI content assistant",
      "Progress tracking",
      "Priority support"
    ]
  },
  {
    name: "Enterprise",
    priceMonthly: 199,
    features: [
      "Unlimited accounts",
      "White-label option",
      "Custom integrations",
      "Unlimited team members",
      "Dedicated account manager",
      "API access",
      "Custom reporting"
    ]
  }
];

function formatPrice(monthly: number, billing: Billing) {
  if (billing === "monthly") return monthly;
  // 20% off yearly
  return Math.round(monthly * 12 * 0.8);
}

export function PricingSection() {
  const [billing, setBilling] = React.useState<Billing>("monthly");

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-pulse-muted">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-pulse-text">
            Simple plans. Serious power.
          </h2>
          <p className="mt-3 max-w-2xl text-pulse-muted">
            Choose a tier that fits your workflow today, then scale up as your agency grows.
          </p>
        </div>

        <div className="glass flex items-center gap-2 rounded-2xl border border-white/10 p-2">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={[
              "rounded-xl px-3 py-2 text-sm transition",
              billing === "monthly" ? "bg-white/10 text-pulse-text" : "text-pulse-muted hover:text-pulse-text"
            ].join(" ")}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={[
              "rounded-xl px-3 py-2 text-sm transition",
              billing === "yearly" ? "bg-white/10 text-pulse-text" : "text-pulse-muted hover:text-pulse-text"
            ].join(" ")}
          >
            Yearly
          </button>
          <Badge variant="success" className="ml-1">
            Save 20%
          </Badge>
        </div>
      </div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {tiers.map((t) => {
          const price = formatPrice(t.priceMonthly, billing);
          const suffix = billing === "monthly" ? "/mo" : "/yr";
          return (
            <motion.div
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
              }}
            >
              <Card
                className={[
                  "h-full overflow-hidden",
                  t.highlighted
                    ? "border border-pulse-primary/25 shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_20px_60px_rgba(0,0,0,0.45)]"
                    : ""
                ].join(" ")}
                gradientBorder={t.highlighted}
                animatedBorder={t.highlighted}
                padding="lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-pulse-muted">{t.name}</p>
                    <div className="mt-3 flex items-end gap-2">
                      <p className="text-4xl font-semibold tracking-tight text-pulse-text">${price}</p>
                      <p className="pb-1 text-sm text-pulse-muted">{suffix}</p>
                    </div>
                  </div>

                  {t.highlighted && (
                    <Badge variant="info" dot>
                      Most Popular
                    </Badge>
                  )}
                </div>

                <ul className="mt-6 space-y-3 text-sm text-pulse-muted">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pulse-primary/15 text-pulse-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/subscription">
                    <Button
                      fullWidth
                      size="lg"
                      variant={t.highlighted ? "primary" : "secondary"}
                      iconRight={t.highlighted ? <Sparkles className="h-4 w-4" /> : undefined}
                    >
                      Choose {t.name}
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

