import type { Metadata } from "next";

import { PartnerWithUs } from "@/components/partner/partner-with-us";

const title = "Partner with Us | Nuclii";
const description =
  "For the people who make the moment possible. Register early with Nuclii as a host, venue, talent or maker before public launch.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", url: "/early-access" },
  twitter: { card: "summary_large_image", title, description },
};

export default function PartnerWithUsPage() {
  return <PartnerWithUs />;
}
