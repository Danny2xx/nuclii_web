"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronDown } from "lucide-react";

import {
  exploreCards,
  moreExploreEvents,
  type ExploreEvent,
} from "@/components/home/explore-content";
import { EventCard, ExploreSection, PhonePreview } from "@/components/home/explore-section";
import { useLessMotion } from "@/components/motion/use-less-motion";

// Scroll-driven pivot between the light "discover" chapter and the dark
// feature sections. The section pins while you scroll through it:
//   deal     – tickets fly out from the phone and fill the screen
//   hold     – one ticket lifts forward to show the cards are live
//   collapse – tickets pull back into the phone, the page fades to black
//   title    – the chapter title takes the whole screen, then hands off
//
// Smoothness rules: everything moves with transforms/opacity only (no layout),
// and stacking never changes mid-flight. Where the browser supports
// scroll-driven animations (ViewTimeline: Chrome, Edge, Safari 26), every
// part's whole journey is sampled once into keyframes and handed to the
// compositor, so the sequence tracks the scroll exactly, off the main thread,
// like a native app. `fill: both` holds the end state once the section has
// scrolled past (no snapping back). Elsewhere it falls back to one
// spring-smoothed scroll progress computed in JS.

const TITLE = "now make your own.";

const T = {
  dealStart: 0.04,
  dealSpread: 0.34, // first card to last card
  dealLength: 0.18,
  holdStart: 0.56,
  holdEnd: 0.66,
  collapseStart: 0.64,
  collapseSpread: 0.06,
  collapseLength: 0.1,
  darkStart: 0.64,
  darkEnd: 0.8,
  phoneOut: [0.72, 0.82],
  titleIn: [0.82, 0.92],
};

const FEATURED_ID = "study";

// Card centre as % of the stage, resting tilt, and a fixed layer
// (above 2 = in front of the phone; those cards emerge from the phone).
type Spot = { x: number; y: number; r: number; layer: number };

const desktopLayout: Record<string, Spot> = {
  "fifa-tournament": { x: 8.5, y: 18, r: -7, layer: 1 },
  footy: { x: 8.5, y: 52, r: 5, layer: 1 },
  "mario-party": { x: 8.5, y: 86, r: -6, layer: 1 },
  "love-island-watchparty": { x: 23.5, y: 33, r: 6, layer: 1 },
  "uno-match": { x: 23.5, y: 70, r: -8, layer: 1 },
  "pop-up": { x: 35, y: 17, r: -10, layer: 3 },
  "grace-birthday-linkup": { x: 34.5, y: 83, r: -7, layer: 3 },
  "painting-park": { x: 65, y: 16, r: 8, layer: 3 },
  study: { x: 65.5, y: 80, r: 6, layer: 20 },
  "sunday-dinner": { x: 76.5, y: 33, r: -6, layer: 1 },
  "unpopular-opinions": { x: 76.5, y: 70, r: 9, layer: 1 },
  rave: { x: 91.5, y: 18, r: 8, layer: 1 },
  "watch-party": { x: 91.5, y: 52, r: -5, layer: 1 },
  "bible-study": { x: 91.5, y: 86, r: 7, layer: 1 },
};

// phones: two columns of four either side of the phone
const mobileLayout: Record<string, Spot> = {
  "fifa-tournament": { x: 13.5, y: 14, r: -6, layer: 3 },
  footy: { x: 13.5, y: 38, r: 5, layer: 3 },
  "pop-up": { x: 13.5, y: 62, r: -7, layer: 3 },
  "mario-party": { x: 13.5, y: 86, r: 6, layer: 3 },
  rave: { x: 86.5, y: 14, r: 7, layer: 3 },
  study: { x: 86.5, y: 38, r: -5, layer: 20 },
  "unpopular-opinions": { x: 86.5, y: 62, r: 6, layer: 3 },
  "love-island-watchparty": { x: 86.5, y: 86, r: -6, layer: 3 },
};

// phones: these cards already stick out of the phone before the sequence
// starts (share of the way out), so the mockup never reads as the end of the
// page
const mobilePeek: Record<string, number> = {
  footy: 0.55,
  study: 0.6,
  "unpopular-opinions": 0.5,
};

const allEvents: readonly ExploreEvent[] = [...exploreCards, ...moreExploreEvents];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const ramp = (v: number, from: number, to: number) => clamp01((v - from) / (to - from));

