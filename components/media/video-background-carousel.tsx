"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PLAYBACK_RATE = 1.5;
const CYCLE_MS = 5000;

type VideoBackgroundCarouselProps = {
  className?: string;
  sources: readonly string[];
};

function VideoBackgroundCarousel({ className, sources }: VideoBackgroundCarouselProps) {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % sources.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [sources.length]);

  useEffect(() => {
    const video = videoRefs.current[active];
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [active]);

  return (
    <div className={cn("overflow-hidden", className)}>
      {sources.map((src, index) => (
        <video
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000",
            index === active ? "opacity-100" : "opacity-0",
          )}
          key={src}
          loop
          muted
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = PLAYBACK_RATE;
          }}
          playsInline
          preload="auto"
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
