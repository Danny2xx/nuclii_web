"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";

/**
 * Editorial "wipe up from behind a mask" reveal — the content sits below an
 * overflow-hidden frame and slides up into view. Best on large display
 * headings. Falls back to plain content when reduced-motion / pre-hydration.
 */
function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();

  if (!isClient || reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "108%" }}
        transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.5 }}
        whileInView={{ y: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export { MaskReveal };
