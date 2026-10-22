"use client";

import { useEffect } from "react";

// Gets each section ready a screen and a half before it scrolls in: its lazy
// images load and decode, and its videos start buffering. Without this the
// first scroll through hitches as images decode right as they arrive (the
// second pass was already smooth, so the cost was first-time work only).
function Prewarm({ selector = "main section" }: { selector?: string }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          entry.target.querySelectorAll("img").forEach((img) => {
            if (img.loading === "lazy") img.loading = "eager";
            img.decode().catch(() => {});
          });
          // only videos waiting on "metadata": a carousel marks the clips it
          // isn't about to play "none", and buffering all of them at once
          // would starve the one that's actually on screen
          entry.target.querySelectorAll("video").forEach((video) => {
            if (video.preload === "metadata") video.preload = "auto";
          });
        }
      },
      { rootMargin: "150% 0px" },
    );
    document.querySelectorAll(selector).forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [selector]);

  return null;
}

export { Prewarm };
