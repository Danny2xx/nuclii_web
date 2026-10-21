"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import {
  profilePhotos,
  ProfileImage,
  type ProfilePhoto,
} from "@/components/home/profile-photos";
import {
  MotionToggleButton,
  useMotionPlayback,
} from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

// "Your ticket becomes the memory." Words on the left; on the right three
// event tickets deal in as plain "admit one" stubs, then each develops into
// a clip from the night (/public/images/memories). Clips only play while the
// section is on screen and motion is playing.

const ease = [0.32, 0.72, 0, 1] as const;

const friendsGoing = [
  profilePhotos.curlyWhiteMan,
  profilePhotos.womanAsian,
  profilePhotos.man,
  profilePhotos.whiteWoman,
] as const;

type Memory = {
  clip: string;
  event: string;
  meta: string;
  host: string;
  others: number;
  faces: readonly ProfilePhoto[];
  number: string;
  // resting place: centre x/y (% of the fan), width (% of the fan, varied so
  // the set feels hand-placed), rotation and stacking
  x: number;
  y: number;
  w: number;
  rotate: number;
  z: number;
};

const memories: readonly Memory[] = [
  {
    clip: "/images/memories/midnight_chronicles.mp4",
    event: "With the Girlies",
    meta: "Sat 16 May · Digbeth",
    host: "Tobi",
    others: 6,
    faces: [
      profilePhotos.man,
      profilePhotos.asianWoman,
      profilePhotos.southAsianMan,
    ],
    number: "0231",
    x: 21,
    y: 54,
    w: 43,
    rotate: -7,
    z: 1,
  },
  {
    clip: "/images/memories/partyb.mp4",
    event: "'Casual' Games Night",
    meta: "Fri 8 May · Digbeth",
    host: "Zara",
    others: 4,
    faces: [
      profilePhotos.asianWoman,
      profilePhotos.whiteWoman,
      profilePhotos.manWhite,
    ],
    number: "0187",
    x: 50,
    y: 46,
    w: 48,
    rotate: 1.5,
    z: 3,
  },
  {
    clip: "/images/memories/just-roaming.mp4",
    event: "Just Roaming",
    meta: "Sat 2 May · Moseley",
    host: "Liv",
    others: 9,
    faces: [
      profilePhotos.whiteWoman,
      profilePhotos.europeMan,
      profilePhotos.womanWhite,
    ],
    number: "0142",
    x: 80,
    y: 57,
    w: 40,
    rotate: 7,
    z: 2,
  },
];

// Notches sit level with the perforation between the clip window and the
// stub. Sizes are in cqw of the ticket (an @container), so they scale with it:
// 0.56cqw white rim + 2.8cqw padding + a 4:5 window 93.28cqw wide
// (116.6cqw tall) + 3cqw gap.
const RIM = "0.56cqw";
const PERF_Y = "122.96cqw";
const notches = ["0", "100%"].map(
  (x) =>
    `radial-gradient(circle 3.4cqw at ${x} ${PERF_Y}, transparent 98%, #000 100%)`,
);
const ticketMask = {
  maskImage: notches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: notches.join(", "),
  WebkitMaskComposite: "source-in",
} as const;

function Face({
  photo,
  className,
}: {
  photo: ProfilePhoto;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#2A2B30]",
        className,
      )}
    >
      <ProfileImage photo={photo} />
    </span>
  );
}

