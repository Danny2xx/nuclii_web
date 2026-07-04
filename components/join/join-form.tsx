"use client";

import { useState } from "react";
import Link from "next/link";

import { WaitlistForm } from "@/components/home/waitlist-form";
import { Reveal } from "@/components/motion";

export function JoinForm() {
  const [joined, setJoined] = useState(false);

  return (
    <>
      <Reveal className="mt-8 flex justify-center" delay={0.1}>
        <WaitlistForm
          exploreHref="/"
          exploreLabel="explore nuclii"
          layout="hero"
          onJoinedChange={setJoined}
          source="join entry"
          submitLabel="join early access"
          successMessage="you're in. welcome to the first wave — we'll reach out as nuclii opens near you."
        />
      </Reveal>

      {/* Only for people who haven't joined yet — once joined, the success
          state's "explore nuclii" button covers this. */}
      {!joined && (
        <Reveal className="mt-7 flex justify-center" delay={0.18}>
          <Link
            className="inline-flex text-sm font-semibold lowercase text-white/55 underline-offset-4 transition hover:text-white hover:underline"
            href="/"
          >
            just looking? explore the site →
          </Link>
        </Reveal>
      )}
    </>
  );
}
