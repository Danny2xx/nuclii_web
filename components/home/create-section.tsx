"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

// No create-section photo folder was supplied, so these reuse supplied photos
// that suit a DJ night; swap a path to change one.
const eventPhotos = {
  hero: "/images/categories/after-dark.jpg",
  vibe: [
    "/images/explore-hover/rave.jpg",
    "/images/categories/outside.jpg",
    "/images/categories/lowkey-low-effort.jpg",
    "/images/categories/for-creatives.jpg",
  ],
  photoLed: "/images/explore-hover/rave.jpg",
  editorial: "/images/categories/outside.jpg",
};

type LookId = "photo-led" | "poster" | "minimal" | "editorial";

const lookNames: Record<LookId, string> = {
  "photo-led": "photo-led",
  poster: "poster",
  minimal: "minimal",
  editorial: "editorial",
};

// The event page's hero in each of the four looks from the cards alongside.
function PhoneHero({ id }: { id: LookId }) {
  if (id === "photo-led") {
    return (
      <>
        <Image alt="" className="object-cover" fill sizes="20rem" src={eventPhotos.hero} />
        <span className="absolute bottom-[3cqw] left-[3cqw] rounded-full bg-black/55 px-[2.6cqw] py-[1cqw] text-[3cqw] text-white">
          music · open decks
        </span>
      </>
    );
  }
  if (id === "poster") {
    return (
      <div className="flex size-full flex-col justify-between bg-[#2328B5] p-[5cqw] pt-[14cqw] font-display text-white">
        <span className="flex justify-between text-[3.2cqw] opacity-85">
          <span>£8</span>
          <span>23.05</span>
        </span>
        <span className="text-[13cqw] font-extrabold uppercase leading-[0.88] tracking-[-0.02em]">
          Open
          <br />
          Decks
        </span>
        <span className="flex justify-between text-[3cqw] font-semibold uppercase">
          <span>Digbeth</span>
          <span>20:00 – 02:00</span>
        </span>
      </div>
    );
  }
  if (id === "minimal") {
    return (
      <div className="relative size-full bg-[#DCE6F6] bg-[radial-gradient(circle_at_50%_46%,#F6727A_0%,#F7A7B0_26%,transparent_56%)]">
        <span className="absolute inset-x-[5cqw] bottom-[5cqw] flex items-end justify-between font-display text-[3.2cqw] font-semibold uppercase leading-tight">
          <span>
            Open Decks
            <br />
            23.05
          </span>
          <span>Digbeth</span>
        </span>
      </div>
    );
  }
  return (
    <div className="relative size-full bg-[#EBC6E7]">
      <span className="absolute left-[5cqw] top-[15cqw] font-display text-[11cqw] font-medium leading-[0.95] tracking-[-0.03em]">
        Open
        <br />
        Decks
      </span>
      <span className="absolute right-[5cqw] top-[28cqw] rounded-full border border-black/60 px-[2.4cqw] py-[0.6cqw] text-[3cqw]">
        23.05
      </span>
      <span className="absolute inset-x-[5cqw] bottom-[5cqw] h-[38%] overflow-hidden rounded-[2cqw]">
        <Image alt="" className="object-cover grayscale" fill sizes="16rem" src={eventPhotos.editorial} />
      </span>
    </div>
  );
}

