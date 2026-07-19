"use client";

import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import { LegalDrawer } from "@/components/layout/legal-drawer";
import { SocialLinks } from "@/components/social/SocialLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import {
  cookieSections,
  guidelinesSections,
  privacySections,
  termsSections,
} from "@/lib/legal-content";
import { footerLinks, footerNavGroups } from "@/lib/navigation";

const LAST_UPDATED = "June 24, 2026";

const legalDrawers: Record<string, { title: string; sections: Parameters<typeof LegalDrawer>[0]["sections"] }> = {
  "/privacy":              { title: "Privacy Policy",        sections: privacySections     },
  "/terms":                { title: "Terms of Use",           sections: termsSections       },
  "/cookies":              { title: "Cookie Policy",          sections: cookieSections      },
  "/community-guidelines": { title: "Community Guidelines",   sections: guidelinesSections  },
};

function Footer() {
  const pathname = usePathname();
  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  if (pathname === "/join") return null;

  return (
    <footer className="border-t border-white/12 bg-background">
      <div className="nuclii-container flex flex-col items-center gap-7 py-14 text-center sm:py-16">
        <TrackedLink
          aria-label="Nuclii home"
          analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
          analyticsProperties={{ label: "nuclii_home", location: "footer_logo" }}
          className="inline-flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <span
            aria-hidden="true"
            className="block h-[1.65rem] w-[5rem] bg-[#6A6AF2]"
            style={{
              WebkitMaskImage: "url(/logo/nuclii-white.png)",
              maskImage: "url(/logo/nuclii-white.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <span className="sr-only">nuclii</span>
        </TrackedLink>

        <nav
          aria-label="Footer navigation"
          className="mx-auto flex max-w-[44rem] flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {footerLinks.map((link) => {
            const external = link.external || link.href.startsWith("mailto:");
            const event = external
              ? ANALYTICS_EVENTS.outboundLinkClicked
              : ANALYTICS_EVENTS.navigationClicked;
            const analyticsProperties = {
              label: link.label,
              location: "footer_nav",
              external,
            };
            const className =
              "inline-flex items-center gap-1 text-[clamp(1.3rem,3.7vw,1.85rem)] font-medium lowercase leading-none tracking-[-0.03em] text-white transition-colors hover:text-white/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

            return external ? (
              <TrackedAnchor
                analyticsEvent={event}
                analyticsProperties={analyticsProperties}
                className={className}
                href={link.href}
                key={link.href}
                rel="noopener noreferrer"
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
                {link.external && (
                  <>
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">(opens in new tab)</span>
                  </>
                )}
              </TrackedAnchor>
            ) : (
              <TrackedLink
                analyticsEvent={event}
                analyticsProperties={analyticsProperties}
                className={className}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </TrackedLink>
            );
          })}
        </nav>

        <SocialLinks
          buttonSize="size-12"
          className="justify-center gap-3"
          iconSize="size-5"
        />
      </div>

      <div className="border-t border-white/12">
        <div className="nuclii-container flex flex-col gap-6 py-9 text-[clamp(1rem,2.4vw,1.22rem)] font-medium leading-[1.35] tracking-[-0.03em] text-white/52 sm:flex-row sm:items-start sm:justify-between sm:py-10">
          <p>© {new Date().getFullYear()} Nuclii. All rights reserved.</p>
          <div className="flex max-w-[32rem] flex-wrap gap-x-8 gap-y-3 sm:justify-end">
            {legalLinks.map((link) => {
              const drawer = legalDrawers[link.href];

              return drawer ? (
                <LegalDrawer
                  key={link.href}
                  lastUpdated={LAST_UPDATED}
                  sections={drawer.sections}
                  title={drawer.title}
                  triggerClassName="text-white/52 transition hover:text-white"
                >
                  {link.label}
                </LegalDrawer>
              ) : (
                <TrackedLink
                  analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                  analyticsProperties={{
                    label: link.label,
                    location: "footer_legal",
                  }}
                  className="text-white/52 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </TrackedLink>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
