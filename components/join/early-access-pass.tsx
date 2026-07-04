"use client";

import { motion, useReducedMotion } from "motion/react";

import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

// The nuclii ecosystem, in line order. No counts — the framing carries the FOMO.
const ROLES = [
  { name: EXPERIENCE_ROLES.explorer.label, color: EXPERIENCE_ROLES.explorer.signal },
  { name: EXPERIENCE_ROLES.host.label, color: EXPERIENCE_ROLES.host.signal },
  { name: EXPERIENCE_ROLES.venue.label, color: EXPERIENCE_ROLES.venue.signal },
  { name: EXPERIENCE_ROLES.talent.label, color: EXPERIENCE_ROLES.talent.signal },
] as const;

export function EarlyAccessPass() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      className="w-full max-w-[21rem]"
      transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[20px] border border-white/10 bg-[#0f1012] p-6"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* header — real wordmark + a quiet live cue */}
        <div className="flex items-center justify-between">
          <span
            aria-hidden="true"
            className="block h-[0.95rem] w-[2.9rem] bg-white"
            style={{
              WebkitMaskImage: "url(/logo/nuclii-white.png)",
              maskImage: "url(/logo/nuclii-white.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
            }}
          />
          <span className="sr-only">nuclii</span>
          <span className="flex items-center gap-1.5 text-[12px] lowercase text-white/50">
            <span className="relative flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-[#7A9E6E]/60 motion-safe:animate-ping" />
              <span className="relative size-2 rounded-full bg-[#7A9E6E]" />
            </span>
            forming now
          </span>
        </div>

        <h3 className="mt-6 text-[1.7rem] font-extrabold lowercase leading-[0.95] tracking-[-0.03em] text-white">
          the first wave.
        </h3>
        <p className="mt-3 text-[13.5px] lowercase leading-6 text-white/55">
          early access to nuclii — invite-first, no followers, no queue-jumping
          for money.
        </p>

        <div className="mt-5 h-px w-full bg-white/10" />

        <p className="mt-5 text-[13px] lowercase text-white/45">first in line</p>
        <ul className="mt-3 space-y-3">
          {ROLES.map((role) => (
            <li className="flex items-center gap-3" key={role.name}>
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: role.color }}
              />
              <span className="text-[15px] lowercase text-white/60">{role.name}</span>
            </li>
          ))}
          <li className="flex items-center gap-3 pt-1">
            <span className="relative flex size-2.5 shrink-0 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-white/50 motion-safe:animate-ping" />
              <span className="relative size-2.5 rounded-full bg-white" />
            </span>
            <span className="text-[15px] font-bold lowercase text-white">
              you · joining now
            </span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
