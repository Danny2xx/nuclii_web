"use client";

import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

// The tab icon is one fixed lime logo everywhere (set in app/layout.tsx), so
// every browser and device shows the same thing.
function Logo() {
  return (
    <TrackedLink
      aria-label="nuclii home"
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
