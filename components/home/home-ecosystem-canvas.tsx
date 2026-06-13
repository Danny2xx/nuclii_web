import React from "react";
import {
  LockKeyhole,
  Music2,
  Sparkles,
  TicketCheck,
  UsersRound,
} from "lucide-react";

import { HeroEmailCapture } from "@/components/home/hero-email-capture";
import { InteractiveHomeMap } from "@/components/home/interactive-home-map";
import { StackedRoleCards } from "@/components/home/stacked-role-cards";
import { RotatingWord } from "@/components/motion/rotating-word";
import { cn } from "@/lib/utils";

const reelCards = [
  {
    title: "Workshop",
    description: "Skill sessions, creative classes, and drop-in learning.",
    icon: Sparkles,
    video: "/videos/workshop.mp4",
    wide: false,
  },
  {
    title: "Club night",
    description: "Safer access, location reveal, and QR flows.",
    icon: Music2,
    video: "/videos/nightlife.mp4",
    wide: true,
  },
  {
    title: "Society moment",
    description: "Community events, mixers, and member-first experiences.",
    icon: UsersRound,
    video: "/videos/society.mp4",
    wide: false,
  },
  {
    title: "Pickup window",
    description: "Food drops, collection slots, and timed service windows.",
    icon: TicketCheck,
    video: "/videos/pickup.mp4",
    wide: false,
  },
  {
    title: "Private reveal",
    description: "Area-first discovery with location revealed at the right time.",
    icon: LockKeyhole,
    video: "/videos/reveal.mp4",
    wide: false,
  },
] as const;

function HomeEcosystemCanvas() {
  return (
    <div className="nuclii-container relative pb-0 pt-10 sm:pt-14 lg:pt-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <IntroBlock />
        {/* Mobile — smaller cards that fit 390px */}
        <div className="flex items-center justify-center lg:hidden">
          <StackedRoleCards size="sm" />
        </div>
        {/* Desktop — full-size cards */}
        <div className="hidden items-start justify-end pt-4 lg:flex">
          <StackedRoleCards size="md" />
        </div>
      </section>

      <UseCaseReels />
      <InteractiveHomeMap />
    </div>
  );
}

function IntroBlock() {
  return (
    <section aria-labelledby="home-hero-title" className="relative z-10">
      {/* Editorial display headline inspired by large typographic layouts */}
      <h1
        id="home-hero-title"
        className="font-extrabold leading-[0.9] tracking-tight text-foreground"
        style={{ fontSize: "clamp(3.2rem, 7.5vw, 6.5rem)" }}
      >
        {/* Line 1 */}
        <span className="block">Every</span>

        {/* Line 2 — rotating accent word */}
        <span className="block">
          <RotatingWord />
        </span>

        {/* Line 3 */}
        <span className="block">Starts</span>

        {/* Line 4 — large blue dot + final word */}
        <span className="flex items-center gap-[0.18em]">
          <span
            aria-hidden="true"
            className="inline-block h-[0.5em] w-[0.5em] shrink-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #7aa8ff, #3d6fe8)",
            }}
          />
          Here.
        </span>
      </h1>

      <p className="mt-6 max-w-xs text-[0.95rem] leading-7 text-muted-foreground sm:max-w-sm">
        Discover and host real-world experiences near you, without followers,
        group chats, or social pressure.
      </p>

      <div className="mt-6">
        <HeroEmailCapture />
      </div>
    </section>
  );
}

function UseCaseReels() {
  // Duplicate for seamless infinite loop
  const loopCards = [...reelCards, ...reelCards];

  return (
    <section className="mt-8 sm:mt-10" id="use-case-reels">
      {/* Minimal eyebrow */}
      <p className="nuclii-container mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
        Experiences on Nuclii
      </p>

      {/* Auto-scrolling marquee — pauses when hovered */}
      <div className="group/marquee relative overflow-hidden">
        <div
          className="nuclii-infinite-scroll flex gap-4 group-hover/marquee:[animation-play-state:paused]"
        >
          {loopCards.map((card, index) => (
            <ReelCard
              key={`${card.title}-${index}`}
              description={card.description}
              icon={card.icon}
              title={card.title}
              video={card.video}
              wide={card.wide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReelCard({
  title,
  description,
  icon: Icon,
  video,
  wide,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>;
  video: string;
  wide: boolean;
}) {
  return (
    <article
      className={cn(
        "nuclii-home-reel relative shrink-0 overflow-hidden rounded-[2rem] border border-border bg-[#050506] shadow-card",
        wide ? "h-[420px] w-[380px]" : "h-[400px] w-[300px]",
      )}
    >
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        src={video}
      />
      {/* Gradient overlay so label is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary/80">
              {title}
            </p>
            <p className="mt-1 text-sm leading-5 text-white/70">
              {description}
            </p>
          </div>
          <div className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-black/50 backdrop-blur">
            <Icon aria-hidden="true" className="size-4 text-white/80" />
          </div>
        </div>
      </div>
    </article>
  );
}

export { HomeEcosystemCanvas };
