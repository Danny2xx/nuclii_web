"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  WaitlistForm,
  type WaitlistRoleChoice,
} from "@/components/home/waitlist-form";
import { Sparkles } from "@/components/partner/mascot";
import {
  AudienceGlyph,
  BookingGlyph,
  CapacityGlyph,
  ClockGlyph,
  EventGlyph,
  EyeGlyph,
  HostGlyph,
  MegaphoneGlyph,
  PortfolioGlyph,
  QrGlyph,
  SpaceGlyph,
  TalentGlyph,
} from "@/components/partner/glyphs";
import { Button } from "@/components/ui/button";
import {
  PageTitle,
  SectionTitle,
} from "@/components/ui/marketing-typography";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";
import { cn } from "@/lib/utils";

type FeatureGlyph = ComponentType<{ className?: string }>;

type RoleValue = "host" | "venue-business" | "talent-creative";

type Section = {
  id: string;
  label: string;
  card?: string;
  accent: string;
  lead: string;
  description: string;
  formLabel: string;
  formHint: string;
  features: { label: string; icon: FeatureGlyph }[];
  role: RoleValue;
  cta: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    focus?: string;
    frameRatio?: string;
    scale?: number;
  };
};

const SECTIONS: Section[] = [
  {
    id: "hosts",
    label: EXPERIENCE_ROLES.host.shortLabel,
    accent: EXPERIENCE_ROLES.host.partnerAccent,
    lead: "from idea to audience",
    description:
      "for supper clubs, workshops, socials and showcases. plan the experience, bring in the right people and manage access without stitching together different tools.",
    formLabel: EXPERIENCE_ROLES.host.formLabel,
    formHint: "plan the experience, manage access and grow the community around it.",
    features: [
      { icon: EventGlyph, label: "shape and publish" },
      { icon: QrGlyph, label: "sell and scan access" },
      { icon: MegaphoneGlyph, label: "build demand" },
      { icon: AudienceGlyph, label: "grow your community" },
    ],
    role: "host",
    cta: "register as a host",
    image: {
      src: "/partner/host.png",
      alt: "A Nuclii host preparing a paint and sip beneath park trees with easels, canvases and a table ready for guests",
      width: 736,
      height: 981,
      focus: "50% 88%",
    },
  },
  {
    id: "spaces",
    label: EXPERIENCE_ROLES.venue.shortLabel,
    card: "venues",
    accent: EXPERIENCE_ROLES.venue.partnerAccent,
    lead: "from underused space to the right booking",
    description:
      "for bars, studios, rooftops and galleries. show hosts what the space can hold, when it is free and what kind of experience belongs there.",
    formLabel: EXPERIENCE_ROLES.venue.formLabel,
    formHint: "show what your space can hold and hear from hosts whose plans fit.",
    features: [
      { icon: EyeGlyph, label: "showcase your space" },
      { icon: BookingGlyph, label: "receive fitting requests" },
      { icon: CapacityGlyph, label: "share capacity and amenities" },
      { icon: ClockGlyph, label: "manage availability" },
    ],
    role: "venue-business",
    cta: "register as a venue",
    image: {
      src: "/partner/venue.png",
      alt: "A Nuclii venue displayed at a city bus stop with a warmly lit restaurant behind it",
      width: 687,
      height: 811,
      focus: "50% 62%",
      frameRatio: "687 / 811",
      scale: 1.12,
    },
  },
  {
    id: "talent",
    label: EXPERIENCE_ROLES.talent.label,
    card: "talent",
    accent: EXPERIENCE_ROLES.talent.partnerAccent,
    lead: "from skill to opportunity",
    description:
      "for DJs, chefs, photographers, performers and makers. show the work, share availability and connect with organisers already looking for your skill.",
    formLabel: EXPERIENCE_ROLES.talent.formLabel,
    formHint: "show your work and connect with organisers already looking for your skill.",
    features: [
      { icon: PortfolioGlyph, label: "showcase your work" },
      { icon: EyeGlyph, label: "get found by hosts" },
      { icon: BookingGlyph, label: "turn interest into bookings" },
      { icon: ClockGlyph, label: "share availability" },
    ],
    role: "talent-creative",
    cta: "register as talent",
    image: {
      src: "/partner/talent.png",
      alt: "Nuclii talent creating a shared moment inside a busy city train",
      width: 612,
      height: 792,
      focus: "50% 80%",
    },
  },
];

const GLYPHS = { hosts: HostGlyph, spaces: SpaceGlyph, talent: TalentGlyph } as const;

const PARTNER_ROLE_CHOICES = SECTIONS.map((section) => ({
  value: section.role,
  label: section.formLabel,
  hint: section.formHint,
  accent: section.accent,
  icon: GLYPHS[section.id as keyof typeof GLYPHS],
})) satisfies readonly WaitlistRoleChoice[];

