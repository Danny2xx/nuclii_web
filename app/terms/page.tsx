import type { Metadata } from "next";

import { PolicyPage, type PolicySection } from "@/components/content/policy-page";

export const metadata: Metadata = {
  title: "Terms of Use | Nuclii",
  description: "Terms of use for the Nuclii pre-launch website: acceptable use, waitlist, and early-stage disclaimers.",
};

const sections: PolicySection[] = [
  {
    title: "Website terms only",
    body: "These terms apply to the Nuclii pre-launch website. They are not the full app marketplace terms, which will be published before beta launch.",
  },
  {
    title: "Use of the website",
    items: [
      "Use the website for lawful, respectful, and genuine enquiries only.",
      "Do not attempt to disrupt, scrape, reverse engineer, or misuse the website.",
      "Do not submit false, harmful, misleading, or abusive information.",
    ],
  },
  {
    title: "Waitlist and beta access",
    items: [
      "Submitting a form does not guarantee beta access, partnership acceptance, investment conversations, or team opportunities.",
      "Nuclii may contact selected early users, hosts, partners, investors, or contributors as the product develops.",
      "Nuclii may update its website, forms, and launch plans while the product remains early-stage.",
    ],
  },
  {
    title: "Intellectual property",
    body: "Nuclii’s name, branding, website copy, design, and product concepts remain the property of their respective owners. Do not copy or reuse them without permission.",
  },
  {
    title: "Acceptable use",
    items: [
      "Do not submit harassment, spam, fake listings, unsafe listings, or abusive content.",
      "Do not impersonate another person, organisation, venue, investor, or partner.",
      "Do not misuse privacy, location, access, or eligibility concepts described on the website.",
    ],
  },
  {
    title: "Early-stage disclaimer",
    body: "Nuclii is in pre-launch. Product details, features, timing, policies, and availability may change before beta or public launch.",
  },
  {
    title: "Liability",
    body: "The website is provided as pre-launch information and should not be treated as a guarantee of product availability, access, outcomes, or financial opportunity.",
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      badge="Terms"
      description="Terms covering acceptable use, waitlist status, and early-stage disclaimers."
      lastUpdated="May 27, 2026"
      sections={sections}
      title="Terms of Use"
    />
  );
}
