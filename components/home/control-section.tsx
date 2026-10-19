"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

import { profilePhotos, ProfileImage, type ProfilePhoto } from "@/components/home/profile-photos";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { cn } from "@/lib/utils";

// 02 control: audience rings. Pick how far an event reaches, from everyone on
// nuclii down to your building; the chosen ring and everything inside it
// light up. Age and gender go further: they decide who, the rings decide where.
// The example is a sisters' night (women-only, 21+), so those settings start on.
// Nothing moves on its own.

type RingId = "everyone" | "birmingham" | "uni" | "society" | "building";

// outermost first; size is the ring's radius as a share of the biggest
const rings: readonly { id: RingId; label: string; size: number; reach: string }[] = [
  { id: "everyone", label: "Everyone", size: 1, reach: "Anyone on nuclii can see it" },
  { id: "birmingham", label: "Birmingham", size: 0.82, reach: "Only people in Birmingham can see it" },
  { id: "uni", label: "Your uni", size: 0.65, reach: "Only people at your uni can see it" },
  { id: "society", label: "Your society", size: 0.48, reach: "Only your society can see it" },
  { id: "building", label: "Your building", size: 0.32, reach: "Only your building can see it" },
];

type Person = {
  photo: ProfilePhoto;
  // the innermost ring they're inside (index into rings)
  ring: number;
  // where they sit: angle in degrees (0 = right, 90 = down) and radius as a share of the biggest ring
  angle: number;
  radius: number;
  woman: boolean;
  over21: boolean;
};

const people: readonly Person[] = [
  { photo: profilePhotos.whiteMan, ring: 0, angle: 200, radius: 0.91, woman: false, over21: true },
  { photo: profilePhotos.manWhite, ring: 0, angle: 25, radius: 0.91, woman: false, over21: true },
  { photo: profilePhotos.europeMan, ring: 1, angle: 145, radius: 0.735, woman: false, over21: true },
  { photo: profilePhotos.womanWhite, ring: 1, angle: -25, radius: 0.735, woman: true, over21: true },
  { photo: profilePhotos.southAsianMan, ring: 2, angle: 230, radius: 0.565, woman: false, over21: false },
  { photo: profilePhotos.womanAsian, ring: 2, angle: 55, radius: 0.565, woman: true, over21: true },
  { photo: profilePhotos.whiteWoman, ring: 3, angle: 165, radius: 0.4, woman: true, over21: true },
  { photo: profilePhotos.curlyWhiteMan, ring: 3, angle: 15, radius: 0.4, woman: false, over21: false },
  { photo: profilePhotos.asianWoman, ring: 4, angle: 90, radius: 0.24, woman: true, over21: true },
];

function sentence(ring: RingId, women: boolean, over21: boolean) {
  const reach = rings.find((r) => r.id === ring)!.reach;
  if (women && over21) return `${reach}, and only women aged 21+.`;
  if (women) return `${reach}, and only women.`;
  if (over21) return `${reach}, and only if they're 21+.`;
  return `${reach}.`;
}

