"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CATEGORY_PALETTES, isWeekend, priceLabel, whenLabel } from "@/lib/demo/world";
import type { DemoEvent } from "@/lib/demo/types";
import { cn } from "@/lib/utils";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { EventCover } from "../primitives";
import { CloseIcon, ForwardIcon, MapPinIcon } from "../icons";
import { PinMark } from "../marks";

/** stylised, non-geographic positions for the seed world's london areas */
const AREA_POS: Record<string, [number, number]> = {
  peckham: [46, 66],
  deptford: [62, 62],
  "new cross": [54, 74],
  camberwell: [37, 60],
  brixton: [27, 70],
  dalston: [62, 28],
  hackney: [70, 33],
  "hackney wick": [84, 40],
  "london fields": [66, 38],
  shoreditch: [53, 40],
  "columbia road": [58, 46],
  haggerston: [60, 34],
  bermondsey: [44, 53],
  "canada water": [57, 57],
  walthamstow: [78, 13],
  "victoria park": [76, 44],
  "canary wharf": [80, 60],
};

const FILTERS = [
  { key: "all", label: "all" },
  { key: "tonight", label: "tonight" },
  { key: "weekend", label: "this weekend" },
  { key: "free", label: "free" },
] as const;

function hashJitter(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return [((h % 9) - 4), (((h >> 3) % 9) - 4)] as const;
}

function posFor(event: DemoEvent): [number, number] {
  const base = AREA_POS[event.area] ?? [50, 50];
  const [jx, jy] = hashJitter(event.id);
  return [base[0] + jx, base[1] + jy];
}

export function MapScreen() {
  const { allEvents } = useWorld();
  const { go } = useDemoRouter();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const events = useMemo(() => {
    const upcoming = allEvents.filter((e) => e.dayOffset >= 0);
    const filtered = upcoming.filter((e) => {
      if (filter === "tonight") return e.dayOffset === 0;
      if (filter === "weekend") return isWeekend(e.dayOffset);
      if (filter === "free") return e.price === 0;
      return true;
    });
    // keep the map legible — cap and prefer nearer dates
    return filtered.sort((a, b) => a.dayOffset - b.dayOffset).slice(0, 16);
  }, [allEvents, filter]);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="relative h-[calc(100dvh-11rem)] min-h-[30rem] overflow-hidden rounded-3xl bg-[#0d0f13]">
      {/* stylised city */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 300"
      >
        <rect fill="#0d0f13" height="300" width="400" />
        <ellipse cx="70" cy="236" fill="#15231a" rx="62" ry="36" />
        <ellipse cx="336" cy="66" fill="#15231a" rx="52" ry="30" />
        <path
          d="M-10 150 C 80 120, 150 180, 236 158 S 360 120, 420 168"
          fill="none"
          stroke="#12263c"
          strokeLinecap="round"
          strokeWidth="18"
        />
        <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2">
          <line x1="0" x2="400" y1="60" y2="88" />
          <line x1="0" x2="400" y1="200" y2="218" />
          <line x1="118" x2="150" y1="0" y2="300" />
          <line x1="262" x2="292" y1="0" y2="300" />
        </g>
      </svg>

      {/* neighbourhood labels */}
      <div
        aria-hidden="true"
        className="absolute inset-0 select-none text-[9px] font-semibold uppercase tracking-wider text-white/22"
      >
        <span className="absolute left-[56%] top-[26%]">dalston</span>
        <span className="absolute left-[70%] top-[33%]">hackney</span>
        <span className="absolute left-[42%] top-[64%]">peckham</span>
        <span className="absolute left-[26%] top-[70%]">brixton</span>
        <span className="absolute left-[60%] top-[62%]">deptford</span>
      </div>

      {/* filters */}
      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              setSelectedId(null);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
              filter === f.key
                ? "bg-[var(--demo-accent)] text-white"
                : "border border-white/12 bg-black/45 text-white/70 hover:text-white",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* tap-away backdrop */}
      {selected && (
        <button
          aria-label="close event"
          className="absolute inset-0 z-20 cursor-default"
          type="button"
          onClick={() => setSelectedId(null)}
        />
      )}

      {/* pins */}
      <div className="absolute inset-0 z-20">
        {events.map((event) => {
          const [x, y] = posFor(event);
          const isActive = event.id === selectedId;
          const ring = CATEGORY_PALETTES[event.category][1];
          return (
            <motion.button
              key={event.id}
              type="button"
              aria-label={`${event.title} — ${event.area}`}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${x}%`, top: `${y}%`, zIndex: isActive ? 10 : 1 }}
              onClick={() => setSelectedId((c) => (c === event.id ? null : event.id))}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: isActive ? 1.12 : 1 }}
              whileHover={reduce ? undefined : { scale: 1.08 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <span
                className={cn(
                  "relative block overflow-hidden rounded-full",
                  event.featured ? "size-14" : "size-11",
                )}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 3px ${ring}, 0 0 22px ${ring}88, 0 10px 26px rgba(0,0,0,0.55)`
                    : `0 0 0 2px ${ring}, 0 8px 20px rgba(0,0,0,0.5)`,
                }}
              >
                <EventCover event={event} sizes="56px" className="absolute inset-0" />
              </span>
              <span
                className="mx-auto -mt-1 block size-2 rounded-full"
                style={{ backgroundColor: ring }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* your location */}
      <div className="absolute bottom-[16%] left-1/2 z-10 -translate-x-1/2">
        <span className="relative flex size-3 items-center justify-center">
          {!reduce && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--demo-accent)]/60" />
          )}
          <span className="relative size-3 rounded-full bg-[var(--demo-accent)] ring-2 ring-white/70" />
        </span>
      </div>

      {/* locate button */}
      <span className="absolute bottom-3 right-3 z-20 grid size-10 place-items-center rounded-full border border-white/12 bg-black/55 text-[var(--demo-accent-bright)] backdrop-blur">
        <PinMark className="size-5" />
      </span>

      {/* slide-up detail sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            className="absolute inset-x-0 bottom-0 z-30 p-2.5"
            initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#16181d]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-white/20" />
              <button
                type="button"
                aria-label="close"
                onClick={() => setSelectedId(null)}
                className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CloseIcon className="size-4" />
              </button>
              <div className="flex gap-3 p-3">
                <EventCover event={selected} sizes="72px" className="size-[4.5rem] shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 pr-6">
                  <p className="truncate font-display text-base font-extrabold lowercase tracking-[-0.02em] text-white">
                    {selected.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_PALETTES[selected.category][1] }}
                    />
                    {whenLabel(selected)} · {priceLabel(selected.price)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-white/45">
                    <MapPinIcon className="size-3" />
                    {selected.venueName}, {selected.area}
                  </p>
                </div>
              </div>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => go({ name: "event", id: selected.id })}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-bold lowercase text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  view event
                  <ForwardIcon className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
