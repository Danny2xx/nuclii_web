"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

function CardSpotlight({ children, className }: CardSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  // Capture element size in the event handler — refs are safe to read there
  function onEnter() {
    if (ref.current) {
      setSize({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
    }
    setHovered(true);
  }

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || reduceMotion) return;
    const { left, top } = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - left, y: e.clientY - top });
  }

  const tiltX =
    hovered && size.h > 0 && !reduceMotion
      ? ((mouse.y - size.h / 2) / size.h) * -7
      : 0;
  const tiltY =
    hovered && size.w > 0 && !reduceMotion
      ? ((mouse.x - size.w / 2) / size.w) * 7
      : 0;

  return (
    <div
      ref={ref}
      className={cn(
        "nuclii-card relative overflow-hidden hover:border-primary/45",
        className,
      )}
      style={{
        transform:
          hovered && !reduceMotion
            ? `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`
            : "translateY(0px)",
        transition: hovered
          ? "transform 0.12s ease-out, box-shadow 200ms ease, border-color 200ms ease"
          : "transform 0.45s ease-out, box-shadow 300ms ease, border-color 300ms ease",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
    >
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(260px circle at ${mouse.x}px ${mouse.y}px, rgba(91,140,255,0.12), transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export { CardSpotlight };
