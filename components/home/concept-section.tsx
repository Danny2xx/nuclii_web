"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  categoryImage,
  categoryItems,
  modeItems,
  type CategoryItem,
  type ModeItem,
} from "@/components/home/concept-content";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { cn } from "@/lib/utils";

const MODE_INTERVAL_MS = 5500;
// how far a swipe must travel (px) before it changes slide
const SWIPE_PX = 40;
// px per second — slow enough to read the cards as they pass
const RAIL_SPEED = 18;

// Lines the rail's first card up with the section content, including once the
// content is capped at 92rem and centred.
const railInset = "max(var(--container-x), calc((100% - 92rem) / 2))";

function CategoryCard({ item, hidden }: { item: CategoryItem; hidden?: boolean }) {
  const image = categoryImage(item);

  return (
    <li aria-hidden={hidden || undefined} className="w-[clamp(13rem,22vw,20rem)] shrink-0">
      <div
        className="relative aspect-[3/2] overflow-hidden rounded-2xl"
        style={{ backgroundColor: item.placeholderColor }}
      >
        {image && (
          // decorative: the title below already names the category
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 20rem, 13rem"
            src={image}
            style={{ objectPosition: item.imagePosition ?? "center" }}
          />
        )}
      </div>
      <p className="!mt-2 font-display text-base font-semibold leading-tight text-black lg:text-lg">
        {item.title}
      </p>
      <p className="!mt-0.5 text-sm leading-snug text-black/45">{item.description}</p>
    </li>
  );
}

// Drifts slowly while the section plays; any hover, touch or focus hands
// control back to the visitor, who can also swipe the strip. The list renders
// twice so the drift can wrap. The drift is a CSS transform animation, so it
// runs on the compositor and never competes with page scrolling (moving
// scrollLeft every frame did, and stuttered).
function CategoryRail({ playing }: { playing: boolean }) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [duration, setDuration] = useState(0);

  // one loop is half the track; its length sets the speed
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setDuration(track.scrollWidth / 2 / RAIL_SPEED));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const pause = () => setInteracting(true);
  const resume = () => setInteracting(false);

  return (
    <div
      className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onBlur={resume}
      onFocus={pause}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onTouchEnd={resume}
      onTouchStart={pause}
      style={{ paddingLeft: railInset }}
    >
      <ul
        aria-label="experience categories"
        // each card carries its own gap (pr-2) so half the track is exactly one loop
        className="flex w-max [&>li]:pr-2"
        ref={trackRef}
        style={{
          animation: duration ? `nuclii-marquee ${duration}s linear infinite` : undefined,
          animationPlayState: playing && !interacting ? "running" : "paused",
        }}
        tabIndex={0}
      >
        {categoryItems.map((item) => (
          <CategoryCard item={item} key={item.title} />
        ))}
        {categoryItems.map((item) => (
          <CategoryCard hidden item={item} key={`${item.title}-loop`} />
        ))}
      </ul>
    </div>
  );
}

// Slides wait on either side of the active one: the next mode sits to the right
// and the previous to the left, so "next" enters from the right and "previous"
// from the left, with the outgoing mode leaving the opposite way.
type SlidePlace = "active" | "next" | "previous";

const slidePlaceClassName: Record<SlidePlace, string> = {
  active: "translate-x-0 opacity-100",
  next: "pointer-events-none translate-x-4 opacity-0",
  previous: "pointer-events-none -translate-x-4 opacity-0",
};

function ModeSlide({ item, place }: { item: ModeItem; place: SlidePlace }) {
  const active = place === "active";

  return (
    <div
      aria-hidden={!active || undefined}
      aria-label={`${item.mode}: ${item.caption.from} to ${item.caption.to}`}
      aria-roledescription="slide"
      className={cn(
        "flex flex-col items-center transition-[opacity,translate] duration-500 ease-out [grid-area:stack]",
        slidePlaceClassName[place],
      )}
      role="group"
    >
      <p className="relative z-10 font-display text-xl font-bold lowercase leading-none text-black underline decoration-[var(--nuclii-lime)] decoration-2 underline-offset-[0.3em] sm:text-2xl">
        {item.mode}
      </p>

      {/* sized from the room left beside the statement, so the statement keeps its line breaks */}
      <div className="relative mt-12 w-[min(22rem,60vw)] lg:w-[clamp(14rem,calc(46vw-14rem),25rem)]">
        {item.backgroundCards.map((card) => (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl"
            key={`${card.color}-${card.rotate}`}
            style={{ backgroundColor: card.color, transform: `rotate(${card.rotate}deg) scale(1.06)` }}
          />
        ))}
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-3xl"
          style={{ backgroundColor: item.placeholderColor }}
        >
          {item.image && (
            // the 1% scale hides the 1px transparent edge some of the PNG exports have
            <Image
              alt={item.imageAlt ?? ""}
              className="scale-[1.01] object-cover"
              draggable={false}
              fill
              sizes="(min-width: 1024px) 25rem, 22rem"
              src={item.image}
            />
          )}
        </div>
      </div>

      <p className="relative z-10 !mt-12 font-display text-xl lowercase leading-none text-black sm:text-2xl">
        <span className="font-bold">{item.caption.from}</span> to{" "}
        <span className="font-bold">{item.caption.to}</span>
      </p>
    </div>
  );
}