// Scroll-driven animations on the compositor (not in every browser yet).
type ViewTimelineCtor = new (options: { subject: Element; axis?: "block" | "inline" }) => AnimationTimeline;

function viewTimelineCtor() {
  return (window as unknown as { ViewTimeline?: ViewTimelineCtor }).ViewTimeline;
}

function useNativeScrollTimeline() {
  const [native, setNative] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setNative(Boolean(viewTimelineCtor())));
    return () => cancelAnimationFrame(frame);
  }, []);
  return native;
}

// The section pins from its top meeting the top of the screen until its
// bottom meets the bottom: the "contain" range of a view timeline.
function scrollAnimation(
  el: Element | null,
  timeline: AnimationTimeline,
  sample: (p: number) => Keyframe,
  steps = 64,
) {
  if (!el) return null;
  const frames = Array.from({ length: steps + 1 }, (_, i) => ({ ...sample(i / steps), offset: i / steps }));
  return el.animate(frames, {
    timeline,
    fill: "both",
    easing: "linear",
    rangeStart: "contain 0%",
    rangeEnd: "contain 100%",
  } as KeyframeAnimationOptions);
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return desktop;
}

type CardPlan = {
  event: ExploreEvent;
  spot: Spot;
  dealAt: number;
  collapseAt: number;
  stackRotate: number;
  peek: number;
};

type Stage = { w: number; h: number };
type CardState = { x: number; y: number; rotate: number; scale: number; opacity: number };

// One function describes a card's whole journey through the sequence.
function cardState(plan: CardPlan, stage: Stage, p: number): CardState {
  const { spot } = plan;
  const featured = plan.event.id === FEATURED_ID;
  const emerges = spot.layer > 2; // in front of the phone, so it fades out of it
  const fx = ((spot.x - 50) / 100) * stage.w;
  const fy = ((spot.y - 50) / 100) * stage.h;
  const deal = plan.peek + (1 - plan.peek) * easeOut(ramp(p, plan.dealAt, plan.dealAt + T.dealLength));
  const collapse = easeIn(ramp(p, plan.collapseAt, plan.collapseAt + T.collapseLength));
  const lift = featured ? Math.sin(Math.PI * ramp(p, T.holdStart, T.holdEnd)) : 0;
  const out = deal * (1 - collapse);
  return {
    x: fx * out,
    y: fy * out - lift * stage.h * 0.03,
    rotate: (plan.stackRotate + (spot.r - plan.stackRotate) * deal) * (1 - collapse) * (1 - easeInOut(lift)),
    scale: (0.82 + 0.18 * deal) * (1 - 0.6 * collapse) * (1 + 0.16 * lift),
    // floor of 0.001 keeps hidden cards painted (invisible), so nothing has
    // to be drawn for the first time mid-animation
    opacity: Math.max(
      0.001,
      (emerges && !plan.peek ? ramp(p, plan.dealAt, plan.dealAt + T.dealLength * 0.35) : 1) *
        (1 - ramp(collapse, 0.35, 1)),
    ),
  };
}

const cardTransform = (s: CardState) =>
  `translateX(${s.x.toFixed(2)}px) translateY(${s.y.toFixed(2)}px) rotate(${s.rotate.toFixed(3)}deg) scale(${s.scale.toFixed(4)})`;

// the rest of the stage, as functions of progress
const darkAt = (p: number) => easeInOut(ramp(p, T.darkStart, T.darkEnd));
const phoneScaleAt = (p: number) => 1 - 0.45 * easeIn(ramp(p, T.collapseStart, T.phoneOut[1]));
const phoneOpacityAt = (p: number) => 1 - ramp(p, T.phoneOut[0], T.phoneOut[1]);
const feedDriftAt = (p: number) => -32 * easeInOut(ramp(p, 0.04, 0.6));
const titleAt = (p: number) => easeOut(ramp(p, T.titleIn[0], T.titleIn[1]));
// phones: the intro line and scroll cue leave as soon as the cards start moving
const introAt = (p: number) => 1 - ramp(p, 0.02, 0.1);

