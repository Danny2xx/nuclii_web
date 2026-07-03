"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

// Character tones taken from the partner mascots in the photos below,
// so the hero ring, the chips and each section share one cast of colours.
export const MASCOT_TONES = {
  host: { from: "#E8795A", to: "#DA4F28" }, // red — the host mascot
  space: { from: "#BEE2F4", to: "#8FC9E8" }, // sky blue — the venue mascot
  talent: { from: "#F1D275", to: "#E9C44A" }, // yellow — the talent mascot
  nuclii: { from: "#9E9CF7", to: "#6A6AF2" }, // brand indigo — nuclii itself
  sage: { from: "#AFC79B", to: "#7A9E6E" }, // sage
  ochre: { from: "#DCC58F", to: "#C2A968" }, // ochre
} as const;

export type MascotTone = { from: string; to: string };

const LIMB = "#211f27";

/** A round, friendly nuclii character — a gradient sphere with face + limbs. */
export function Mascot({
  tone,
  className,
  delay = 0,
  flip = false,
  float = true,
  armLeft,
  armRight,
}: {
  tone: MascotTone;
  className?: string;
  delay?: number;
  flip?: boolean;
  float?: boolean;
  /** Override arm paths to "hold hands" with a neighbour. */
  armLeft?: string;
  armRight?: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  const floating = !reduce && float;
  const blink = reduce
    ? undefined
    : {
        animate: { ry: [12, 12, 2, 12] },
        transition: {
          duration: 0.22,
          repeat: Infinity,
          repeatDelay: 3 + delay,
          ease: "easeInOut" as const,
          times: [0, 0.4, 0.7, 1],
        },
      };

  return (
    <motion.div
      animate={floating ? { y: [0, -10, 0] } : undefined}
      className={className}
      transition={
        floating ? { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay } : undefined
      }
      whileHover={reduce ? undefined : { scale: 1.06 }}
    >
      <svg
        aria-hidden="true"
        className="block h-auto w-full"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
        viewBox="0 0 200 250"
      >
        <defs>
          <radialGradient cx="38%" cy="30%" id={`${id}-body`} r="78%">
            <stop offset="0%" stopColor={tone.from} />
            <stop offset="100%" stopColor={tone.to} />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="238" fill="#000" opacity="0.28" rx="50" ry="8" />

        {/* limbs (behind body) */}
        <path d="M86 150V208" fill="none" stroke={LIMB} strokeLinecap="round" strokeWidth="5" />
        <path d="M114 150V208" fill="none" stroke={LIMB} strokeLinecap="round" strokeWidth="5" />
        <ellipse cx="83" cy="212" fill={LIMB} rx="9" ry="5" />
        <ellipse cx="117" cy="212" fill={LIMB} rx="9" ry="5" />
        <path
          d={armLeft ?? "M36 104C16 120 14 140 26 156"}
          fill="none"
          stroke={LIMB}
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d={armRight ?? "M164 104C184 120 186 140 174 156"}
          fill="none"
          stroke={LIMB}
          strokeLinecap="round"
          strokeWidth="5"
        />
        {!armLeft && <circle cx="26" cy="158" fill={LIMB} r="6" />}
        {!armRight && <circle cx="174" cy="158" fill={LIMB} r="6" />}

        {/* body */}
        <circle cx="100" cy="90" fill={`url(#${id}-body)`} r="78" />

        {/* face */}
        <circle cx="62" cy="104" fill="#fff" opacity="0.14" r="9" />
        <circle cx="138" cy="104" fill="#fff" opacity="0.14" r="9" />
        <motion.ellipse cx="78" cy="84" fill="#1c1a20" rx="8.5" ry="12" {...blink} />
        <motion.ellipse cx="122" cy="84" fill="#1c1a20" rx="8.5" ry="12" {...blink} />
        <circle cx="75" cy="79" fill="#fff" r="2.6" />
        <circle cx="119" cy="79" fill="#fff" r="2.6" />
        <path
          d="M84 108Q100 122 116 108"
          fill="none"
          stroke="#1c1a20"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
    </motion.div>
  );
}

/** Head-only mascot — a small round face glyph for chips, labels and badges. */
export function MascotFace({ tone, className }: { tone: MascotTone; className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={className} viewBox="20 10 160 160">
      <defs>
        <radialGradient cx="38%" cy="30%" id={`${id}-face`} r="80%">
          <stop offset="0%" stopColor={tone.from} />
          <stop offset="100%" stopColor={tone.to} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="90" fill={`url(#${id}-face)`} r="78" />
      <circle cx="62" cy="104" fill="#fff" opacity="0.14" r="9" />
      <circle cx="138" cy="104" fill="#fff" opacity="0.14" r="9" />
      <ellipse cx="78" cy="84" fill="#1c1a20" rx="8.5" ry="12" />
      <ellipse cx="122" cy="84" fill="#1c1a20" rx="8.5" ry="12" />
      <circle cx="75" cy="79" fill="#fff" r="2.6" />
      <circle cx="119" cy="79" fill="#fff" r="2.6" />
      <path
        d="M84 108Q100 122 116 108"
        fill="none"
        stroke="#1c1a20"
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  );
}

type Mote = { x: number; y: number; type: "plus" | "dot"; color: string; size?: number; delay?: number };

/** Scattered decorative pluses/dots, gently pulsing. */
export function Sparkles({ items }: { items: Mote[] }) {
  const reduce = useReducedMotion();

  return (
    <>
      {items.map((mote, index) => (
        <motion.span
          animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1, 0.9] }}
          aria-hidden="true"
          className="pointer-events-none absolute"
          key={index}
          style={{ left: `${mote.x}%`, top: `${mote.y}%`, color: mote.color }}
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: mote.delay ?? 0 }
          }
        >
          {mote.type === "plus" ? (
            <svg
              fill="none"
              height={mote.size ?? 12}
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width={mote.size ?? 12}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          ) : (
            <span
              className="block rounded-full"
              style={{
                width: mote.size ?? 7,
                height: mote.size ?? 7,
                backgroundColor: "currentColor",
              }}
            />
          )}
        </motion.span>
      ))}
    </>
  );
}

