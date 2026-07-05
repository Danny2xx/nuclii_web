"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Live waitlist count, rounded down to a clean step. Rolls up on load.
 */
export function WaitlistCount({
  fallback = 0,
  startValue = 0,
  step = 50,
  className,
}: {
  fallback?: number;
  startValue?: number;
  step?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // The fallback doubles as a floor: the "+" suffix means "at least this many",
  // so we never show fewer even before / without a live count.
  const floor = Math.floor(fallback / step) * step;
  const [target, setTarget] = useState(floor);

  const source = useMotionValue(startValue);
  const spring = useSpring(source, { damping: 40, stiffness: 90, mass: 1 });

  // Keep the DOM number in sync with the spring.
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString();
    });
    return () => unsubscribe();
  }, [spring]);

  // Fetch the real total, rounded down to the step.
  useEffect(() => {
    let active = true;
    fetch("/api/waitlist/count")
      .then((r) => r.json())
      .then((data: { count?: number }) => {
        if (active && typeof data.count === "number") {
          setTarget(Math.max(floor, Math.floor(data.count / step) * step));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [step, floor]);

  // Roll from the start value up to the target (instant when reduced-motion).
  useEffect(() => {
    if (reduce) {
      spring.jump(target);
      if (ref.current) ref.current.textContent = target.toLocaleString();
      return;
    }
    source.set(target);
  }, [target, reduce, source, spring]);

  return (
    <span className={className}>
      <span ref={ref} suppressHydrationWarning>
        {startValue.toLocaleString()}
      </span>
      +
    </span>
  );
}
