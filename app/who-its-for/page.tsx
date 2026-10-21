import type { Metadata } from "next";

import { WhoItsFor } from "@/components/who/who-its-for";

const title = "Who it's for | Nuclii";
const description =
  "If you have an idea, you can make it happen. Nuclii is made for students, organisers, offline communities, venues and talent & makers.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", url: "/who-its-for" },
  twitter: { card: "summary_large_image", title, description },
};

export default function WhoItsForPage() {
  return <WhoItsFor />;
}
