"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";

import { EventScreen, lookNames, PhoneHero, type LookId } from "@/components/home/create-section";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { cn } from "@/lib/utils";

// 01 create: one event page, four looks. Pick one and the phone's page and
// the guest's ticket (which slides out from under the phone) both change. Until the visitor picks a look
// themselves, it steps through them on its own.

const ease = [0.32, 0.72, 0, 1] as const;

const lookOrder: readonly LookId[] = ["photo-led", "poster", "minimal", "editorial"];

// stub: the guest ticket's stub colour in each look
const lookStyle: Record<LookId, { label: string; stub: string; stubText: string }> = {
  "photo-led": { label: "Photo-led", stub: "#6D6A3C", stubText: "#FFFFFF" },
  poster: { label: "Poster", stub: "#2328B5", stubText: "#FFFFFF" },
  minimal: { label: "Minimal", stub: "#F6727A", stubText: "#0A0A0B" },
  editorial: { label: "Editorial", stub: "#EBC6E7", stubText: "#0A0A0B" },
};

function Phone({ look }: { look: LookId }) {
  return (
    <div
      aria-label={`An event page on nuclii in the ${lookNames[look]} style: Open Decks, hosted by Southside Sound in Digbeth, Birmingham, Saturday 23 May, 20:00 to 02:00, from £8, 18 and over, with an RSVP button`}
      className="relative aspect-[9/19.4] w-full"
      role="img"
    >
      <div
        aria-hidden="true"
        className="@container relative size-full overflow-hidden rounded-[12%/5.6%] bg-white text-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <span className="absolute left-1/2 top-[2.4cqw] z-10 h-[6.5cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-black" />
        <EventScreen look={look} />
      </div>
    </div>
  );
}

// the guest's ticket, in the chosen look
function GuestTicket({ look }: { look: LookId }) {
  const { stub, stubText } = lookStyle[look];
  return (
    <div
      className="flex h-[4.4rem] w-[10.5rem] bg-white text-black shadow-[0_20px_44px_-16px_rgba(0,0,0,0.5)] sm:h-[5.2rem] sm:w-[16rem]"
      style={ticketPillStyle}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center pl-4 pr-2 leading-tight sm:pl-5">
        <span className="truncate font-display text-sm font-extrabold uppercase tracking-[-0.01em] sm:text-lg">
          Open Decks
        </span>
        <span className="!mt-0.5 truncate text-[0.62rem] text-black/55 sm:text-xs">Sat 23 May · Digbeth</span>
        <span className="hidden truncate text-xs text-black/55 sm:block">from £8 · Southside Sound</span>
      </div>
      <div
        className="flex w-[3rem] shrink-0 flex-col items-center justify-center border-l-2 border-dotted border-black/25 font-display sm:w-[4rem]"
        style={{ backgroundColor: stub, color: stubText }}
      >
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.08em] opacity-75">admit</span>
        <span className="text-lg font-extrabold leading-none sm:text-xl">01</span>
      </div>
    </div>
  );
}

function CreateLookSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const lessMotion = useLessMotion();
  const { playing, toggle } = useMotionPlayback();
  // once the visitor picks a look themselves, the demo stops for good
  const [touched, setTouched] = useState(false);
  const [look, setLook] = useState<LookId>("photo-led");

  const demo = !touched && playing && !lessMotion;
  const still = lessMotion;

  useEffect(() => {
    if (!demo || !inView) return;
    const id = window.setTimeout(() => {
      setLook((current) => lookOrder[(lookOrder.indexOf(current) + 1) % lookOrder.length]);
    }, 2800);
    return () => window.clearTimeout(id);
  }, [demo, inView, look]);

  const pick = (id: LookId) => {
    setTouched(true);
    setLook(id);
  };

  return (
    <section
      aria-labelledby="create-heading"
      className="relative overflow-hidden bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(3.5rem,6vw,5rem)] text-white"
      data-analytics-section="home_create"
      ref={sectionRef}
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* the words and the looks */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm">
            01 create
          </p>
          <h2
            className="!mt-6 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.08] tracking-[-0.03em] !text-white"
            id="create-heading"
          >
            <span className="bg-[var(--nuclii-lime)] px-1.5 text-black [box-decoration-break:clone]">simple</span> where it
            should be. <span className="bg-[var(--nuclii-lime)] px-1.5 text-black [box-decoration-break:clone]">flexible</span>{" "}
            where it matters.
          </h2>
          <p className="!mt-5 max-w-[28rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Choose the look, the audience and the details. Keep it simple, change it when you need to.
          </p>

          <div aria-label="Event page look" className="!mt-8 grid max-w-[27rem] grid-cols-2 gap-2.5" role="group">
            {lookOrder.map((id, index) => {
              const on = look === id;
              return (
                <button
                  aria-pressed={on}
                  className={cn(
                    "flex h-16 items-center gap-3 rounded-none pl-3 pr-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on ? "bg-[var(--nuclii-lime)] text-black" : "bg-white/[0.08] text-white hover:bg-white/[0.14]",
                  )}
                  key={id}
                  onClick={() => pick(id)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") pick(id);
                  }}
                  style={{ ...ticketPillStyle, fontSize: "1rem" }}
                  type="button"
                >
                  {/* a live mini of the look */}
                  <span
                    aria-hidden="true"
                    className="@container relative aspect-[4/5] w-9 shrink-0 overflow-hidden rounded-[0.2rem]"
                  >
                    <PhoneHero id={id} />
                  </span>
                  <span className="leading-tight">
                    <span className={cn("block text-[0.65rem] font-semibold", on ? "text-black/50" : "text-white/40")}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="block font-display text-[0.95rem] font-semibold">{lookStyle[id].label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="!mt-4 text-sm text-white/40">Same event, four looks. Pick one.</p>
        </div>

        {/* the stage: the phone and the guest ticket */}
        <div className="relative mx-auto flex w-full max-w-[36rem] items-center justify-center py-2">
          <div className="relative w-[14.5rem] sm:w-[17.5rem]">
            <div className="relative">
              <Phone look={look} />
            </div>

            {/* the guest ticket, over the phone's corner; it slides out from
                under the phone again each time the look changes */}
            <div aria-hidden="true" className="absolute left-[52%] top-[70%] sm:left-[58%]">
              <AnimatePresence initial={false}>
                <motion.div
                  animate={{ x: "0%", opacity: 1, rotate: 4 }}
                  className="absolute left-0 top-0"
                  exit={{ y: 14, opacity: 0, rotate: 6, transition: { duration: still ? 0 : 0.25, ease: "easeIn" } }}
                  initial={still ? false : { x: "-38%", opacity: 0, rotate: 0 }}
                  key={look}
                  transition={{ duration: still ? 0 : 0.6, ease, delay: still ? 0 : 0.18 }}
                >
                  <GuestTicket look={look} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {!touched && !lessMotion && (
        <MotionToggleButton
          className={`absolute bottom-4 ${motionToggleEdgeClassName}`}
          label="looks demo"
          onToggle={toggle}
          playing={playing}
        />
      )}
    </section>
  );
}

export { CreateLookSection };
