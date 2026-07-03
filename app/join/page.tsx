import type { Metadata } from "next";

import { JoinForm } from "@/components/join/join-form";
import { Spotlight } from "@/components/join/spotlight";
import { WaitlistCount } from "@/components/join/waitlist-count";
import { FadeIn } from "@/components/motion";

export const metadata: Metadata = {
  title: "Join the waitlist | Nuclii",
  description:
    "Nuclii is the home for real-world experiences. Join the waitlist and get in before we open.",
};

const ROLES = [
  { name: "explorers", color: "#92EB08" }, // attendees — neon green
  { name: "hosts & organisers", color: "#FF5C5C" }, // hosts — red
  { name: "spaces & venues", color: "#4D8DFF" }, // venues — blue
  { name: "talent & makers", color: "#FFD84D" }, // talent — yellow
] as const;

export default function JoinPage() {
  return (
    <main className="nuclii-page">
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden px-[var(--container-x)] py-24"
        data-analytics-section="join_entry"
      >
        {/* dot-grid texture, faded toward the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 52% at 50% 42%, #000 28%, transparent 78%)",
            maskImage:
              "radial-gradient(ellipse 55% 52% at 50% 42%, #000 28%, transparent 78%)",
          }}
        />
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
            <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold lowercase leading-[0.98] tracking-[-0.025em] text-white text-balance">
              you&apos;re <span className="text-[#8FA7C2]">early!</span>
            </h1>
            <p className="mt-7 max-w-[26rem] text-balance text-[15px] leading-[1.5] tracking-[-0.01em] text-white/65 sm:text-base">
              the home for real-world experiences. get in before we open.
            </p>
          </FadeIn>

          {/* live count — real, base seed + signups */}
          <div className="mt-9 flex items-center justify-center gap-2.5">
            <span className="relative flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-[#92EB08]/60 motion-safe:animate-ping" />
              <span className="relative size-2 rounded-full bg-[#92EB08]" />
            </span>
            <p className="text-[15px] lowercase text-white/55">
              <WaitlistCount className="font-bold text-white" fallback={700} />{" "}
              already in the first wave
            </p>
          </div>

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
