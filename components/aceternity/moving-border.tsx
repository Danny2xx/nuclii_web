"use client";

import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a block with an animated gradient border.
 * The 1px padding gap between this wrapper and the children reveals the
 * animated gradient as a living border. Use sparingly — only for the
 * primary CTA block.
 */
function MovingBorder({ children, className }: MovingBorderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl p-[1px]",
        !reduceMotion && "nuclii-moving-border",
        className,
      )}
      style={
        reduceMotion ? { background: "rgba(91,140,255,0.28)" } : undefined
      }
    >
      {children}
    </div>
  );
}

export { MovingBorder };
