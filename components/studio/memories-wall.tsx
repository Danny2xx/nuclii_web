"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { memoriesWall } from "@/components/studio/studio-content";
import { cn } from "@/lib/utils";

// The memories wall: a month as a bare grid (lines only, no frame), with each
// event's photo taped onto the day it happened. On its own a photo is just a
// photo; click it and it tells you what the night was. Arrows step through
// the months that have memories, newest first.

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

type Memory = (typeof memoriesWall)[number];

// a stable tilt per day, so the photos look stuck on by hand
const tiltFor = (day: number) => [-5, 3, -2, 6, -4, 2, -6, 4][day % 8];

function monthKey(date: string) {
  return date.slice(0, 7);
}

const whenLabel = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(y, m - 1, 1)))
    .toLowerCase();
}

function TapedPhoto({ memory, day, open, onToggle }: { memory: Memory; day: number; open: boolean; onToggle: () => void }) {
  const tilt = tiltFor(day);
  return (
    <button
      aria-label={`${whenLabel(memory.date)}: what happened?`}
      aria-pressed={open}
      className={cn(
        "group absolute inset-[8%] z-10 block bg-white p-[6%] pb-[14%] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:z-20 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nuclii-lime)] motion-reduce:transition-none motion-reduce:hover:scale-100",
        open && "z-20 scale-110 ring-2 ring-[var(--nuclii-lime)]",
      )}
      onClick={onToggle}
      style={{ rotate: `${tilt}deg` }}
      type="button"
    >
      <span className="relative block size-full overflow-hidden bg-[#141416]">
        <Image alt="" className="object-cover" fill sizes="(min-width: 1024px) 8rem, 14vw" src={memory.image} />
      </span>
      {/* the tape */}
      <span
        aria-hidden="true"
        className="absolute -top-[10%] left-1/2 h-[18%] w-[55%] -translate-x-1/2 bg-[#F4F2EC]/75 shadow-sm"
        style={{ rotate: `${-tilt * 1.6}deg` }}
      />
    </button>
  );
}

function MemoriesWall() {
  // months that have memories, newest first
  const months = useMemo(() => [...new Set(memoriesWall.map((m) => monthKey(m.date)))].sort().reverse(), []);
  const [index, setIndex] = useState(0);
  const [openDate, setOpenDate] = useState<string | null>(null);

  if (months.length === 0) return null;
  const key = months[index];
  const [year, month] = key.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // grid starts on monday
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const cells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const byDay = new Map(memoriesWall.filter((m) => monthKey(m.date) === key).map((m) => [Number(m.date.slice(8, 10)), m]));

  const selected = openDate ? memoriesWall.find((m) => m.date === openDate) : undefined;

  const step = (delta: number) => {
    setIndex((i) => Math.min(months.length - 1, Math.max(0, i + delta)));
    setOpenDate(null);
  };

  const arrow =
    "flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nuclii-lime)]";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p aria-live="polite" className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-bold lowercase tracking-[-0.02em]">
          {monthLabel(key)}
        </p>
        <div className="flex gap-2">
          {/* older months sit to the left */}
          <button aria-label="Older month" className={arrow} disabled={index === months.length - 1} onClick={() => step(1)} type="button">
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button aria-label="Newer month" className={arrow} disabled={index === 0} onClick={() => step(-1)} type="button">
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      {/* the grid: lines only */}
      <div className="!mt-5 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <span className="pb-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-white/40 sm:text-xs" key={day}>
            {day}
          </span>
        ))}
      </div>
      <ol aria-label={`memories in ${monthLabel(key)}`} className="grid grid-cols-7 border-l border-t border-white/15">
        {Array.from({ length: cells }, (_, i) => {
          const day = i - offset + 1;
          const inMonth = day >= 1 && day <= daysInMonth;
          const memory = inMonth ? byDay.get(day) : undefined;
          return (
            <li
              className={cn("relative aspect-square border-b border-r border-white/15", !inMonth && "bg-white/[0.02]")}
              key={i}
            >
              {inMonth && (
                <span className="absolute left-1.5 top-1 text-[0.65rem] font-semibold text-white/35 sm:left-2 sm:top-1.5 sm:text-xs">
                  {day}
                </span>
              )}
              {memory && (
                <TapedPhoto
                  day={day}
                  memory={memory}
                  onToggle={() => setOpenDate((d) => (d === memory.date ? null : memory.date))}
                  open={openDate === memory.date}
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* what the clicked photo was */}
      <div aria-live="polite" className="!mt-4 min-h-[3.5rem]">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex flex-col bg-[var(--nuclii-lime)] px-4 py-2.5 text-black"
              exit={{ opacity: 0, y: -4 }}
              initial={{ opacity: 0, y: 6 }}
              key={selected.date}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-black/55">
                {whenLabel(selected.date)}
              </span>
              <span className="font-display text-lg font-bold lowercase leading-tight">{selected.title}</span>
            </motion.div>
          ) : (
            <motion.p
              animate={{ opacity: 1 }}
              className="text-sm text-white/45"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="hint"
              transition={{ duration: 0.2 }}
            >
              tap a photo to see the night.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { MemoriesWall };
