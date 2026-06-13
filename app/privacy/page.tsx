import type { Metadata } from "next";

import { PolicyPage, type PolicySection } from "@/components/content/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Nuclii",
  description:
    "Privacy policy for the Nuclii pre-launch website — how we handle early access, contact, and careers information.",
};

const sections: PolicySection[] = [
  {
    title: "What this covers",
    body: "This privacy policy applies to the Nuclii pre-launch website. Full app privacy terms will be published before beta launch.",
  },
  {
    title: "Information we may collect",
    items: [
      "Waitlist and early access information, including name, email, city, role, intended use, age confirmation, and update consent.",
      "Contact form information, including name, email, enquiry type, organisation, city, and message.",
      "Careers application information, including name, email, area of interest, city, optional portfolio or profile links, and message.",
      "Investor enquiry information submitted through contact or investor interest routes.",
      "Basic analytics or cookie information if analytics are enabled on the website.",
    ],
  },
  {
    title: "Why we collect it",
    items: [
      "To manage early access interest and beta communications.",
      "To understand potential attendees, hosts, societies, service providers, talent, venues, partners, investors, and contributors.",
      "To respond to enquiries and improve the pre-launch website.",
      "To send Nuclii updates where consent has been given.",
    ],
  },
  {
    title: "Your choices",
    items: [
      "You can ask to update or delete information submitted through the website.",
      "You can unsubscribe from marketing updates when unsubscribe options are available.",
      "You can manage browser cookie settings through your browser preferences.",
    ],
  },
  {
    title: "Contact",
    body: "For now, use the Get in Touch page to contact Nuclii about privacy questions, deletion requests, or data concerns.",
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      badge="Privacy"
      description="How Nuclii handles information submitted through the pre-launch website."
      lastUpdated="May 27, 2026"
      sections={sections}
      title="Privacy Policy"
    />
  );
}
