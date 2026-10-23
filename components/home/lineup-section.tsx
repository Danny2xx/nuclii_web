"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import { Check, House } from "lucide-react";

import { profilePhotos, ProfileImage, type ProfilePhoto } from "@/components/home/profile-photos";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { cn } from "@/lib/utils";

// 03 collaborate: one event, built by several people. The host's open call
// sits beside the finished poster with its line-up filled. It holds still;
// the only motion is the "go live" stamp landing once. It's the night the
// circle chat (04) is going to: a warehouse rave in Digbeth, Saturday at 10.

const ORANGE = "#FFA200";

type Member = {
  slot: string;
  name: string;
  role: string;
  photo?: ProfilePhoto;
};

const crew: readonly Member[] = [
  { slot: "Venue", name: "The Courtyard", role: "Venue · Digbeth" },
  { slot: "DJ", name: "Marco", role: "DJ selector", photo: profilePhotos.europeMan },
  { slot: "Photography", name: "Jess", role: "Photographer", photo: profilePhotos.womanWhite },
  { slot: "Co-host", name: "Maya", role: "Co-host", photo: profilePhotos.womanAsian },
];

// the poster's art ends 46cqw down; the tear and its notches sit there
const ART = "46cqw";
const posterNotches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.8rem at ${x} ${ART}, transparent 98%, #000 100%)`,
);
const posterMask: CSSProperties = {
  maskImage: posterNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: posterNotches.join(", "),
  WebkitMaskComposite: "source-in",
};

function Face({ member, className }: { member: Member; className?: string }) {
  return (
    <span className={cn("relative block size-9 shrink-0 overflow-hidden rounded-full bg-[#2A2B30]", className)}>
      {member.photo ? (
        <ProfileImage photo={member.photo} />
      ) : (
        <span className="flex size-full items-center justify-center bg-[#26282F] text-white">
          <House aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </span>
  );
}

function LineupRow({ member }: { member: Member }) {
  return (
    <li className="flex h-14 items-center gap-3 bg-white/[0.07] px-3.5">
      <Face member={member} />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate font-display text-[0.95rem] font-semibold text-white">{member.name}</span>
        <span className="block truncate text-xs text-white/50">{member.role}</span>
      </span>
      <span className="flex size-5 items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-black">
        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
      </span>
    </li>
  );
}

function LineupSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.45, once: true });
  const lessMotion = useLessMotion();
  const stamped = inView || lessMotion;

  return (
    <section
      aria-labelledby="collaborate-heading"
      className="relative overflow-hidden bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(3.5rem,6vw,5rem)] text-white"
      data-analytics-section="home_collaborate"
    >
      <div className="mx-auto grid w-full max-w-[80rem] items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* the words and the call */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm">
            03 collaborate
          </p>
          <h2
            className="!mt-6 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-white"
            id="collaborate-heading"
          >
            find the people who can pull it off.
          </h2>
          <p className="!mt-4 max-w-[28rem] text-base leading-relaxed text-white/65 sm:text-lg">
            Put a call out for a venue, a DJ, a photographer or a co-host. See who&apos;s up for it and add them to
            your line-up.
          </p>

          {/* the open call */}
          <div
            className="!mt-8 max-w-[24rem] -rotate-[1.5deg] bg-white px-6 py-5 text-black shadow-[0_20px_44px_-24px_rgba(0,0,0,0.35)]"
            style={ticketPillStyle}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: ORANGE }}>
              open call
            </p>
            <p className="!mt-2 font-display text-lg font-semibold leading-snug">
              Looking for a venue, a DJ, a photographer and a co-host in Digbeth.
            </p>
            <p className="!mt-3 border-t-2 border-dotted border-black/15 pt-3 text-sm text-black/55">
              <span className="font-semibold tabular-nums text-black">{crew.length}</span> of {crew.length} spots
              filled · Sat 10pm
            </p>
          </div>
        </div>

        {/* the finished poster */}
        <div className="relative py-4" ref={stageRef}>
          <div className="@container relative mx-auto w-full max-w-[27rem]">
            <div
              aria-label="Event poster: Warehouse Rave, Saturday 10pm, The Courtyard, Digbeth. Line-up: hosted by you, with The Courtyard, Marco, Jess and Maya. Ready to go live."
              className="relative bg-[#18191D] text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
              role="img"
              style={posterMask}
            >
              {/* art */}
              <div className="relative overflow-hidden" style={{ height: ART }}>
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 27rem, 100vw"
                  src="/images/explore-hover/rave.jpg"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#18191D] via-[#18191D]/30 to-transparent" />
                <span className="absolute right-[5cqw] top-[5cqw] bg-white px-[2.4cqw] py-[1cqw] font-display text-[3cqw] font-bold uppercase tracking-[0.06em] text-black">
                  Sat · 10pm
                </span>
                <div className="absolute inset-x-[6cqw] bottom-[4cqw]">
                  <p className="font-display text-[10cqw] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
                    Warehouse Rave
                  </p>
                  <p className="!mt-[1.6cqw] text-[3.6cqw] text-white/70">
                    rave · The Courtyard, Digbeth
                  </p>
                </div>
              </div>

              {/* the tear */}
              <div className="mx-[1.2rem] border-t-2 border-dashed border-white/20" />

              {/* line-up */}
              <div className="relative p-[1.2rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">line-up</p>
                <ul className="!mt-3 flex flex-col gap-2">
                  <li className="flex h-14 items-center gap-3 px-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--nuclii-lime)] font-display text-sm font-bold text-black">
                      you
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-[0.95rem] font-semibold">Hosted by you</span>
                      <span className="block text-xs text-white/50">Host</span>
                    </span>
                  </li>
                  {crew.map((member) => (
                    <LineupRow key={member.slot} member={member} />
                  ))}
                </ul>

                {/* the one moving part: the stamp lands once as the poster comes into view */}
                <motion.span
                  animate={stamped ? { opacity: 1, scale: 1, rotate: -8 } : { opacity: 0, scale: 1.5, rotate: -14 }}
                  className="absolute -top-5 right-[1.2rem] bg-[var(--nuclii-lime)] px-3.5 py-2 font-display text-sm font-bold uppercase tracking-[0.04em] text-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]"
                  initial={false}
                  style={ticketPillStyle}
                  transition={{ duration: lessMotion ? 0 : 0.4, delay: lessMotion ? 0 : 0.3, ease: [0.2, 1.4, 0.4, 1] }}
                >
                  go live
                </motion.span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export { LineupSection };
