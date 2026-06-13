"use client";

import { useEffect } from "react";

const COLORS = ["#5b8cff", "#3d6fe8", "#93b4ff", "#dbe6ff", "#ffffff"];

function fireConfetti() {
  import("canvas-confetti").then((mod) => {
    void mod.default({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.65 },
      colors: COLORS,
      ticks: 220,
      disableForReducedMotion: true,
    });
  });
}

function useConfetti(trigger: boolean) {
  useEffect(() => {
    if (!trigger) return;
    fireConfetti();
  }, [trigger]);
}

export { fireConfetti, useConfetti };
