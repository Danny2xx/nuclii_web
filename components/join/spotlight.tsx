"use client";

import { motion, useReducedMotion } from "motion/react";

// A soft top-centre spotlight that fades in behind the hero. Aceternity's
// spotlight idea, muted to a quiet white glow so it fits the brand.
export function Spotlight() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-12%] -z-10 h-[68vh] w-[85vw] max-w-[72rem] -translate-x-1/2 rounded-full"
      initial={reduce ? { opacity: 0.9 } : { opacity: 0, scale: 0.82 }}
      style={{
        background:
          "radial-gradient(closest-side, rgba(255,255,255,0.11), rgba(255,255,255,0.03) 45%, transparent 72%)",
        filter: "blur(44px)",
      }}
      transition={{ duration: 1.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
