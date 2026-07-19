import Link from "next/link";
import type { ComponentType } from "react";

import {
  MapMark,
  PrivacyMark,
  PublishMark,
  SaveMark,
  SearchMark,
  TicketMark,
} from "@/components/home/feature-marks";
import { Reveal } from "@/components/motion";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionTitle } from "@/components/ui/marketing-typography";
import { routes } from "@/lib/routes";

type Feature = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
};

const FEATURES: readonly Feature[] = [
  {
    icon: SearchMark,
    label: "search by vibe",
    description:
      "find events, pop-ups and workshops by interest, date and area.",
  },
  {
    icon: MapMark,
    label: "on the map",
    description: "see what's happening around you at a glance.",
  },
  {
    icon: SaveMark,
    label: "save & compare",
    description: "shortlist what fits and decide later.",
  },
  {
    icon: PublishMark,
    label: "host & publish",
    description: "turn an idea into a listing in minutes.",
  },
  {
    icon: TicketMark,
    label: "tickets & access",
    description: "sell and scan entry — guest lists sorted.",
  },
  {
    icon: PrivacyMark,
    label: "privacy-first",
    description: "discover without public exposure. access on your terms.",
  },
];

function FeaturePillars() {
  return (
    <section
      className="nuclii-section border-t border-border"
      data-analytics-section="home_features"
    >
      <div className="nuclii-container">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
            <SectionTitle className="max-w-[15ch]">
              everything you need, in one place.
            </SectionTitle>
            <p className="max-w-[32ch] text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-lg">
              nuclii is the operating layer for real-world experiences — not
              another feed.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal delay={(index % 3) * 0.06} key={feature.label}>
                <div className="group">
                  <Icon className="size-14 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 motion-reduce:transform-none" />
                  <h3 className="mt-5 text-xl font-extrabold lowercase tracking-[-0.03em] text-white">
                    {feature.label}
                  </h3>
                  <p className="mt-2 max-w-[30ch] text-sm leading-6 text-white/68 text-pretty">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-border pt-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="max-w-[24ch] text-2xl font-extrabold lowercase leading-[1.05] tracking-[-0.03em] text-white text-balance sm:text-3xl">
                one platform for all of it.
              </p>
              <Link
                className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold lowercase text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={routes.partner}
              >
                hosting, or listing a space? see the full host, venue &amp;
                talent toolkit
                <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            <Link
              className="group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold lowercase !text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
              href={routes.waitlist}
            >
              join the waitlist
              <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { FeaturePillars };
