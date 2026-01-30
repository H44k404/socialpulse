"use client";

import * as React from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Preload next page to reduce navigation time
  React.useEffect(() => {
    const nextPages = [
      "/dashboard",
      "/dashboard/calendar",
      "/dashboard/composer",
      "/dashboard/analytics",
      "/dashboard/content",
      "/dashboard/platforms",
      "/dashboard/progress",
      "/dashboard/settings",
      "/dashboard/team"
    ];
    nextPages.forEach((page) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = page;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="flex h-screen w-screen bg-pulse-bg overflow-hidden">
      {/* Sidebar - fixed, hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:w-[280px] flex-shrink-0 border-r border-white/10">
        <div className="overflow-y-auto h-full p-3 lg:p-4 scrollbar-thin scrollbar-thumb-pulse-primary/30">
          <Sidebar />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Topbar - fixed with optimized spacing for iOS */}
        <div className="flex-shrink-0 border-b border-white/10 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 backdrop-blur-lg safe-area-inset-top">
          <Topbar />
        </div>
        
        {/* Scrollable content with optimized momentum scrolling for iOS */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 safe-area-inset">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