function Ticket({
  memory,
  developed,
  videoRef,
}: {
  memory: Memory;
  developed: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <div className="@container">
      {/* white rim around the black ticket, notched with it */}
      <div className="bg-white shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)]" style={{ ...ticketMask, padding: RIM }}>
      <div className="bg-[#0A0A0B] p-[2.8cqw] pb-[4.2cqw] text-white">
        {/* the window: an "admit one" face that develops into the clip */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#141416]">
          <video
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            ref={videoRef}
            src={memory.clip}
          />
          <motion.div
            animate={{ opacity: developed ? 0 : 1 }}
            className="absolute inset-0 flex flex-col justify-between bg-[#F4F2EC] p-[6cqw] font-display"
            initial={false}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <span className="flex items-start justify-between text-[max(0.55rem,4.6cqw)] font-semibold uppercase tracking-[0.08em] text-black/50">
              <span>nuclii</span>
              <span>No. {memory.number}</span>
            </span>
            <span className="text-[16cqw] font-extrabold uppercase leading-[0.86] tracking-[-0.03em]">
              admit
              <br />
              one
            </span>
            <span className="text-[max(0.55rem,4.6cqw)] font-semibold uppercase tracking-[0.06em] text-black/60">
              {memory.event}
            </span>
          </motion.div>
        </div>

        {/* perforation between the window and the stub */}
        <span
          aria-hidden="true"
          className="!mt-[3cqw] block border-t-[1.5px] border-dashed border-white/25"
        />

        <div className="!mt-[4cqw] font-display leading-tight">
          <p className="truncate text-[max(0.7rem,6.6cqw)] font-bold">
            {memory.event}
          </p>
          <p className="text-[max(0.6rem,4.8cqw)] text-white/55">
            {memory.meta}
          </p>
          <p className="!mt-[3cqw] flex items-center gap-[2.5cqw] text-[max(0.6rem,4.6cqw)] text-white/70">
            <span aria-hidden="true" className="hidden @[11rem]:flex">
              {memory.faces.map((photo, index) => (
                <Face
                  className={cn(
                    "size-[max(1.25rem,9cqw)] border-[#0A0A0B]",
                    index > 0 && "-ml-[3cqw]",
                  )}
                  key={photo.src}
                  photo={photo}
                />
              ))}
            </span>
            {/* small tickets (phones) keep it short */}
            <span className="hidden @[11rem]:inline">
              <span className="font-semibold text-white">{memory.host}</span> +{" "}
              {memory.others} friends were there
            </span>
            <span className="@[11rem]:hidden">
              <span className="font-semibold text-white">{memory.host}</span> +
              {memory.others} friends
            </span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

function AppTeaserSection() {
  const { playing, toggle } = useMotionPlayback();
  const lessMotion = useLessMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const fanRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [onScreen, setOnScreen] = useState(false);
  const dealt = useInView(fanRef, { once: true, amount: 0.35 });
  const shown = dealt || lessMotion;
  // the ticket brought to the front by hover (or a tap on touch screens)
  const [front, setFront] = useState<number | null>(null);

  // each ticket develops shortly after it lands; reduced motion shows clips straight away
  const [developed, setDeveloped] = useState<boolean[]>(() =>
    memories.map(() => false),
  );
  useEffect(() => {
    if (!shown) return;
    const timers = memories.map((_, index) =>
      window.setTimeout(
        () =>
          setDeveloped((current) =>
            current.map((value, i) => (i === index ? true : value)),
          ),
        lessMotion ? 0 : 1100 + index * 450,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [shown, lessMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: 0.15,
      },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // clips only run while the section is visible and motion is playing
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      if (playing && onScreen) video.play().catch(() => {});
      else video.pause();
    });
  }, [onScreen, playing]);

  return (
    <section
      aria-labelledby="app-teaser-heading"
      className="relative bg-[#F7F7FA] px-[var(--container-x)] py-[clamp(3.5rem,7vw,6rem)] text-black"
      data-analytics-section="home_app_teaser"
      ref={sectionRef}
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* the words */}
        <div className="lg:pt-[clamp(1rem,3vw,3rem)]">
          <h2
            className="font-display text-[clamp(2.3rem,4.2vw,3.9rem)] !font-bold lowercase leading-[1.02] tracking-[-0.03em] !text-black text-balance"
            id="app-teaser-heading"
          >
            the night doesn&apos;t end when it ends.
          </h2>
          <p className="!mt-5 max-w-[30rem] text-base leading-relaxed text-black/60 sm:text-lg">
            Every ticket turns into the memory: the clips, the people and the
            night, kept in one place.
          </p>

          <p className="!mt-8 flex items-center gap-3 text-sm text-black/70 sm:text-base">
            <span aria-hidden="true" className="flex">
              {friendsGoing.map((photo, index) => (
                <Face
                  className={cn(
                    "size-9 border-[#F7F7FA]",
                    index > 0 && "-ml-3",
                  )}
                  key={photo.src}
                  photo={photo}
                />
              ))}
            </span>
            <span>
              <span className="font-semibold text-black">
                Femi and 3 friends
              </span>{" "}
              are going to Open Decks this Saturday
            </span>
          </p>

          <div className="!mt-9">
            <TrackedLink
              analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
              analyticsProperties={{
                cta: "sign_up",
                location: "home_memories",
              }}
              className="group inline-flex h-12 items-center gap-2 rounded-none bg-[var(--nuclii-lime)] px-6 font-display text-base font-semibold !text-black transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7FA]"
              href={routes.signup}
              style={ticketPillStyle}
            >
              sign up
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </TrackedLink>
            <p className="!mt-3 text-sm text-black/45">
              coming soon to iOS &amp; Android
            </p>
          </div>
        </div>

        {/* the tickets */}
        <div
          className="relative mx-auto aspect-[0.95] w-full max-w-[52rem] sm:aspect-[1.15]"
          ref={fanRef}
        >
          <ul aria-label="Memories from past nights">
            {memories.map((memory, index) => (
              <motion.li
                animate={
                  shown
                    ? {
                        left: `${memory.x}%`,
                        top: `${memory.y}%`,
                        rotate: memory.rotate,
                        opacity: 1,
                        scale: 1,
                      }
                    : {
                        left: "50%",
                        top: "62%",
                        rotate: 0,
                        opacity: 0,
                        scale: 0.92,
                      }
                }
                className="absolute w-[calc(var(--w)*1%)] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                initial={
                  lessMotion
                    ? false
                    : {
                        left: "50%",
                        top: "62%",
                        rotate: 0,
                        opacity: 0,
                        scale: 0.92,
                      }
                }
                key={memory.event}
                onHoverEnd={() =>
                  setFront((current) => (current === index ? null : current))
                }
                onHoverStart={() => setFront(index)}
                onTap={() =>
                  setFront((current) => (current === index ? null : index))
                }
                style={{
                  zIndex: front === index ? 10 : memory.z,
                  ["--w" as string]: memory.w,
                }}
                transition={{
                  duration: 0.9,
                  ease,
                  delay: lessMotion ? 0 : 0.12 * index,
                }}
              >
                {/* lift layer, apart from the deal so the two never fight */}
                <motion.div
                  animate={
                    front === index
                      ? { y: -14, scale: 1.06, rotate: -memory.rotate * 0.8 }
                      : { y: 0, scale: 1, rotate: 0 }
                  }
                  initial={false}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                >
                  <Ticket
                    developed={developed[index]}
                    memory={memory}
                    videoRef={(el) => {
                      videoRefs.current[index] = el;
                    }}
                  />
                </motion.div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <MotionToggleButton
        className={`absolute bottom-4 ${motionToggleEdgeClassName}`}
        label="memories videos"
        onToggle={toggle}
        playing={playing}
      />
    </section>
  );
}

export { AppTeaserSection };
