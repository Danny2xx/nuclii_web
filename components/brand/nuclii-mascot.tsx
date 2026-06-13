"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type NucliiMascotMood =
  | "idle"
  | "wave"
  | "point"
  | "gather"
  | "carry-pin"
  | "drop-pin"
  | "scan"
  | "privacy"
  | "celebrate";

type NucliiMascotProps = {
  className?: string;
  label?: string;
  mood?: NucliiMascotMood;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClassNames = {
  sm: "w-20",
  md: "w-28",
  lg: "w-36",
} as const;

const gatherCards = [
  { x: 9, y: 18, tx: 14, ty: 8, rotate: -9 },
  { x: 118, y: 97, tx: -10, ty: -8, rotate: 7 },
  { x: 14, y: 112, tx: 12, ty: -12, rotate: 8 },
] as const;

const qrCells = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

function NucliiMascot({
  className,
  label = "Meet Nuclii",
  mood = "idle",
  showLabel = true,
  size = "md",
}: NucliiMascotProps) {
  const reduceMotion = useReducedMotion();
  const canAnimate = !reduceMotion;
  const isBusy =
    mood === "gather" ||
    mood === "drop-pin" ||
    mood === "scan" ||
    mood === "celebrate";

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-2 text-center",
        className,
      )}
    >
      <motion.div
        animate={canAnimate ? { y: [-2, 3, -2] } : undefined}
        className={cn("relative text-primary", sizeClassNames[size])}
        transition={
          canAnimate
            ? { duration: 4.6, ease: "easeInOut", repeat: Infinity }
            : undefined
        }
      >
        <svg
          aria-label={label}
          className="block h-auto w-full overflow-visible drop-shadow-[0_18px_42px_rgba(91,140,255,0.22)]"
          role="img"
          viewBox="0 0 160 170"
        >
          <motion.g
            animate={
              canAnimate && isBusy
                ? { rotate: [-2, 2, -2], scale: [1, 1.04, 1] }
                : undefined
            }
            style={{ originX: "80px", originY: "70px" }}
            transition={
              canAnimate
                ? {
                    duration: mood === "scan" ? 2.3 : 1.7,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }
                : undefined
            }
          >
            <circle
              cx="80"
              cy="66"
              fill="currentColor"
              r="38"
              stroke="rgba(255,255,255,0.42)"
              strokeWidth="2"
            />
            <circle cx="67" cy="58" fill="white" r="5.5" />
            <circle cx="93" cy="58" fill="white" r="5.5" />
            <motion.circle
              animate={
                canAnimate
                  ? { cy: mood === "point" ? [58, 60, 58] : [58, 57, 58] }
                  : undefined
              }
              cx="68"
              cy="58"
              fill="#0A0A0B"
              r="2"
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <motion.circle
              animate={
                canAnimate
                  ? { cy: mood === "point" ? [58, 60, 58] : [58, 57, 58] }
                  : undefined
              }
              cx="94"
              cy="58"
              fill="#0A0A0B"
              r="2"
              transition={{ duration: 2.2, repeat: Infinity }}
            />
          </motion.g>

          <motion.path
            animate={
              canAnimate && (mood === "wave" || mood === "gather")
                ? mood === "gather"
                  ? { rotate: [0, 18, -10, 8, 0], x: [0, 4, -2, 0] }
                  : { rotate: [0, -14, 10, -10, 0] }
                : undefined
            }
            d="M45 67 C33 61 28 54 23 45"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            style={{ originX: "45px", originY: "67px" }}
            transition={
              canAnimate
                ? { duration: 1.8, ease: "easeInOut", repeat: Infinity }
                : undefined
            }
          />
          <motion.path
            animate={
              canAnimate &&
              (mood === "point" || mood === "drop-pin" || mood === "scan")
                ? mood === "drop-pin"
                  ? { rotate: [0, -18, -8, -18, 0], y: [0, -3, 2, -2, 0] }
                  : mood === "scan"
                    ? { rotate: [0, 8, -5, 8, 0], x: [0, 3, -2, 3, 0] }
                    : { rotate: [0, 10, 0], x: [0, 4, 0] }
                : undefined
            }
            d="M115 69 C129 68 135 62 142 55"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            style={{ originX: "115px", originY: "69px" }}
            transition={
              canAnimate
                ? { duration: 2.1, ease: "easeInOut", repeat: Infinity }
                : undefined
            }
          />
          <path
            d="M67 104 L67 132"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M94 104 L94 132"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
          />

          {mood === "carry-pin" && (
            <motion.g
              animate={canAnimate ? { y: [0, -5, 0] } : undefined}
              transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
            >
              <path
                d="M114 30 C114 18 123 9 135 9 C147 9 156 18 156 30 C156 45 140 60 135 65 C130 60 114 45 114 30Z"
                fill="#FFFFFF"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle cx="135" cy="30" fill="currentColor" r="7" />
            </motion.g>
          )}

          {mood === "gather" && (
            <motion.g
              animate={canAnimate ? { opacity: [0.64, 1, 0.64] } : undefined}
              transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
            >
              {gatherCards.map((card, index) => (
                <motion.rect
                  animate={
                    canAnimate
                      ? {
                          rotate: [card.rotate, card.rotate * -0.4, card.rotate],
                          x: [0, card.tx, 0],
                          y: [0, card.ty, 0],
                        }
                      : undefined
                  }
                  fill="#FFFFFF"
                  height="16"
                  key={`${card.x}-${card.y}`}
                  opacity={0.9 - index * 0.12}
                  rx="6"
                  stroke="currentColor"
                  strokeWidth="3"
                  transition={{
                    delay: index * 0.22,
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  width="30"
                  x={card.x}
                  y={card.y}
                />
              ))}
            </motion.g>
          )}

          {mood === "drop-pin" && (
            <motion.g>
              <motion.path
                animate={
                  canAnimate
                    ? { pathLength: [0, 1, 1], opacity: [0, 0.75, 0] }
                    : undefined
                }
                d="M128 6 C117 28 132 48 112 73"
                fill="none"
                stroke="#FFFFFF"
                strokeDasharray="5 8"
                strokeLinecap="round"
                strokeWidth="3"
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              />
              <motion.g
                animate={
                  canAnimate
                    ? { y: [-8, 16, -8], scale: [0.92, 1.05, 0.92] }
                    : undefined
                }
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              >
                <path
                  d="M112 31 C112 19 121 10 133 10 C145 10 154 19 154 31 C154 46 138 61 133 66 C128 61 112 46 112 31Z"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle cx="133" cy="31" fill="currentColor" r="7" />
              </motion.g>
              <motion.ellipse
                animate={
                  canAnimate
                    ? { opacity: [0.15, 0.55, 0.15], scale: [0.7, 1.18, 0.7] }
                    : undefined
                }
                cx="113"
                cy="92"
                fill="none"
                rx="12"
                ry="5"
                stroke="currentColor"
                strokeWidth="3"
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.g>
          )}

          {mood === "scan" && (
            <motion.g
              animate={canAnimate ? { y: [0, -3, 0] } : undefined}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            >
              <rect
                fill="#FFFFFF"
                height="44"
                rx="12"
                stroke="currentColor"
                strokeWidth="4"
                width="44"
                x="112"
                y="17"
              />
              {qrCells.map((index) => (
                <rect
                  fill="#0A0A0B"
                  height="6"
                  key={index}
                  rx="1.5"
                  width="6"
                  x={121 + (index % 3) * 10}
                  y={25 + Math.floor(index / 3) * 10}
                />
              ))}
              <motion.rect
                animate={
                  canAnimate
                    ? { y: [0, 27, 0], opacity: [0.35, 1, 0.35] }
                    : undefined
                }
                fill="currentColor"
                height="4"
                rx="2"
                transition={{ duration: 1.7, ease: "easeInOut", repeat: Infinity }}
                width="34"
                x="117"
                y="25"
              />
            </motion.g>
          )}

          {mood === "privacy" && (
            <motion.g
              animate={
                canAnimate
                  ? { x: [-3, 3, -3], scale: [1, 1.04, 1] }
                  : undefined
              }
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            >
              <rect
                fill="#0A0A0B"
                height="32"
                rx="10"
                stroke="currentColor"
                strokeWidth="4"
                width="42"
                x="112"
                y="20"
              />
              <path
                d="M123 20 V15 C123 8 128 4 133 4 C139 4 144 8 144 15 V20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <circle cx="133" cy="36" fill="currentColor" r="3.5" />
            </motion.g>
          )}

          {mood === "celebrate" && (
            <motion.g
              animate={
                canAnimate
                  ? { opacity: [0.35, 1, 0.35], y: [4, -3, 4] }
                  : undefined
              }
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            >
              <circle cx="34" cy="20" fill="#FFFFFF" r="3" />
              <circle cx="124" cy="14" fill="#FFFFFF" r="3" />
              <path
                d="M38 38 L28 31"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                d="M119 40 L131 31"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {showLabel && (
        <span className="rounded-full border border-border bg-card/72 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-card backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}

export { NucliiMascot };
export type { NucliiMascotMood };
