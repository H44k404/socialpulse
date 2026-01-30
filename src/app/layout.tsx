import type { Metadata } from "next";
import "./../styles/globals.css";
import { PageTransition } from "@/components/PageTransition";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: "YourAgencyName — Futuristic Social Media Management",
  description:
    "YourAgencyName is a futuristic social media management platform with scheduling, analytics, collaboration, and AI-powered workflows.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%238B5CF6' width='100' height='100'/><text x='50' y='60' font-size='60' fill='white' text-anchor='middle' font-weight='bold'>S</text></svg>"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="mesh-bg min-h-screen antialiased selection:bg-pulse-secondary/30 selection:text-pulse-text overflow-x-hidden" suppressHydrationWarning>
        <PageTransition>{children}</PageTransition>
        <Toaster />
      </body>
    </html>
  );
}

