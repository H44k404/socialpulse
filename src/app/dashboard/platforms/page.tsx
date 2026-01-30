"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";

// Lazy load PlatformConnector to keep page bundle small
const PlatformConnector = dynamic(
  () => import("@/components/dashboard/PlatformConnector").then((mod) => ({ default: mod.PlatformConnector })),
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

export default function PlatformsPage() {
  return (
    <main className="space-y-4">
      <Suspense fallback={<div className="animate-pulse">Loading platforms...</div>}>
        <PlatformConnector />
      </Suspense>
    </main>
  );
}

