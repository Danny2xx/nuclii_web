import {
  BadgeCheck,
  CalendarHeart,
  Handshake,
  Megaphone,
  MessageCircle,
  Rocket,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

import type { PartnerTypeId } from "@/lib/partner-options";

// What working together looks like for each partner type, shown when the
// visitor picks who they are at the top of /partner.
export const partnerLooks: Record<PartnerTypeId, { headline: string; points: string[] }> = {
  society: {
    headline: "bring your society with you.",
    points: [
      "co-host an event with the nuclii team",
      "bring your members on and run your community in the app",
      "reach students beyond your own campus",
    ],
  },
  venue: {
    headline: "fill your space with the right events.",
    points: [
      "host a nuclii Studio night",
      "become a recommended venue for hosts nearby",
      "get matched with events that suit your space",
    ],
  },
  talent: {
    headline: "get on the line-up.",
    points: [
      "perform or run a session at nuclii Studio nights",
      "get featured on our socials and journal",
      "join line-ups for events near you",
    ],
  },
  organiser: {
    headline: "grow it with us.",
    points: [
      "co-host an event or run a series with us",
      "cross-promote with communities like yours",
      "get introduced to venues and talent",
    ],
  },
  brand: {
    headline: "coming soon: sponsor what fits.",
    points: [
      "sponsor events that fit your brand",
      "register interest now and we'll be in touch first",
    ],
  },
};

export const benefits: readonly { title: string; line: string; icon: LucideIcon }[] = [
  { title: "featured placement", line: "front-facing space on the site and in the app, clearly labelled", icon: Star },
  { title: "priority recommendation", line: "shown first in matching and explore while we work together", icon: Rocket },
  { title: "co-hosted events", line: "we help plan, promote and fill events with you", icon: CalendarHeart },
  { title: "introductions", line: "we connect you to the venues, talent and societies you need", icon: Handshake },
  { title: "shout-outs", line: "featured on @wearenuclii and the Studio journal", icon: Megaphone },
  { title: "founding partner badge", line: "a mark on your profile showing you were here early", icon: BadgeCheck },
  { title: "first access to new tools", line: "try new host tools, like sponsorship, first", icon: Sparkles },
  { title: "a direct line to the team", line: "a real person to talk to, and your feedback shapes what we build", icon: MessageCircle },
];
