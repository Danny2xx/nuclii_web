"use client";

import { useId, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLessMotion } from "@/components/motion/use-less-motion";
import { cn } from "@/lib/utils";

// FAQ as a ticket dispenser: a roll of question tickets on the right; pull one
// and it tears off and is handed across as a big ticket with the answer.
// Answers are confirmed product facts; nothing here is a new claim about
// dates or numbers.

const questions = [
  {
    q: "Do I have to be a student?",
    a: "No. Students are part of Nuclii, but it's for anyone looking for something to do or wanting to put something on.",
  },
  {
    q: "Can I choose who sees my event?",
    a: "Yes. Keep it to your building, uni, society or selected interests, set an age range or gender, or open it up to everyone.",
  },
  {
    q: "Is Nuclii just for parties?",
    a: "No. Games nights, dinners, workshops, run clubs, gigs, society events, pop-ups, trips — if people can show up to it, it can belong on nuclii.",
  },
  {
    q: "How do I know who's behind an event?",
    a: "Every event links back to the person or group hosting it. Profiles, previous events and verification where needed help you see who you're showing up for.",
  },
  {
    q: "Do I need my own space to host?",
    a: "No. Host in your building, on campus, at a venue or somewhere you've found for the occasion. If not, we'll match you with the right space.",
  },
  {
    q: "Where is Nuclii launching?",
    a: "Birmingham first. That's where the first events, hosts and spaces will be.",
  },
  {
    q: "Is it free?",
    a: "Yes. Nuclii is free to use right now and at launch.",
  },
  {
    q: "Is there an app?",
    a: "It's coming soon to iOS and Android. You can sign up on the web now and be ready when it lands.",
  },
  {
    q: "Do I need followers or a big audience?",
    a: "No. There are no follower counts or popularity contests. People find your event through where they live, study, belong and what they're into.",
  },
  {
    q: "Is my information safe?",
    a: "Privacy is built in from the start. We collect only what we need, we don't sell your data or use it for advertising, and you choose who sees your events. See the Privacy Policy for the details.",
  },
  {
    q: "I'm a venue, talent or society. Is Nuclii for me?",
    a: "Yes. Venues, talent, service providers and societies all have a place on nuclii, from listing a space to getting booked. The for hosts page is the place to start.",
  },
] as const;

const number = (index: number) => `No. ${String(index + 1).padStart(2, "0")}`;
const ease = [0.32, 0.72, 0, 1] as const;

// Roll segments: quarter-circle cut-outs in every corner, so where two tickets
// meet the pair forms a full side notch, like a raffle roll.
const corners = ["0 0", "100% 0", "0 100%", "100% 100%"].map(
  (at) => `radial-gradient(circle 0.45rem at ${at}, transparent 98%, #000 100%)`,
);
const segmentMask: CSSProperties = {
  maskImage: corners.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: corners.join(", "),
  WebkitMaskComposite: "source-in",
};

// The pulled ticket: notches top and bottom of the tear between stub and body.
const STUB = "24%";
const pulledNotches = ["0", "100%"].map(
  (y) => `radial-gradient(circle 0.7rem at ${STUB} ${y}, transparent 98%, #000 100%)`,
);
const pulledMask: CSSProperties = {
  maskImage: pulledNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: pulledNotches.join(", "),
  WebkitMaskComposite: "source-in",
};