function Rings({
  selected,
  women,
  over21,
  still,
}: {
  selected: number;
  women: boolean;
  over21: boolean;
  still: boolean;
}) {
  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <div aria-hidden="true" className="@container relative mx-auto aspect-square w-full max-w-[34rem]">
      {/* the reach: one disc, scaled to the chosen ring */}
      <motion.div
        animate={{ scale: rings[selected].size }}
        className="absolute inset-[1%] rounded-full bg-white/[0.07]"
        initial={false}
        transition={{ duration: still ? 0 : 0.6, ease }}
      />

      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
        {rings.map((ring, i) => {
          const inside = i >= selected;
          return (
            <circle
              className="transition-[stroke,stroke-width] duration-500 motion-reduce:transition-none"
              cx="50"
              cy="50"
              fill="none"
              key={ring.id}
              r={49 * ring.size}
              stroke={i === selected ? "#FFFFFF" : inside ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)"}
              strokeDasharray={inside ? undefined : "0.8 1.2"}
              strokeWidth={i === selected ? 0.45 : 0.3}
            />
          );
        })}
      </svg>

      {/* the people, inside or outside the reach */}
      {people.map((person, i) => {
        const radians = (person.angle * Math.PI) / 180;
        const reached = person.ring >= selected && (!women || person.woman) && (!over21 || person.over21);
        return (
          <motion.span
            animate={{ opacity: reached ? 1 : 0.22, scale: reached ? 1 : 0.86 }}
            className="absolute size-[7cqw] overflow-hidden rounded-full border-2 bg-[#2A2B30] transition-colors duration-500"
            initial={false}
            key={i}
            style={{
              left: `${(50 + Math.cos(radians) * 49 * person.radius).toFixed(2)}%`,
              top: `${(50 + Math.sin(radians) * 49 * person.radius).toFixed(2)}%`,
              marginLeft: "-3.5cqw",
              marginTop: "-3.5cqw",
              borderColor: reached ? "#FFFFFF" : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: still ? 0 : 0.45 }}
          >
            <ProfileImage photo={person.photo} />
          </motion.span>
        );
      })}

      {/* ring names, on top of each ring */}
      {rings.map((ring, i) => {
        const inside = i >= selected;
        return (
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-[1.6cqw] py-[0.5cqw] font-display text-[max(0.66rem,2.5cqw)] font-semibold transition-colors duration-500 motion-reduce:transition-none",
              i === selected
                ? "bg-[var(--nuclii-lime)] text-black"
                : inside
                  ? "bg-[#0A0A0B] text-white"
                  : "bg-[#0A0A0B] text-white/35",
            )}
            key={ring.id}
            style={{ top: `${50 - 49 * ring.size}%` }}
          >
            {ring.label}
          </span>
        );
      })}

      {/* the event, in the middle: small enough to sit inside the innermost ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-[2.2cqw] py-[1.5cqw] text-center text-black shadow-[0_16px_32px_-14px_rgba(0,0,0,0.9)]"
        style={{ ...ticketPillStyle, fontSize: "max(0.55rem, 2.1cqw)" }}
      >
        <p className="font-display text-[1.2em] font-bold leading-[1.05] tracking-[-0.02em]">
          Sisters&apos;
          <br />
          Candle Night
        </p>
        <p className="!mt-[0.4em] text-[0.8em] text-black/55">
          Sun 24 May{over21 ? " · 21+" : ""}
          {women ? " · women" : ""}
        </p>
      </div>
    </div>
  );
}

const chipClass = (on: boolean) =>
  cn(
    "inline-flex h-11 items-center gap-2 rounded-none px-4 font-display text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    on ? "bg-[var(--nuclii-lime)] text-black" : "bg-white/[0.08] text-white/80 hover:bg-white/[0.14]",
  );

function ControlSection() {
  const lessMotion = useLessMotion();
  const [selected, setSelected] = useState(1);
  const [women, setWomen] = useState(true);
  const [over21, setOver21] = useState(true);

  return (
    <section
      aria-labelledby="control-heading"
      className="relative overflow-hidden bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(3.5rem,6vw,5rem)] text-white"
      data-analytics-section="home_control"
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-white sm:text-sm">02 control</p>
          <h2
            className="!mt-6 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-white"
            id="control-heading"
          >
            decide who it&apos;s for.
          </h2>
          <p className="!mt-4 max-w-[28rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Open it to everyone, or keep it to Birmingham, your uni, your society or your building. Then customise it
            further. Your event, your people.
          </p>

          <p className="!mt-8 text-xs font-semibold uppercase tracking-[0.08em] text-white/45">how far it reaches</p>
          <div aria-label="How far it reaches" className="!mt-3 flex flex-wrap gap-2.5" role="radiogroup">
            {rings.map((ring, i) => (
              <button
                aria-checked={selected === i}
                className={chipClass(selected === i)}
                key={ring.id}
                onClick={() => setSelected(i)}
                role="radio"
                style={ticketPillStyle}
                type="button"
              >
                {ring.label}
              </button>
            ))}
          </div>

          <p className="!mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-white/45">customise further</p>
          <div className="!mt-3 flex flex-wrap gap-2.5">
            {[
              { label: "21+", on: over21, toggle: () => setOver21((v) => !v) },
              { label: "Women only", on: women, toggle: () => setWomen((v) => !v) },
            ].map(({ label, on, toggle }) => (
              <button
                aria-pressed={on}
                className={chipClass(on)}
                key={label}
                onClick={toggle}
                style={ticketPillStyle}
                type="button"
              >
                {on && <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />}
                {label}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="!mt-6 max-w-[28rem] font-display text-lg font-semibold leading-snug">
            {sentence(rings[selected].id, women, over21)}
          </p>
        </div>

        <Rings over21={over21} selected={selected} still={lessMotion} women={women} />
      </div>
    </section>
  );
}

export { ControlSection };
