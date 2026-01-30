"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import { PlatformsSection } from "@/components/landing/PlatformsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProgressTrackerSection } from "@/components/landing/ProgressTrackerSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/landing/Footer";
import { LoadingScreen } from "@/components/landing/LoadingScreen";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  ease: "anticipate" as const,
  duration: 0.8
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: "hero", component: HeroSection },
    { id: "platforms", component: PlatformsSection },
    { id: "features", component: FeaturesSection },
    { id: "progress", component: ProgressTrackerSection },
    { id: "pricing", component: PricingSection },
    { id: "testimonials", component: TestimonialsSection },
    { id: "footer", component: Footer }
  ];

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="main-content"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full overflow-x-hidden bg-slate-900"
      >
        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="relative"
            >
              <SectionComponent />
            </motion.section>
          );
        })}
      </motion.main>
    </AnimatePresence>
  );
}

