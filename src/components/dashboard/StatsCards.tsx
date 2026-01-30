"use client";

import { useEffect, memo } from "react";
import { motion } from "framer-motion";
import { BarChart3, CalendarClock, LineChart, Users } from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  ResponsiveContainer,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAnalyticsStore } from "@/store/analytics-store";

function StatNumber({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-3xl font-bold tracking-tight text-white"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

function StatsCardsComponent() {
  const { timeSeries, platformPerformance, loading, refresh } = useAnalyticsStore();

  useEffect(() => {
    if (timeSeries.length === 0) void refresh();
  }, [refresh, timeSeries.length]);

  const totalEngagement =
    timeSeries.reduce((sum, d) => sum + d.likes + d.comments + d.shares + d.clicks, 0) ?? 0;

  const COLORS = ["#06B6D4", "#8B5CF6", "#F59E0B", "#10B981"];

  return (
    <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card gradientBorder padding="md" className="hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 text-cyan-400 shadow-lg shadow-cyan-500/30">
              <LineChart className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Total Posts Published</CardTitle>
              <Badge variant="success" size="sm" className="mt-1">
                ↑ 12% vs last month
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <StatNumber value={420} />
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={timeSeries}>
                <RTooltip contentStyle={{ background: "#020617", borderRadius: 12, border: "1px solid #1e293b" }} />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={600}
                />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card gradientBorder padding="md" className="hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/30">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Total Engagement</CardTitle>
              <p className="text-xs text-purple-300 mt-1">Likes, comments, shares, and clicks combined.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <StatNumber value={totalEngagement} />
          <p className="mt-2 text-sm font-medium text-purple-300">vs. 32,900 last period</p>
        </CardBody>
      </Card>

      <Card gradientBorder padding="md" className="hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 text-orange-400 shadow-lg shadow-orange-500/30">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Follower Growth</CardTitle>
              <Badge variant="info" size="sm" className="mt-1">
                Net new followers in the last 7 days.
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <StatNumber value={1280} />
          <div className="mt-4 h-14">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={timeSeries}>
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={600}
                />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card gradientBorder padding="md" className="hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/20 text-pink-400 shadow-lg shadow-pink-500/30">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Scheduled Posts</CardTitle>
              <p className="text-xs text-pink-300 mt-1">Upcoming posts & platform mix.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <StatNumber value={36} />
          <p className="mt-2 text-sm font-medium text-pink-300">Next post today at 3:24 PM</p>
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformPerformance.slice(0, 4)}
                  dataKey="engagement"
                  nameKey="platform"
                  innerRadius={18}
                  outerRadius={30}
                  paddingAngle={3}
                >
                  {platformPerformance.slice(0, 4).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {loading && (
        <p className="col-span-full text-xs text-pulse-muted">Loading analytics snapshot…</p>
      )}
    </section>
  );
}

export const StatsCards = memo(StatsCardsComponent);