function SequenceCard({
  plan,
  stage,
  progress,
  cardRef,
}: {
  plan: CardPlan;
  stage: Stage;
  progress: MotionValue<number>;
  cardRef: (el: HTMLLIElement | null) => void;
}) {
  // the JS fallback: one journey calculation per frame, shared by each style
  const memo = useRef<{ p: number; s: CardState } | null>(null);
  const at = (p: number) => {
    if (memo.current?.p !== p) memo.current = { p, s: cardState(plan, stage, p) };
    return memo.current.s;
  };
  const transform = useTransform(progress, (p) => cardTransform(at(p)));
  const opacity = useTransform(progress, (p) => at(p).opacity);

  return (
    <motion.li
      className="absolute left-1/2 top-1/2 w-[27%] -translate-x-1/2 -translate-y-1/2 will-change-transform lg:w-[16%]"
      ref={cardRef}
      style={{ transform, opacity, zIndex: plan.spot.layer }}
    >
      {/* no hover effects: cards slide under a resting pointer while scrolling,
          and hover repaints/restacking would stutter mid-flight */}
      <EventCard card={plan.event} lite />
    </motion.li>
  );
}

function PinnedSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const darkRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLLIElement>());
  const desktop = useIsDesktop();
  const native = useNativeScrollTimeline();
  const [stage, setStage] = useState<Stage>({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // light spring for the JS fallback: glides between wheel steps
  const sprung = useSpring(scrollYProgress, { stiffness: 220, damping: 38, mass: 0.4, restDelta: 0.0004 });
  // with native timelines the compositor drives everything; the JS values
  // hold still at the start (and the running animations override them)
  const still = useMotionValue(0);
  const progress = native ? still : sprung;

  // decode every card photo before the section arrives, so no image is
  // decoded (and no frame dropped) while cards are flying
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // this section's cards, plus the section that follows the hand-off
        const next = section.nextElementSibling;
        [...section.querySelectorAll("img"), ...(next ? next.querySelectorAll("img") : [])].forEach((img) => {
          img.loading = "eager";
          img.decode?.().catch(() => {});
        });
        observer.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setStage({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // deal from the phone outward, pull back in the reverse order
  const plans = useMemo<CardPlan[]>(() => {
    const layout = desktop ? desktopLayout : mobileLayout;
    const byDistance = allEvents
      .filter((event) => layout[event.id])
      .sort(
        (a, b) =>
          Math.hypot(layout[a.id].x - 50, layout[a.id].y - 50) - Math.hypot(layout[b.id].x - 50, layout[b.id].y - 50),
      );
    const last = Math.max(1, byDistance.length - 1);
    return byDistance.map((event, order) => ({
      event,
      spot: layout[event.id],
      dealAt: T.dealStart + (order / last) * T.dealSpread,
      collapseAt: T.collapseStart + ((last - order) / last) * T.collapseSpread,
      stackRotate: (order % 2 ? 1 : -1) * (2 + (order % 4)),
      peek: desktop ? 0 : (mobilePeek[event.id] ?? 0),
    }));
  }, [desktop]);

  // native path: sample every journey into keyframes, once per stage size
  useEffect(() => {
    const Timeline = viewTimelineCtor();
    const section = sectionRef.current;
    if (!native || !Timeline || !section || !stage.w) return;
    const timeline = new Timeline({ subject: section, axis: "block" });
    const animations = [
      scrollAnimation(darkRef.current, timeline, (p) => ({ opacity: darkAt(p) })),
      scrollAnimation(phoneRef.current, timeline, (p) => ({
        transform: `scale(${phoneScaleAt(p).toFixed(4)})`,
        opacity: phoneOpacityAt(p),
      })),
      scrollAnimation(section.querySelector("[data-phone-feed]"), timeline, (p) => ({
        transform: `translateY(${feedDriftAt(p).toFixed(3)}%)`,
      })),
      scrollAnimation(introRef.current, timeline, (p) => {
        const t = introAt(p);
        return { opacity: Math.max(0.001, t), transform: `translateY(${(-16 * (1 - t)).toFixed(2)}px)` };
      }),
      scrollAnimation(titleRef.current, timeline, (p) => {
        const t = titleAt(p);
        return {
          opacity: Math.max(0.001, t),
          transform: `translateY(${(48 * (1 - t)).toFixed(2)}px) scale(${(0.94 + 0.06 * t).toFixed(4)})`,
        };
      }),
      ...plans.map((plan) =>
        scrollAnimation(cardRefs.current.get(plan.event.id) ?? null, timeline, (p) => {
          const s = cardState(plan, stage, p);
          return { transform: cardTransform(s), opacity: s.opacity };
        }),
      ),
    ];
    return () => animations.forEach((animation) => animation?.cancel());
  }, [native, stage, plans]);

  const dark = useTransform(progress, darkAt);
  const phoneScale = useTransform(progress, phoneScaleAt);
  const phoneOpacity = useTransform(progress, phoneOpacityAt);
  const screenDrift = useTransform(progress, (p) => `${feedDriftAt(p)}%`);
  const titleT = useTransform(progress, titleAt);
  // floor keeps the huge title painted from the start, so it never rasterises mid-scroll
  const titleOpacity = useTransform(titleT, (t) => Math.max(0.001, t));
  const titleY = useTransform(titleT, (t) => 48 * (1 - t));
  const titleScale = useTransform(titleT, (t) => 0.94 + 0.06 * t);
  const introT = useTransform(progress, introAt);
  const introOpacity = useTransform(introT, (t) => Math.max(0.001, t));
  const introY = useTransform(introT, (t) => -16 * (1 - t));

  return (
    <section
      aria-labelledby="explore-sequence-title"
      className="relative h-[220vh] lg:h-[360vh]"
      data-analytics-section="home_explore"
      ref={sectionRef}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-[#F7F7FA] px-[var(--container-x)] pt-14">
        {/* fades in over the light background: cheaper than animating the colour */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0A0A0B] will-change-[opacity]"
          ref={darkRef}
          style={{ opacity: dark }}
        />

        {/* stage: portrait on phones/tablets, wide from lg — sized to fit the screen.
            On phones it sits a little low to leave room for the intro line above. */}
        <div
          className="relative aspect-[4/5] w-[min(40rem,92vw,calc((100svh-12rem)*0.8))] max-lg:mt-9 lg:aspect-[1.45] lg:w-[min(80rem,94vw,calc((100svh-7rem)*1.45))]"
          ref={stageRef}
        >
          {/* phones: a line above the mockup and a cue below it, so the phone
              reads as a preview with more to come, not the end of the page */}
          <motion.div
            className="pointer-events-none absolute inset-0 lg:hidden"
            ref={introRef}
            style={{ opacity: introOpacity, y: introY }}
          >
            <p className="absolute inset-x-0 bottom-full mb-4 text-center font-display text-[clamp(1.4rem,6.4vw,2rem)] font-bold lowercase leading-[1.05] tracking-[-0.03em] text-[#0A0A0B]">
              your city&apos;s already moving.
            </p>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-full mt-3 flex flex-col items-center gap-0.5 text-sm font-semibold lowercase tracking-wide text-black/70"
            >
              scroll
              <ChevronDown className="size-5 text-[#7E9416] motion-safe:animate-bounce" strokeWidth={2.75} />
            </span>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 z-[2] w-[46%] -translate-x-1/2 -translate-y-1/2 will-change-transform lg:w-[27%]"
            ref={phoneRef}
            style={{ scale: phoneScale, opacity: phoneOpacity }}
          >
            <PhonePreview bare contentY={screenDrift} />
          </motion.div>

          <ul aria-label="example events">
            {plans.map((plan) => (
              <SequenceCard
                cardRef={(el) => {
                  if (el) cardRefs.current.set(plan.event.id, el);
                  else cardRefs.current.delete(plan.event.id);
                }}
                key={plan.event.id}
                plan={plan}
                progress={progress}
                stage={stage}
              />
            ))}
          </ul>
        </div>

        <motion.h2
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--container-x)] text-center font-display text-[clamp(3rem,9vw,8.5rem)] !font-bold lowercase leading-[0.95] tracking-[-0.04em] !text-white will-change-transform"
          id="explore-sequence-title"
          ref={titleRef}
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
        >
          {TITLE}
        </motion.h2>
      </div>
    </section>
  );
}

// Reduced motion: the existing static collage, then the title as a plain band.
function StaticFallback() {
  return (
    <>
      <ExploreSection />
      <section
        aria-labelledby="explore-sequence-title"
        className="bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(4rem,10vw,8rem)] text-center"
      >
        <h2
          className="font-display text-[clamp(3rem,9vw,8.5rem)] !font-bold lowercase leading-[0.95] tracking-[-0.04em] !text-white"
          id="explore-sequence-title"
        >
          {TITLE}
        </h2>
      </section>
    </>
  );
}

function ExploreSequence() {
  const lessMotion = useLessMotion();
  return lessMotion ? <StaticFallback /> : <PinnedSequence />;
}

export { ExploreSequence };
