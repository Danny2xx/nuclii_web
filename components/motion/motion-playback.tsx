"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

// OS reduced motion, or the site's accessibility panel asking for less motion /
// paused media, means auto-playing motion starts paused.
function motionAllowed() {
  const root = document.documentElement;
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    (root.dataset.a11yMotion ?? "full") === "full" &&
    root.dataset.a11yMedia !== "paused"
  );
}

// One play/pause state for a block of auto-playing motion, seeded from the
// visitor's motion preferences.
function useMotionPlayback() {
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    let allowed: boolean | null = null;
    // Only follow the preference when it actually flips, so changing e.g. text
    // size doesn't override the visitor's own play/pause choice.
    const sync = () => {
      const next = motionAllowed();
      if (next === allowed) return;
      allowed = next;
      setPlaying(next);
    };
    // runs after the accessibility panel applies its stored preferences
    const id = window.setTimeout(sync, 0);

    window.addEventListener("nuclii-accessibility-preferences-change", sync);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("nuclii-accessibility-preferences-change", sync);
    };
  }, []);

  return { playing, setPlaying, toggle: () => setPlaying((current) => !current) };
}

// The hero's play/pause also reaches the category strip just below it (a
// different section), so pausing the top of the page pauses all of it.
const HERO_MOTION_EVENT = "nuclii-hero-motion-toggle";

function announceHeroMotion(playing: boolean) {
  window.dispatchEvent(new CustomEvent<{ playing: boolean }>(HERO_MOTION_EVENT, { detail: { playing } }));
}

function useHeroMotionToggles(onToggle: (playing: boolean) => void) {
  const latest = useRef(onToggle);
  useEffect(() => {
    latest.current = onToggle;
  });
  useEffect(() => {
    const listener = (event: Event) => latest.current((event as CustomEvent<{ playing: boolean }>).detail.playing);
    window.addEventListener(HERO_MOTION_EVENT, listener);
    return () => window.removeEventListener(HERO_MOTION_EVENT, listener);
  }, []);
}

type MotionToggleButtonProps = {
  className?: string;
  // what the button pauses, e.g. "hero motion" → "Pause hero motion"
  label: string;
  onToggle: () => void;
  playing: boolean;
};

// The site's one play/pause control — every section uses this so the size,
// border and icon stay identical everywhere.
function MotionToggleButton({ className, label, onToggle, playing }: MotionToggleButtonProps) {
  const Icon = playing ? Pause : Play;

  return (
    // Small visual circle, full 44px tap target around it.
    <button
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      className={cn(
        "group inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--nuclii-lime)] focus-visible:outline-none",
        className,
      )}
      onClick={onToggle}
      type="button"
    >
      <span className="inline-flex size-7 items-center justify-center rounded-full border border-[var(--nuclii-lime)] transition-colors duration-200 group-hover:bg-white/10 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background">
        <Icon aria-hidden="true" className="size-3" fill="currentColor" strokeWidth={0} />
      </span>
    </button>
  );
}

export { announceHeroMotion, MotionToggleButton, useHeroMotionToggles, useMotionPlayback };
