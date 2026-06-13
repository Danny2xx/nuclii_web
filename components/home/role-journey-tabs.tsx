"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Gauge,
  MapPin,
  QrCode,
  Sparkles,
  Store,
  Ticket,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  NucliiMascot,
  type NucliiMascotMood,
} from "@/components/brand/nuclii-mascot";
import { cn } from "@/lib/utils";

type RoleJourney = {
  description: string;
  icon: LucideIcon;
  id: "attendee" | "host" | "venue" | "talent";
  label: string;
  mood: NucliiMascotMood;
  shortLabel: string;
  steps: readonly {
    description: string;
    icon: LucideIcon;
    label: string;
    title: string;
  }[];
  title: string;
};

const roleJourneys = [
  {
    id: "attendee",
    icon: UsersRound,
    label: "Attendee",
    shortLabel: "Find and attend",
    mood: "drop-pin",
    title: "Discover what's happening near you.",
    description:
      "Find real experiences nearby without needing to be in the right group chat first.",
    steps: [
      {
        icon: MapPin,
        label: "01",
        title: "Find nearby",
        description: "Browse experiences by area, type, and access context.",
      },
      {
        icon: Ticket,
        label: "02",
        title: "RSVP or book",
        description: "Request access, reserve a place, or save a pass.",
      },
      {
        icon: QrCode,
        label: "03",
        title: "Arrive calmly",
        description: "Check in with a QR pass. Your details stay private.",
      },
    ],
  },
  {
    id: "host",
    icon: CalendarDays,
    label: "Host",
    shortLabel: "Create and manage",
    mood: "gather",
    title: "Turn an idea into a structured experience.",
    description:
      "Hosts can create listings, manage capacity, coordinate access, and reduce operational chaos.",
    steps: [
      {
        icon: Sparkles,
        label: "01",
        title: "Create listing",
        description: "Turn details, links, and messages into one clean page.",
      },
      {
        icon: Gauge,
        label: "02",
        title: "Manage demand",
        description: "Control capacity, eligibility, timing, and access status.",
      },
      {
        icon: QrCode,
        label: "03",
        title: "Check people in",
        description: "Confirm arrivals with a QR scan. Nothing extra is exposed.",
      },
    ],
  },
  {
    id: "venue",
    icon: Store,
    label: "Venue",
    shortLabel: "Fill the space",
    mood: "carry-pin",
    title: "Put your space in front of the right people.",
    description:
      "List your space, receive requests from hosts and communities, and fill your calendar without chasing leads.",
    steps: [
      {
        icon: Store,
        label: "01",
        title: "Show the space",
        description: "Share the type of venue, availability, and access rules.",
      },
      {
        icon: CalendarDays,
        label: "02",
        title: "Receive requests",
        description: "Connect with hosts, communities, creators, and operators.",
      },
      {
        icon: MapPin,
        label: "03",
        title: "Bring people in",
        description: "Host pop-ups, workshops, showcases, and community moments.",
      },
    ],
  },
  {
    id: "talent",
    icon: Sparkles,
    label: "Talent",
    shortLabel: "Showcase and book",
    mood: "celebrate",
    title: "Get discovered. Get booked. Stay organised.",
    description:
      "Share what you do, be found by the right hosts and venues, and keep bookings organised in one place.",
    steps: [
      {
        icon: Sparkles,
        label: "01",
        title: "Create showcase",
        description: "Share your craft, availability, and what you can offer.",
      },
      {
        icon: UsersRound,
        label: "02",
        title: "Get discovered",
        description: "Appear in relevant events, services, and venue-led moments.",
      },
      {
        icon: Ticket,
        label: "03",
        title: "Manage booking",
        description: "Keep requests, confirmations, and attendance organized.",
      },
    ],
  },
] as const satisfies readonly RoleJourney[];

