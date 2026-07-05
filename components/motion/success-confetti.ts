const CONFETTI_COLORS = [
  "#FFFFFF",
  "#A1A1AA",
  "#7A9E6E",
  "#6F89A8",
  "#B5736E",
  "#8E7CA8",
  "#C2A968",
  "#6E9CA0",
] as const;

type SuccessConfettiOptions = {
  accent?: string;
  anchor?: HTMLElement | null;
  reduceMotion?: boolean | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getOrigin(anchor?: HTMLElement | null) {
  if (typeof window === "undefined" || !anchor) {
    return { x: 0.5, y: 0.45 };
  }

  const rect = anchor.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return { x: 0.5, y: 0.45 };
  }

  return {
    x: clamp((rect.left + rect.width / 2) / window.innerWidth, 0.14, 0.86),
    y: clamp((rect.top + Math.min(rect.height * 0.38, 160)) / window.innerHeight, 0.18, 0.76),
  };
}

export async function celebrateWaitlistSignup({
  accent,
  anchor,
  reduceMotion,
}: SuccessConfettiOptions) {
  if (reduceMotion || typeof window === "undefined") return;

  const origin = getOrigin(anchor);
  const colors = Array.from(new Set([accent, ...CONFETTI_COLORS].filter(Boolean))) as string[];
  const { default: confetti } = await import("canvas-confetti");

  const shared = {
    colors,
    disableForReducedMotion: true,
    gravity: 1.05,
    origin,
    scalar: 0.84,
    ticks: 150,
    zIndex: 100,
  };

  void confetti({
    ...shared,
    particleCount: 58,
    spread: 66,
    startVelocity: 32,
  });

  window.setTimeout(() => {
    void confetti({
      ...shared,
      angle: 64,
      origin: { ...origin, x: clamp(origin.x - 0.12, 0.08, 0.92) },
      particleCount: 24,
      scalar: 0.72,
      spread: 46,
      startVelocity: 26,
    });
  }, 90);

  window.setTimeout(() => {
    void confetti({
      ...shared,
      angle: 116,
      origin: { ...origin, x: clamp(origin.x + 0.12, 0.08, 0.92) },
      particleCount: 24,
      scalar: 0.72,
      spread: 46,
      startVelocity: 26,
    });
  }, 130);
}
