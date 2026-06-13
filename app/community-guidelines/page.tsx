import type { Metadata } from "next";

import { PolicyPage, type PolicySection } from "@/components/content/policy-page";

export const metadata: Metadata = {
  title: "Community Guidelines | Nuclii",
  description:
    "Community guidelines for safe, respectful, and privacy-aware real-world experiences on Nuclii.",
};

const sections: PolicySection[] = [
  {
    title: "Respectful use",
    body: "Nuclii is being built for real-world experiences. People should be treated with respect before, during, and after any listing, booking, event, service, pickup, or gathering.",
  },
  {
    title: "No harassment or abuse",
    items: [
      "Do not harass, threaten, intimidate, bully, or target people or groups.",
      "Do not use Nuclii to coordinate unsafe, discriminatory, or abusive behaviour.",
      "Do not pressure people to reveal identity, attendance, or location information unnecessarily.",
    ],
  },
  {
    title: "No fake or unsafe listings",
    items: [
      "Do not create fake events, fake services, fake venue listings, or misleading experiences.",
      "Do not list unsafe, illegal, exploitative, or intentionally deceptive activity.",
      "Hosts should represent timing, location, capacity, access, eligibility, and expectations clearly.",
    ],
  },
  {
    title: "Privacy respect",
    items: [
      "Respect private location reveal settings and do not share private locations without permission.",
      "Do not expose attendee identities, private attendance, or QR access information unnecessarily.",
      "Do not misuse privacy-first features to mislead or harm others.",
    ],
  },
  {
    title: "Reporting and moderation",
    body: "Nuclii is designed to make reporting straightforward and moderation trustworthy. Reports may be reviewed to protect attendees, hosts, communities, venues, and partners.",
  },
  {
    title: "Safety-first behaviour",
    items: [
      "Follow eligibility, age-aware, capacity, and access rules set for a listing.",
      "Use QR access, booking, and location reveal tools responsibly.",
      "If something feels unsafe, misleading, or abusive, report it through the appropriate Nuclii channel when available.",
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <PolicyPage
      badge="Guidelines"
      description="Guidelines for safe, respectful, privacy-aware real-world experiences on Nuclii."
      lastUpdated="May 27, 2026"
      sections={sections}
      title="Community Guidelines"
    />
  );
}
