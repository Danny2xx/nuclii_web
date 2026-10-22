"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { visibleNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// Top-bar actions beside the menu button. Log in and sign up sit here from
// tablets up; on phones they'd crowd the page, so they live in the menu only.
// On desktop the main links sit inline too, over the page's opening section;
// once you scroll past it they fold away into the menu. The home page folds
// after its hero (#waitlist); every other page after its first section.
function useOverHomeHero(pathname: string) {
  const [overHero, setOverHero] = useState(true);

  // An IntersectionObserver does the watching, so scrolling never forces a
  // layout. The nav lives in the layout and can mount before the page content
  // does, so until the section turns up each scroll tries the lookup again
  // (and pages without one fold after a short scroll).
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const set = (over: boolean) => setOverHero((current) => (current === over ? current : over));
    const attach = () => {
      const top =
        pathname === "/" ? document.getElementById("waitlist") : document.querySelector("main section");
      if (!top) return false;
      // collapses once the section has scrolled up behind the bar (96px)
      observer = new IntersectionObserver(([entry]) => set(entry.isIntersecting), {
        rootMargin: "-96px 0px 0px 0px",
      });
      observer.observe(top);
      return true;
    };
    const onScroll = () => {
      if (observer || attach()) return;
      set(window.scrollY < 160);
    };
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return overHero;
}

// Whether the page behind the bar is light, so lime "Log in" (too faint on
// light: about 2:1) can switch to black there. Samples what sits under the
// bar, skipping the bar itself and anything mostly see-through; photos and
// video count as dark.
function luminance(color: string) {
  const [r, g, b, a = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
  if (r === undefined || a < 0.5) return null;
  const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function effectiveOpacity(el: Element) {
  let opacity = 1;
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity);
  }
  return opacity;
}

// Hit-testing forces a layout, so it runs at most every CHECK_MS while you
// scroll (and once more when you stop), never on every frame.
const CHECK_MS = 120;

function useLightBehind(barRef: RefObject<HTMLElement | null>, pathname: string) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    let timer = 0;
    const check = () => {
      timer = 0;
      const bar = barRef.current;
      // hidden (phones): nothing to colour
      if (!bar || bar.getClientRects().length === 0) return;
      const box = bar.getBoundingClientRect();
      const stack = document.elementsFromPoint(box.left + 12, box.top + box.height / 2);
      let next = false;
      for (const el of stack) {
        if (bar.contains(el) || el.closest("header, [data-nav-ignore]")) continue;
        if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) break;
        const lum = luminance(getComputedStyle(el).backgroundColor);
        if (lum === null || effectiveOpacity(el) < 0.5) continue;
        next = lum > 0.5;
        break;
      }
      setLight((current) => (current === next ? current : next));
    };
    const schedule = () => {
      if (!timer) timer = window.setTimeout(check, CHECK_MS);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [barRef, pathname]);

  return light;
}

function SideNav() {
  const pathname = usePathname();
  const expanded = useOverHomeHero(pathname);
  const barRef = useRef<HTMLElement>(null);
  const lightBehind = useLightBehind(barRef, pathname);

  // The /join gate is intentionally distraction-free — logo only.
  if (pathname === "/join") return null;

  const actions = visibleNavItems.filter((item) => item.variant === "login" || item.variant === "signup");
  const links = visibleNavItems.filter((item) => !item.variant);

  return (
    <nav
      aria-label="Main navigation"
      ref={barRef}
      className="fixed right-[calc(max(1rem,env(safe-area-inset-right))+3.375rem)] top-[max(1.25rem,env(safe-area-inset-top))] z-[60] flex h-11 items-center gap-2 max-md:hidden lg:right-[5.875rem] lg:top-9"
    >
      {/* inline links: desktop only, shown over the home hero */}
      <div
        className={cn(
          "mr-3 hidden items-center gap-6 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none lg:flex",
          expanded ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0",
        )}
        inert={!expanded}
      >
        {links.map((item) => (
          <TrackedLink
            analyticsEvent={item.external ? ANALYTICS_EVENTS.outboundLinkClicked : ANALYTICS_EVENTS.navigationClicked}
            analyticsProperties={{ label: item.label, location: "hero_nav", external: Boolean(item.external) }}
            className={cn(
              "relative inline-flex min-h-11 items-center gap-1 font-display text-base font-semibold leading-none transition-colors after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              lightBehind ? "!text-[#0A0A0B]" : "!text-white",
            )}
            href={item.href}
            key={item.label}
            rel={item.external ? "noopener noreferrer" : undefined}
            target={item.external ? "_blank" : undefined}
          >
            {item.label}
            {item.external && (
              <>
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(opens in new tab)</span>
              </>
            )}
          </TrackedLink>
        ))}
      </div>

      {actions.map((item) => (
        <TrackedLink
          analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
          analyticsProperties={{ label: item.label, location: "top_bar" }}
          className={cn(
            "inline-flex h-10 items-center font-display text-sm font-semibold leading-none transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-base",
            item.variant === "signup"
              ? "rounded-none bg-[var(--nuclii-lime)] px-4 !text-black sm:px-5"
              : // plain link: lime over dark, black over light sections
                cn("px-2 transition-colors", lightBehind ? "!text-[#0A0A0B]" : "!text-[var(--nuclii-lime)]"),
          )}
          href={item.href}
          key={item.label}
          style={item.variant === "signup" ? ticketPillStyle : undefined}
        >
          {item.label}
          {/* sign up carries the ticket tear and a stub */}
          {item.variant === "signup" && (
            <span aria-hidden="true" className="ml-3 flex items-center gap-2.5">
              <span className="h-5 border-l-2 border-dotted border-black/45" />
              <ArrowRight className="size-3.5" strokeWidth={2.25} />
            </span>
          )}
        </TrackedLink>
      ))}
    </nav>
  );
}

export { SideNav };
