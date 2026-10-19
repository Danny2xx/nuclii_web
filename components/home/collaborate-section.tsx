import Image from "next/image";
import {
  BatteryFull,
  Camera,
  Check,
  Crown,
  Headphones,
  House,
  Mail,
  Pencil,
  Plus,
  Signal,
  Wifi,
} from "lucide-react";

import { profilePhotos, ProfileImage } from "@/components/home/profile-photos";
import { cn } from "@/lib/utils";

// Host-side planning: the copy and steps on the left, an event's "collaborate"
// tab in a phone on the right with two glass panels floating over it. Photos
// reuse supplied event photos; people use the supplied profile portraits.

const topics = ["open calls", "skills", "spaces", "invites", "shared planning"] as const;

const steps = [
  { title: "Put the call out", body: "Say what you need." },
  { title: "Find your people", body: "Discover the right fit." },
  { title: "Bring them in", body: "Invite the crew." },
  { title: "Pull it together", body: "Keep everything moving." },
] as const;

const photos = {
  cover: "/images/explore-hover/movies.jpg",
  courtyard: "/images/explore-hover/pop-up.jpg",
};

function FindPeople() {
  return (
    <span className="shrink-0 rounded-full bg-[var(--nuclii-lime)] px-[3cqw] py-[1.6cqw] text-[2.7cqw] font-semibold text-black">
      Find people
    </span>
  );
}

function OpenCallIcon() {
  return (
    <span className="flex size-[9cqw] shrink-0 items-center justify-center rounded-full border border-dashed border-black/35">
      <Plus className="size-[4cqw]" strokeWidth={1.75} />
    </span>
  );
}

// The collaborate tab itself (no phone frame or status bar), for reuse.
const needs = [
  { label: "DJ", icon: Headphones, selected: true },
  { label: "Photographer", icon: Camera },
  { label: "Space", icon: House },
  { label: "Something else", icon: Plus },
];

