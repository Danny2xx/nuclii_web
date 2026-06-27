"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark, MapPin, Navigation, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

type MapEvent = {
  id: string;
  src: string;
  x: number;
  y: number;
  ring: string;
  title: string;
  kind: "event" | "space" | "talent";
  when: string;
  distance: string;
  host: string;
  featured?: boolean;
};

const EVENTS: readonly MapEvent[] = [
  {
    id: "waterfight",
    src: "/images/host.jpg",
    x: 50,
    y: 46,
    ring: "#6F89A8",
    title: "waterfight",
    kind: "event",
    when: "sun 14 jul · 2pm",
    distance: "1.2 km away",
    host: "hosted by london splash club",
    featured: true,
  },
  {
    id: "supper",
    src: "/images/about-gathering.jpg",
    x: 82,
    y: 72,
    ring: "#7A9E6E",
    title: "candlelit supper club",
    kind: "event",
    when: "fri 12 jul · 7pm",
    distance: "0.8 km away",
    host: "hosted by the long table",
  },
  {
    id: "studio",
    src: "/images/talent.jpg",
    x: 80,
    y: 30,
    ring: "#8E7CA8",
    title: "open ceramics studio",
    kind: "talent",
    when: "sat 13 jul · 11am",
    distance: "2.1 km away",
    host: "with maya, ceramicist",
  },
  {
    id: "warehouse",
    src: "/images/venue.jpg",
    x: 25,
    y: 73,
    ring: "#6E9CA0",
    title: "hackney warehouse",
    kind: "space",
    when: "available this weekend",
    distance: "1.7 km away",
    host: "holds up to 120 guests",
  },
  {
    id: "rooftop",
    src: "/images/attendee.jpg",
    x: 18,
    y: 42,
    ring: "#C2A968",
    title: "rooftop social",
    kind: "event",
    when: "thu 11 jul · 6pm",
    distance: "3.0 km away",
    host: "hosted by skyline collective",
  },
] as const;

