"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import { Check, House, Plus, RotateCcw } from "lucide-react";

import { profilePhotos, ProfileImage, type ProfilePhoto } from "@/components/home/profile-photos";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { cn } from "@/lib/utils";

// 03 collaborate: one event, built by several people. The host puts a call
// out, replies fly in from the edges and drop into the poster's line-up, and
// the poster ends ready to publish. It's the night the circle chat (04) is
// going to: a warehouse rave in Digbeth, Saturday at 10.

const ORANGE = "#FFA200";
const ease = [0.32, 0.72, 0, 1] as const;

type Member = {
  slot: string;
  name: string;
  role: string;
  photo?: ProfilePhoto;
  // the side the reply flies in from: -1 left, 1 right
  side: -1 | 1;
};

const crew: readonly Member[] = [
  { slot: "Venue", name: "The Courtyard", role: "Venue · Digbeth", side: -1 },
  { slot: "DJ", name: "Marco", role: "DJ selector", photo: profilePhotos.europeMan, side: 1 },
  { slot: "Photography", name: "Jess", role: "Photographer", photo: profilePhotos.womanWhite, side: -1 },
  { slot: "Co-host", name: "Maya", role: "Co-host", photo: profilePhotos.womanAsian, side: 1 },
];

// beats: 1 the call goes out; then per member, one beat to arrive and one to
// land in the line-up; the last beat stamps the poster ready to publish
const BEATS = 2 + crew.length * 2;
const arrivedAt = (i: number) => 2 + i * 2;
const landedAt = (i: number) => 3 + i * 2;
const delayBefore = (beat: number) =>
  beat === 0 ? 700 : beat === 1 ? 900 : beat === BEATS - 1 ? 600 : beat % 2 === 0 ? 1000 : 450;

// the poster's art ends 46cqw down; the tear and its notches sit there
const ART = "46cqw";
const posterNotches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.8rem at ${x} ${ART}, transparent 98%, #000 100%)`,
);
const posterMask: CSSProperties = {
  maskImage: posterNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: posterNotches.join(", "),
  WebkitMaskComposite: "source-in",
};

