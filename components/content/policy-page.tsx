import type { ReactNode } from "react";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

type PolicySection = {
  title: string;
  body?: string;
  items?: string[];
};

type PolicyPageProps = {
  /** @deprecated kept for call-site compatibility; no longer rendered. */
  badge?: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
  children?: ReactNode;
};

function PolicyPage({
  title,
  description,
  lastUpdated,
  sections,
  children,
}: PolicyPageProps) {
  return (
    <main className="nuclii-page">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="nuclii-section border-b border-border">
        <div className="nuclii-container max-w-4xl">
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold lowercase leading-[0.95] tracking-[-0.03em] text-balance">
            {title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <p className="mt-8 text-sm lowercase text-muted-foreground/70">
            pre-launch policy · last updated {lastUpdated}
          </p>
        </div>
      </section>

      {/* ── Sections ───────────────────────────────────────────────────── */}
      <section className="nuclii-section">
        <div className="nuclii-container max-w-4xl">
          <div className="divide-y divide-border">
            {sections.map((section) => (
              <Reveal key={section.title}>
                <div className="grid gap-3 py-10 md:grid-cols-[13rem_1fr] md:gap-12">
                  <h2 className="text-xl font-bold lowercase tracking-[-0.02em] text-foreground sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.body && (
                      <p className="max-w-[65ch] text-base leading-8 text-muted-foreground">
                        {section.body}
                      </p>
                    )}
                    {section.items && (
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li
                            className="border-t border-border pt-3 text-sm leading-7 text-muted-foreground sm:text-base"
                            key={item}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {children}

          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-muted-foreground">
              Questions about any of this?{" "}
              <TrackedAnchor
                analyticsEvent={ANALYTICS_EVENTS.outboundLinkClicked}
                analyticsProperties={{
                  cta: "get_in_touch",
                  location: "policy_footer",
                }}
                className="font-semibold text-foreground underline-offset-4 hover:underline"
                href="mailto:hello@nuclii.co.uk"
              >
                Get in touch
              </TrackedAnchor>
              .
            </p>
            <Button asChild className="shrink-0 lowercase" size="lg">
              <TrackedAnchor
                analyticsProperties={{
                  cta: "get_early_access",
                  location: "policy_footer",
                }}
                href="/early-access"
              >
                get early access
              </TrackedAnchor>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export { PolicyPage };
export type { PolicySection };
