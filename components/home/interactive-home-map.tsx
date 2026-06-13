"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Music2, Palette, UsersRound } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type EventPin = { x: string; y: string; label: string };
type MapEvent = {
  id: string;
  title: string;
  type: string;
  timing: string;
  note: string;
  icon: LucideIcon;
  pins: readonly EventPin[];
  pan: { x: number; y: number };
};

const mapEvents = [
  {
    id: "workshop",
    title: "Creative Workshop",
    type: "Workshop",
    timing: "Tonight",
    note: "Location visible after booking",
    icon: Palette,
    pan: { x: 0, y: 0 },
    pins: [
      { x: "30%", y: "38%", label: "Studio" },
      { x: "50%", y: "55%", label: "Pop-up" },
    ],
  },
  {
    id: "club",
    title: "Club Night",
    type: "Nightlife",
    timing: "Friday",
    note: "QR access · Private venue",
    icon: Music2,
    pan: { x: -45, y: -25 },
    pins: [
      { x: "64%", y: "32%", label: "Venue" },
      { x: "73%", y: "58%", label: "After-hours" },
    ],
  },
  {
    id: "society",
    title: "Society Mixer",
    type: "Community",
    timing: "Saturday",
    note: "Open to members · Eligibility-aware",
    icon: UsersRound,
    pan: { x: 28, y: 18 },
    pins: [
      { x: "38%", y: "64%", label: "Campus" },
      { x: "57%", y: "44%", label: "Members" },
    ],
  },
] as const satisfies readonly MapEvent[];

