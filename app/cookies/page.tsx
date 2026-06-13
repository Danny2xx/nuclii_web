import type { Metadata } from "next";

import { PolicyPage, type PolicySection } from "@/components/content/policy-page";

export const metadata: Metadata = {
  title: "Cookie Policy | Nuclii",
  description: "Cookie policy for the Nuclii pre-launch website — essential cookies, analytics, and managing preferences.",
};

const sections: PolicySection[] = [
  {
    title: "What cookies are",
    body: "Cookies and similar technologies help websites remember settings, understand usage, and keep services working. This page covers cookie use on Nuclii’s pre-launch website.",
  },
  {
    title: "Essential cookies",
    body: "Essential cookies may be used to make the website function correctly, support forms, protect sessions, or maintain basic site performance.",
  },
  {
    title: "Analytics cookies",
    body: "If analytics are enabled, they may help Nuclii understand page visits, device types, and website performance. Analytics should be configured in a privacy-aware way.",
  },
  {
    title: "Marketing cookies",
    body: "Marketing cookies are not currently used on this pre-launch website. If used in future, this policy will be updated accordingly.",
  },
  {
    title: "Managing preferences",
    items: [
      "You can manage or block cookies through your browser settings.",
      "Blocking some cookies may affect how the website works.",
      "If a cookie preference tool is added later, this page should explain how to use it.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <PolicyPage
      badge="Cookies"
      description="Cookie use on the Nuclii pre-launch website and how to manage preferences."
      lastUpdated="May 27, 2026"
      sections={sections}
      title="Cookie Policy"
    />
  );
}
