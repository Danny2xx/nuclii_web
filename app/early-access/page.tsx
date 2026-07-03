import type { Metadata } from "next";

import { PartnerWithUs } from "@/components/partner/partner-with-us";

export const metadata: Metadata = {
  title: "Partner with Us | Nuclii",
  description:
    "Partner with Nuclii as a host, space, or talent. Create better event experiences and stronger connections for communities everywhere.",
};

export default function PartnerWithUsPage() {
  return <PartnerWithUs />;
}