// Placeholder rotating sets. Swap for the final curated photos per type.
const HERO_MEDIA: Record<string, string[]> = {
  hosts: ["/images/host.jpg", "/images/about-gathering.jpg", "/images/attendee.jpg"],
  spaces: ["/images/venue.jpg", "/images/about-circle.jpg"],
  talent: ["/images/talent.jpg", "/images/about-conversation.jpg"],
};

export function PartnerWithUs() {
  const [role, setRole] = useState<RoleValue>("host");
  const formRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  function goToApply(nextRole?: RoleValue) {
    if (nextRole) setRole(nextRole);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="nuclii-page pb-16 sm:pb-24">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="nuclii-container pb-14 pt-24 sm:pb-20 sm:pt-28"
        data-analytics-section="partner_hero"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(32rem,1.15fr)] lg:gap-16">
          <motion.div
            animate={{ y: 0 }}
            initial={reduce ? { y: 0 } : { y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PageTitle>
              for the people who make the moment possible.
            </PageTitle>
            <p className="mt-5 max-w-[31rem] text-base leading-7 text-white/72 text-pretty sm:text-lg sm:leading-8">
              bring the idea, the space or the skill. nuclii connects the people and tools
              that turn each part into something real.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <MagneticButton
                onClick={() => goToApply()}
                size="lg"
                type="button"
              >
                register your interest
              </MagneticButton>
              <Button
                className="px-0 lowercase text-white/70 hover:bg-transparent hover:text-white"
                onClick={() => scrollTo("hosts")}
                variant="ghost"
                type="button"
              >
                choose your partner type
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Button>
            </div>
          </motion.div>

          <PartnerEquation onPick={scrollTo} />
        </div>
      </section>

      {/* ── Role sections (editorial bands) ────────────────── */}
      <div className="nuclii-container">
        {SECTIONS.map((section, index) => {
          const Glyph = GLYPHS[section.id as keyof typeof GLYPHS];
          return (
            <motion.section
              className="scroll-mt-24 border-t border-white/10 py-14 lg:py-20"
              data-analytics-section={`partner_${section.id}`}
              id={section.id}
              initial={reduce ? { y: 0 } : { y: 24 }}
              key={section.id}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              whileInView={{ y: 0 }}
            >
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-[clamp(4rem,8vw,8rem)]">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.035]"
                      style={{
                        color: section.accent,
                        boxShadow: `inset 0 0 0 1px ${section.accent}18`,
                      }}
                    >
                      <Glyph className="size-7" />
                    </span>
                    <h2
                      className="text-3xl font-extrabold lowercase leading-none tracking-[-0.02em] sm:text-4xl"
                      style={{ color: section.accent }}
                    >
                      {section.label}
                    </h2>
                  </div>
                  <p
                    className="mt-5 text-[1.05rem] font-semibold lowercase leading-6"
                    style={{ color: section.accent }}
                  >
                    {section.lead}
                  </p>
                  <p className="mt-3 max-w-[38rem] text-[0.98rem] leading-[1.65] text-white/70 text-pretty">
                    {section.description}
                  </p>

                  <div className="mt-8 grid max-w-[38rem] grid-cols-1 gap-x-8 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                    {section.features.map((feature) => (
                      <div className="flex items-center gap-2.5" key={feature.label}>
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]"
                          style={{ color: section.accent }}
                        >
                          <feature.icon className="size-5" />
                        </span>
                        <p className="text-sm font-semibold lowercase leading-snug text-white">
                          {feature.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <MagneticButton
                      accentColor={section.accent}
                      onClick={() => goToApply(section.role)}
                      type="button"
                    >
                      {section.cta}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      />
                    </MagneticButton>
                    <p className="max-w-52 text-xs leading-5 text-white/55">
                      takes about 2 minutes. we&apos;ll confirm next steps by email.
                    </p>
                  </div>
                </div>

                <SectionPhoto accent={section.accent} delay={index * 0.1} image={section.image} />
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ── Apply form ─────────────────────────────────────── */}
      <section
        className="nuclii-container mt-8 scroll-mt-24 border-t border-white/10 py-16 sm:mt-12 sm:py-20 lg:py-24"
        id="apply"
        ref={formRef}
      >
        <div className="mx-auto flex w-full max-w-[48rem] flex-col items-center">
          <div className="max-w-2xl text-center">
            <SectionTitle size="compact">
              let&apos;s build together
            </SectionTitle>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/72 text-pretty">
              choose how you want to join, leave your details and we&apos;ll reach out as nuclii
              opens near you.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/58 text-pretty">
              early partners get first access, direct onboarding and a voice in how nuclii develops.
            </p>
          </div>
          <div className="mt-9 flex w-full justify-center sm:mt-10">
            <WaitlistForm
              className="mx-auto max-w-[46rem]"
              layout="hero"
              onRoleChange={(nextRole) => {
                if (
                  nextRole === "host" ||
                  nextRole === "venue-business" ||
                  nextRole === "talent-creative"
                ) {
                  setRole(nextRole);
                }
              }}
              roleChoices={PARTNER_ROLE_CHOICES}
              selectedRole={role}
              source="partner with us"
              submitLabel="register your interest"
              successMessage="you're in. we'll reach out as nuclii opens near you."
            />
          </div>
        </div>
      </section>

    </main>
  );
}

/** Crossfades through a set of images on an interval; frozen for reduced motion. */
function RotatingImage({
  images,
  alt,
  startDelay = 0,
}: {
  images: string[];
  alt: string;
  startDelay?: number;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || images.length < 2) return;
    let interval: ReturnType<typeof setInterval>;
    const advance = () => setActive((v) => (v + 1) % images.length);
    const timeout = setTimeout(() => {
      advance();
      interval = setInterval(advance, 4200);
    }, startDelay + 4200);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [reduce, images.length, startDelay]);

  return (
    <>
      {images.map((src, index) => (
        <Image
          alt={index === 0 ? alt : ""}
          className={cn(
            "object-cover transition-opacity duration-[1200ms] ease-out",
            index === active ? "opacity-100" : "opacity-0",
          )}
          fill
          key={src}
          priority={index === 0}
          sizes="(max-width: 640px) 28vw, (max-width: 1024px) 30vw, 22vw"
          src={src}
        />
      ))}
    </>
  );
}

// The hero anchor: venues + hosts + talent, an equation of rotating scenes (host featured).
const EQUATION_ORDER = ["spaces", "hosts", "talent"] as const;

function PartnerEquation({ onPick }: { onPick: (id: string) => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:flex sm:items-center sm:justify-center sm:gap-3">
      {EQUATION_ORDER.map((id, index) => {
        const section = SECTIONS.find((entry) => entry.id === id)!;
        const Glyph = GLYPHS[id];
        const featured = id === "hosts";
        return (
          <Fragment key={id}>
            {index > 0 && (
              <span aria-hidden="true" className="grid shrink-0 place-items-center text-white">
                <svg
                  className="size-4 sm:size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            )}
            <motion.button
              animate={{ y: 0 }}
              aria-label={`jump to ${section.card ?? section.label}`}
              className={cn(
                "group relative min-h-52 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B] motion-reduce:transform-none",
                featured ? "z-10 sm:min-h-[440px] sm:flex-[1.4]" : "sm:min-h-[360px] sm:flex-1",
              )}
              initial={reduce ? { y: 0 } : { y: 16 }}
              onClick={() => onPick(id)}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 + index * 0.1 }}
              type="button"
            >
              {/* rotating photos (gently zoom on hover) */}
              <span className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] motion-reduce:transform-none">
                <RotatingImage
                  alt={`${section.label} on nuclii`}
                  images={HERO_MEDIA[id] ?? []}
                  startDelay={index * 1300}
                />
              </span>
              {/* legibility scrim */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
              />
              {/* accent glow from the top */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-2/5 opacity-70"
                style={{ background: `radial-gradient(80% 100% at 50% 0%, ${section.accent}33, transparent 72%)` }}
              />
              {/* accent hairline that lights on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 1.5px ${section.accent}` }}
              />
              {/* label */}
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 sm:gap-2.5 sm:p-5">
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-lg border border-white/15 bg-black/35",
                    featured ? "size-8 sm:size-9" : "size-7 sm:size-8",
                  )}
                  style={{ color: section.accent }}
                >
                  <Glyph className={featured ? "size-6 sm:size-7" : "size-5 sm:size-6"} />
                </span>
                <span
                  className={cn(
                    "text-sm font-bold lowercase leading-none text-white sm:text-lg",
                    featured && "sm:text-xl",
                  )}
                >
                  {section.card ?? section.label}
                </span>
              </span>
            </motion.button>
          </Fragment>
        );
      })}
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
  image: {
    src: string;
    alt: string;
    focus?: string;
    frameRatio?: string;
    scale?: number;
  };
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[24rem]"
      initial={reduce ? { scale: 1, y: 0 } : { scale: 0.96, y: 14 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ scale: 1, y: 0 }}
    >
      {/* accent halo behind the frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 -z-10 rounded-[30px] blur-2xl"
        style={{ backgroundImage: `radial-gradient(60% 55% at 50% 45%, ${accent}40, transparent 72%)` }}
      />
      <Sparkles
        items={[
          { x: 2, y: 10, type: "plus", color: accent, size: 13 },
          { x: 94, y: 16, type: "dot", color: accent, size: 7, delay: 0.3 },
          { x: 96, y: 82, type: "plus", color: accent, size: 11, delay: 0.5 },
          { x: 4, y: 86, type: "dot", color: accent, size: 8, delay: 0.2 },
        ]}
      />
      <div
        className="relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] shadow-[0_26px_60px_-12px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: image.frameRatio ?? "1 / 1" }}
      >
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          sizes="(max-width: 1024px) 88vw, 24rem"
          src={image.src}
          style={{
            objectPosition: image.focus ?? "50% 75%",
            transform: image.scale ? `scale(${image.scale})` : undefined,
          }}
        />
      </div>
    </motion.div>
  );
}
