import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  return (
    <footer className="border-t border-border bg-background">
      <div className="nuclii-container flex flex-col items-center gap-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <TrackedLink
          aria-label="Nuclii home"
          analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
          analyticsProperties={{ label: "nuclii_home", location: "footer_logo" }}
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <Image
            alt="Nuclii"
            height={28}
            src="/nuclii-logo.png"
            style={{ height: "1.75rem", width: "auto" }}
            width={75}
          />
        </TrackedLink>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
              "inline-flex items-center gap-1 text-sm text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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

        <SocialLinks />
      </div>

      <div className="border-t border-border">
        <div className="nuclii-container flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nuclii. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => {
              const drawer = legalDrawers[link.href];

              return drawer ? (
                <LegalDrawer
                  key={link.href}
                  lastUpdated={LAST_UPDATED}
                  sections={drawer.sections}
                  title={drawer.title}
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
                  className="text-xs text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
