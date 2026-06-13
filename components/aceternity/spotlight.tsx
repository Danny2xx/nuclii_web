"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

function Spotlight({ children, className }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current || reduceMotion) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - left, y: e.clientY - top });
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={onMove}
    >
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            opacity: visible ? 1 : 0,
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(91,140,255,0.13), transparent 50%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

export { Spotlight };
