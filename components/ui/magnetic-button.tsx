"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

type MagneticButtonSize = "default" | "sm" | "lg";
type MagneticButtonTone = "solid" | "outline";

type MagneticButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  accentColor?: string;
  children: React.ReactNode;
  inkColor?: string;
  magnetStrength?: number;
  size?: MagneticButtonSize;
  tone?: MagneticButtonTone;
};

const sizeClasses: Record<MagneticButtonSize, string> = {
  default: "min-h-11 px-5 py-2.5 text-sm",
  sm: "min-h-9 px-4 py-2 text-xs",
  lg: "min-h-12 px-7 py-3 text-sm",
};

type MagneticStyle = React.CSSProperties & {
  "--magnetic-border"?: string;
  "--magnetic-fill"?: string;
  "--magnetic-ink"?: string;
};

function MagneticButton({
  accentColor = "#ffffff",
  children,
  className,
  disabled,
  inkColor = "#0A0A0B",
  magnetStrength = 0.18,
  onPointerLeave,
  onPointerMove,
  size = "default",
  style,
  tone = "solid",
  type = "button",
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 210, damping: 18, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 210, damping: 18, mass: 0.35 });

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    onPointerMove?.(event);
    if (event.defaultPrevented || disabled || reduceMotion || event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;

    rawX.set(offsetX * magnetStrength);
    rawY.set(offsetY * magnetStrength);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLButtonElement>) {
    onPointerLeave?.(event);
    rawX.set(0);
    rawY.set(0);
  }

  const magneticStyle = {
    ...style,
    "--magnetic-border": accentColor,
    "--magnetic-fill": accentColor,
    "--magnetic-ink": inkColor,
    x,
    y,
  } as HTMLMotionProps<"button">["style"] & MagneticStyle;

  return (
    <motion.button
      className={cn(
        "group relative isolate inline-flex max-w-full shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border font-semibold lowercase leading-snug tracking-normal outline-none transition-[border-color,color,filter,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 motion-safe:[&_svg:last-child]:group-hover:translate-x-0.5",
        sizeClasses[size],
        tone === "solid"
          ? "border-[color:var(--magnetic-border)] text-[color:var(--magnetic-ink)] hover:brightness-110"
          : "border-[color:var(--magnetic-border)] text-[color:var(--magnetic-fill)] hover:text-[color:var(--magnetic-ink)]",
        className,
      )}
      disabled={disabled}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={magneticStyle}
      type={type}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.98 }}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          tone === "outline" && "scale-x-0 group-hover:scale-x-100",
        )}
        style={{ backgroundColor: "var(--magnetic-fill)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/2 -skew-x-12 bg-white/24 opacity-0 transition-[left,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:left-[115%] motion-safe:group-hover:opacity-100 motion-reduce:hidden"
      />
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

export { MagneticButton };
