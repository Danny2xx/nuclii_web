"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { MapPin } from "lucide-react";

import { profilePhotos, ProfileImage, type ProfilePhoto } from "@/components/home/profile-photos";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { cn } from "@/lib/utils";

// 04 circle: the event's group chat, out of the phone. The card pins while you
// scroll and the scroll plays the chat: faster scrolling, faster messages;
// scrolling back rewinds it. Whoever is talking lights up in the circle, and
// the address reveal lands as a ticket stub.

const BLUE = "#00A6FF";
const ease = [0.32, 0.72, 0, 1] as const;

const members = [
  { name: "Zara", photo: profilePhotos.asianWoman },
  { name: "Tobi", photo: profilePhotos.man },
  { name: "Liv", photo: profilePhotos.whiteWoman },
  { name: "Hamza", photo: profilePhotos.southAsianMan },
  { name: "Maya", photo: profilePhotos.womanAsian },
  { name: "Kai", photo: profilePhotos.curlyWhiteMan },
  { name: "Jess", photo: profilePhotos.womanWhite },
  { name: "Ollie", photo: profilePhotos.whiteManVest },
] as const satisfies readonly { name: string; photo: ProfilePhoto }[];

type Name = (typeof members)[number]["name"];
// the chat is seen from Tobi's phone
const YOU: Name = "Tobi";

type Message = { from: Name; text: string } | { update: string };

const script: readonly Message[] = [
  { from: "Zara", text: "Pre-drinks at mine from 7? Who's in? 🍾" },
  { from: "Tobi", text: "I'm in! I'll bring the aux 🎧" },
  { from: "Liv", text: "Dress code? Thinking all black 🖤" },
  { from: "Hamza", text: "Calm, got my outfit. Everyone good for 10?" },
  { update: "Address revealed · Digbeth, Birmingham" },
  { from: "Maya", text: "10 mins from the station, easy" },
  { from: "Kai", text: "Who's on the last bus back?" },
  { from: "Tobi", text: "Me, save me a seat 🙋" },
  { from: "Jess", text: "See you all at 7 ✨" },
];

// space between messages; older ones slide up under the fade
const CHAT_GAP = 16;

// where each face starts before gathering, in multiples of its own size
const scatter = [
  [-1.6, -1.2],
  [0.8, -2],
  [2.2, -0.6],
  [1.8, 1.4],
  [0.4, 2.2],
  [-1.4, 1.8],
  [-2.4, 0.4],
  [-2, -1.8],
] as const;

const photoOf = (name: Name) => members.find((m) => m.name === name)!.photo;

// messages showing at a given scroll progress through the pinned card
const countAt = (v: number) => Math.min(script.length, 1 + Math.floor(Math.max(0, v) * script.length * 1.25));

function Circle({ gathered, speaking, still }: { gathered: boolean; speaking: Name | null; still: boolean }) {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full">
      {/* the ring that joins them */}
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
        <motion.circle
          animate={{ pathLength: gathered ? 1 : 0 }}
          cx="50"
          cy="50"
          fill="none"
          initial={false}
          r="38"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.4"
          transition={{
            duration: still ? 0 : 1.1,
            ease,
            delay: still ? 0 : 0.5,
          }}
        />
      </svg>

      {members.map((member, i) => {
        const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        const talking = speaking === member.name;
        const [sx, sy] = scatter[i];
        return (
          <span
            className="absolute size-[19%] -translate-x-1/2 -translate-y-1/2"
            key={member.name}
            style={{
              left: `${(50 + Math.cos(angle) * 38).toFixed(2)}%`,
              top: `${(50 + Math.sin(angle) * 38).toFixed(2)}%`,
            }}
          >
            <motion.span
              animate={
                gathered
                  ? { x: "0%", y: "0%", opacity: 1, scale: talking ? 1.16 : 1 }
                  : {
                      x: `${sx * 100}%`,
                      y: `${sy * 100}%`,
                      opacity: 0,
                      scale: 0.7,
                    }
              }
              className="relative block size-full"
              initial={false}
              transition={{
                duration: still ? 0 : 0.8,
                ease,
                delay: still || !gathered ? 0 : talking ? 0 : i * 0.06,
              }}
            >
              <span
                className="relative block size-full overflow-hidden rounded-full border-2 bg-[#2A2B30] transition-colors duration-300"
                style={{
                  borderColor: talking ? BLUE : "rgba(255,255,255,0.9)",
                }}
              >
                <ProfileImage photo={member.photo} />
              </span>
              <span
                className={cn(
                  "absolute left-1/2 top-full !mt-1.5 -translate-x-1/2 text-xs font-medium transition-colors duration-300",
                  talking ? "text-white" : "text-white/45",
                )}
              >
                {member.name}
              </span>
            </motion.span>
          </span>
        );
      })}

      {/* the group, in the middle */}
      <motion.div
        animate={{ opacity: gathered ? 1 : 0, scale: gathered ? 1 : 0.92 }}
        className="absolute inset-[28%] flex flex-col items-center justify-center text-center"
        initial={false}
        transition={{ duration: still ? 0 : 0.6, ease, delay: still ? 0 : 0.7 }}
      >
        <span className="font-display text-[clamp(1.05rem,1.9vw,1.5rem)] font-bold leading-tight tracking-[-0.02em]">
          Late Night Activities
        </span>
        <span className="!mt-1.5 text-xs text-white/50 sm:text-sm">8 members · made from the event</span>
      </motion.div>
    </div>
  );
}