/* ─── City Map SVG ──────────────────────────────────────────────────── */
function CityMap({ panX, panY }: { panX: number; panY: number }) {
  return (
    <motion.svg
      animate={{ x: panX, y: panY }}
      aria-hidden="true"
      className="pointer-events-none absolute"
      preserveAspectRatio="xMidYMid slice"
      style={{ inset: "-6%", width: "112%", height: "112%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      viewBox="0 0 900 560"
    >
      {/* ── Base land ── */}
      <rect width="900" height="560" fill="#0c0e17" />

      {/* ── Parks ── */}
      <rect x="48" y="72" width="115" height="92" rx="6" fill="#0b1509" />
      <rect x="618" y="140" width="78" height="58" rx="4" fill="#0b1509" />
      <rect x="760" y="310" width="60" height="50" rx="4" fill="#0b1509" />
      <rect x="120" y="300" width="52" height="44" rx="4" fill="#0b1509" />

      {/* ── Building blocks – north of river ── */}
      {/* Block grid roughly filling in between major roads */}
      {[
        [190,10,80,62],[280,10,95,62],[385,10,88,62],[483,10,72,62],[565,10,44,62],
        [190,82,55,58],[255,82,75,58],[340,82,58,58],[408,82,68,58],[486,82,60,58],[556,82,44,58],
        [190,155,60,90],[260,155,80,90],[350,155,54,90],[414,155,64,90],[488,155,56,90],[554,155,60,90],
        [620,10,80,56],[710,10,70,56],[790,10,80,56],[620,76,70,60],[700,76,80,60],[790,76,80,60],
        [620,155,70,88],[700,155,80,88],[790,155,80,88],
        [10,165,80,80],[100,165,60,80],[170,165,0,80],
        [10,82,80,60],[100,82,55,60],[165,82,0,60],
        [10,10,80,58],[100,10,55,58],[165,10,0,58],
        [190,265,60,68],[260,265,75,68],[345,265,50,68],[405,265,62,68],[477,265,58,68],[545,265,60,68],
        [614,265,70,68],[694,265,78,68],[782,265,98,68],
        [10,255,60,78],[80,255,80,78],[170,255,0,78],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#13161f" opacity="0.95" />
      ))}

      {/* ── Building blocks – south of river ── */}
      {[
        [10,430,80,55],[100,430,65,55],[175,430,55,55],[240,430,70,55],[320,430,65,55],
        [395,430,60,55],[465,430,70,55],[545,430,75,55],[630,430,70,55],[710,430,80,55],[800,430,80,55],
        [10,495,80,55],[100,495,65,55],[175,495,55,55],[240,495,70,55],[320,495,65,55],
        [395,495,60,55],[465,495,70,55],[545,495,75,55],[630,495,70,55],[710,495,80,55],[800,495,80,55],
      ].map(([x, y, w, h], i) => (
        <rect key={`s${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#13161f" opacity="0.9" />
      ))}

      {/* ── Minor streets ── */}
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" fill="none">
        {/* Horizontal minor */}
        {[50, 82, 115, 205, 240, 305, 340, 455, 490].map(y => (
          <line key={`mh${y}`} x1="0" y1={y} x2="900" y2={y} />
        ))}
        {/* Vertical minor */}
        {[85, 130, 220, 270, 320, 450, 505, 550, 665, 720, 770, 840].map(x => (
          <line key={`mv${x}`} x1={x} y1="0" x2={x} y2="560" />
        ))}
      </g>

      {/* ── Secondary roads ── */}
      <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.6" fill="none">
        {/* Horizontal secondary */}
        {[62, 156, 262, 345, 420].map(y => (
          <line key={`sh${y}`} x1="0" y1={y} x2="900" y2={y} />
        ))}
        {/* Vertical secondary */}
        {[170, 350, 440, 530, 610, 695, 785].map(x => (
          <line key={`sv${x}`} x1={x} y1="0" x2={x} y2="560" />
        ))}
        {/* Diagonal secondary — toned down on mobile via CSS */}
        <g className="nuclii-map-diagonals">
          <line x1="0" y1="110" x2="900" y2="390" />
          <line x1="120" y1="0" x2="520" y2="370" />
          <line x1="560" y1="0" x2="900" y2="280" />
        </g>
      </g>

      {/* ── Main arterial roads ── */}
      <g fill="none">
        {/* Horizontal mains */}
        <line x1="0" y1="150" x2="900" y2="148" stroke="rgba(255,255,255,0.32)" strokeWidth="3.5" />
        <path d="M0,268 C200,265 400,270 600,266 L900,266" stroke="rgba(255,255,255,0.30)" strokeWidth="3.5" />
        <path d="M0,358 C150,354 350,362 550,356 L900,354" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
        {/* Vertical mains */}
        <line x1="185" y1="0" x2="185" y2="560" stroke="rgba(255,255,255,0.30)" strokeWidth="3.5" />
        <line x1="395" y1="0" x2="395" y2="560" stroke="rgba(255,255,255,0.30)" strokeWidth="3.5" />
        <line x1="625" y1="0" x2="625" y2="560" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
        {/* Diagonal main (arterial) — toned down on mobile */}
        <g className="nuclii-map-diagonals">
          <line x1="0" y1="62" x2="900" y2="412" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
          <line x1="900" y1="62" x2="240" y2="560" stroke="rgba(255,255,255,0.20)" strokeWidth="2.5" />
          <line x1="0" y1="320" x2="500" y2="560" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        </g>
      </g>

      {/* ── River Thames ── */}
      <path
        d="M-10,390 C80,376 180,386 280,380 C380,373 460,384 540,378 C630,371 720,382 820,374 L900,374 L900,428 C800,422 710,432 620,424 C530,416 448,428 360,420 C270,412 180,424 80,416 Z"
        fill="#091628"
        opacity="0.92"
      />
      {/* River shine */}
      <path
        d="M0,385 C90,378 200,384 320,378 C440,372 560,380 700,374 L900,372 L900,380 C760,382 640,376 510,382 C380,388 260,382 140,388 Z"
        fill="rgba(91,140,255,0.06)"
      />

      {/* ── Bridges over Thames ── */}
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="3.5" fill="none">
        <line x1="185" y1="368" x2="185" y2="430" />
        <line x1="395" y1="362" x2="395" y2="428" />
        <line x1="625" y1="365" x2="625" y2="425" />
        <line x1="295" y1="372" x2="295" y2="426" />
        <line x1="520" y1="368" x2="520" y2="424" />
      </g>

      {/* ── Blue glow around active area ── */}
      <circle cx="450" cy="280" r="180" fill="rgba(91,140,255,0.04)" />
      <circle cx="450" cy="280" r="260" fill="rgba(91,140,255,0.02)" />

      {/* ── District / street labels ── */}
      <g fill="rgba(255,255,255,0.22)" fontFamily="system-ui,sans-serif" fontSize="9.5" fontWeight="500" letterSpacing="0.06em">
        <text x="58" y="120" textAnchor="middle" transform="rotate(-2,58,120)">REGENT&apos;S PARK</text>
        <text x="210" y="210" textAnchor="middle">MARYLEBONE</text>
        <text x="460" y="110" textAnchor="middle">KING&apos;S CROSS</text>
        <text x="670" y="210" textAnchor="middle">ISLINGTON</text>
        <text x="200" y="320" textAnchor="middle">SOHO</text>
        <text x="450" y="318" textAnchor="middle">THE STRAND</text>
        <text x="660" y="320" textAnchor="middle">CITY OF LONDON</text>
        <text x="210" y="465" textAnchor="middle">LAMBETH</text>
        <text x="480" y="462" textAnchor="middle">SOUTHWARK</text>
        <text x="700" y="462" textAnchor="middle">BERMONDSEY</text>
      </g>

      {/* ── Thames label ── */}
      <text
        fill="rgba(91,140,255,0.35)"
        fontFamily="system-ui,sans-serif"
        fontSize="10"
        fontStyle="italic"
        fontWeight="500"
        letterSpacing="0.12em"
        textAnchor="middle"
        x="450"
        y="405"
      >
        RIVER THAMES
      </text>

      {/* ── Scale bar ── */}
      <g transform="translate(22,530)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="60" y1="-4" x2="60" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <text x="30" y="-7" fill="rgba(255,255,255,0.3)" fontFamily="system-ui,sans-serif" fontSize="7.5" textAnchor="middle">500m</text>
      </g>

      {/* ── Compass ── */}
      <g transform="translate(858,38)">
        <circle r="14" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text fill="rgba(255,255,255,0.55)" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="0" y="-4">N</text>
        <line x1="0" y1="-2" x2="0" y2="10" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </g>
    </motion.svg>
  );
}

/* ─── Main component ────────────────────────────────────────────────── */
function InteractiveHomeMap() {
  const [activeId, setActiveId] = useState<string>(mapEvents[0].id);
  const activeEvent =
    mapEvents.find((e) => e.id === activeId) ?? mapEvents[0];
  const ActiveIcon = activeEvent.icon;

  return (
    <section
      className="mt-16 grid gap-6 sm:mt-20 lg:mt-24 lg:grid-cols-[1.25fr_0.75fr]"
      id="interactive-map"
    >
      {/* ── Map panel ─────────────────────────────────────────────── */}
      <div className="nuclii-home-dark-panel relative min-h-[36rem] overflow-hidden rounded-[2rem] border border-white/8 bg-[#0c0e17]">

        {/* City map SVG — pans on event change */}
        <CityMap panX={activeEvent.pan.x} panY={activeEvent.pan.y} />

        {/* Vignette overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(8,9,14,0.55) 100%)",
          }}
        />

        {/* Active event pins with ripple rings */}
        {activeEvent.pins.map((pin, index) => (
          <div
            key={`${activeEvent.id}-${pin.label}`}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: pin.x, top: pin.y }}
          >
            <span className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-primary/30 bg-primary/6" />
            {index === 0 && (
              <span
                className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-primary/45 bg-primary/12"
                style={{ animationDelay: "0.45s" }}
              />
            )}
            <span className="relative z-10 block size-3.5 rounded-full bg-primary ring-4 ring-primary/20 [box-shadow:0_0_14px_rgba(91,140,255,0.85)]" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-primary/25 bg-black/80 px-2.5 py-1 text-[0.68rem] font-semibold text-primary backdrop-blur">
              {pin.label}
            </span>
          </div>
        ))}

        {/* Header overlay — solid top fading to transparent blocks SVG district labels */}
        <div className="absolute left-0 right-0 top-0 z-20 bg-gradient-to-b from-[#0c0e17] from-40% via-[#0c0e17]/70 to-transparent p-6 pb-16">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary/70">
            Map-first discovery
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl" style={{ color: "#ffffff" }}>
            Discover what&apos;s near you.
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Locations reveal after booking. No unnecessary exposure.
          </p>
        </div>

        {/* Bottom overlay: mobile pills + active card stacked */}
        <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-3">

          {/* Mobile-only event selector — pills above the card */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5 lg:hidden">
            {mapEvents.map((event) => (
              <button
                aria-pressed={activeId === event.id}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeId === event.id
                    ? "border-primary/60 bg-primary/20 text-primary"
                    : "border-white/20 bg-black/50 text-white/55 hover:border-white/35",
                )}
                key={event.id}
                onClick={() => setActiveId(event.id)}
                type="button"
              >
                {event.title}
              </button>
            ))}
          </div>

          {/* Active listing card */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0b]/90 p-4 shadow-card backdrop-blur sm:self-end sm:w-72">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-primary/12 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                  {activeEvent.type}
                </span>
                <h3 className="mt-2 text-base font-bold" style={{ color: "#ffffff" }}>
                  {activeEvent.title}
                </h3>
                <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {activeEvent.timing} · {activeEvent.note}
                </p>
              </div>
              <ActiveIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Listings panel — desktop only ─────────────────────────── */}
      <aside className="hidden flex-col gap-3 lg:flex">
        <div className="mb-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary/70">
            On Nuclii
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            What&apos;s happening.
          </h2>
        </div>

        {mapEvents.map((event) => {
          const Icon = event.icon;
          const isActive = activeId === event.id;

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "group flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-foreground/12 bg-foreground/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                  : "border-border bg-card hover:border-foreground/15 hover:bg-foreground/[0.03]",
              )}
              key={event.id}
              onClick={() => setActiveId(event.id)}
              type="button"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-primary">
                  {event.type}
                </span>
                <span className="mt-1 block text-base font-semibold text-foreground">
                  {event.title}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  {event.timing} · {event.note}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                  isActive
                    ? "border-white/25 bg-[#0a0a0b] !text-[#ffffff]"
                    : "border-white/12 bg-[#0a0a0b] !text-[rgba(255,255,255,0.45)] hover:!text-[#ffffff] hover:border-white/25",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </button>
          );
        })}
      </aside>
    </section>
  );
}

export { InteractiveHomeMap };
