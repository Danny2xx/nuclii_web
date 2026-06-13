"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";

type FadeInProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
};

function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  y = 18,
  ...props
}: FadeInProps) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();

  if (!isClient || reduceMotion) {
    return <div {...(props as ComponentPropsWithoutRef<"div">)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { FadeIn };
