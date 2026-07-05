"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const DEFAULT_PLAYBACK_RATE = 1.5;
const DEFAULT_CYCLE_MS = 5000;

type VideoBackgroundCarouselProps = {
  className?: string;
  cycleMs?: number;
  maxSources?: number;
  playbackRate?: number;
  randomize?: boolean;
  sources: readonly string[];
};

function shuffleSources(sources: readonly string[], maxSources?: number) {
  const shuffled = [...sources];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, maxSources ?? shuffled.length);
}

function getInitialSources(sources: readonly string[], maxSources?: number) {
  return sources.slice(0, maxSources ?? sources.length);
}

function VideoBackgroundCarousel({
  className,
  cycleMs = DEFAULT_CYCLE_MS,
  maxSources,
  playbackRate = DEFAULT_PLAYBACK_RATE,
  randomize = false,
  sources,
}: VideoBackgroundCarouselProps) {
  const [playlist, setPlaylist] = useState(() => getInitialSources(sources, maxSources));
  const [active, setActive] = useState(0);
  const [accessibilityMotion, setAccessibilityMotion] = useState("full");
  const [mediaPaused, setMediaPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const nextActive = playlist.length > 0 ? (active + 1) % playlist.length : 0;
  const pausePlayback =
    Boolean(reduceMotion) || accessibilityMotion !== "full" || mediaPaused;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPlaylist(randomize ? shuffleSources(sources, maxSources) : getInitialSources(sources, maxSources));
      setActive(0);
      videoRefs.current = [];
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [maxSources, randomize, sources]);

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
    if (pausePlayback || playlist.length <= 1) return;

    const id = setInterval(() => {
      setActive((current) => (current + 1) % playlist.length);
    }, cycleMs);
    return () => clearInterval(id);
  }, [cycleMs, pausePlayback, playlist.length]);

  useEffect(() => {
    if (pausePlayback) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }

    const video = videoRefs.current[active];
    if (!video) return;
    video.currentTime = 0;
    video.playbackRate = playbackRate;
    video.play().catch(() => {});
  }, [active, pausePlayback, playbackRate]);

  return (
    <div aria-hidden="true" className={cn("overflow-hidden", className)}>
      {playlist.map((src, index) => (
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
            event.currentTarget.playbackRate = playbackRate;
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