const PROP_LINE = "#8b8a9c";

/** Presentation board accessory (hosts). */
export function BoardProp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={PROP_LINE}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 170 150"
    >
      <rect height="78" rx="4" width="120" x="25" y="14" />
      <path d="M40 120l20-28M130 120l-20-28M55 92h60" />
      <path d="M40 34h90M40 48h60M40 62h70" opacity="0.6" />
      <path
        d="M96 30l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z"
        fill="#8E7CA8"
        stroke="none"
      />
    </svg>
  );
}

/** Venue building accessory (spaces). */
export function VenueProp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={PROP_LINE}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 150 150"
    >
      <path d="M20 60L75 24l55 36" />
      <path d="M30 60v66h90V60" />
      <path d="M64 126V92a11 11 0 0 1 22 0v34" />
      <path d="M40 74h16v14H40zM94 74h16v14H94z" opacity="0.7" />
      <path d="M75 24V10M75 10h14v8H75" fill="#6F89A8" stroke="none" />
      <path d="M14 126h122" />
    </svg>
  );
}

/** Microphone + notes accessory (talent). */
export function MicProp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={PROP_LINE}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 130 150"
    >
      <rect height="44" rx="13" width="26" x="40" y="14" />
      <path d="M30 50a23 23 0 0 0 46 0M53 73v26M40 126h26" />
      <path d="M53 99c0 14-6 20-19 23" opacity="0.9" />
      <path d="M100 30v40" />
      <circle cx="94" cy="72" fill="#B5736E" r="7" stroke="none" />
      <path d="M100 30l16-5v40" />
      <circle cx="110" cy="67" fill="#B5736E" r="7" stroke="none" />
    </svg>
  );
}
