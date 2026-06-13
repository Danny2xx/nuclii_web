"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

function MagneticButton({
  children,
  strength = 0.32,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 14 });
  const sy = useSpring(y, { stiffness: 380, damping: 14 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={{ x: sx, y: sy }}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      {children}
    </motion.div>
  );
}

export { MagneticButton };
