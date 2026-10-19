"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

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
// every value comes from one spring-smoothed scroll progress (so wheel steps
// glide instead of jumping), and stacking never changes mid-flight. Values are
// computed in JS (function transforms) rather than handed to the browser's
// scroll timeline, which snaps back once the section scrolls past its end.

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

const allEvents: readonly ExploreEvent[] = [...exploreCards, ...moreExploreEvents];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const ramp = (v: number, from: number, to: number) => clamp01((v - from) / (to - from));

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
};

function SequenceCard({
  plan,
  stage,
  progress,
}: {
  plan: CardPlan;
  stage: { w: number; h: number };
  progress: MotionValue<number>;
}) {
  const { spot } = plan;
  const featured = plan.event.id === FEATURED_ID;
  const emerges = spot.layer > 2; // in front of the phone, so it fades out of it
  const fx = ((spot.x - 50) / 100) * stage.w;
  const fy = ((spot.y - 50) / 100) * stage.h;

  // one function describes the whole journey; each style reads its part
  const state = (p: number) => {
    const deal = easeOut(ramp(p, plan.dealAt, plan.dealAt + T.dealLength));
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
        (emerges ? ramp(p, plan.dealAt, plan.dealAt + T.dealLength * 0.35) : 1) *
          (1 - ramp(collapse, 0.35, 1)),
      ),
    };
  };

  const x = useTransform(progress, (p) => state(p).x);
  const y = useTransform(progress, (p) => state(p).y);
  const rotate = useTransform(progress, (p) => state(p).rotate);
  const scale = useTransform(progress, (p) => state(p).scale);
  const opacity = useTransform(progress, (p) => state(p).opacity);

  return (
    <motion.li
      className="absolute left-1/2 top-1/2 w-[27%] -translate-x-1/2 -translate-y-1/2 will-change-transform lg:w-[16%]"
      style={{ x, y, rotate, scale, opacity, zIndex: spot.layer }}
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
  const desktop = useIsDesktop();
  const [stage, setStage] = useState({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // light spring: glides between wheel steps without feeling laggy
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 38, mass: 0.4, restDelta: 0.0004 });

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

  const layout = desktop ? desktopLayout : mobileLayout;
  const placed = allEvents.filter((event) => layout[event.id]);
  // deal from the phone outward, pull back in the reverse order
  const byDistance = [...placed].sort(
    (a, b) =>
      Math.hypot(layout[a.id].x - 50, layout[a.id].y - 50) - Math.hypot(layout[b.id].x - 50, layout[b.id].y - 50),
  );
  const last = Math.max(1, byDistance.length - 1);
  const plans: CardPlan[] = byDistance.map((event, order) => ({
    event,
    spot: layout[event.id],
    dealAt: T.dealStart + (order / last) * T.dealSpread,
    collapseAt: T.collapseStart + ((last - order) / last) * T.collapseSpread,
    stackRotate: (order % 2 ? 1 : -1) * (2 + (order % 4)),
  }));

  const dark = useTransform(progress, (p) => easeInOut(ramp(p, T.darkStart, T.darkEnd)));
  const phoneScale = useTransform(progress, (p) => 1 - 0.45 * easeIn(ramp(p, T.collapseStart, T.phoneOut[1])));
  const phoneOpacity = useTransform(progress, (p) => 1 - ramp(p, T.phoneOut[0], T.phoneOut[1]));
  const screenDrift = useTransform(progress, (p) => `${-32 * easeInOut(ramp(p, 0.04, 0.6))}%`);
  const titleT = useTransform(progress, (p) => easeOut(ramp(p, T.titleIn[0], T.titleIn[1])));
  // floor keeps the huge title painted from the start, so it never rasterises mid-scroll
  const titleOpacity = useTransform(titleT, (t) => Math.max(0.001, t));
  const titleY = useTransform(titleT, (t) => 48 * (1 - t));
  const titleScale = useTransform(titleT, (t) => 0.94 + 0.06 * t);

  return (
    <section
      aria-labelledby="explore-sequence-title"
      className="relative h-[280vh] lg:h-[360vh]"
      data-analytics-section="home_explore"
      ref={sectionRef}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-[#F7F7FA] px-[var(--container-x)] pt-14">
        {/* fades in over the light background: cheaper than animating the colour */}
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[#0A0A0B] will-change-[opacity]" style={{ opacity: dark }} />

        {/* stage: portrait on phones/tablets, wide from lg — sized to fit the screen */}
        <div
          className="relative aspect-[4/5] w-[min(40rem,92vw,calc((100svh-7rem)*0.8))] lg:aspect-[1.45] lg:w-[min(80rem,94vw,calc((100svh-7rem)*1.45))]"
          ref={stageRef}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 z-[2] w-[50%] -translate-x-1/2 -translate-y-1/2 will-change-transform lg:w-[27%]"
            style={{ scale: phoneScale, opacity: phoneOpacity }}
          >
            <PhonePreview contentY={screenDrift} />
          </motion.div>

          <ul aria-label="example events">
            {plans.map((plan) => (
              <SequenceCard key={plan.event.id} plan={plan} progress={progress} stage={stage} />
            ))}
          </ul>
        </div>

        <motion.h2
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--container-x)] text-center font-display text-[clamp(3rem,9vw,8.5rem)] !font-bold lowercase leading-[0.95] tracking-[-0.04em] !text-white will-change-transform"
          id="explore-sequence-title"
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
