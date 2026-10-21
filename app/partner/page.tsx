import type { Metadata } from "next";

import { PartnerPage } from "@/components/partner/partner-page";

const title = "Partner with us | Nuclii";
const description =
  "Work with the Nuclii team directly: co-host events, get featured and get recommended. Societies, venues, talent, organisers and brands.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", url: "/partner" },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <PartnerPage />;
}
