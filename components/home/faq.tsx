"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "About Nuclii",
    items: [
      {
        q: "What is Nuclii?",
        a: "Nuclii is an infrastructure platform for real-world experiences. It connects people who want to discover local events and experiences with those who host, organise, or facilitate them — without needing social media followers, group chats, or fragmented tools. Think of it as the coordination layer that sits underneath real-world activity.",
      },
      {
        q: "Who is Nuclii for?",
        a: "Nuclii is built for everyone involved in real-world experiences. Attendees use it to discover what's happening near them. Hosts create and manage listings for events, workshops, pickups, and private gatherings. Societies and communities use it to organise members. Talent and service providers get discovered. Venues connect with hosts and communities looking for a space.",
      },
      {
        q: "How is Nuclii different from Eventbrite or Facebook Events?",
        a: "Nuclii is not a social media platform and not just a ticketing tool. It is infrastructure — connecting every side of the real-world experience ecosystem in one structured place. There are no public attendee lists, no follower counts, and no algorithmic feeds. Privacy is built in from the start. Location reveal controls, QR access, and eligibility settings mean both hosts and attendees have more control than any existing platform offers.",
      },
      {
        q: "What kinds of experiences does Nuclii support?",
        a: "Nuclii is designed for a wide range of real-world experiences — workshops, social events, society nights, food pickups and collection windows, private gatherings, pop-up markets, talent showcases, service appointments, and more. If it happens in the real world and involves more than one person, Nuclii can support it.",
      },
    ],
  },
  {
    category: "Early access & practical",
    items: [
      {
        q: "Is Nuclii available to use now?",
        a: "Not yet. Nuclii is in pre-launch and we are building the early community of attendees, hosts, societies, and talent before beta. If you join early access, you will be among the first to use the platform when it opens — and your feedback will shape what it becomes.",
      },
      {
        q: "What is the difference between the waitlist and early access?",
        a: "The waitlist is for general interest — put your email in and you will be notified when Nuclii launches. Early access is for people who want to be actively involved before launch: as a host, a society, a talent, or a collaborator. Early access applications are reviewed personally and selected applicants will be onboarded directly.",
      },
      {
        q: "Is it free?",
        a: "Joining the waitlist and applying for early access is completely free. We will share full platform pricing details before beta launch. Early hosts and communities who join now will be the first to know.",
      },
      {
        q: "What happens after I join early access?",
        a: "Every application is reviewed personally. We do not auto-approve. Selected early users, hosts, societies, and communities are contacted directly before beta launch with access details, onboarding steps, and a direct line to the Nuclii team. You will not be left wondering — if you are selected, you will hear from us.",
      },
      {
        q: "Is my information safe?",
        a: "Nuclii is built with privacy as a default, not an afterthought. We collect only what is needed to manage your early access interest and beta communications. We do not sell data and we do not use it for advertising. See the Privacy Policy for full details.",
      },
    ],
  },
] as const;

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-6 py-5 text-left transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:text-primary",
          open ? "text-primary" : "text-foreground",
        )}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="text-base font-semibold leading-snug">{q}</span>
        <span className={cn(
          "grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-200",
          open
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-secondary text-muted-foreground",
        )}>
          {open
            ? <Minus aria-hidden="true" className="size-3.5" />
            : <Plus aria-hidden="true" className="size-3.5" />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-7 text-muted-foreground sm:text-base">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  return (
    <section className="nuclii-section border-y border-border">
      <div className="nuclii-container">
        <div className="mb-12 max-w-xl">
          <p className="nuclii-eyebrow mb-5">Questions</p>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Everything you need to know.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Can't find what you're looking for?{" "}
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="/contact"
            >
              Send us a message.
            </a>
          </p>
        </div>

        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {faqs.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
                {category}
              </p>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 sm:px-6">
                {items.map(({ q, a }) => (
                  <FAQItem a={a} key={q} q={q} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FAQ };
