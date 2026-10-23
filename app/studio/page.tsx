import type { Metadata } from "next";

import { StudioPage } from "@/components/studio/studio-page";

const title = "Studio | nuclii";
const description =
  "nuclii studio: the team's own corner. The events we host, the ideas we're testing, the journal and how to join the team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", url: "/studio" },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <StudioPage />;
}