// A full event page, as a host would publish it: every detail a guest needs
// to decide, plus the actions to join, share and save.
// The event page itself (no phone frame), so the make chapter can reuse it.
function EventScreen({ look }: { look: LookId }) {
  return (
    <div className="px-[4.5cqw] pt-[12cqw]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[5cqw]">
        {/* the same event in each look; the chosen one crossfades in */}
        {(["photo-led", "poster", "minimal", "editorial"] as const).map((id) => (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none",
              look === id ? "opacity-100" : "opacity-0",
            )}
            key={id}
          >
            <PhoneHero id={id} />
          </div>
        ))}
        <span className="absolute inset-x-[3cqw] top-[3cqw] flex justify-between">
          <span className="flex size-[8cqw] items-center justify-center rounded-full bg-white/90">
            <ChevronLeft className="size-[5cqw]" strokeWidth={2} />
          </span>
          <span className="flex gap-[2cqw]">
            <span className="flex size-[8cqw] items-center justify-center rounded-full bg-white/90">
              <Share2 className="size-[4.2cqw]" strokeWidth={2} />
            </span>
            <span className="flex size-[8cqw] items-center justify-center rounded-full bg-white/90">
              <Heart className="size-[4.2cqw]" strokeWidth={2} />
            </span>
          </span>
        </span>
      </div>

      <p className="!mt-[4cqw] font-display text-[7cqw] font-bold leading-none tracking-[-0.02em]">Open Decks</p>
      <p className="!mt-[2.5cqw] flex items-center gap-[2cqw] text-[3.3cqw]">
        <span className="flex size-[6cqw] items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-[2.6cqw] font-bold">
          SS
        </span>
        hosted by <span className="font-semibold">Southside Sound</span>
      </p>

      <div className="!mt-[3.5cqw] flex flex-col gap-[2.4cqw] text-[3.4cqw] leading-none">
        <p className="flex items-center gap-[2.5cqw]">
          <MapPin className="size-[4.4cqw] shrink-0" strokeWidth={1.75} />
          Digbeth, Birmingham
        </p>
        <p className="flex items-center gap-[2.5cqw]">
          <CalendarDays className="size-[4.4cqw] shrink-0" strokeWidth={1.75} />
          Sat, 23 May
          <span className="ml-auto">20:00 – 02:00</span>
        </p>
        <p className="flex items-center gap-[2.5cqw]">
          <Ticket className="size-[4.4cqw] shrink-0" strokeWidth={1.75} />
          from £8
        </p>
        <p className="flex items-center gap-[2.5cqw]">
          <ShieldCheck className="size-[4.4cqw] shrink-0" strokeWidth={1.75} />
          18+ · open to all
        </p>
      </div>

      <p className="!mt-[3.5cqw] text-[3.1cqw] leading-snug text-black/65">
        Bring a USB, put your name down on the night and play a 30-minute set. Decks
        provided, first-timers welcome.
      </p>

      <span className="!mt-[4cqw] flex h-[10cqw] items-center justify-center rounded-[3cqw] bg-black text-[3.6cqw] font-semibold text-white">
        RSVP
      </span>

      <p className="!mt-[5cqw] font-display text-[4.4cqw] font-semibold leading-none">the vibe</p>
      <div className="!mt-[2.5cqw] -mr-[4.5cqw] flex gap-[2cqw]">
        {eventPhotos.vibe.map((src) => (
          <span className="relative aspect-square w-[21cqw] shrink-0 overflow-hidden rounded-[2.5cqw]" key={src}>
            <Image alt="" className="object-cover" fill sizes="5rem" src={src} />
          </span>
        ))}
      </div>
    </div>
  );
}

function EventPhone({ look }: { look: LookId }) {
  return (
    <div
      aria-label={`An event page on nuclii in the ${lookNames[look]} style: Open Decks, hosted by Southside Sound in Digbeth, Birmingham, Saturday 23 May, 20:00 to 02:00, from £8, 18 and over, with an RSVP button`}
      className="relative mx-auto aspect-[9/19] w-full rounded-[14%/6.6%] border border-white/15 bg-[#16171B] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      role="img"
    >
      <div
        aria-hidden="true"
        className="@container relative size-full overflow-hidden rounded-[11.5%/5.4%] bg-white text-black"
      >
        {/* dynamic island */}
        <span className="absolute left-1/2 top-[2.4cqw] z-10 h-[6.5cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-black" />

        <EventScreen look={look} />
      </div>
    </div>
  );
}


// The four looks a host can pick for the same event page. Positions follow the
// layout reference (% of the collage box).
const looks: readonly {
  id: LookId;
  number: string;
  name: string;
  className: string;
  place: string;
}[] = [
  { id: "photo-led", number: "01", name: "Photo-led", className: "bg-[#6D6A3C] text-white", place: "left-[25%] top-[2%] w-[41%] h-[42%] z-[1]" },
  { id: "poster", number: "02", name: "Poster", className: "bg-[#CFDFF6] text-black", place: "left-[1%] top-[33%] w-[40%] h-[61%] z-[2]" },
  { id: "minimal", number: "03", name: "Minimal", className: "bg-[#DCE6F6] text-black", place: "left-[69%] top-[10%] w-[30%] h-[52%] z-[1]" },
  { id: "editorial", number: "04", name: "Editorial", className: "bg-[#EBC6E7] text-black", place: "left-[46%] top-[54%] w-[43%] h-[45%] z-[3]" },
];

