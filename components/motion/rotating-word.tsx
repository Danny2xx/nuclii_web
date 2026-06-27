"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = [
  { label: "connection", className: "text-[#7A9E6E]" },
  { label: "workshop", className: "text-[#6F89A8]" },
  { label: "pop-up", className: "text-[#B5736E]" },
  { label: "run club", className: "text-[#C2A968]" },
  { label: "pickup", className: "text-[#6E9CA0]" },
  { label: "showcase", className: "text-[#A87C9C]" },
  { label: "gathering", className: "text-[#8A9E6B]" },
  { label: "food drop", className: "text-[#BD8B5E]" },
  { label: "society night", className: "text-[#7A9E6E]" },
  { label: "supper club", className: "text-[#6F89A8]" },
  { label: "talent set", className: "text-[#6E9CA0]" },
  { label: "day party", className: "text-[#A87C9C]" },
  { label: "live set", className: "text-[#C2A968]" },
  { label: "art class", className: "text-[#BD8B5E]" },
  { label: "game night", className: "text-[#8E7CA8]" },
  { label: "market day", className: "text-[#6F89A8]" },
  { label: "comedy night", className: "text-[#B5736E]" },
  { label: "open studio", className: "text-[#6E9CA0]" },
  { label: "wellness class", className: "text-[#A87C9C]" },
  { label: "rooftop social", className: "text-[#C2A968]" },
  { label: "real experience", className: "text-[#BD8B5E]" },
] as const;

const WIDEST = "real experience";

function RotatingWord({ interval = 2100 }: { interval?: number }) {
  const [index, setIndex] = useState(0);
  const [accessibilityMotion, setAccessibilityMotion] = useState("full");
  const reduceMotion = useReducedMotion();
  const motionDisabled = Boolean(reduceMotion) || accessibilityMotion !== "full";

  useEffect(() => {
    const syncPreferences = () => {
      setAccessibilityMotion(document.documentElement.dataset.a11yMotion ?? "full");
    };

    syncPreferences();
    window.addEventListener("nuclii-accessibility-preferences-change", syncPreferences);
    return () => {
      window.removeEventListener("nuclii-accessibility-preferences-change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (motionDisabled) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, motionDisabled]);

  const current = WORDS[index];

  if (motionDisabled) {
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
