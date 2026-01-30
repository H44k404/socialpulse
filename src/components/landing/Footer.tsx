"use client";

import * as React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNotificationStore } from "@/store/notification-store";

export function Footer() {
  const pushToast = useNotificationStore((s) => s.push);
  const [email, setEmail] = React.useState("");

  const onNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    pushToast({ title: "Thanks for subscribing!", description: "We'll send product updates to " + email, variant: "success" });
    setEmail("");
  };
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 pt-8">
      <Card padding="lg" className="overflow-hidden">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="glass flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-pulse-primary/25 via-white/5 to-pulse-secondary/25 text-sm font-semibold text-pulse-text">
                SP
              </span>
              <div>
                <p className="text-sm font-semibold text-pulse-text">{APP_NAME}</p>
                <p className="text-xs text-pulse-muted">{APP_TAGLINE}</p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm text-pulse-muted">
              YourAgencyName is a futuristic social media management platform with universal scheduling, advanced
              analytics, and AI-powered workflows.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                className="glass rounded-xl border border-white/10 p-2 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                href="#"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                className="glass rounded-xl border border-white/10 p-2 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                href="#"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                className="glass rounded-xl border border-white/10 p-2 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                href="#"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                className="glass rounded-xl border border-white/10 p-2 text-pulse-muted transition hover:bg-white/10 hover:text-pulse-text"
                href="#"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-pulse-muted">Product</p>
              <Link className="block text-pulse-muted hover:text-pulse-text" href="#features">
                Features
              </Link>
              <Link className="block text-pulse-muted hover:text-pulse-text" href="#platforms">
                Platforms
              </Link>
              <Link className="block text-pulse-muted hover:text-pulse-text" href="#pricing">
                Pricing
              </Link>
              <Link className="block text-pulse-muted hover:text-pulse-text" href="/dashboard">
                Dashboard
              </Link>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-pulse-muted">Company</p>
              <a className="block text-pulse-muted hover:text-pulse-text" href="#">
                About
              </a>
              <a className="block text-pulse-muted hover:text-pulse-text" href="#">
                Careers
              </a>
              <a className="block text-pulse-muted hover:text-pulse-text" href="#">
                Security
              </a>
              <a className="block text-pulse-muted hover:text-pulse-text" href="#">
                Contact
              </a>
            </div>

            <div className="space-y-3 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-pulse-muted">Newsletter</p>
              <form onSubmit={onNewsletterSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                <Input
                  label="Email address"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
                <Button type="submit" className="h-11" size="md">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-pulse-muted">
                We’ll only send product updates. No spam.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-pulse-muted">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-pulse-text" href="#">
                Privacy
              </a>
              <a className="hover:text-pulse-text" href="#">
                Terms
              </a>
              <a className="hover:text-pulse-text" href="#">
                Legal
              </a>
            </div>
          </div>
        </div>
      </Card>
    </footer>
  );
}

