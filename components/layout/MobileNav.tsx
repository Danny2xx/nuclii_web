"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { AccessibilityPreferencesControl } from "@/components/accessibility/accessibility-preferences";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { footerNavGroups, visibleNavItems } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.dataset.mobileNav = open ? "open" : "closed";

    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.mobileNav;
    };
  }, [open]);

  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  // The /join gate is intentionally distraction-free — logo only.
  if (pathname === "/join") return null;

  return (
    <div>
      {/* solid circle so the menu button reads over light, dark and video */}
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className={cn(
          "nuclii-mobile-menu-button fixed !top-[max(1.25rem,env(safe-area-inset-top))] z-[70] flex size-11 lg:!right-10 lg:!top-9 items-center justify-center rounded-full border border-white/15 bg-[#0A0A0B] text-[var(--nuclii-lime)] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-0.5 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "translate-y-[4px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0.5 left-0 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "-translate-y-[4px] -rotate-45",
            )}
          />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-white text-black">
          <nav aria-label="Menu" className="nuclii-mobile-drawer mx-auto flex min-h-full w-full max-w-[44rem] flex-col px-6 lg:px-10">

            {/* Main pages */}
            <div className="flex flex-col gap-4">
              {visibleNavItems.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <div key={item.label}>
                    <TrackedLink
                      analyticsEvent={
                        item.external
                          ? ANALYTICS_EVENTS.outboundLinkClicked
                          : ANALYTICS_EVENTS.navigationClicked
                      }
                      analyticsProperties={{
                        label: item.label,
                        location: "mobile_drawer",
                        external: Boolean(item.external),
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center gap-2 text-4xl font-extrabold leading-none tracking-[-0.04em] transition-colors",
                        item.variant === "signup"
                          ? "mt-2 min-h-14 rounded-full bg-[var(--nuclii-lime)] px-6 text-2xl text-black hover:opacity-85"
                          : cn("hover:text-black/60", active ? "text-black" : "text-black/55"),
                      )}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      target={item.external ? "_blank" : undefined}
                    >
                      {item.label}
                      {item.external && (
                        <>
                          <ArrowUpRight aria-hidden="true" className="size-6" />
                          <span className="sr-only">(opens in new tab)</span>
                        </>
                      )}
                    </TrackedLink>

                    {item.children && (
                      <div className="mt-2 flex flex-col gap-2 pl-1">
                        {item.children.map((child) => (
                          <TrackedLink
                            analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                            analyticsProperties={{
                              label: child.label,
                              location: "mobile_drawer_child",
                            }}
                            className="text-xl font-extrabold lowercase tracking-[-0.04em] text-black/55 transition-colors hover:text-black/70"
                            href={child.href}
                            key={child.href}
                            onClick={() => setOpen(false)}
                          >
                            ↳ {child.label}
                          </TrackedLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <TrackedLink
              analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
              analyticsProperties={{
                cta: "try_web_app",
                location: "mobile_drawer_primary",
              }}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-between border-y border-black/14 py-4 text-xl font-extrabold lowercase tracking-[-0.03em] text-black transition hover:text-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              href={routes.waitlist}
              onClick={() => setOpen(false)}
            >
              try the web app
              <ArrowRight aria-hidden="true" className="size-5" />
            </TrackedLink>

            <AccessibilityPreferencesControl placement="mobile" />

            {/* Legal links */}
            <div className="mt-7 border-t border-black/12 pt-5">
              <p className="mb-3 text-xs font-semibold lowercase text-black/35">
                legal
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <TrackedLink
                    analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                    analyticsProperties={{
                      label: link.label,
                      location: "mobile_drawer_legal",
                    }}
                    className="text-xs font-semibold lowercase text-black/60 transition hover:text-black"
                    href={link.href}
                    key={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </TrackedLink>
                ))}
              </div>
            </div>

          </nav>
        </div>
      )}
    </div>
  );
}

export { MobileNav };