function ChatLine({ message }: { message: Message }) {
  if ("update" in message) {
    return (
      <div className="flex justify-center py-1">
        <span
          className="inline-flex items-center gap-2.5 rounded-none px-5 py-2.5 font-display text-[clamp(0.9rem,1.2vw,1.05rem)] font-semibold text-black"
          style={{ ...ticketPillStyle, backgroundColor: BLUE }}
        >
          <MapPin aria-hidden="true" className="size-4" strokeWidth={2.25} />
          {message.update}
        </span>
      </div>
    );
  }

  const mine = message.from === YOU;
  return (
    <div className={cn("flex items-end gap-3", mine && "justify-end")}>
      {!mine && (
        <span className="relative block size-9 shrink-0 overflow-hidden rounded-full bg-[#2A2B30] sm:size-10">
          <ProfileImage photo={photoOf(message.from)} />
        </span>
      )}
      <div
        className={cn(
          "max-w-[82%] px-5 py-3 text-[clamp(1rem,1.45vw,1.3rem)] leading-snug",
          mine
            ? "rounded-[1.4rem] rounded-br-md bg-white text-black"
            : "rounded-[1.4rem] rounded-bl-md bg-[#1C1D21] text-white",
        )}
      >
        {!mine && <span className="block text-xs font-semibold text-white/45 sm:text-sm">{message.from}</span>}
        {message.text}
      </div>
    </div>
  );
}

// phones: the circle as a row of faces, so the pinned card fits one screen
function FaceRow({ speaking }: { speaking: Name | null }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-3">
      <span className="flex">
        {members.map((member, i) => (
          <span
            className={cn(
              "relative block size-9 overflow-hidden rounded-full border-2 bg-[#2A2B30] transition-colors duration-300",
              i > 0 && "-ml-2.5",
            )}
            key={member.name}
            style={{ borderColor: speaking === member.name ? BLUE : "#0A0A0B", zIndex: members.length - i }}
          >
            <ProfileImage photo={member.photo} />
          </span>
        ))}
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold">Late Night Activities</span>
        <span className="block text-xs text-white/50">8 members · made from the event</span>
      </span>
    </div>
  );
}

function CircleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef(0);
  const inView = useInView(stageRef, { amount: 0.35 });
  const lessMotion = useLessMotion();
  const animated = !lessMotion;
  const [count, setCount] = useState(1);

  // The card pins while you scroll through it; how far you've scrolled
  // decides how many messages are in. Scroll faster, they come faster;
  // scroll back and they rewind. The whole chat is in by ~80%.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = countAt(v);
    setCount((current) => (current === next ? current : next));
  });

  const shown = animated ? count : script.length;
  const gathered = !animated || inView || shown > 1;

  // The column is pinned to the bottom, so adding (or removing) a message
  // shifts everything by that message's height at once. Offset the column by
  // the change, set before paint, then slide it home: one transform, no snap.
  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return;
    const height = column.getBoundingClientRect().height;
    const previous = lastHeight.current;
    lastHeight.current = height;
    const change = height - previous;
    if (!animated || previous === 0 || change === 0) return;
    const current = new DOMMatrixReadOnly(getComputedStyle(column).transform).m42;
    const from = current + change;
    column.style.transform = `translateY(${from}px)`;
    const controls = animate(column, { y: [from, 0] }, { duration: 0.45, ease });
    return () => controls.stop();
  }, [animated, shown]);

  const latest = script[shown - 1];
  const speaking = animated && latest && "from" in latest ? latest.from : null;

  // !block below: the stack centres short cards with flex; this one is tall
  // and pins its own stage, so it must start at the top
  return (
    <section
      aria-labelledby="circle-heading"
      className={cn("relative bg-[#0A0A0B] text-white", animated && "!block h-[230svh] !flex-none")}
      data-analytics-section="home_circle"
      ref={sectionRef}
    >
      <div
        className={cn(
          "overflow-clip px-[var(--container-x)] py-[clamp(3.5rem,6vw,5rem)]",
          animated && "sticky top-0 flex min-h-[100svh] flex-col justify-center",
        )}
        ref={stageRef}
      >
        <div className="mx-auto grid w-full max-w-[80rem] items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* the words and the circle */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-white sm:text-sm">04 repeat</p>
            <h2
              className="!mt-5 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-white lg:!mt-6"
              id="circle-heading"
            >
              your built-in circle.
            </h2>
            <p className="!mt-4 max-w-[30rem] text-base leading-relaxed text-white/65 sm:text-lg">
              Every event comes with its own group chat. Plan the pre-drinks, share updates and keep everyone in the
              loop.
            </p>
            <div className="!mt-6 lg:hidden">
              <FaceRow speaking={speaking} />
            </div>
            <div className="!mt-12 hidden max-w-[24rem] lg:block">
              <Circle gathered={gathered} speaking={speaking} still={!animated} />
            </div>
          </div>

          {/* the chat, full size; older messages slide up under the fade */}
          <div
            aria-label="Example group chat for Late Night Activities"
            className="relative flex h-[22rem] flex-col justify-end overflow-hidden sm:h-[28rem] lg:h-[32rem]"
            role="log"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0, #000 22%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 22%)",
            }}
          >
            <div className="flex flex-col" ref={columnRef} style={{ gap: CHAT_GAP }}>
              {script.slice(0, shown).map((message, i) => (
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={animated ? { opacity: 0 } : false}
                  key={i}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                >
                  <ChatLine message={message} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CircleSection };
