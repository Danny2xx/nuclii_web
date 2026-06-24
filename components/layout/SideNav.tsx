"use client";

import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { sideNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed right-6 top-6 z-[60] hidden items-center gap-5 text-white mix-blend-difference lg:right-10 lg:top-9 lg:flex"
    >
      {sideNavItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <TrackedLink
            analyticsEvent={
              item.external
                ? ANALYTICS_EVENTS.outboundLinkClicked
                : ANALYTICS_EVENTS.navigationClicked
            }
            analyticsProperties={{
              label: item.label,
              location: "desktop_nav",
              external: Boolean(item.external),
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex items-center gap-1 py-2 text-sm font-semibold lowercase leading-none tracking-normal transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "text-white after:scale-x-100"
                : "text-white/55 after:scale-x-0 hover:after:scale-x-100",
            )}
            href={item.href}
            key={item.href}
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
        );
      })}
    </nav>
  );
}

export { SideNav };
