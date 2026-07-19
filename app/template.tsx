"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

import { useIsClient } from "@/components/motion";

type TemplateProps = {
  children: ReactNode;
};

export default function Template({ children }: TemplateProps) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  // the /demo sandbox uses position: fixed chrome; the motion wrapper's
  // residual filter/transform would turn it into the containing block
  if (!isClient || reduceMotion || pathname?.startsWith("/demo")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
