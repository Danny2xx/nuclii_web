"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Widest word determines reserved layout width — prevents headline reflow
const WORDS = [
  "event",
  "workshop",
  "pickup",
  "gathering",
  "pop-up",
  "showcase",
  "experience",
] as const;

const WIDEST = "experience";

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    // inline-grid stacks children in the same cell, reserving space for widest word
    <span className="relative inline-grid [&>*]:col-start-1 [&>*]:row-start-1">
      <span aria-hidden="true" className="invisible select-none">
        {WIDEST}
      </span>
      <AnimatePresence>
        <motion.span
          key={WORDS[index]}
          aria-live="polite"
          className="absolute inset-0 flex items-center text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export { RotatingWord };
