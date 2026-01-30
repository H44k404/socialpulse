"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";

// Lazy load AnalyticsDashboard to keep page bundle small
const AnalyticsDashboard = dynamic(
  () => import("@/components/dashboard/AnalyticsDashboard").then((mod) => ({ default: mod.AnalyticsDashboard })),
  { 
    loading: () => (
      <Card padding="lg" className="h-[400px] animate-pulse bg-white/5">
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-white/10"></div>
          <div className="h-[300px] rounded bg-white/5"></div>
        </div>
      </Card>
    ),
    ssr: true
  }
);

export default function AnalyticsPage() {
  return (
    <main className="space-y-4">
      <Suspense fallback={<div className="animate-pulse">Loading analytics...</div>}>
        <AnalyticsDashboard />
      </Suspense>
    </main>
  );
}

