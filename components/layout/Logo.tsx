"use client";

import Image from "next/image";
import { useEffect } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

// The tab icon is the short logo, and its colour follows the visitor's local
// time: black in the morning, white through the middle of the day, lime at
// night. The black and white versions carry a thin outline in the opposite
// colour so they stay visible on light and dark tabs. app/favicon.ico (lime)
// is the default before this runs.
type Daypart = "morning" | "midday" | "night";

function daypart(hour: number): Daypart {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "midday";
  return "night";
}

function setTabIcon(part: Daypart) {
  const href = `/favicon/${part}.png`;
  document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']").forEach((link) => {
    if (link.getAttribute("href") === href) return;
    link.type = "image/png";
    link.removeAttribute("sizes");
    link.href = href;
  });
}

function Logo() {
  useEffect(() => {
    const update = () => setTabIcon(daypart(new Date().getHours()));
    update();
    // Next writes (and can re-add) its own icon links after this runs, so
    // re-apply whenever links are added to the head
    const observer = new MutationObserver(update);
    observer.observe(document.head, { childList: true });
    // keeps an open tab in step as the day moves on
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => {
      observer.disconnect();
      window.clearInterval(id);
    };
  }, []);

  return (
    <TrackedLink
      aria-label="Nuclii home"
      analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
      analyticsProperties={{ label: "nuclii_home", location: "fixed_logo" }}
      className="fixed left-4 top-5 z-[60] inline-flex min-h-11 items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6 lg:left-10 lg:top-9"
      href="/"
    >
      {/* supplied brand icon, shown as-is at its native 291×160 ratio */}
      <Image
        alt=""
        className="h-[1.4rem] w-auto object-contain lg:h-[1.9rem]"
        height={160}
        priority
        src="/logo/nuclii-icon.png"
        width={291}
      />
      <span className="sr-only">nuclii</span>
    </TrackedLink>
  );
}

export { Logo };
