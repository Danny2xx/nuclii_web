import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { BuildWithUsForm } from "@/components/forms/build-with-us-form";
import { SectionShell } from "@/components/layout";
import { FadeIn, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers | Nuclii",
  description:
    "Help build Nuclii — a product-led platform for real-world discovery, hosting, access, and community infrastructure.",
};

export default function BuildWithUsPage() {
  return (
    <main className="nuclii-page">
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(91,140,255,0.2),transparent_34rem)]" />
        <div className="nuclii-container relative max-w-3xl py-12">
          <FadeIn>
            <h1 className="nuclii-title">
              Build something people will actually use offline.
            </h1>
            <p className="nuclii-copy mt-6">
              Nuclii is early and product-led. We are building infrastructure
              for real-world discovery, hosting, and access — and we are looking
              for people who care about design, community, and how people
              actually behave in real life.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#build-with-us-form">
                  Apply now
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <SectionShell
        className="bg-secondary/35"
        description="Tell us where you want to help and what kind of real-world product work you care about."
        eyebrow="Application"
        id="build-with-us-form"
        title="Apply now."
      >
        <Reveal>
          <BuildWithUsForm />
        </Reveal>
      </SectionShell>
    </main>
  );
}
