"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type Pin = {
  label: string;
  /** position as a percentage of the panel */
  x: number;
  y: number;
  /** optional neon accent; defaults to white */
  accent?: string;
};

const PINS: readonly Pin[] = [
  { label: "pottery workshop", x: 24, y: 26 },
  { label: "rooftop social", x: 66, y: 22, accent: "#39FF14" },
  { label: "pop-up market", x: 46, y: 44 },
  { label: "run club", x: 70, y: 60, accent: "#4D8DFF" },
  { label: "supper club", x: 30, y: 68 },
  { label: "food drop", x: 58, y: 80, accent: "#FF5FD2" },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const pinVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function ExperienceMap() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-[#0b0c0f] sm:aspect-[16/11] lg:aspect-[4/3]">
      {/* street grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(ellipse at center, #000 50%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, #000 50%, transparent 92%)",
        }}
      />

      {/* range rings */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="29" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.25" />
      </svg>

      {/* "live near you" status */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
        <span className="relative flex size-1.5">
          {!reduce && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#39FF14]/70" />
          )}
          <span className="relative size-1.5 rounded-full bg-[#39FF14]" />
        </span>
        live near you
      </div>

      {/* you-are-here marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="relative flex size-3 items-center justify-center">
          {!reduce && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40" />
          )}
          <span className="relative size-2.5 rounded-full bg-white ring-2 ring-white/30" />
        </span>
      </div>

      {/* experience pins */}
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : "hidden"}
        variants={container}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={reduce ? undefined : "show"}
      >
        {PINS.map((pin) => (
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            key={pin.label}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            variants={pinVariants}
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg shadow-black/40 backdrop-blur">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: pin.accent ?? "#ffffff" }}
              />
              {pin.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export { ExperienceMap };
