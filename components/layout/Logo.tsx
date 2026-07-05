"use client";

import { useEffect, useState } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

// nuclii's brand colours. The wordmark's colour follows the visitor's local
// time — real-world moments happen around the clock.
type Daypart = "morning" | "day" | "night";

// On-dark logo colour (indigo lifted so it stays legible on near-black).
const LOGO_COLOR: Record<Daypart, string> = {
  morning: EXPERIENCE_ROLES.explorer.signal,
  day: "#FFFFFF",
  night: "#6A6AF2", // brand indigo, lifted for dark surfaces
};

// Favicon: fill + dot, chosen to stay visible on any browser tab.
const FAVICON: Record<Daypart, { bg: string; dot: string }> = {
  morning: { bg: EXPERIENCE_ROLES.explorer.signal, dot: "#0A0A0B" },
  day: { bg: "#0A0A0B", dot: "#FFFFFF" },
  night: { bg: "#1800AD", dot: "#FFFFFF" },
};

function daypart(hour: number): Daypart {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  return "night";
}

function setFavicon(part: Daypart) {
  const { bg, dot } = FAVICON[part];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='${bg}'/><circle cx='12.5' cy='15' r='2.6' fill='${dot}'/><circle cx='19.5' cy='15' r='2.6' fill='${dot}'/></svg>`;
  const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = href;
}

function Logo() {
  // SSR default keeps hydration stable; the real time resolves on the client.
  const [color, setColor] = useState<string>(LOGO_COLOR.day);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const part = daypart(new Date().getHours());
      setColor(LOGO_COLOR[part]);
      setFavicon(part);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <TrackedLink
      aria-label="Nuclii home"
      analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
      analyticsProperties={{ label: "nuclii_home", location: "fixed_logo" }}
      className="fixed left-4 top-5 z-[60] inline-flex min-h-11 items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6 lg:left-10 lg:top-9"
      href="/"
    >
      <span
        aria-hidden="true"
        className="nuclii-logo-mark block h-[1.4rem] w-[4.28rem] transition-[background-color] duration-500 lg:h-[1.6rem] lg:w-[4.88rem]"
        style={{
          backgroundColor: color,
          WebkitMaskImage: "url(/logo/nuclii-white.png)",
          maskImage: "url(/logo/nuclii-white.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "left center",
          maskPosition: "left center",
        }}
      />
      <span className="sr-only">nuclii</span>
    </TrackedLink>
  );
}

export { Logo };
