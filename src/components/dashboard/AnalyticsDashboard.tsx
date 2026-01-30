"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { useAnalyticsStore } from "@/store/analytics-store";

const COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B", "#10B981"];

export function AnalyticsDashboard() {
  const { timeSeries, platformPerformance, contentTypes, loading, error, refresh } = useAnalyticsStore();
  const [range, setRange] = React.useState<"7d" | "30d">("7d");

  useEffect(() => {
    if (!timeSeries.length) void refresh();
  }, [refresh, timeSeries.length]);

  return (
    <section className="space-y-4">
      <Card gradientBorder padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Engagement, platform performance, and content insights.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown
              label="Range"
              value={range}
              onChange={(v) => setRange(v as "7d" | "30d")}
              options={[
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" }
              ]}
            />
            <Button variant="secondary" size="sm" onClick={() => refresh()}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-[2fr_1.3fr]">
          <div className="h-60 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-xs text-pulse-muted">Engagement over time</p>
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={timeSeries}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RTooltip
                  contentStyle={{
                    background: "#020617",
                    borderRadius: 12,
                    border: "1px solid #1e293b",
                    fontSize: 11
                  }}
                />
                <Line type="monotone" dataKey="likes" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </RLineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="mb-1 text-pulse-muted">Platform performance</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformPerformance}>
                    <XAxis dataKey="platform" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RTooltip
                      contentStyle={{
                        background: "#020617",
                        borderRadius: 12,
                        border: "1px solid #1e293b",
                        fontSize: 11
                      }}
                    />
                    <Bar dataKey="engagement">
                      {platformPerformance.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="mb-1 text-pulse-muted">Content type performance</p>
              <div className="flex items-center gap-2">
                <div className="h-20 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={contentTypes} dataKey="value" innerRadius={18} outerRadius={30} paddingAngle={3}>
                        {contentTypes.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 text-[11px]">
                  {contentTypes.map((c, i) => (
                    <div key={c.type} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-pulse-text">{c.type}</span>
                      <span className="text-pulse-muted">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        {loading && <p className="mt-2 text-xs text-pulse-muted">Refreshing analytics…</p>}
        {error && (
          <p className="mt-2 text-xs text-pulse-error">
            {error} <Badge variant="warning">Retry via Refresh</Badge>
          </p>
        )}
      </Card>
    </section>
  );
}

