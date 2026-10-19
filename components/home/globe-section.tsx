"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { globePins, type GlobePin, type GlobePinIcon } from "@/components/home/globe-content";
import { GlobeSphere } from "@/components/home/globe-sphere";
import { UseCaseTicker } from "@/components/home/use-case-ticker";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { cn } from "@/lib/utils";

const pinIcons: Record<GlobePinIcon, LucideIcon> = {
  near: MapPin,
  uni: GraduationCap,
  building: Building2,
  circles: Users,
  societies: UsersRound,
  interests: Heart,
};

// Ticket notch cut into each short side of a chip, like a torn stub.
const chipNotches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.45em at ${x} 50%, transparent 98%, #000 100%)`,
);
const chipMask: CSSProperties = {
  maskImage: chipNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: chipNotches.join(", "),
  WebkitMaskComposite: "source-in",
};

function TicketChip({ pin }: { pin: GlobePin }) {
  const Icon = pinIcons[pin.icon];

  return (
    <span className="inline-flex drop-shadow-[0_6px_14px_rgba(40,70,10,0.18)]">
      <span
        className="inline-flex items-stretch whitespace-nowrap rounded-[1em] bg-[#D6F46C] font-display text-[max(0.625rem,1.1cqw)] font-semibold leading-none text-black"
        style={chipMask}
      >
        <span className="flex items-center gap-[0.5em] py-[0.8em] pl-[1.15em] pr-[0.8em]">
          {pin.label}
          <ArrowRight aria-hidden="true" className="size-[1.1em]" strokeWidth={2} />
        </span>
        <span aria-hidden="true" className="my-[0.55em] border-l-[1.5px] border-dashed border-black/35" />
        <span className="flex items-center pl-[0.8em] pr-[1.15em]">
          <Icon aria-hidden="true" className="size-[1.1em]" strokeWidth={2} />
        </span>
      </span>
    </span>
  );
}

const chipPlacement = {
  left: "bottom-[62%] right-[42%]",
  right: "bottom-[62%] left-[42%]",
  top: "bottom-[108%] left-1/2 -translate-x-1/2",
};

// Entrance: pins drop in one after another with a small bounce, in the order
// of the story (near you first, then branching out). Plays once when the
// globe scrolls into view.
const PIN_START = 0.15;
const PIN_STAGGER = 0.22;
const pinDelay = (index: number) => PIN_START + index * PIN_STAGGER;

function PhotoPin({
  pin,
  index,
  placement,
  revealed,
  animate,
}: {
  pin: GlobePin;
  index: number;
  placement: "desktop" | "mobile";
  revealed: boolean;
  animate: boolean;
}) {
  const spot = pin[placement];
  const delay = pinDelay(index);
  const shown = revealed || !animate;

  return (
    <motion.li
      animate={shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: "-120%", scale: 0.6 }}
      className={cn(
        "absolute aspect-square w-[6.5%] -translate-x-1/2 -translate-y-1/2",
        placement === "desktop" ? "hidden md:block" : "md:hidden",
      )}
      initial={animate ? { opacity: 0, y: "-120%", scale: 0.6 } : false}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 14,
        mass: 0.8,
        delay,
        opacity: { duration: 0.18, delay },
      }}
    >
      <span className="relative block size-full overflow-hidden rounded-full border-[3px] border-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]">
        <Image alt={pin.imageAlt} className="object-cover" fill sizes="6rem" src={pin.image} />
      </span>
      {/* the pin's anchor point */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-full size-[18%] -translate-x-1/2 translate-y-[20%] rounded-full border-2 border-white bg-black"
      />
      {/* the ticket chip settles in once the pin has landed */}
      <motion.span
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        className={cn("absolute z-10", chipPlacement[spot.chip])}
        initial={animate ? { opacity: 0, y: 6 } : false}
        transition={{ duration: 0.35, ease: "easeOut", delay: delay + 0.3 }}
      >
        <TicketChip pin={pin} />
      </motion.span>
    </motion.li>
  );
}

function GlobeSection() {
  const { playing, toggle } = useMotionPlayback();
  const globeRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(globeRef, { once: true, amount: 0.15 });
  // safety net: the pins and chips must never stay hidden, so they reveal
  // shortly after load even if the in-view trigger never fires
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), 4000);
    return () => window.clearTimeout(id);
  }, []);
  const revealed = inView || timedOut;
  const animateEntrance = !useLessMotion();

  return (
    <section
      aria-labelledby="globe-heading"
      className="relative overflow-hidden bg-[#F7F7FA] pt-[clamp(2.5rem,5vw,4rem)] text-black [--background:#F7F7FA] [--ring:#0A0A0B]"
      data-analytics-section="home_globe"
    >
      <div className="px-[var(--container-x)]">
        <div className="mx-auto w-full max-w-[92rem]">
          <p className="inline-block border-b-2 border-[var(--nuclii-lime)] pb-1 text-xs font-semibold uppercase tracking-[0.06em] text-black sm:text-sm">
            EXPLORE
          </p>
          <div className="mx-auto max-w-[44rem] text-center">
            <h2
              className="!mt-6 font-display text-[clamp(2.25rem,3.4vw,3.25rem)] !font-semibold leading-[1.1] tracking-[-0.02em] !text-black text-balance"
              id="globe-heading"
            >
              start close, <span className="text-[var(--nuclii-lime)]">branch out.</span>
            </h2>
            <p className="!mt-4 text-base leading-relaxed text-black/60 sm:text-lg lg:text-xl">
              Discover <span className="font-medium text-black">events</span>,{" "}
              <span className="font-medium text-black">people</span>{" "}
              and experiences through where you live, study, belong, and what you&apos;re into.
            </p>
          </div>
        </div>
      </div>

      {/* shows the top of the globe; phones get a wider globe so pins have room */}
      <div className="relative mt-4 overflow-hidden pt-16">
        <div className="relative mx-auto aspect-square w-full max-w-[90rem] md:aspect-[100/44]" ref={globeRef}>
          {/* chips size in container units, so they shrink with the globe instead of crowding it */}
          <div className="@container absolute left-[-35%] top-0 aspect-square w-[170%] md:left-0 md:w-full">
            <GlobeSphere playing={playing} />
            <ul aria-label="ways to discover">
              {globePins.map((pin, index) => (
                <PhotoPin
                  animate={animateEntrance}
                  index={index}
                  key={`${pin.id}-desktop`}
                  pin={pin}
                  placement="desktop"
                  revealed={revealed}
                />
              ))}
              {globePins.map((pin, index) => (
                <PhotoPin
                  animate={animateEntrance}
                  index={index}
                  key={`${pin.id}-mobile`}
                  pin={pin}
                  placement="mobile"
                  revealed={revealed}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* one control for the globe and the quotes strip below it */}
        <MotionToggleButton
          className={`absolute bottom-4 z-10 ${motionToggleEdgeClassName}`}
          label="globe and quotes motion"
          onToggle={toggle}
          playing={playing}
        />
      </div>

      <UseCaseTicker playing={playing} />
    </section>
  );
}

export { GlobeSection };
