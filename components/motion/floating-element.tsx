"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";

type FloatingElementProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  amplitude?: number;
  delay?: number;
  duration?: number;
};

function FloatingElement({
  children,
  amplitude = 10,
  delay = 0,
  duration = 5,
  ...props
}: FloatingElementProps) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();

  if (!isClient || reduceMotion) {
    return <div {...(props as ComponentPropsWithoutRef<"div">)}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        rotate: [-0.35, 0.35, -0.35],
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        delay,
        duration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { FloatingElement };