const FILTERS = ["all", "events", "spaces", "talent"] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const pinVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function ExperienceMap() {
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = EVENTS.find((event) => event.id === selectedId) ?? null;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f13] shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:aspect-[4/3]">
      {/* stylized city map */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 300"
      >
        <rect fill="#0d0f13" height="300" width="400" />
        <ellipse cx="64" cy="232" fill="#15231a" rx="58" ry="34" />
        <ellipse cx="338" cy="70" fill="#15231a" rx="50" ry="30" />
        <path
          d="M-10 132 C 70 108, 150 168, 232 150 S 360 116, 420 158"
          fill="none"
          stroke="#12263c"
          strokeLinecap="round"
          strokeWidth="16"
        />
        <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2">
          <line x1="0" x2="400" y1="58" y2="86" />
          <line x1="0" x2="400" y1="196" y2="214" />
          <line x1="118" x2="150" y1="0" y2="300" />
          <line x1="262" x2="292" y1="0" y2="300" />
        </g>
        <g stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1">
          <line x1="0" x2="400" y1="120" y2="138" />
          <line x1="0" x2="400" y1="250" y2="262" />
          <line x1="60" x2="84" y1="0" y2="300" />
          <line x1="190" x2="214" y1="0" y2="300" />
          <line x1="330" x2="352" y1="0" y2="300" />
        </g>
      </svg>

      {/* neighbourhood labels */}
      <div
        aria-hidden="true"
        className="absolute inset-0 select-none text-[9px] font-semibold uppercase tracking-wider text-white/25"
      >
        <span className="absolute left-[18%] top-[22%]">hoxton</span>
        <span className="absolute right-[12%] top-[34%]">shoreditch</span>
        <span className="absolute left-[12%] top-[60%]">hackney</span>
        <span className="absolute bottom-[24%] right-[16%]">dalston</span>
      </div>

      {/* search + filters */}
      <div className="absolute inset-x-3 top-3 z-20 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/12 bg-black/55 px-3 py-2 backdrop-blur">
          <Search aria-hidden="true" className="size-3.5 shrink-0 text-white/45" />
          <span className="truncate text-[11px] text-white/45">
            search by interest, date, area or vibe
          </span>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/12 bg-black/55 text-white/60 backdrop-blur">
          <SlidersHorizontal aria-hidden="true" className="size-3.5" />
        </span>
      </div>
      <div className="absolute left-3 top-[3.4rem] z-20 flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => (
          <span
            className={
              filter === "all"
                ? "rounded-full bg-[#6F89A8] px-2.5 py-1 text-[11px] font-semibold text-white"
                : "rounded-full border border-white/12 bg-black/40 px-2.5 py-1 text-[11px] text-white/65 backdrop-blur"
            }
            key={filter}
          >
            {filter}
          </span>
        ))}
      </div>

      {/* tap-anywhere backdrop to dismiss the sheet */}
      {selected && (
        <button
          aria-label="Close event details"
          className="absolute inset-0 z-20 cursor-default"
          onClick={() => setSelectedId(null)}
          type="button"
        />
      )}

      {/* clickable pins */}
      <motion.div
        className="absolute inset-0 z-20"
        initial={reduce ? false : "hidden"}
        variants={container}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={reduce ? undefined : "show"}
      >
        {EVENTS.map((event) => {
          const isActive = event.id === selectedId;
          const size = event.featured ? "size-16" : "size-12";
          return (
            <motion.button
              aria-label={`${event.title} — ${event.kind}`}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              key={event.id}
              onClick={() => setSelectedId((current) => (current === event.id ? null : event.id))}
              style={{ left: `${event.x}%`, top: `${event.y}%`, zIndex: isActive ? 10 : 1 }}
              type="button"
              variants={pinVariants}
              whileHover={reduce ? undefined : { scale: 1.08 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
            >
              <motion.span
                animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                className={`relative block ${size} overflow-hidden rounded-full`}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 3px ${event.ring}, 0 0 22px ${event.ring}, 0 10px 26px rgba(0,0,0,0.55)`
                    : `0 0 0 2px ${event.ring}, 0 8px 20px rgba(0,0,0,0.5)`,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <Image alt="" className="object-cover" fill sizes="64px" src={event.src} />
              </motion.span>
              <span
                className="mx-auto -mt-1 block size-2 rounded-full shadow"
                style={{ backgroundColor: event.ring }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* your location */}
      <div className="absolute bottom-[15%] left-1/2 z-10 -translate-x-1/2">
        <span className="relative flex size-3 items-center justify-center">
          {!reduce && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6F89A8]/60" />
          )}
          <span className="relative size-3 rounded-full bg-[#6F89A8] ring-2 ring-white/70" />
        </span>
      </div>

      {/* locate button */}
      <span className="absolute bottom-3 right-3 z-20 grid size-9 place-items-center rounded-full border border-white/12 bg-black/55 text-[#9bb1c9] backdrop-blur">
        <Navigation aria-hidden="true" className="size-4" />
      </span>

      {/* slide-up event detail sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="absolute inset-x-0 bottom-0 z-30 p-2.5"
            exit={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
            initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
            key={selected.id}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#16181d]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-white/20" />
              <button
                aria-label="Close"
                className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20"
                onClick={() => setSelectedId(null)}
                type="button"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>

              <div className="flex gap-3 p-3">
                <span className="relative block size-[4.5rem] shrink-0 overflow-hidden rounded-xl">
                  <Image alt={selected.title} className="object-cover" fill sizes="72px" src={selected.src} />
                </span>
                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-bold lowercase text-white">{selected.title}</p>
                    <Bookmark aria-hidden="true" className="size-3.5 shrink-0 text-white/45" />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: selected.ring }} />
                    {selected.kind} · {selected.when}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/40">
                    <MapPin aria-hidden="true" className="size-3" />
                    {selected.distance}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-white/45">{selected.host}</p>
                </div>
              </div>

              <div className="px-3 pb-3">
                <span className="block w-full rounded-full bg-white py-2 text-center text-[12px] font-semibold lowercase text-black">
                  view {selected.kind}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { ExperienceMap };