function Face({ member, className }: { member: Member; className?: string }) {
  return (
    <span className={cn("relative block size-9 shrink-0 overflow-hidden rounded-full bg-[#2A2B30]", className)}>
      {member.photo ? (
        <ProfileImage photo={member.photo} />
      ) : (
        <span className="flex size-full items-center justify-center bg-[#26282F] text-white">
          <House aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </span>
  );
}

// the reply card that flies in, then sits exactly over its line-up row
function ReplyCard({
  member,
  state,
  target,
  stageWidth,
  still,
}: {
  member: Member;
  state: "away" | "waiting" | "landed";
  target: Target;
  stageWidth: number;
  still: boolean;
}) {
  // wait just beside the poster: out in the margin when there's room,
  // only nudged aside when the poster fills the width (phones)
  const margin = (stageWidth - (target.w + 40)) / 2;
  const wait = member.side * Math.min(Math.max(margin + 16, 14), 160);
  return (
    <motion.div
      animate={
        state === "away"
          ? { x: member.side * stageWidth * 0.8, y: -8, opacity: 0, rotate: member.side * 4 }
          : state === "waiting"
            ? { x: wait, y: -10, opacity: 1, rotate: member.side * -2 }
            : { x: 0, y: 0, opacity: 0, rotate: 0 }
      }
      aria-hidden="true"
      className="absolute z-20 flex h-14 items-center gap-3 bg-white px-3.5 text-black shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)]"
      initial={false}
      style={{ left: target.x, top: target.y, width: target.w, marginLeft: -target.w / 2, marginTop: -28 }}
      transition={
        still
          ? { duration: 0 }
          : state === "landed"
            ? { duration: 0.55, ease, opacity: { duration: 0.2, delay: 0.42 } }
            : { duration: 0.7, ease }
      }
    >
      <Face member={member} />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate font-display text-[0.95rem] font-semibold">{member.name}</span>
        <span className="block truncate text-xs text-black/50">{member.role}</span>
      </span>
      <span className="inline-flex items-center gap-1 bg-[var(--nuclii-lime)] px-2 py-1 text-xs font-semibold">
        in <Check className="size-3" strokeWidth={3} />
      </span>
    </motion.div>
  );
}

type Target = { x: number; y: number; w: number };

function LineupRow({
  member,
  filled,
  still,
  rowRef,
}: {
  member: Member;
  filled: boolean;
  still: boolean;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const fade = (on: boolean) => ({
    animate: { opacity: on ? 1 : 0 },
    initial: false as const,
    transition: { duration: still ? 0 : 0.3, delay: still || !on ? 0 : 0.4 },
  });
  return (
    <li className="relative h-14" ref={rowRef}>
      {/* open spot */}
      <motion.div
        {...fade(!filled)}
        className="absolute inset-0 flex items-center gap-3 border border-dashed border-white/25 px-3.5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-white/30">
          <Plus aria-hidden="true" className="size-4 text-white/50" />
        </span>
        <span className="flex-1 text-sm text-white/60">{member.slot}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: ORANGE }}>
          open
        </span>
      </motion.div>
      {/* filled */}
      <motion.div {...fade(filled)} className="absolute inset-0 flex items-center gap-3 bg-white/[0.07] px-3.5">
        <Face member={member} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate font-display text-[0.95rem] font-semibold text-white">{member.name}</span>
          <span className="block truncate text-xs text-white/50">{member.role}</span>
        </span>
        <span className="flex size-5 items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-black">
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        </span>
      </motion.div>
    </li>
  );
}

function LineupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(stageRef, { amount: 0.45 });
  const lessMotion = useLessMotion();
  const { playing, toggle } = useMotionPlayback();
  const [beat, setBeat] = useState(0);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [targets, setTargets] = useState<{ stageWidth: number; rows: Target[] } | null>(null);

  const animated = playing && !lessMotion;
  // still visitors (or anyone paused before it starts) get the finished poster
  const shown = started ? beat : animated ? 0 : BEATS;
  const done = shown >= BEATS;
  const venueIn = shown >= landedAt(0);
  const filledCount = crew.filter((_, i) => shown >= landedAt(i)).length;

  useEffect(() => {
    if (!animated || !inView || beat >= BEATS) return;
    const id = window.setTimeout(() => {
      setStarted(true);
      setBeat((b) => b + 1);
    }, delayBefore(beat));
    return () => window.clearTimeout(id);
  }, [animated, inView, beat, run]);

  // where each line-up row sits inside the stage, so a reply can land on it
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      const rows = rowRefs.current.map((row) => {
        const r = row?.getBoundingClientRect();
        return r ? { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, w: r.width } : null;
      });
      if (rows.every(Boolean)) setTargets({ stageWidth: box.width, rows: rows as Target[] });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    setRun((r) => r + 1);
    setBeat(0);
    setStarted(true);
  };

  return (
    <section
      aria-labelledby="collaborate-heading"
      className="relative overflow-hidden bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(3.5rem,6vw,5rem)] text-white"
      data-analytics-section="home_collaborate"
      ref={sectionRef}
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* the words and the call */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm">
            03 collaborate
          </p>
          <h2
            className="!mt-6 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-white"
            id="collaborate-heading"
          >
            find the people who can pull it off.
          </h2>
          <p className="!mt-4 max-w-[28rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Put a call out for a venue, a DJ, a photographer or a co-host. See who&apos;s up for it and add them to
            your line-up.
          </p>

          {/* the open call */}
          <motion.div
            animate={shown >= 1 ? { opacity: 1, scale: 1, rotate: -1.5 } : { opacity: 0, scale: 1.08, rotate: -4 }}
            className="!mt-8 max-w-[24rem] bg-white px-6 py-5 text-black shadow-[0_20px_44px_-24px_rgba(0,0,0,0.35)]"
            initial={false}
            style={ticketPillStyle}
            transition={{ duration: animated ? 0.45 : 0, ease }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: ORANGE }}>
              open call
            </p>
            <p className="!mt-2 font-display text-lg font-semibold leading-snug">
              Looking for a venue, a DJ, a photographer and a co-host in Digbeth.
            </p>
            <p className="!mt-3 border-t-2 border-dotted border-black/15 pt-3 text-sm text-black/55">
              <span className="font-semibold tabular-nums text-black">{filledCount}</span> of {crew.length} spots
              filled · Sat 10pm
            </p>
          </motion.div>
        </div>

        {/* the poster, and the replies landing on it */}
        <div className="relative py-4" ref={stageRef}>
          <div className="@container relative mx-auto w-full max-w-[27rem]">
            <div
              aria-label={`Event poster: Warehouse Rave, Saturday 10pm, ${
                venueIn ? "The Courtyard, Digbeth" : "Digbeth"
              }. Line-up: hosted by you${done ? ", with The Courtyard, Marco, Jess and Maya" : ""}.`}
              className="relative bg-[#18191D] text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
              role="img"
              style={posterMask}
            >
              {/* art */}
              <div className="relative overflow-hidden" style={{ height: ART }}>
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 27rem, 100vw"
                  src="/images/explore-hover/rave.jpg"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#18191D] via-[#18191D]/30 to-transparent" />
                <span className="absolute right-[5cqw] top-[5cqw] bg-white px-[2.4cqw] py-[1cqw] font-display text-[3cqw] font-bold uppercase tracking-[0.06em] text-black">
                  Sat · 10pm
                </span>
                <div className="absolute inset-x-[6cqw] bottom-[4cqw]">
                  <p className="font-display text-[10cqw] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
                    Warehouse Rave
                  </p>
                  <p className="!mt-[1.6cqw] text-[3.6cqw] text-white/70">
                    rave ·{" "}
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="inline-block"
                      initial={animated ? { opacity: 0 } : false}
                      key={venueIn ? "venue" : "tbc"}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      {venueIn ? "The Courtyard, Digbeth" : "Digbeth · venue tbc"}
                    </motion.span>
                  </p>
                </div>
              </div>

              {/* the tear */}
              <div className="mx-[1.2rem] border-t-2 border-dashed border-white/20" />

              {/* line-up */}
              <div className="relative p-[1.2rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">line-up</p>
                <ul className="!mt-3 flex flex-col gap-2">
                  <li className="flex h-14 items-center gap-3 px-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--nuclii-lime)] font-display text-sm font-bold text-black">
                      you
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-[0.95rem] font-semibold">Hosted by you</span>
                      <span className="block text-xs text-white/50">Host</span>
                    </span>
                  </li>
                  {crew.map((member, i) => (
                    <LineupRow
                      filled={shown >= landedAt(i)}
                      key={`${run}-${member.slot}`}
                      member={member}
                      rowRef={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      still={!animated}
                    />
                  ))}
                </ul>

                {/* ready to publish */}
                <motion.span
                  animate={done ? { opacity: 1, scale: 1, rotate: -8 } : { opacity: 0, scale: 1.5, rotate: -14 }}
                  className="absolute -top-5 right-[1.2rem] bg-[var(--nuclii-lime)] px-3.5 py-2 font-display text-sm font-bold uppercase tracking-[0.04em] text-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]"
                  initial={false}
                  style={ticketPillStyle}
                  transition={{ duration: animated ? 0.4 : 0, ease: [0.2, 1.4, 0.4, 1] }}
                >
                  ready to publish
                </motion.span>
              </div>
            </div>
          </div>

          {/* replies, over the poster */}
          {animated &&
            targets &&
            crew.map((member, i) => (
              <ReplyCard
                key={`${run}-${member.slot}`}
                member={member}
                stageWidth={targets.stageWidth}
                state={shown >= landedAt(i) ? "landed" : shown >= arrivedAt(i) ? "waiting" : "away"}
                still={!animated}
                target={targets.rows[i]}
              />
            ))}
        </div>
      </div>

      {!lessMotion &&
        (done && started ? (
          <button
            className={`absolute bottom-4 inline-flex h-11 items-center gap-2 px-2 text-sm font-semibold text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${motionToggleEdgeClassName}`}
            onClick={replay}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> replay
          </button>
        ) : (
          <MotionToggleButton
            className={`absolute bottom-4 ${motionToggleEdgeClassName}`}
            label="line-up demo"
            onToggle={toggle}
            playing={playing}
          />
        ))}
    </section>
  );
}

export { LineupSection };