function ModeCarousel({ playing }: { playing: boolean }) {
  const [active, setActive] = useState(0);
  // live swipe: the slides follow the finger, then step or spring back
  const [dragX, setDragX] = useState<number | null>(null);
  const dragStart = useRef(0);

  // Re-arms on every change, so a manual step always gets a full interval.
  useEffect(() => {
    if (!playing || dragX !== null) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % modeItems.length),
      MODE_INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, playing, dragX]);

  const step = (delta: number) =>
    setActive((current) => (current + delta + modeItems.length) % modeItems.length);

  const endSwipe = () => {
    if (dragX !== null && Math.abs(dragX) >= SWIPE_PX) step(dragX < 0 ? 1 : -1);
    setDragX(null);
  };

  const arrowClassName =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--nuclii-lime)] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none";

  return (
    <div
      aria-label="ways to use nuclii"
      aria-roledescription="carousel"
      className="flex items-center justify-center gap-1 sm:gap-3"
      role="region"
    >
      <button aria-label="Previous carousel mode" className={arrowClassName} onClick={() => step(-1)} type="button">
        <ArrowLeft aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </button>

      {/* pan-y keeps vertical page scrolling native; horizontal drags swipe */}
      <div
        aria-live={playing ? "off" : "polite"}
        className={cn(
          "grid cursor-grab touch-pan-y select-none [grid-template-areas:'stack'] active:cursor-grabbing",
          dragX === null && "transition-transform duration-300 ease-out motion-reduce:transition-none",
        )}
        onPointerCancel={() => setDragX(null)}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = event.clientX;
          setDragX(0);
        }}
        onPointerMove={(event) => {
          if (dragX !== null) setDragX(event.clientX - dragStart.current);
        }}
        onPointerUp={endSwipe}
        style={{ transform: `translateX(${(dragX ?? 0) * 0.6}px)` }}
      >
        {modeItems.map((item, index) => (
          <ModeSlide
            item={item}
            key={item.mode}
            place={
              index === active
                ? "active"
                : index === (active + 1) % modeItems.length
                  ? "next"
                  : "previous"
            }
          />
        ))}
      </div>

      <button aria-label="Next carousel mode" className={arrowClassName} onClick={() => step(1)} type="button">
        <ArrowRight aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </button>
    </div>
  );
}

// Note: globals.css resets p/h margins outside a layer, so margins on those
// elements need the `!` prefix to apply.
function ConceptSection() {
  // One state for every auto-moving part of this section; pausing stops the
  // drift and rotation but leaves the arrows and swiping working.
  const { playing: isSectionPlaying, toggle } = useMotionPlayback();

  return (
    <section
      aria-labelledby="concept-heading"
      className="bg-[#F7F7FA] pt-3 text-black [--background:#F7F7FA] [--ring:#0A0A0B]"
      data-analytics-section="home_concept"
    >
      <CategoryRail playing={isSectionPlaying} />

      <div className="relative px-[var(--container-x)] pb-20 pt-[clamp(3.5rem,6vw,6rem)]">
        <div className="mx-auto w-full max-w-[92rem]">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <h2
                className="max-w-[11.6em] font-display text-[clamp(1.5rem,4vw,3.625rem)] !font-medium leading-[1.3] tracking-[-0.01em] !text-black sm:leading-[1.4]"
                id="concept-heading"
              >
                From something happening downstairs to something happening across
                the city. From ten people to ten thousand.
              </h2>
              <p className="!mt-[clamp(1.5rem,5vw,4.5rem)] flex gap-x-4 gap-y-2 whitespace-nowrap font-display text-base text-black sm:flex-wrap sm:gap-x-[clamp(2rem,5vw,5rem)] sm:text-2xl">
                <span>
                  you <span className="font-bold text-[#F04A23]">make</span> it.
                </span>
                <span>
                  you <span className="font-bold text-[#35A9E0]">book</span> it.
                </span>
                <span>
                  you <span className="font-bold text-[var(--nuclii-lime)]">go</span>.
                </span>
              </p>
            </div>

            <ModeCarousel playing={isSectionPlaying} />
          </div>

        </div>

        <MotionToggleButton
          className={`absolute bottom-4 ${motionToggleEdgeClassName}`}
          label="section motion"
          onToggle={toggle}
          playing={isSectionPlaying}
        />
      </div>

    </section>
  );
}

export { ConceptSection };