function LookArt({ id }: { id: LookId }) {
  if (id === "photo-led") {
    return (
      <span className="absolute bottom-0 right-0 h-[62%] w-[62%] overflow-hidden">
        <Image alt="" className="object-cover" fill sizes="14rem" src={eventPhotos.photoLed} />
      </span>
    );
  }
  if (id === "poster") {
    return (
      <span className="absolute bottom-[7%] left-[12%] flex h-[62%] w-[72%] -rotate-3 flex-col justify-between rounded-md bg-[#2328B5] p-[7%] font-display text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)]">
        <span className="flex justify-between text-[0.55rem] opacity-80">
          <span>£8</span>
          <span>23.05</span>
        </span>
        <span className="text-[clamp(1.1rem,2.3vw,2rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
          Rooftop
          <br />
          Radio
        </span>
        <span className="text-[0.6rem] font-semibold">23.05</span>
      </span>
    );
  }
  if (id === "minimal") {
    return (
      <>
        <span className="absolute left-1/2 top-[52%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#F6727A_0%,#F7A7B0_45%,transparent_70%)] blur-md" />
        {/* sits above where the Editorial card overlaps this one */}
        <span className="absolute inset-x-[8%] bottom-[20%] flex items-end justify-between font-display text-[0.55rem] font-semibold uppercase leading-tight">
          <span>
            Rooftop Radio
            <br />
            23.05
          </span>
          <span>Digbeth</span>
        </span>
      </>
    );
  }
  return (
    <>
      <span className="absolute left-[8%] top-[30%] font-display text-[clamp(1.1rem,2.3vw,2.1rem)] font-medium leading-[0.95] tracking-[-0.03em]">
        Rooftop
        <br />
        Radio
      </span>
      <span className="absolute right-[8%] top-[45%] rounded-full border border-black/60 px-2 text-[0.6rem]">23.05</span>
      <span className="absolute bottom-0 left-[8%] right-[8%] h-[34%] overflow-hidden rounded-t-md">
        <Image alt="" className="object-cover grayscale" fill sizes="16rem" src={eventPhotos.editorial} />
      </span>
    </>
  );
}

function CreateSection() {
  // hovering, tapping or focusing a look shows it on the phone, which keeps
  // the last one shown; the cards themselves carry no selection marker
  const [shownLook, setShownLook] = useState<LookId>("photo-led");

  return (
    <section
      aria-labelledby="create-heading"
      className="bg-[#0A0A0B] px-[var(--container-x)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,6vw,5rem)] text-white"
      data-analytics-section="home_create"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="inline-block border-b-2 border-[#F04A23] pb-1 text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm">
          CREATE
        </p>

        {/* phones read headline → event page → looks; desktop puts the phone on the left */}
        <div className="!mt-10 grid gap-12 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.75fr)] lg:gap-x-16">
          <div className="text-center lg:col-start-2 lg:row-start-1">
            <h2
              className="font-display text-[clamp(2rem,3.4vw,3.25rem)] !font-semibold leading-[1.1] tracking-[-0.02em] !text-white text-balance"
              id="create-heading"
            >
              <span className="text-[var(--nuclii-lime)]">simple</span> where it should be.
              <br />
              <span className="text-[var(--nuclii-lime)]">flexible</span> where it matters.
            </h2>
            <p className="!mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
              Choose the look, the audience and the details.
              <br />
              Keep it simple, change it when <span className="text-[var(--nuclii-lime)]">you</span> need to.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[19rem] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-[21rem] lg:self-center">
            <EventPhone look={shownLook} />
          </div>

          {/* the same event page in four looks */}
          <ul
            aria-label="event page looks"
            className="relative mx-auto aspect-[1.45] w-full max-w-[44rem] lg:col-start-2 lg:row-start-2"
          >
            {looks.map((look) => {
              return (
                <li className={cn("absolute", look.place)} key={look.id}>
                  <button
                    aria-pressed={shownLook === look.id}
                    className={cn(
                      "relative flex size-full flex-col justify-start overflow-hidden rounded-none p-[5%] text-left shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none",
                      look.className,
                    )}
                    onClick={() => setShownLook(look.id)}
                    onFocus={() => setShownLook(look.id)}
                    onPointerEnter={() => setShownLook(look.id)}
                    type="button"
                  >
                    <span className="relative z-10 block leading-tight">
                      <span className="block text-[0.6rem] opacity-70">{look.number}</span>
                      <span className="block font-display text-[clamp(0.8rem,1.1vw,1rem)] font-medium">{look.name}</span>
                    </span>
                    <LookArt id={look.id} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { CreateSection, EventScreen, LookArt, looks, lookNames, PhoneHero, type LookId };