function RoleJourneyTabs() {
  const [activeRoleId, setActiveRoleId] =
    useState<RoleJourney["id"]>("attendee");
  const activeRole =
    roleJourneys.find((role) => role.id === activeRoleId) ?? roleJourneys[0];

  return (
    <div className="nuclii-visual-tile p-4 sm:p-5 lg:p-6">
      <div className="relative z-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-background/80 p-5 shadow-card backdrop-blur sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold leading-tight sm:text-5xl">
              One platform, four journeys.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Whether you're attending, hosting, offering a space, or showcasing
              talent — pick your role to see how Nuclii works for you.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
            {roleJourneys.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole.id === role.id;

              return (
                <button
                  aria-selected={isActive}
                  className={cn(
                    "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "border-primary/60 bg-primary text-primary-foreground shadow-blue"
                      : "border-border bg-card/72 text-muted-foreground hover:border-primary/35 hover:bg-primary/10 hover:text-foreground",
                  )}
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  role="tab"
                  type="button"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="grid gap-4"
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              key={activeRole.id}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-3xl border border-border bg-card/82 p-5 shadow-card">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {activeRole.shortLabel}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight">
                      {activeRole.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {activeRole.description}
                    </p>
                  </div>
                  <NucliiMascot
                    label={`Nuclii for ${activeRole.label}`}
                    mood={activeRole.mood}
                    showLabel={false}
                    size="sm"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                {activeRole.steps.map(({ icon: Icon, label, title, description }) => (
                  <div
                    className="flex gap-4 rounded-2xl border border-border bg-card/68 p-4"
                    key={title}
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">
                        {label}
                      </p>
                      <h4 className="mt-1 text-base font-semibold">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <RoleAppVisual role={activeRole} />
        </div>
      </div>
    </div>
  );
}

function RoleAppVisual({ role }: { role: RoleJourney }) {
  const Icon = role.icon;

  return (
    <div className="relative min-h-[35rem] overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_50%_18%,rgba(91,140,255,0.22),transparent_20rem),linear-gradient(145deg,rgba(18,19,22,0.95),rgba(10,10,11,0.98))] p-5 shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(91,140,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(91,140,255,0.065)_1px,transparent_1px)] bg-[size:46px_46px] opacity-70" />
      <div className="relative z-10 mx-auto w-full max-w-[21rem] rounded-[2.55rem] border border-white/15 bg-black p-2.5 shadow-[0_42px_120px_rgba(0,0,0,0.55)]">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
        <div className="overflow-hidden rounded-[1.95rem] border border-border bg-background">
          <div className="border-b border-border bg-card px-5 pb-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary">
                  {role.label} view
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role.shortLabel}
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              className="relative min-h-[28rem] overflow-hidden bg-secondary"
              exit={{ opacity: 0, x: -20, filter: "blur(8px)" }}
              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
              key={role.id}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <RoleScreen role={role} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-border bg-card/86 p-4 shadow-card backdrop-blur">
        <p className="text-xs font-semibold text-primary">Story outcome</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {getRoleOutcome(role.id)}
        </p>
      </div>
    </div>
  );
}

function RoleScreen({ role }: { role: RoleJourney }) {
  if (role.id === "attendee") {
    return <AttendeeScreen />;
  }

  if (role.id === "host") {
    return <HostScreen />;
  }

  if (role.id === "venue") {
    return <VenueScreen />;
  }

  return <TalentScreen />;
}

function AttendeeScreen() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(rgba(91,140,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(91,140,255,0.12)_1px,transparent_1px)] bg-[size:42px_42px] p-5">
      <div className="rounded-2xl border border-border bg-card/94 p-4 shadow-card backdrop-blur">
        <p className="text-xs font-semibold text-primary">Nearby now</p>
        <h3 className="mt-2 text-lg font-semibold">Workshop drop-in</h3>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Area visible now - exact location after RSVP
        </p>
      </div>
      <div className="absolute left-[22%] top-[42%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/12" />
      <div className="absolute right-[22%] top-[34%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/12" />
      <div className="absolute bottom-[28%] left-[44%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/12" />
      <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary">
        QR pass ready after RSVP
      </div>
    </div>
  );
}

function HostScreen() {
  return (
    <div className="absolute inset-0 bg-background p-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold text-primary">Host dashboard</p>
        <h3 className="mt-2 text-xl font-semibold">Create listing</h3>
        <div className="mt-5 space-y-3">
          {["Capacity", "Access", "Reveal", "Check-in"].map((item, index) => (
            <div
              className="rounded-2xl border border-border bg-secondary p-3"
              key={item}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {item}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {index === 0 ? "40 max" : "Set"}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-primary/80" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VenueScreen() {
  return (
    <div className="absolute inset-0 bg-secondary p-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold text-primary">Venue profile</p>
        <h3 className="mt-2 text-xl font-semibold">Studio space</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Available for workshops, pop-ups, and community events.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {["Evenings", "Capacity 60", "Area visible", "Host requests"].map(
            (item) => (
              <div
                className="rounded-2xl border border-border bg-secondary p-3 text-xs font-semibold text-muted-foreground"
                key={item}
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="mt-4 rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary">
        New request from a workshop host
      </div>
    </div>
  );
}

function TalentScreen() {
  return (
    <div className="absolute inset-0 bg-background p-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary">Talent showcase</p>
            <h3 className="mt-2 text-xl font-semibold">DJ set and visuals</h3>
          </div>
          <Sparkles aria-hidden="true" className="size-5 text-primary" />
        </div>
        <div className="mt-5 h-28 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(91,140,255,0.55),transparent_7rem),linear-gradient(135deg,#0B1B3F,#121316)]" />
        <div className="mt-5 space-y-3">
          {["Available Friday", "Open to venues", "Booking request"].map(
            (item) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-3"
                key={item}
              >
                <span className="text-xs font-semibold text-muted-foreground">
                  {item}
                </span>
                <span className="size-2.5 rounded-full bg-primary shadow-blue" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function getRoleOutcome(roleId: RoleJourney["id"]) {
  if (roleId === "attendee") {
    return "The attendee understands what is happening, books with context, and arrives with access ready.";
  }

  if (roleId === "host") {
    return "The host gets structure around demand, eligibility, capacity, and check-in.";
  }

  if (roleId === "venue") {
    return "The venue becomes discoverable to hosts and communities without relying on scattered messages.";
  }

  return "Talent can be discovered for services, showcases, pop-ups, and venue-led experiences.";
}

export { RoleJourneyTabs };
