import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

function Logo() {
  return (
    <TrackedLink
      aria-label="Nuclii home"
      analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
      analyticsProperties={{ label: "nuclii_home", location: "fixed_logo" }}
      className="font-display fixed left-4 top-5 z-[60] inline-flex min-h-11 items-center text-[1.45rem] font-extrabold lowercase leading-none tracking-[-0.025em] text-white/85 mix-blend-difference transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6 lg:left-10 lg:top-9 lg:text-[1.65rem]"
      href="/"
    >
      nuclii
    </TrackedLink>
  );
}

export { Logo };
