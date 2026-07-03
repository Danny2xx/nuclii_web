"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";

import { WaitlistForm } from "@/components/home/waitlist-form";
import { CheckIcon } from "@/components/ui/icons";
import {
  Mascot,
  MascotFace,
  MASCOT_TONES,
  Sparkles,
  type MascotTone,
} from "@/components/partner/mascot";
import { cn } from "@/lib/utils";

type RoleValue = "host" | "venue-business" | "talent-creative";

type Section = {
  id: string;
  label: string;
  accent: string;
  tone: MascotTone;
  description: string;
  features: { title: string; detail: string }[];
  role: RoleValue;
  cta: string;
  image: { src: string; alt: string; width: number; height: number };
  flip?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: "hosts",
    label: "hosts",
    accent: "#DA4F28", // the red host mascot in the photo
    tone: MASCOT_TONES.host,
    description: "create unforgettable events and grow your community with powerful tools and insights.",
    features: [
      { title: "event creation & management", detail: "plan and publish events easily" },
      { title: "seamless ticketing", detail: "manage sales and attendees in one place" },
      { title: "grow your audience", detail: "reach new communities and fans" },
      { title: "performance insights", detail: "track what matters and improve" },
    ],
    role: "host",
    cta: "partner as a host",
    image: {
      src: "/partner/host.png",
      alt: "a nuclii host's open-air paint-and-sip laid out under park trees — easels, fresh canvases and a set table waiting for guests",
      width: 736,
      height: 981,
    },
  },
  {
    id: "spaces",
    label: "spaces",
    accent: "#8FC9E8", // the sky-blue venue mascot in the photo
    tone: MASCOT_TONES.space,
    description: "showcase your venue and connect with hosts looking for the perfect space.",
    features: [
      { title: "increase visibility", detail: "get discovered by quality event hosts" },
      { title: "booking requests", detail: "receive and manage inquiries easily" },
      { title: "availability management", detail: "keep your calendar up to date" },
      { title: "collaborate with hosts", detail: "build lasting event relationships" },
    ],
    role: "venue-business",
    cta: "partner as a space",
    image: {
      src: "/partner/venue.png",
      alt: "a nuclii venue lighting up a city bus-stop billboard, a warm restaurant terrace glowing behind it",
      width: 687,
      height: 811,
    },
    flip: true,
  },
  {
    id: "talent",
    label: "talent",
    accent: "#E9C44A", // the yellow talent mascot in the photo
    tone: MASCOT_TONES.talent,
    description: "showcase your skills, get discovered, and book more opportunities.",
    features: [
      { title: "showcase your services", detail: "highlight what makes you unique" },
      { title: "get discovered", detail: "connect with hosts and venues" },
      { title: "collaboration requests", detail: "receive and respond to invites" },
      { title: "more opportunities", detail: "book gigs and grow your career" },
    ],
    role: "talent-creative",
    cta: "partner as talent",
    image: {
      src: "/partner/talent.png",
      alt: "nuclii talent turning a packed city subway carriage into a moment — balloons up, a small crowd gathered in",
      width: 612,
      height: 792,
    },
  },
];

// Each chip wears its partner type's mascot — the same face as the ring and photos.
const CHIPS = [
  { label: "hosts", tone: MASCOT_TONES.host, target: "hosts" },
  { label: "spaces", tone: MASCOT_TONES.space, target: "spaces" },
  { label: "talent", tone: MASCOT_TONES.talent, target: "talent" },
];

