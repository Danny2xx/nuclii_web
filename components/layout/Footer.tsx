"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import { LegalDrawer } from "@/components/layout/legal-drawer";
import { StayUpdated } from "@/components/layout/stay-updated";
import { SocialLinks } from "@/components/social/SocialLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { cookieSections, guidelinesSections, privacySections, termsSections } from "@/lib/legal-content";
import { footerLinks, footerNavGroups, useCaseLinks } from "@/lib/navigation";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { routes } from "@/lib/routes";

const LAST_UPDATED = "June 24, 2026";

const legalDrawers: Record<string, { title: string; sections: Parameters<typeof LegalDrawer>[0]["sections"] }> = {
  "/privacy": { title: "Privacy Policy", sections: privacySections },
  "/terms": { title: "Terms of Use", sections: termsSections },
  "/cookies": { title: "Cookie Policy", sections: cookieSections },
  "/community-guidelines": { title: "Community Guidelines", sections: guidelinesSections },
};

// a footer link's label, with the part named in `bold` set in bold
function FooterLabel({ link }: { link: (typeof footerLinks)[number] }) {
  if (!link.bold || !link.label.endsWith(link.bold)) return <>{link.label}</>;
  return (
    <span>
      {link.label.slice(0, -link.bold.length)}
      <strong className="font-bold text-white">{link.bold}</strong>
    </span>
  );
}

// a dashed rule across the card, optionally labelled near its start
function CardRule({ label }: { label?: string }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-3 px-[clamp(1.25rem,4vw,3rem)]">
      {label && (
        <>
          <span className="w-4 border-t border-dashed border-white/15" />
          <span className="text-xs text-white/40">{label}</span>
        </>
      )}
      <span className="flex-1 border-t border-dashed border-white/15" />
    </div>
  );
}

const headingClass = "text-xs font-semibold uppercase tracking-[0.06em] text-white/40";

function Footer() {
  const pathname = usePathname();
  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  if (pathname === "/join") return null;

  const linkClass =
    "inline-flex items-center gap-1 text-base text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <footer className="bg-background px-[var(--container-x)] pb-6 pt-[clamp(2.5rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-[90rem]">
        {/* one card: spray-painted logo, links, the small print */}
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#121316]">
          <TrackedLink
            aria-label="Nuclii home"
            analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
            analyticsProperties={{ label: "nuclii_home", location: "footer_logo" }}
            className="block px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)] pt-[clamp(1.5rem,4vw,3rem)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            href="/"
          >
            <Image
              alt="nuclii"
              className="h-auto w-full"
              height={456}
              sizes="(min-width: 1024px) 70vw, 92vw"
              src="/logo/nuclii-spray.webp"
              width={1680}
            />
          </TrackedLink>

          <CardRule label="navigation" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2rem,4vw,3rem)] sm:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_0.9fr_1.5fr]">
            <nav aria-label="Footer navigation">
              <p className={headingClass}>nuclii</p>
              <ul className="!mt-4 flex flex-col gap-3">
                {footerLinks.map((link) => {
                  const external = link.external || link.href.startsWith("mailto:");
                  const analyticsProperties = { label: link.label, location: "footer_nav", external };
                  return (
                    <li key={link.href}>
                      {external ? (
                        <TrackedAnchor
                          analyticsEvent={ANALYTICS_EVENTS.outboundLinkClicked}
                          analyticsProperties={analyticsProperties}
                          className={linkClass}
                          href={link.href}
                          rel="noopener noreferrer"
                          target={link.external ? "_blank" : undefined}
                        >
                          <FooterLabel link={link} />
                          {link.external && (
                            <>
                              <ArrowUpRight aria-hidden="true" className="size-3.5" />
                              <span className="sr-only">(opens in new tab)</span>
                            </>
                          )}
                        </TrackedAnchor>
                      ) : (
                        <TrackedLink
                          analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                          analyticsProperties={analyticsProperties}
                          className={linkClass}
                          href={link.href}
                        >
                          <FooterLabel link={link} />
                        </TrackedLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <nav aria-label="Use cases">
              <p className={headingClass}>use cases</p>
              <ul className="!mt-4 flex flex-col gap-3">
                {useCaseLinks.map((link) => (
                  <li key={link.label}>
                    <TrackedLink
                      analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                      analyticsProperties={{ label: link.label, location: "footer_use_cases" }}
                      className={linkClass}
                      href={link.href}
                    >
                      {link.label}
                    </TrackedLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className={headingClass}>legal</p>
              <ul className="!mt-4 flex flex-col gap-3">
                {legalLinks.map((link) => {
                  const drawer = legalDrawers[link.href];
                  return (
                    <li key={link.href}>
                      {drawer ? (
                        <LegalDrawer
                          lastUpdated={LAST_UPDATED}
                          sections={drawer.sections}
                          title={drawer.title}
                          triggerClassName={`${linkClass} text-left`}
                        >
                          {link.label}
                        </LegalDrawer>
                      ) : (
                        <TrackedLink
                          analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                          analyticsProperties={{ label: link.label, location: "footer_legal" }}
                          className={linkClass}
                          href={link.href}
                        >
                          {link.label}
                        </TrackedLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className={headingClass}>get started</p>
              <TrackedLink
                analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
                analyticsProperties={{ cta: "try_on_web", location: "footer" }}
                className="!mt-4 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-none bg-[var(--nuclii-lime)] px-5 font-display text-base font-semibold !text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                href={routes.signup}
                style={ticketPillStyle}
              >
                try on web
                <ArrowRight aria-hidden="true" className="size-4" />
              </TrackedLink>
            </div>

            <div className="col-span-2 xl:col-span-1">
              <StayUpdated />
              <SocialLinks buttonSize="size-10" className="!mt-6 gap-2.5" iconSize="size-[1.1rem]" />
            </div>
          </div>

          <CardRule />

          <p className="px-[clamp(1.25rem,4vw,3rem)] py-5 text-sm text-white/45">
            © {new Date().getFullYear()} Nuclii. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
