"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const PLAYBACK_RATE = 1.5;
const CYCLE_MS = 5000;

type VideoBackgroundCarouselProps = {
  className?: string;
  sources: readonly string[];
};

function VideoBackgroundCarousel({ className, sources }: VideoBackgroundCarouselProps) {
  const [active, setActive] = useState(0);
  const [accessibilityMotion, setAccessibilityMotion] = useState("full");
  const [mediaPaused, setMediaPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const nextActive = (active + 1) % sources.length;
  const pausePlayback =
    Boolean(reduceMotion) || accessibilityMotion !== "full" || mediaPaused;

  useEffect(() => {
    const syncPreferences = () => {
      setAccessibilityMotion(document.documentElement.dataset.a11yMotion ?? "full");
      setMediaPaused(document.documentElement.dataset.a11yMedia === "paused");
    };

    syncPreferences();
    window.addEventListener("nuclii-accessibility-preferences-change", syncPreferences);
    return () => {
      window.removeEventListener("nuclii-accessibility-preferences-change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (pausePlayback || sources.length <= 1) return;

    const id = setInterval(() => {
      setActive((current) => (current + 1) % sources.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [pausePlayback, sources.length]);

  useEffect(() => {
    if (pausePlayback) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }

    const video = videoRefs.current[active];
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [active, pausePlayback]);

  return (
    <div aria-hidden="true" className={cn("overflow-hidden", className)}>
      {sources.map((src, index) => (
        <video
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000",
            pausePlayback && "transition-none",
            index === active ? "opacity-100" : "opacity-0",
          )}
          key={src}
          loop
          muted
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = PLAYBACK_RATE;
          }}
          playsInline
          preload={index === active ? "auto" : index === nextActive && !pausePlayback ? "metadata" : "none"}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={src}
        />
      ))}
    </div>
  );
}

export { VideoBackgroundCarousel };