export function PartnerWithUs() {
  const [role, setRole] = useState<RoleValue>("host");
  const formRef = useRef<HTMLDivElement | null>(null);

  function goToApply(nextRole?: RoleValue) {
    if (nextRole) setRole(nextRole);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="nuclii-page pb-24">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="nuclii-container pt-24 sm:pt-28" data-analytics-section="partner_hero">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[clamp(3rem,7vw,5rem)] font-extrabold lowercase leading-[0.95] tracking-[-0.03em]">
              partner
              <br />
              with us
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70 sm:text-lg">
              collaborate with nuclii to create better event experiences and stronger
              connections for communities everywhere.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {CHIPS.map((chip) => (
                <button
                  className="group flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm font-bold lowercase text-white/85 transition hover:border-white/30 hover:bg-white/[0.06]"
                  key={chip.label}
                  onClick={() => scrollTo(chip.target)}
                  type="button"
                >
                  <MascotFace
                    className="size-7 shrink-0 transition-transform duration-200 group-hover:-rotate-6 motion-reduce:transition-none"
                    tone={chip.tone}
                  />
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold lowercase text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.97] motion-reduce:transform-none"
                onClick={() => goToApply()}
                type="button"
              >
                partner with us
              </button>
              <button
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold lowercase text-white/85 transition hover:border-white/45 hover:text-white"
                onClick={() => goToApply()}
                type="button"
              >
                choose your partner type
              </button>
            </div>
          </motion.div>

          <HeroCircle />
        </div>
      </section>

      {/* ── Role sections ──────────────────────────────────── */}
      <div className="nuclii-container mt-20 space-y-6 sm:mt-28">
        {SECTIONS.map((section, index) => (
          <motion.section
            className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-10"
            data-analytics-section={`partner_${section.id}`}
            id={section.id}
            initial={{ opacity: 0, y: 26 }}
            key={section.id}
            style={{
              backgroundImage: `radial-gradient(120% 120% at ${section.flip ? "100%" : "0%"} 0%, ${section.accent}1f, transparent 55%)`,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.25 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
                section.flip && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div>
                <div className="flex items-center gap-3">
                  <MascotFace className="size-12 shrink-0" tone={section.tone} />
                  <h2
                    className="text-3xl font-extrabold lowercase tracking-[-0.02em] sm:text-4xl"
                    style={{ color: section.accent }}
                  >
                    {section.label}
                  </h2>
                </div>
                <p className="mt-4 max-w-md text-base leading-7 text-white/70">
                  {section.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {section.features.map((feature) => (
                    <li className="flex items-start gap-3" key={feature.title}>
                      <span className="mt-0.5 shrink-0" style={{ color: section.accent }}>
                        <CheckIcon className="size-[18px]" />
                      </span>
                      <p className="text-sm leading-6 text-white/75">
                        <span className="font-bold text-white">{feature.title}</span>{" "}
                        <span className="text-white/45">— {feature.detail}</span>
                      </p>
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-8 w-full rounded-xl px-6 py-3.5 text-sm font-semibold lowercase text-[#0A0A0B] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none"
                  onClick={() => goToApply(section.role)}
                  style={{ backgroundColor: section.accent }}
                  type="button"
                >
                  {section.cta}
                </button>
              </div>

              <SectionPhoto
                accent={section.accent}
                delay={index * 0.15}
                image={section.image}
              />
            </div>
          </motion.section>
        ))}
      </div>

      {/* ── Apply form ─────────────────────────────────────── */}
      <section className="nuclii-container mt-24 scroll-mt-24" id="apply" ref={formRef}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold lowercase tracking-[-0.02em] sm:text-4xl">
            let&apos;s build together
          </h2>
          <p className="mt-3 text-base leading-7 text-white/65">
            tell us how you&apos;d like to partner and we&apos;ll reach out as nuclii opens near you.
          </p>
        </div>
        <div className="mx-auto mt-8 flex max-w-2xl justify-center">
          <WaitlistForm
            defaultRole={role}
            key={role}
            source="partner with us"
            submitLabel="apply to partner"
            successMessage="application received. we'll review it and reach out as nuclii opens near you."
          />
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────── */}
      <section className="nuclii-container mt-20">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
          <Sparkles
            items={[
              { x: 8, y: 30, type: "plus", color: "#DA4F28", size: 14 },
              { x: 14, y: 70, type: "dot", color: "#8FC9E8", size: 8, delay: 0.4 },
              { x: 88, y: 35, type: "dot", color: "#E9C44A", size: 10, delay: 0.2 },
              { x: 93, y: 68, type: "plus", color: "#6A6AF2", size: 12, delay: 0.6 },
            ]}
          />
          <p className="mx-auto max-w-xl text-lg font-semibold lowercase text-white/85 sm:text-xl">
            together, we can build amazing events and bring people closer.
          </p>
          <button
            className="mt-6 rounded-xl bg-white px-7 py-3 text-sm font-semibold lowercase text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.97] motion-reduce:transform-none"
            onClick={() => goToApply()}
            type="button"
          >
            partner with us
          </button>
        </div>
      </section>
    </main>
  );
}

const POP = {
  initial: { opacity: 0, scale: 0.4 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.4 },
};

// Reaching arms so neighbours appear to hold hands around the ring.
const REACH = {
  // top mascot reaches down-left and down-right
  topLeft: "M40 96C18 110 12 150 30 178",
  topRight: "M160 96C182 110 188 150 170 178",
  // side mascots reach up-inward and down-inward
  upIn: "M150 70C176 78 184 120 176 150",
  downIn: "M150 150C176 142 184 184 168 196",
};

function HeroCircle() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        fill="none"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="33" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="33"
          stroke="#ffffff"
          strokeDasharray="1.5 3"
          strokeOpacity="0.18"
          strokeWidth="0.5"
        />
      </svg>
      <Sparkles
        items={[
          { x: 50, y: 2, type: "plus", color: "#6A6AF2", size: 14 },
          { x: 88, y: 20, type: "dot", color: "#E9C44A", size: 8, delay: 0.3 },
          { x: 12, y: 28, type: "dot", color: "#DA4F28", size: 9, delay: 0.5 },
          { x: 92, y: 64, type: "plus", color: "#8FC9E8", size: 12, delay: 0.2 },
          { x: 6, y: 70, type: "dot", color: "#E9C44A", size: 7, delay: 0.6 },
          { x: 58, y: 96, type: "plus", color: "#DA4F28", size: 13, delay: 0.4 },
        ]}
      />

      <motion.div
        className="absolute left-1/2 top-0 w-[31%] -translate-x-1/2"
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0 }}
        {...POP}
      >
        <Mascot armLeft={REACH.topLeft} armRight={REACH.topRight} className="w-full" delay={0} tone={MASCOT_TONES.nuclii} />
      </motion.div>
      <motion.div
        className="absolute left-0 top-1/2 w-[31%] -translate-y-1/2"
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.12 }}
        {...POP}
      >
        <Mascot armRight={REACH.upIn} className="w-full" delay={0.6} tone={MASCOT_TONES.host} />
      </motion.div>
      <motion.div
        className="absolute right-0 top-1/2 w-[31%] -translate-y-1/2"
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.18 }}
        {...POP}
      >
        <Mascot armRight={REACH.upIn} className="w-full" delay={0.3} flip tone={MASCOT_TONES.talent} />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-1/2 w-[31%] -translate-x-1/2"
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.24 }}
        {...POP}
      >
        <Mascot armLeft={REACH.topLeft} armRight={REACH.topRight} className="w-full" delay={0.9} flip tone={MASCOT_TONES.space} />
      </motion.div>
    </div>
  );
}

