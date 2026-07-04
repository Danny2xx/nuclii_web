import type { Metadata } from "next";

import { JoinForm } from "@/components/join/join-form";
import { Spotlight } from "@/components/join/spotlight";
import { FadeIn } from "@/components/motion";
import { PageTitle } from "@/components/ui/marketing-typography";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

export const metadata: Metadata = {
  title: "Join Early Access | Nuclii",
  description:
    "Nuclii is the home for real-world experiences. Join the waitlist and get in before we open.",
};

const ROLES = [
  { name: EXPERIENCE_ROLES.explorer.label, color: EXPERIENCE_ROLES.explorer.signal },
  { name: EXPERIENCE_ROLES.host.label, color: EXPERIENCE_ROLES.host.signal },
  { name: EXPERIENCE_ROLES.venue.label, color: EXPERIENCE_ROLES.venue.signal },
  { name: EXPERIENCE_ROLES.talent.label, color: EXPERIENCE_ROLES.talent.signal },
] as const;

export default function JoinPage() {
  return (
    <main className="nuclii-page">
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden px-[var(--container-x)] py-24"
        data-analytics-section="join_entry"
      >
        {/* soft signal wash + spotlight for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(38% 36% at 16% 14%, rgba(111,137,168,0.07), transparent 72%), radial-gradient(42% 42% at 84% 88%, rgba(142,124,168,0.07), transparent 72%)",
          }}
        />
        <Spotlight />

        <div className="relative mx-auto w-full max-w-[42rem]">
          <FadeIn className="flex flex-col items-center text-center">
            <PageTitle className="text-white">
              you&apos;re{" "}
              <span style={{ color: EXPERIENCE_ROLES.venue.signal }}>early!</span>
            </PageTitle>
            <p className="mt-7 max-w-[26rem] text-balance text-[15px] leading-[1.5] tracking-[-0.01em] text-white/65 sm:text-base">
              the home for real-world experiences. get in before we open.
            </p>
          </FadeIn>

          <JoinForm />

          {/* who's in the first wave — a quiet footer, not a card */}
          <div className="mx-auto mt-16 max-w-lg">
            <p className="text-center text-[12px] lowercase tracking-[0.04em] text-white/45">
              first in line
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 text-[13.5px] lowercase">
              {ROLES.map((role) => (
                <span className="inline-flex items-center gap-1.5 text-white/55" key={role.name}>
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  {role.name}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 font-bold text-white">
                <span className="relative flex size-2 shrink-0 items-center justify-center">
                  <span className="absolute inline-flex size-full rounded-full bg-white/50 motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-white" />
                </span>
                you
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
