import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/demo-app";

export const metadata: Metadata = {
  title: "nuclii — sandbox",
  description:
    "a working preview of nuclii: one london week seen through four lives — explorer, host, venue and talent.",
  robots: { index: false },
};

export default function DemoPage() {
  return <DemoApp />;
}