function SectionPhoto({
  accent,
  delay,
  image,
}: {
  accent: string;
  delay: number;
  image: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <motion.div
      className="relative mx-auto grid w-full max-w-[25rem] place-items-center"
      initial={{ scale: 0.96, y: 14 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ scale: 1, y: 0 }}
    >
      {/* accent halo — bleeds through the venue cut-out and rims the framed photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 -z-10 blur-2xl"
        style={{
          backgroundImage: `radial-gradient(58% 52% at 50% 50%, ${accent}3d, transparent 72%)`,
        }}
      />
      <Sparkles
        items={[
          { x: 3, y: 12, type: "plus", color: accent, size: 13 },
          { x: 93, y: 18, type: "dot", color: accent, size: 7, delay: 0.3 },
          { x: 95, y: 80, type: "plus", color: accent, size: 11, delay: 0.5 },
          { x: 5, y: 84, type: "dot", color: accent, size: 8, delay: 0.2 },
        ]}
      />
      <Image
        alt={image.alt}
        className="h-auto w-full rounded-[22px]"
        height={image.height}
        sizes="(max-width: 1024px) 88vw, 25rem"
        src={image.src}
        style={{ filter: "drop-shadow(0 24px 55px rgba(0,0,0,0.5))" }}
        width={image.width}
      />
    </motion.div>
  );
}
