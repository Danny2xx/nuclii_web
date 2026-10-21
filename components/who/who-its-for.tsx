import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { audiences, comingSoon, everyone, tools, type Audience } from "@/components/who/who-content";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// /who-its-for: who nuclii is made for. The hero states the idea, then each
// audience gets a section (anchor-linked from the footer's "made for"
// column): what's in their way, how nuclii opens it, their tools and an
// example ticket. Sections alternate dark and light.

const eyebrow = "text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm";
const sectionX = "px-[var(--container-x)]";
const inner = "mx-auto w-full max-w-[80rem]";

function TryOnWeb({ location, className }: { location: string; className?: string }) {
  return (
    <TrackedLink
      analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
      analyticsProperties={{ cta: "try_on_web", location }}
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-none bg-[var(--nuclii-lime)] px-6 font-display text-base font-semibold !text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      href={routes.signup}
      style={ticketPillStyle}
    >
      try on web
      <ArrowRight aria-hidden="true" className="size-4" />
    </TrackedLink>
  );
}

// a ticket-shaped example of what this audience would put on nuclii
function ExampleTicket({ example, dark }: { example: Audience["example"]; dark: boolean }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[24rem] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)]",
        dark ? "bg-white text-black" : "bg-[#0A0A0B] text-white",
      )}
      style={{ ...ticketPillStyle, fontSize: "1.6rem" }}
    >
      <div className="min-w-0 flex-1 px-6 py-5 text-base">
        <p className={cn("text-[0.7rem] font-semibold uppercase tracking-[0.08em]", dark ? "text-black/45" : "text-white/45")}>
          for example
        </p>
        <p className="!mt-2 font-display text-xl font-bold leading-tight tracking-[-0.02em]">{example.title}</p>
        <p className={cn("!mt-1 text-sm", dark ? "text-black/60" : "text-white/60")}>{example.meta}</p>
      </div>
      <div
        className={cn(
          "flex w-[38%] shrink-0 items-center border-l-2 border-dotted px-4 text-sm font-semibold leading-snug",
          dark ? "border-black/20" : "border-white/25",
        )}
      >
        <span className="bg-[var(--nuclii-lime)] px-2 py-1 text-black">{example.tag}</span>
      </div>
    </div>
  );
}

