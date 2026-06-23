"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = [
  { label: "connection.", className: "text-[#39FF14]" },
  { label: "workshop.", className: "text-[#4D8DFF]" },
  { label: "pop-up.", className: "text-[#FF4D4D]" },
  { label: "run club.", className: "text-[#FFD84D]" },
  { label: "pickup.", className: "text-[#2BE8FF]" },
  { label: "showcase.", className: "text-[#FF5FD2]" },
  { label: "gathering.", className: "text-[#B6FF3C]" },
  { label: "food drop.", className: "text-[#FF9A3D]" },
  { label: "service slot.", className: "text-[#B57BFF]" },
  { label: "society night.", className: "text-[#39FF14]" },
  { label: "supper club.", className: "text-[#4D8DFF]" },
  { label: "venue moment.", className: "text-[#FF4D4D]" },
  { label: "talent set.", className: "text-[#2BE8FF]" },
  { label: "day party.", className: "text-[#FF5FD2]" },
  { label: "live set.", className: "text-[#FFD84D]" },
  { label: "private invite.", className: "text-[#B6FF3C]" },
  { label: "art class.", className: "text-[#FF9A3D]" },
  { label: "game night.", className: "text-[#B57BFF]" },
  { label: "qr check-in.", className: "text-[#39FF14]" },
  { label: "market day.", className: "text-[#4D8DFF]" },
  { label: "comedy night.", className: "text-[#FF4D4D]" },
  { label: "open studio.", className: "text-[#2BE8FF]" },
  { label: "wellness class.", className: "text-[#FF5FD2]" },
  { label: "rooftop social.", className: "text-[#FFD84D]" },
  { label: "listening bar.", className: "text-[#B6FF3C]" },
  { label: "real experience.", className: "text-[#FF9A3D]" },
] as const;

const WIDEST = "real experience.";

function RotatingWord({ interval = 2100 }: { interval?: number }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, reduceMotion]);

  const current = WORDS[index];

  if (reduceMotion) {
    return <span className={WORDS[0].className}>{WORDS[0].label}</span>;
  }

  return (
    <span className="relative inline-grid align-baseline [&>*]:col-start-1 [&>*]:row-start-1">
      <span aria-hidden="true" className="invisible select-none">
        {WIDEST}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className={`${current.className} absolute inset-0 block`}
          exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          key={current.label}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {current.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export { RotatingWord };