function CollaborateScreen() {
  return (
    <div className="px-[4.5cqw] pt-[3cqw]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[4cqw]">
        <Image alt="" className="object-cover" fill sizes="18rem" src={photos.cover} />
        <span className="absolute bottom-[2.5cqw] right-[2.5cqw] flex items-center gap-[1cqw] rounded-full border border-white/40 bg-black/45 px-[2.4cqw] py-[1cqw] text-[2.6cqw] text-white backdrop-blur-sm">
          <Pencil className="size-[2.6cqw]" strokeWidth={2} /> Edit
        </span>
      </div>

      <p className="!mt-[3.5cqw] flex items-center justify-between">
        <span className="font-display text-[6.2cqw] font-bold leading-none tracking-[-0.02em]">Movie Night</span>
        <span className="rounded-full bg-black/[0.06] px-[2.4cqw] py-[1cqw] text-[2.6cqw] text-black/60">Draft</span>
      </p>
      <p className="!mt-[1.5cqw] text-[3cqw] text-black/55">Cannon Hill Park · Sun 20 Dec · 6:00 PM</p>

      <div className="!mt-[3.5cqw] flex justify-between border-b border-black/10 text-[3.1cqw] text-black/55">
        {["Overview", "Collaborate", "Plan", "Tickets"].map((tab) => (
          <span
            className={cn(
              "pb-[2cqw]",
              tab === "Collaborate" && "border-b-2 border-[var(--nuclii-lime)] font-semibold text-[#6E8A0C]",
            )}
            key={tab}
          >
            {tab}
          </span>
        ))}
      </div>

      <p className="!mt-[4cqw] text-[4.4cqw] font-bold leading-none">What do you need?</p>
      <p className="!mt-[1.2cqw] text-[2.9cqw] text-black/55">Add open calls or invite people directly.</p>
      <div className="!mt-[3cqw] grid grid-cols-4 gap-[2cqw]">
        {needs.map(({ label, icon: Icon, selected }) => (
          <span
            className={cn(
              "flex aspect-[0.9] flex-col items-center justify-center gap-[1.5cqw] rounded-[3cqw] border text-center text-[2.4cqw] leading-tight",
              selected ? "border-[var(--nuclii-lime)] bg-[#EEF6D6]" : "border-black/10",
            )}
            key={label}
          >
            <Icon className="size-[5cqw]" strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </div>

      <p className="!mt-[4.5cqw] flex items-center justify-between leading-none">
        <span className="text-[4.2cqw] font-bold">Collaborators</span>
        <span className="text-[2.9cqw] font-semibold text-[#6E8A0C]">Manage</span>
      </p>
      <div className="!mt-[2.5cqw] flex flex-col gap-[2cqw]">
        {["DJ", "Photography"].map((role) => (
          <div className="flex items-center gap-[3cqw] rounded-[3cqw] border border-black/10 p-[2.5cqw]" key={role}>
            <OpenCallIcon />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[3.2cqw] font-semibold">{role}</span>
              <span className="block text-[2.7cqw] text-black/50">Open call</span>
            </span>
            <FindPeople />
          </div>
        ))}
        <div className="flex items-center gap-[3cqw] rounded-[3cqw] border border-black/10 p-[2.5cqw]">
          <span className="relative size-[9cqw] shrink-0 overflow-hidden rounded-[2cqw]">
            <Image alt="" className="object-cover" fill sizes="3rem" src={photos.courtyard} />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[3.2cqw] font-semibold">Space</span>
            <span className="block text-[2.7cqw] text-black/50">The Courtyard</span>
          </span>
          <span className="rounded-full bg-[#EEF6D6] px-[2.4cqw] py-[1.4cqw] text-[2.5cqw] text-[#5E7A08]">Confirmed</span>
          <span className="rounded-full border border-black/15 px-[3cqw] py-[1.4cqw] text-[2.7cqw] font-medium">View</span>
        </div>
      </div>
    </div>
  );
}

function CollaboratePhone() {

  return (
    <div
      aria-label="The collaborate tab of a draft event, Movie Night: open calls for a DJ and a photographer, and The Courtyard confirmed as the space"
      className="@container relative aspect-[9/19.5] w-full"
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-[12%/5.5%] border-[1.5px] border-black bg-white text-black"
      >
        {/* status bar + dynamic island */}
        <div className="flex items-center justify-between px-[7cqw] pt-[4cqw] text-[3.4cqw] font-semibold">
          <span>9:41</span>
          <span className="h-[6.5cqw] w-[26cqw] rounded-full bg-black" />
          <span className="flex items-center gap-[1.2cqw]">
            <Signal className="size-[3.6cqw]" strokeWidth={2.5} />
            <Wifi className="size-[3.6cqw]" strokeWidth={2.5} />
            <BatteryFull className="size-[4.6cqw]" strokeWidth={2} />
          </span>
        </div>

        <CollaborateScreen />
      </div>
    </div>
  );
}

// Glass panel floating over the phone: see-through white with a blur, so the
// screen and the black page read through it.
const glass =
  "rounded-[1.4em] border border-white/45 bg-white/65 p-[1.1em] text-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl";
// same look without the blur, for places where the panel moves (blur behind
// moving content is re-rendered every frame)
const solidPanel =
  "rounded-[1.4em] border border-white/60 bg-white/[0.93] p-[1.1em] text-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]";

const crew = [
  { name: "You", role: "Host", photo: profilePhotos.whiteMan, status: "host" },
  { name: "Femi", role: "DJ selector", photo: profilePhotos.curlyWhiteMan, status: "joined" },
  { name: "Tami", role: "Photography", photo: profilePhotos.womanAsian, status: "invited" },
  { name: "The Courtyard", role: "Venue", photo: null, status: "confirmed" },
] as const;

const statusPill = {
  host: "border-black/10 bg-black/[0.06] text-black/60",
  joined: "border-[#A3BF1C] text-[#5E7A08]",
  invited: "border-[#A3BF1C] text-[#5E7A08]",
  confirmed: "border-[#A3BF1C] text-[#5E7A08]",
};

function CrewPanel({ solid = false }: { solid?: boolean }) {
  return (
    <div aria-hidden="true" className={solid ? solidPanel : glass}>
      <p className="text-[1.15em] font-bold leading-none">The line up</p>
      <ul className="mt-[0.8em] flex flex-col divide-y divide-black/10">
        {crew.map((person) => (
          <li className="flex items-center gap-[0.6em] py-[0.5em]" key={person.name}>
            {person.photo ? (
              <span className="relative size-[2.2em] shrink-0 overflow-hidden rounded-full border-[1.5px] border-white">
                <ProfileImage photo={person.photo} />
              </span>
            ) : (
              <span className="relative size-[2.2em] shrink-0 overflow-hidden rounded-[0.5em]">
                <Image alt="" className="object-cover" fill sizes="2.5rem" src={photos.courtyard} />
              </span>
            )}
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate font-semibold">{person.name}</span>
              <span className="block truncate text-[0.85em] text-black/55">{person.role}</span>
            </span>
            {person.status === "host" && <Crown className="size-[1em] text-[#E0A21B]" fill="currentColor" strokeWidth={1.5} />}
            <span
              className={cn(
                "flex shrink-0 items-center gap-[0.3em] rounded-full border px-[0.6em] py-[0.25em] text-[0.8em] capitalize",
                statusPill[person.status],
              )}
            >
              {person.status === "invited" ? (
                <Mail className="size-[1em]" strokeWidth={1.75} />
              ) : person.status !== "host" ? (
                <Check className="size-[1em]" strokeWidth={2.5} />
              ) : null}
              {person.status}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-[0.6em] py-[0.5em]">
          <span className="flex size-[2.2em] shrink-0 items-center justify-center rounded-full border border-dashed border-black/35">
            <Plus className="size-[1em]" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block font-semibold">Lighting</span>
            <span className="block text-[0.85em] text-black/55">Open call</span>
          </span>
          <span className="shrink-0 rounded-full bg-[var(--nuclii-lime)] px-[0.7em] py-[0.35em] text-[0.8em] font-semibold">
            Find people
          </span>
        </li>
      </ul>
    </div>
  );
}

const checklist = [
  { label: "Space confirmed", done: true },
  { label: "DJ joined", done: true },
  { label: "Photography invited", done: false },
  { label: "Final event details", done: false },
] as const;

function ComingTogetherPanel({ solid = false }: { solid?: boolean }) {
  return (
    <div aria-hidden="true" className={solid ? solidPanel : glass}>
      <p className="text-[1.15em] font-bold leading-none">Coming together</p>
      <ul className="mt-[0.8em] flex flex-col gap-[0.55em]">
        {checklist.map((item) => (
          <li className={cn("flex items-center gap-[0.55em]", !item.done && "text-black/55")} key={item.label}>
            {item.done ? (
              <span className="flex size-[1.25em] items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-white">
                <Check className="size-[0.8em]" strokeWidth={3} />
              </span>
            ) : (
              <span className="size-[1.25em] rounded-full border-[1.5px] border-black/25" />
            )}
            {item.label}
          </li>
        ))}
      </ul>
      <span className="mt-[1em] flex items-center justify-center gap-[0.4em] rounded-full bg-[var(--nuclii-lime)] py-[0.6em] font-semibold">
        <Plus className="size-[1em]" strokeWidth={2.25} /> Invite someone
      </span>
    </div>
  );
}

function CollaborateSection() {
  return (
    <section
      aria-labelledby="collaborate-heading"
      className="bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(4rem,7vw,6.5rem)] text-white"
      data-analytics-section="home_collaborate"
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
        <div>
          <p className="inline-block border-b-2 border-[#35A9E0] pb-1 text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm">
            COLLABORATE
          </p>
          <h2
            className="!mt-6 font-display text-[clamp(2.25rem,3.3vw,3.05rem)] !font-bold leading-[1.06] tracking-[-0.03em] !text-white"
            id="collaborate-heading"
          >
            You&apos;ve got the idea. Find the people who can pull it off.
          </h2>
          <p className="!mt-5 max-w-[30rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Open a call, find the right people and spaces, and keep the plan moving in one place.
          </p>
          <ul aria-label="what you can do" className="!mt-6 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <li className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/80" key={topic}>
                {topic}
              </li>
            ))}
          </ul>

          <ol className="!mt-10 flex flex-col gap-5">
            {steps.map((step, index) => (
              <li className="flex items-center gap-4" key={step.title}>
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    index === 0
                      ? "border-[var(--nuclii-lime)] bg-[var(--nuclii-lime)] text-black"
                      : "border-white/20 text-white/80",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-lg font-semibold">{step.title}</span>
                  <span className="block text-sm text-white/55">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* phone with glass panels floating over its edges */}
        <div className="@container relative mx-auto aspect-[0.72] w-full max-w-[46rem] sm:aspect-[0.88] lg:aspect-[0.92]">
          <div className="absolute left-1/2 top-0 w-[64%] -translate-x-1/2 sm:w-[52%] lg:left-[54%] lg:w-[50%]">
            <CollaboratePhone />
          </div>
          <div className="absolute left-0 top-[54%] w-[52%] text-[max(0.6rem,1.9cqw)] sm:top-[18%] sm:w-[44%] lg:top-[20%] lg:w-[33%] lg:text-[max(0.6rem,1.55cqw)]">
            <CrewPanel />
          </div>
          <div className="absolute bottom-0 right-0 w-[48%] text-[max(0.6rem,1.9cqw)] sm:bottom-[6%] sm:w-[42%] lg:bottom-[14%] lg:w-[29%] lg:text-[max(0.6rem,1.55cqw)]">
            <ComingTogetherPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

export { CollaborateScreen, CollaborateSection, ComingTogetherPanel, CrewPanel, steps, topics };
