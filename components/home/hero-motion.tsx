"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";

// One state drives the hero video, the "meet nuclii" dot and the toggle, so
// they can never disagree.
type HeroMotionContextValue = {
  isHeroPlaying: boolean;
  toggleHeroMotion: () => void;
};

const HeroMotionContext = createContext<HeroMotionContextValue | null>(null);

function useHeroMotion() {
  const context = useContext(HeroMotionContext);
  if (!context) throw new Error("Hero motion parts must sit inside HeroMotionProvider");
  return context;
}

function HeroMotionProvider({ children }: { children: ReactNode }) {
  const { playing: isHeroPlaying, toggle: toggleHeroMotion } = useMotionPlayback();

  return (
    <HeroMotionContext.Provider
      value={{ isHeroPlaying, toggleHeroMotion }}
    >
      {children}
    </HeroMotionContext.Provider>
  );
}

// Also pauses while the hero is off screen, so the video isn't decoded in the
// background while you scroll the rest of the page. The toggle keeps its state.
function HeroVideo(props: {
  className?: string;
  playbackRate?: number;
  poster?: string;
  sources: readonly string[];
}) {
  const { isHeroPlaying } = useHeroMotion();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0" ref={boxRef}>
      <VideoBackgroundCarousel {...props} playing={isHeroPlaying && onScreen} />
    </div>
  );
}

function HeroMotionDot() {
  const { isHeroPlaying } = useHeroMotion();
  return (
    <span
      aria-hidden="true"
      className="nuclii-hero-dot inline-block size-2.5 shrink-0 rounded-full bg-[var(--nuclii-lime)]"
      data-playing={isHeroPlaying}
    />
  );
}

function HeroMotionToggle({ className }: { className?: string }) {
  const { isHeroPlaying, toggleHeroMotion } = useHeroMotion();
  return (
    <MotionToggleButton
      className={className}
      label="hero motion"
      onToggle={toggleHeroMotion}
      playing={isHeroPlaying}
    />
  );
}

export { HeroMotionDot, HeroMotionProvider, HeroMotionToggle, HeroVideo };
