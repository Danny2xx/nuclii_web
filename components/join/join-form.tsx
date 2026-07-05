"use client";

import { useState } from "react";
import Link from "next/link";

import {
  WaitlistForm,
  type WaitlistRoleChoice,
} from "@/components/home/waitlist-form";
import { Reveal } from "@/components/motion";
import {
  AudienceGlyph,
  HostGlyph,
  LinkGlyph,
  SpaceGlyph,
  TalentGlyph,
} from "@/components/partner/glyphs";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

const JOIN_ROLE_CHOICES = [
  {
    value: EXPERIENCE_ROLES.explorer.value,
    label: "explore",
    hint: "discover workshops, pop-ups, services, gatherings and places around you.",
    accent: EXPERIENCE_ROLES.explorer.partnerAccent,
    icon: AudienceGlyph,
  },
  {
    value: EXPERIENCE_ROLES.host.value,
    label: "host",
    hint: "create demand, manage access and bring people together with less chaos.",
    accent: EXPERIENCE_ROLES.host.partnerAccent,
    icon: HostGlyph,
  },
  {
    value: EXPERIENCE_ROLES.venue.value,
    label: "list a space",
    hint: "connect your space with hosts, communities and moments that fit.",
    accent: EXPERIENCE_ROLES.venue.partnerAccent,
    icon: SpaceGlyph,
  },
  {
    value: EXPERIENCE_ROLES.talent.value,
    label: "get booked",
    hint: "show your skill and get discovered by organisers already looking.",
    accent: EXPERIENCE_ROLES.talent.partnerAccent,
    icon: TalentGlyph,
  },
  {
    value: "other",
    label: "get involved",
    hint: "for societies, service providers, partners, investors and contributors.",
    accent: "#FFFFFF",
    icon: LinkGlyph,
  },
] satisfies readonly WaitlistRoleChoice[];

export function JoinForm() {
  const [joined, setJoined] = useState(false);

  return (
    <>
      <Reveal className="flex justify-center" delay={0.1}>
        <WaitlistForm
          celebrateOnSuccess
          defaultRole={EXPERIENCE_ROLES.explorer.value}
          duplicateMessage="you're already on the early-access list. we'll reach out as Nuclii opens near you."
          exploreHref="/"
          exploreLabel="explore nuclii"
          layout="hero"
          onJoinedChange={setJoined}
          requireConsent={false}
          roleChoices={JOIN_ROLE_CHOICES}
          source="join entry"
          submitLabel="join the waitlist"
          successMessage="you're in. welcome to the first wave — we'll contact selected early members, hosts and partners as Nuclii prepares for beta."
        />
      </Reveal>

      {/* Only for people who haven't joined yet — once joined, the success
          state's "explore nuclii" button covers this. */}
      {!joined && (
        <Reveal className="mt-5 flex justify-center" delay={0.18}>
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
