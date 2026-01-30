"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";

// Lazy load PostComposer to keep page bundle small
const PostComposer = dynamic(
  () => import("@/components/dashboard/PostComposer").then((mod) => ({ default: mod.PostComposer })),
  { 
    loading: () => (
      <Card padding="lg" className="h-[500px] animate-pulse bg-white/5">
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-white/10"></div>
          <div className="h-[400px] rounded bg-white/5"></div>
        </div>
      </Card>
    ),
    ssr: true
  }
);

export default function ComposerPage() {
  return (
    <main className="space-y-4">
      <Suspense fallback={<div className="animate-pulse">Loading composer...</div>}>
        <PostComposer />
      </Suspense>
    </main>
  );
}

