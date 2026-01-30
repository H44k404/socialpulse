"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Dynamic imports with loading fallback
const StatsCards = dynamic(() => import("@/components/dashboard/StatsCards").then(mod => ({ default: mod.StatsCards })), {
  loading: () => <div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />,
  ssr: true
});

const ProgressTracker = dynamic(() => import("@/components/dashboard/ProgressTracker").then(mod => ({ default: mod.ProgressTracker })), {
  loading: () => <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />,
  ssr: true
});

const ActivityFeed = dynamic(() => import("@/components/dashboard/ActivityFeed").then(mod => ({ default: mod.ActivityFeed })), {
  loading: () => <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />,
  ssr: true
});

const AnalyticsDashboard = dynamic(() => import("@/components/dashboard/AnalyticsDashboard").then(mod => ({ default: mod.AnalyticsDashboard })), {
  loading: () => <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />,
  ssr: true
});

export default function DashboardPage() {
  return (
    <main className="space-y-6 w-full">
      <Suspense fallback={<div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />}>
        <StatsCards />
      </Suspense>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Suspense fallback={<div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />}>
          <ProgressTracker />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>
      <Suspense fallback={<div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />}>
        <AnalyticsDashboard />
      </Suspense>
    </main>
  );
}

