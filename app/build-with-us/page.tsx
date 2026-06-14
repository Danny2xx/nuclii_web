import type { Metadata } from "next";

import { FadeIn, Reveal } from "@/components/motion";
import { PhotoPlaceholder } from "@/components/media/photo-placeholder";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Build With Us | Nuclii",
  description:
    "At Nuclii, we're building the future of real-world communities and experiences. This is your chance to help shape what's next.",
};

const TALLY_BUILD_URL = "https://tally.so/r/RGjlyp";

const roles = [
  {
    number: "01",
    title: "builders",
    description: "engineers, product people, and problem solvers.",
  },
  {
    number: "02",
    title: "designers",
    description: "product, brand, and experience designers.",
  },
  {
    number: "03",
    title: "community leads",
    description: "operators and connectors who love people.",
  },
  {
    number: "04",
    title: "campus ambassadors",
    description: "student leaders who want to bring nuclii to their campus.",
  },
  {
    number: "05",
    title: "content creators",
    description: "storytellers, filmmakers, and creators.",
  },
  {
    number: "06",
    title: "collaborators",
    description: "partners, researchers, and domain experts.",
  },
] as const;

export default function BuildWithUsPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden sm:min-h-screen">
        <PhotoPlaceholder className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="nuclii-container relative pb-16 pt-32 sm:pb-20 lg:pb-24">
          <FadeIn>
            <h1 className="nuclii-display lowercase text-white">
              build
              <br />
              with us.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
              at nuclii, we&apos;re building the future of real-world
              communities and experiences. we bring curious people together
              to learn, create, and grow — offline. this is your chance to
              help shape what&apos;s next.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Who you are and what you get ─────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                who you are and what you get:
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <p>
                  we&apos;re looking for builders, thinkers, and doers who
                  care about community, creativity, and making an impact in
                  the real world.
                </p>
                <p>
                  as a builder, you&apos;ll get early access, real
                  responsibility, and a front-row seat to shaping the future
                  of nuclii.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              {roles.map((role) => (
                <div className="nuclii-numbered-item" key={role.number}>
                  <p className="nuclii-numbered-item__heading">
                    <span className="nuclii-numbered-item__number">
                      {role.number}
                    </span>
                    {role.title}
                  </p>
                  <p className="nuclii-numbered-item__description">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Photo collage ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border sm:row-span-2 sm:aspect-auto" />
              <PhotoPlaceholder className="aspect-video rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border sm:row-span-2 sm:aspect-auto" />
              <PhotoPlaceholder className="aspect-video rounded-2xl border border-border" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="nuclii-title max-w-2xl font-extrabold lowercase">
              if you care about building culture in real life, we want to
              hear from you.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8 lg:pb-4">
              <Button
                asChild
                className="w-fit lowercase"
                size="lg"
              >
                <a href={TALLY_BUILD_URL}>apply to build with us</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
