import type { Metadata } from "next";

import { EventsGate } from "@/components/events/events-gate";
import { isEventsUnlocked } from "./gate";

export const metadata: Metadata = {
  title: "Events | Nuclii",
  description: "Nuclii events — coming soon.",
  robots: { index: false, follow: false },
};

export default async function EventsPage() {
  const unlocked = await isEventsUnlocked();

  return (
    <main className="nuclii-page">
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden px-[var(--container-x)] py-24"
        data-analytics-section="events_entry"
      >
        {/* soft signal wash for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(40% 38% at 18% 16%, rgba(142,124,168,0.07), transparent 72%), radial-gradient(44% 44% at 82% 86%, rgba(111,137,168,0.07), transparent 72%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[42rem]">
          {unlocked ? (
            <div className="mx-auto max-w-[30rem] text-center">
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold lowercase leading-[0.98] tracking-[-0.03em]">
                events, coming soon.
              </h1>
              <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
                you&apos;re in. we&apos;re putting together the first nuclii events — real rooms,
                real moments. check back here soon.
              </p>
            </div>
          ) : (
            <EventsGate />
          )}
        </div>
      </section>
    </main>
  );
}