function AudienceSection({ audience, index }: { audience: Audience; index: number }) {
  // first section sits on light, after the dark hero; then they alternate
  const dark = index % 2 === 1;
  return (
    <section
      aria-labelledby={`${audience.id}-heading`}
      className={cn(
        "scroll-mt-24 py-[clamp(4rem,8vw,7rem)]",
        sectionX,
        dark ? "bg-[#0A0A0B] text-white" : "bg-[#F7F7FA] text-black",
      )}
      data-analytics-section={`who_${audience.id}`}
      id={audience.id}
    >
      <div className={cn(inner, "grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20")}>
        <Reveal>
          <p className={eyebrow}>
            {String(index + 1).padStart(2, "0")} {audience.label}
          </p>
          {audience.gloss && (
            <p className={cn("!mt-1 text-sm", dark ? "text-white/45" : "text-black/45")}>{audience.gloss}</p>
          )}
          <h2
            className={cn(
              "!mt-6 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em]",
              dark ? "!text-white" : "!text-black",
            )}
            id={`${audience.id}-heading`}
          >
            {audience.headline}
          </h2>
          {audience.body.map((paragraph) => (
            <p
              className={cn("!mt-5 max-w-[34rem] text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-black/65")}
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}

          <div className="!mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <TryOnWeb location={`who_${audience.id}`} />
            {audience.partnerLine && (
              <TrackedLink
                analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                analyticsProperties={{ label: "partner", location: `who_${audience.id}` }}
                className={cn(
                  "group inline-flex max-w-[22rem] items-center gap-2 text-sm font-medium underline decoration-[var(--nuclii-lime)] decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  dark ? "text-white/80 hover:text-white" : "text-black/70 hover:text-black",
                )}
                href={routes.partner}
              >
                {audience.partnerLine} Partner with us
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </TrackedLink>
            )}
          </div>
        </Reveal>

        <Reveal className="flex flex-col gap-8 lg:pt-14" delay={0.08}>
          <ExampleTicket dark={dark} example={audience.example} />

          <div>
            <p className={cn(eyebrow, dark ? "text-white/45" : "text-black/45")}>your tools</p>
            <ul className="!mt-4 grid gap-2.5 sm:grid-cols-2">
              {audience.tools.map((id) => {
                const tool = tools[id];
                const Icon = tool.icon;
                return (
                  <li
                    className={cn("flex items-start gap-3 px-4 py-3.5", dark ? "bg-white/[0.06]" : "bg-white")}
                    key={id}
                  >
                    <Icon aria-hidden="true" className="!mt-0.5 size-[1.1rem] shrink-0" strokeWidth={1.75} />
                    <span className="leading-tight">
                      <span className="block font-display text-[0.95rem] font-semibold">{tool.name}</span>
                      <span className={cn("!mt-1 block text-sm", dark ? "text-white/55" : "text-black/55")}>
                        {tool.line}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhoItsFor() {
  return (
    <main>
      {/* the idea */}
      <section
        aria-labelledby="who-heading"
        className={cn("bg-[#0A0A0B] pb-[clamp(4rem,8vw,6.5rem)] pt-[clamp(8rem,16vw,12rem)] text-white", sectionX)}
        data-analytics-section="who_hero"
      >
        <div className={inner}>
          <p className={cn(eyebrow, "text-white/55")}>who it&apos;s for</p>
          <h1
            className="!mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,6.5vw,6rem)] !font-bold lowercase leading-[0.98] tracking-[-0.04em] !text-white"
            id="who-heading"
          >
            if you have an idea, you can make it happen.
          </h1>
          <p className="!mt-7 font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug text-white">
            No audience? No network? No venue? No need.
          </p>
          <p className="!mt-3 max-w-[36rem] text-base leading-relaxed text-white/70 sm:text-lg">
            the people, the talent, the venues and the tools are already here. plus it&apos;s{" "}
            <strong className="font-bold text-white">free</strong>.
          </p>

          <nav aria-label="Who it's for" className="!mt-10">
            <ul className="flex flex-wrap gap-2.5">
              {audiences.map((audience) => (
                <li key={audience.id}>
                  <a
                    className="inline-flex h-11 items-center rounded-none bg-white/[0.08] px-4 font-display text-sm font-semibold text-white transition-colors hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={`#${audience.id}`}
                    style={ticketPillStyle}
                  >
                    {audience.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {audiences.map((audience, index) => (
        <AudienceSection audience={audience} index={index} key={audience.id} />
      ))}

      {/* what everyone gets, then the close */}
      <section
        aria-labelledby="everyone-heading"
        className={cn("bg-[#0A0A0B] py-[clamp(4rem,8vw,6.5rem)] text-white", sectionX)}
        data-analytics-section="who_everyone"
      >
        <div className={inner}>
          <h2
            className="font-display text-[clamp(1.8rem,3vw,2.6rem)] !font-bold lowercase leading-[1.05] tracking-[-0.03em] !text-white"
            id="everyone-heading"
          >
            every account gets
          </h2>
          <ul className="!mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {everyone.map(({ label, icon: Icon }) => (
              <li className="flex items-start gap-3 bg-white/[0.06] px-4 py-4" key={label}>
                <Icon aria-hidden="true" className="!mt-0.5 size-[1.1rem] shrink-0 text-[var(--nuclii-lime)]" strokeWidth={1.75} />
                <span className="font-display text-[0.95rem] font-semibold leading-snug">{label}</span>
              </li>
            ))}
          </ul>
          <p className="!mt-6 text-sm text-white/55">
            <span className="font-semibold text-white">coming soon for hosts:</span> {comingSoon.join(" · ")}
          </p>

          <div className="!mt-16 flex flex-col gap-6 border-t border-dashed border-white/15 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold lowercase leading-tight tracking-[-0.02em]">
              got an idea? start it today.
            </p>
            <TryOnWeb className="self-start sm:self-auto" location="who_close" />
          </div>
        </div>
      </section>
    </main>
  );
}

export { WhoItsFor };
