"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Globe, Rocket } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function Particles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: number; duration: number; delay: number }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return <div aria-hidden="true" className="pointer-events-none absolute inset-0" />;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Floating3DElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border border-purple-400/30 rounded-lg"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 w-24 h-24 border border-cyan-400/30 rounded-full"
        animate={{
          rotateZ: [0, 360],
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 border border-orange-400/30"
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, 180, 360],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm" />
      </motion.div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-1/3 right-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-white/10">
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-20"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/10">
          <Globe className="w-6 h-6 text-cyan-400" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/4"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full backdrop-blur-sm border border-white/10">
          <Rocket className="w-6 h-6 text-orange-400" />
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-10 md:py-20">
      {/* Mouse-follow gradient effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(139, 92, 246, 0.15), transparent 40%)`
        }}
      />

      {/* animated gradient mesh overlay */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_20%,rgba(139,92,246,0.3),transparent_55%),radial-gradient(700px_circle_at_80%_10%,rgba(6,182,212,0.25),transparent_50%),radial-gradient(900px_circle_at_40%_80%,rgba(245,158,11,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(15,23,42,1))]" />
      </motion.div>

      <Particles />
      <Floating3DElements />

      <motion.div
        style={{ y: y2 }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6"
      >
        <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 items-center">
          <motion.div
            style={{ y: y3 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" dot>
                Futuristic cyber-glass UI
              </Badge>
              <Badge variant="neutral">Next.js 14 • TypeScript • Motion</Badge>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pulse-text leading-tight"
            >
              Meet{" "}
              <span className="bg-gradient-to-r from-pulse-secondary via-pulse-primary to-pulse-accent bg-clip-text text-transparent animate-pulse">
                YourAgencyName
              </span>
              .
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400">
                Schedule. Analyze. Dominate.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-base md:text-lg lg:text-xl text-pulse-muted leading-relaxed max-w-lg"
            >
              Your Custom Tagline
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button size="lg" iconRight={<ArrowRight className="h-5 w-5" />} className="w-full bg-gradient-to-r from-pulse-primary via-pulse-secondary to-pulse-accent hover:shadow-2xl hover:shadow-pulse-primary/50 transition-all duration-300 text-white font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full hover:bg-white/15 transition-colors duration-300">
                  Sign Up Free
                </Button>
              </Link>
              <Button variant="ghost" size="lg" iconLeft={<Play className="h-5 w-5" />} className="w-full sm:w-auto hover:bg-white/15 transition-colors duration-300">
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="glass rounded-2xl border border-white/10 px-4 md:px-6 py-4 backdrop-blur-xl w-full"
            >
              <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3 md:gap-x-6 text-sm text-pulse-text font-medium">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pulse-secondary" />
                  500k+ Posts Scheduled
                </span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pulse-primary"></span>50k+ Users</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pulse-accent"></span>99.9% Uptime</span>
              </div>
            </motion.div>

            <motion.a
              href="#platforms"
              className="inline-flex items-center gap-2 text-base text-pulse-muted hover:text-pulse-text transition-colors duration-300 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-pulse-primary/50 bg-pulse-primary/10 group-hover:border-pulse-primary group-hover:bg-pulse-primary/20 transition-all"
              >
                ↓
              </motion.span>
              Scroll to explore
            </motion.a>
          </motion.div>

          {/* mock dashboard / 3D-ish preview */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative hidden md:block"
          >
            <div aria-hidden="true" className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-pulse-primary/20 via-pulse-secondary/10 to-pulse-accent/20 blur-3xl" />

            <Card className="relative overflow-hidden" gradientBorder animatedBorder padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                  <span className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                </div>
                <Badge variant="info">Live Preview</Badge>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="glass-soft rounded-xl border border-white/10 p-5 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent">
                  <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Engagement</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-400">+18.4%</p>
                  <div className="mt-4 h-2.5 w-full rounded-full bg-white/10">
                    <motion.div
                      className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 shadow-lg shadow-cyan-500/50"
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-soft rounded-xl border border-white/10 p-4 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent">
                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Scheduled</p>
                    <p className="mt-2 text-2xl font-bold text-purple-400">24</p>
                    <p className="mt-2 text-xs text-purple-200/60">Next: 2:30 PM</p>
                  </div>
                  <div className="glass-soft rounded-xl border border-white/10 p-4 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent">
                    <p className="text-xs font-semibold text-orange-300 uppercase tracking-wider">AI Suggestions</p>
                    <p className="mt-2 text-2xl font-bold text-orange-400">12</p>
                    <p className="mt-2 text-xs text-orange-200/60">Trending now</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* floating platform mini-cards */}
            <motion.div
              className="absolute -right-4 -top-4 w-44"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Card padding="sm" className="text-xs border-cyan-500/30 bg-cyan-500/5" hoverLift>
                <p className="font-semibold text-cyan-300">Instagram</p>
                <p className="mt-1 text-cyan-200/60">Reels + Stories enabled</p>
              </Card>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-10 w-48"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Card padding="sm" className="text-xs border-purple-500/30 bg-purple-500/5" hoverLift>
                <p className="font-semibold text-purple-300">TikTok</p>
                <p className="mt-1 text-purple-200/60">Best time: 7–9 PM</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