function PulledTicket({
  index,
  onStep,
  panelId,
}: {
  index: number;
  onStep: (delta: number) => void;
  panelId: string;
}) {
  const item = questions[index];
  return (
    <div
      aria-live="polite"
      className="grid min-h-[21rem] grid-cols-[24%_1fr] bg-white text-black shadow-[0_30px_70px_-34px_rgba(0,0,0,0.35)]"
      id={panelId}
      role="region"
      style={pulledMask}
    >
      {/* stub */}
      <div className="flex flex-col justify-between border-r-2 border-dotted border-black/25 p-6">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-black/45">nuclii</span>
        <span className="font-display text-[clamp(2.2rem,3.4vw,3.4rem)] font-extrabold leading-none tracking-[-0.03em]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-black/45">
          admit one
        </span>
      </div>
      {/* body */}
      <div className="flex flex-col p-8">
        <h3 className="font-display text-[clamp(1.5rem,2.3vw,2.1rem)] !font-bold leading-tight tracking-[-0.02em] !text-black">
          {item.q}
        </h3>
        <p className="!mt-4 max-w-[34rem] text-lg leading-relaxed text-black/70">{item.a}</p>
        <div className="!mt-auto flex items-center justify-between pt-6 text-sm font-semibold">
          <button
            aria-label="Previous question"
            className="inline-flex h-10 items-center gap-1.5 px-1 text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            onClick={() => onStep(-1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> previous
          </button>
          <button
            aria-label="Next question"
            className="inline-flex h-10 items-center gap-1.5 bg-[#0A0A0B] px-4 text-white transition-colors hover:bg-[#1C1D21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            onClick={() => onStep(1)}
            type="button"
          >
            next ticket <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const lessMotion = useLessMotion();
  const panelId = useId();

  const pull = (index: number) => {
    setDirection(index >= active ? 1 : -1);
    setActive(index);
  };
  const step = (delta: number) => pull((active + delta + questions.length) % questions.length);

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-[#F7F7FA] px-[var(--container-x)] py-[clamp(4rem,8vw,7rem)] text-black"
      data-analytics-section="home_faq"
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* the words and the pulled ticket */}
        <div className="lg:sticky lg:top-28">
          <h2
            className="font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-black"
            id="faq-heading"
          >
            questions, answered.
          </h2>
          <p className="!mt-4 max-w-[26rem] text-base leading-relaxed text-black/60 sm:text-lg">
            Pull a ticket. Can&apos;t see yours?{" "}
            <a
              className="font-medium text-black underline decoration-[var(--nuclii-lime)] decoration-2 underline-offset-4 transition-colors hover:text-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="mailto:hello@nuclii.co.uk"
            >
              Get in touch
            </a>
            .
          </p>

          {/* the pulled ticket (desktop) */}
          <div className="relative hidden lg:!mt-10 lg:block">
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.div
                animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                custom={direction}
                exit={lessMotion ? { opacity: 0 } : { x: -90, y: 10, rotate: -4, opacity: 0 }}
                initial={lessMotion ? { opacity: 0 } : { x: 140, rotate: 5, opacity: 0 }}
                key={active}
                transition={{ duration: 0.5, ease }}
              >
                <PulledTicket index={active} onStep={step} panelId={panelId} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* the roll */}
        <ol aria-label="Questions" className="lg:col-start-2 lg:row-start-1">
          {questions.map((item, index) => {
            const pulled = index === active;
            return (
              <li key={item.q}>
                <button
                  aria-controls={panelId}
                  aria-expanded={pulled}
                  className={cn(
                    "flex w-full items-center gap-4 px-5 py-3 text-left transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                    index > 0 && "border-t-2 border-dotted border-white/20",
                    pulled
                      ? "bg-[var(--nuclii-lime)] text-black focus-visible:ring-black lg:-translate-x-2.5 motion-reduce:translate-x-0"
                      : "bg-[#0A0A0B] text-white hover:bg-[#1C1D21] focus-visible:ring-white",
                  )}
                  onClick={() => pull(index)}
                  style={segmentMask}
                  type="button"
                >
                  <span
                    className={cn(
                      "w-12 shrink-0 font-display text-[0.7rem] font-semibold uppercase tracking-[0.06em]",
                      pulled ? "text-black/55" : "text-white/45",
                    )}
                  >
                    {number(index)}
                  </span>
                  <span className="flex-1 font-display text-[0.92rem] font-semibold leading-snug sm:text-base">
                    {item.q}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={cn("size-4 shrink-0 transition-opacity lg:rotate-180", pulled ? "opacity-100" : "opacity-40")}
                    strokeWidth={2.25}
                  />
                </button>
                {/* phones: the answer opens right under its ticket */}
                {pulled && (
                  <div className="border-t-2 border-dotted border-black/30 bg-white px-5 py-4 text-sm leading-relaxed text-black/75 lg:hidden">
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export { FaqSection };
