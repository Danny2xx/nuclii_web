import type { Metadata } from "next";

import { ContactFlow } from "@/components/forms/contact-form";
import { FadeIn } from "@/components/motion";

export const metadata: Metadata = {
  title: "Get in Touch | Nuclii",
  description:
    "Contact Nuclii for early access, hosting, partnerships, venues, investors, press, team enquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="nuclii-page">
      <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_0%,rgba(91,140,255,0.12),transparent_28rem)]" />
        <div className="nuclii-container relative pb-0">
          <FadeIn className="max-w-2xl">
            <h1 className="nuclii-title">Get in touch.</h1>
            <p className="nuclii-copy mt-5 max-w-xl">
              Choose the category that fits your enquiry and we will make sure
              it reaches the right person.
            </p>
          </FadeIn>
        </div>
      </section>

      <ContactFlow />
    </main>
  );
}
