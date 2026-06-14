import type { Metadata } from "next";

import { FadeIn, Reveal } from "@/components/motion";
import { PhotoPlaceholder } from "@/components/media/photo-placeholder";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | Nuclii",
  description:
    "Nuclii exists to help people discover great things happening in the real world — and bring more people together, in person.",
};

const beliefs = [
  {
    number: "01",
    title: "real-world first",
    description:
      "we're here to strengthen offline communities, not replace them.",
  },
  {
    number: "02",
    title: "curated with care",
    description: "quality over quantity in everything we surface.",
  },
  {
    number: "03",
    title: "community over audience",
    description: "we build for people, not metrics.",
  },
  {
    number: "04",
    title: "privacy-first by design",
    description: "your data, your choices, always.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden sm:min-h-screen">
        <PhotoPlaceholder className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="nuclii-container relative pb-16 pt-32 sm:pb-20 lg:pb-24">
          <FadeIn>
            <h1 className="nuclii-display lowercase text-white">about us.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
              Nuclii exists to help people discover great things happening in
              the real world — and bring more people together, in person.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Why we exist ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
              why we exist
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
              <p>
                real-world connection is fragmented.
                <br />
                the best things happening in your city are often hidden in
                stories, group chats, flyers, and word of mouth.
              </p>
              <p>
                Nuclii exists to make discovery, hosting, and access simpler
                and more human.
              </p>
              <p>
                {
                  "we're building the infrastructure for attendees, hosts, venues, and communities to find each other and build culture offline."
                }
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Beliefs + collage ─────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div>
              {beliefs.map((belief) => (
                <div className="nuclii-numbered-item" key={belief.number}>
                  <p className="nuclii-numbered-item__heading">
                    <span className="nuclii-numbered-item__number">
                      {belief.number}
                    </span>
                    {belief.title} —
                  </p>
                  <p className="nuclii-numbered-item__description">
                    {belief.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              <PhotoPlaceholder className="row-span-2 rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="nuclii-display max-w-3xl lowercase">
              {"let's build something real together."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8 lg:pb-4">
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Nuclii is just getting started.
                <br />
                {
                  "if you're passionate about real-world connection, we'd love to hear from you."
                }
              </p>
              <Button asChild className="w-fit lowercase" size="lg" variant="outline">
                <a href="mailto:hello@nuclii.co.uk">get in touch</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
