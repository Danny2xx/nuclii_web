"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  amount?: number;
  delay?: number;
  y?: number;
};

function Reveal({
  children,
  amount = 0.25,
  delay = 0,
  y = 22,
  ...props
}: RevealProps) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();

  if (!isClient || reduceMotion) {
    return <div {...(props as ComponentPropsWithoutRef<"div">)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ delay, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Reveal };
