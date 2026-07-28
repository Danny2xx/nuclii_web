"use client";

import { useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_PALETTES,
  SEED_THREADS,
  TALENTS,
  VENUES,
  countdownLabel,
  naira,
  shortDayLabel,
  tierById,
  whenLabel,
} from "@/lib/demo/world";
import type { BookingRequest, DemoEvent, EventCategory } from "@/lib/demo/types";
import { celebrateWaitlistSignup } from "@/components/motion/success-confetti";
import { cn } from "@/lib/utils";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { EventCover, GroupedList, InitialsAvatar, ScreenSection, StatusChip } from "../primitives";
import { BackIcon, CheckIcon, PlusIcon } from "../icons";

function useHostIdentity() {
  const { identity } = useWorld();
  return {
    hostPersonaId: identity?.kind === "persona" ? identity.persona.id : "you",
    hostName:
      identity?.kind === "persona"
        ? identity.persona.id === "maya"
          ? "table for twelve"
          : identity.persona.name
        : (identity?.guest.name ?? "you"),
  };
}

/** venue → talent → promotion assembly state for one event */
function assemblyFor(event: DemoEvent, requests: BookingRequest[]) {
  const mine = requests.filter((r) => r.eventId === event.id);
  const venueReq = mine.find((r) => r.type === "venue");
  const talentReqs = mine.filter((r) => r.type === "talent");
  return {
    venue: venueReq?.status ?? ("accepted" as const), // seeded events ship assembled
    talent:
      talentReqs.length === 0
        ? event.talentNames?.length
          ? ("accepted" as const)
          : ("none" as const)
        : talentReqs.every((r) => r.status === "accepted")
          ? ("accepted" as const)
          : talentReqs.some((r) => r.status === "declined")
            ? ("declined" as const)
            : ("pending" as const),
    live: true,
  };
}

function AssemblySlot({
  label,
  hue,
  status,
}: {
  label: string;
  hue: string;
  status: "accepted" | "pending" | "declined" | "none";
}) {
  return (
    <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-background/55 px-3 py-2.5">
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: hue }} />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-foreground">{label}</span>
        <span className="block text-[0.6875rem] text-muted-foreground">
          {status === "accepted"
            ? "confirmed"
            : status === "pending"
              ? "awaiting reply"
              : status === "declined"
                ? "declined — pick another"
                : "not needed"}
        </span>
      </span>
      {status === "accepted" && <CheckIcon className="size-3.5 shrink-0 text-[#9DC08F]" />}
      {status === "pending" && (
        <span aria-hidden="true" className="size-3.5 shrink-0 animate-pulse rounded-full border border-[#D6C08A]" />
      )}
    </div>
  );
}

function AssemblyStrip({ event }: { event: DemoEvent }) {
  const { allRequests } = useWorld();
  const assembly = assemblyFor(event, allRequests);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <AssemblySlot
        label="venue"
        hue="#6F89A8"
        status={assembly.venue === "declined" ? "declined" : assembly.venue}
      />
      <AssemblySlot label="talent" hue="#B5736E" status={assembly.talent} />
      <AssemblySlot label="promotion" hue="#8E7CA8" status="accepted" />
    </div>
  );
}

export function HostDashboard() {
  const { allEvents, allRequests, state, identity } = useWorld();
  const { go } = useDemoRouter();
  const { hostPersonaId } = useHostIdentity();

  const myEvents = allEvents.filter((e) => e.hostId === hostPersonaId);
  const upcoming = myEvents.filter((e) => e.dayOffset >= 0).sort((a, b) => a.dayOffset - b.dayOffset);
  const past = myEvents.filter((e) => e.dayOffset < 0).sort((a, b) => b.dayOffset - a.dayOffset);
  const hero = upcoming[0];

  const pendingReplies = allRequests.filter(
    (r) => r.status === "pending" && myEvents.some((e) => e.id === r.eventId),
  );
  const unread =
    identity?.kind === "persona"
      ? SEED_THREADS.filter(
          (t) => t.betweenPersonaIds.includes(identity.persona.id) && !state.readThreads.includes(t.id),
        )
      : [];

  const plan =
    identity?.kind === "persona"
      ? tierById(state.planOverrides[identity.persona.id] ?? identity.persona.planId)
      : undefined;
  const isPro = (plan?.tier.price ?? 0) > 0;

  const revenue = upcoming.reduce((sum, e) => sum + e.going * e.price, 0);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
            your events
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {upcoming.length} coming up · {naira(revenue)} in rsvps so far
          </p>
        </div>
        <button
          type="button"
          onClick={() => go({ name: "create" })}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <PlusIcon className="size-4" />
          create event
        </button>
      </div>

      {hero ? (
        <div className="mt-6 rounded-3xl bg-card p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <EventCover event={hero} sizes="112px" className="size-24 shrink-0 rounded-xl sm:size-28" />
            <div className="min-w-0 flex-1">
              <StatusChip tone="accent">{countdownLabel(hero.dayOffset)}</StatusChip>
              <button
                type="button"
                onClick={() => go({ name: "event", id: hero.id })}
                className="mt-1.5 block text-left text-lg font-extrabold lowercase tracking-tight text-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {hero.title}
              </button>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {whenLabel(hero)} · {hero.venueName}
              </p>
            </div>
            <RsvpRing going={hero.going} capacity={hero.capacity} />
          </div>
          <div className="mt-5">
            <AssemblyStrip event={hero} />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-card p-8 text-center">
          <p className="text-sm font-semibold text-foreground">your first event starts here</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            pick a date, choose a space, book the talent — we&apos;ll bring the right people.
          </p>
        </div>
      )}

      {(pendingReplies.length > 0 || unread.length > 0) && (
        <ScreenSection title="needs your attention">
          <GroupedList>
            {pendingReplies.map((request) => (
              <div key={request.id} className="flex items-center gap-3 px-4 py-3">
                <span aria-hidden="true" className="size-2 shrink-0 animate-pulse rounded-full bg-[#D6C08A]" />
                <p className="min-w-0 flex-1 text-sm text-foreground/85">
                  <span className="font-bold text-foreground">
                    {request.type === "venue" ? "venue" : "talent"} request
                  </span>{" "}
                  for {request.eventTitle} — awaiting reply
                </p>
                <StatusChip tone="attention">pending</StatusChip>
              </div>
            ))}
            {unread.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => go({ name: "inbox", threadId: thread.id })}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[var(--demo-accent)]" />
                <p className="min-w-0 flex-1 truncate text-sm text-foreground/85">
                  <span className="font-bold text-foreground">new message</span> — {thread.subject}
                </p>
              </button>
            ))}
          </GroupedList>
        </ScreenSection>
      )}

      {upcoming.length > 1 && (
        <ScreenSection title="coming up">
          <GroupedList>
            {upcoming.slice(1).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </GroupedList>
        </ScreenSection>
      )}

      <ScreenSection title="how people find you">
        <div className={cn("relative rounded-2xl bg-card p-4", !isPro && "overflow-hidden")}>
          <div className={cn("grid grid-cols-3 gap-3", !isPro && "blur-[7px]")} aria-hidden={!isPro}>
            <Funnel label="views" value={isPro ? 1284 : 999} />
            <Funnel label="saves" value={isPro ? 173 : 99} />
            <Funnel label="rsvps" value={isPro ? 58 : 9} />
          </div>
          {!isPro && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="rounded-lg bg-background/85 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-sm">
                audience insights live on host pro
              </p>
            </div>
          )}
          {isPro && (
            <p className="mt-3 text-xs text-muted-foreground">
              last 30 days · <span className="font-semibold text-foreground/75">host pro</span>
            </p>
          )}
        </div>
      </ScreenSection>

      {past.length > 0 && (
        <ScreenSection title="past events">
          <GroupedList>
            {past.map((event) => (
              <EventRow key={event.id} event={event} note="sold out" />
            ))}
          </GroupedList>
        </ScreenSection>
      )}
    </div>
  );
}

function Funnel({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-background/60 px-3 py-2.5 text-center">
      <p className="text-lg font-extrabold tracking-tight text-foreground">{value}</p>
      <p className="text-[0.6875rem] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function EventRow({ event, note }: { event: DemoEvent; note?: string }) {
  const { go } = useDemoRouter();
  return (
    <button
      type="button"
      onClick={() => go({ name: "event", id: event.id })}
      className="flex w-full items-center gap-3.5 px-3.5 py-3 text-left transition-colors duration-150 hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <EventCover event={event} sizes="48px" className="size-12 shrink-0 rounded-lg" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold lowercase text-foreground">{event.title}</span>
        <span className="block text-xs text-muted-foreground">
          {whenLabel(event)} · {event.going}/{event.capacity} going
        </span>
      </span>
      {note ? <StatusChip tone="neutral">{note}</StatusChip> : null}
    </button>
  );
}

function RsvpRing({ going, capacity }: { going: number; capacity: number }) {
  const ratio = capacity > 0 ? Math.min(going / capacity, 1) : 0;
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-20 shrink-0" role="img" aria-label={`${going} of ${capacity} spots taken`}>
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-foreground/10" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--demo-accent-bright)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-extrabold leading-none text-foreground">{going}</span>
        <span className="text-[0.5625rem] font-semibold text-muted-foreground">of {capacity}</span>
      </div>
    </div>
  );
}

/* ── create-event flow ─────────────────────────────────────── */

function StepDots({ step }: { step: number }) {
  return (
    <ol aria-label={`step ${step + 1} of 3`} className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          aria-hidden="true"
          className={cn(
            "h-1 rounded-full transition-all duration-200",
            i === step ? "w-6 bg-foreground" : "w-2.5 bg-foreground/25",
          )}
        />
      ))}
    </ol>
  );
}

// labels come from the real clock so they never contradict the resolved date
const DATE_CHOICES = [2, 5, 9, 14].map((dayOffset) => ({
  label: shortDayLabel(dayOffset),
  dayOffset,
}));

export function CreateEventFlow() {
  const { dispatch } = useWorld();
  const { go } = useDemoRouter();
  const { hostPersonaId, hostName } = useHostIdentity();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [dayOffset, setDayOffset] = useState<number | null>(null);
  const [price, setPrice] = useState("5000");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [talentIds, setTalentIds] = useState<string[]>([]);
  const publishRef = useRef<HTMLButtonElement>(null);

  const venue = VENUES.find((v) => v.id === venueId);
  const basicsDone = title.trim() && category && dayOffset !== null;

  const publish = () => {
    if (!basicsDone || !venue || !category || dayOffset === null) return;
    const id = `made-${Date.now()}`;
    const event: DemoEvent = {
      id,
      title: title.trim().toLowerCase(),
      category,
      area: venue.area,
      venueName: venue.name,
      hostName,
      hostId: hostPersonaId,
      talentNames: TALENTS.filter((t) => talentIds.includes(t.id)).map((t) => t.name),
      dayOffset,
      startTime: "19:30",
      price: Math.max(Number(price) || 0, 0),
      capacity: venue.capacity,
      going: 0,
      blurb: "fresh off the press — full details landing shortly.",
      tags: ["just announced"],
      palette: CATEGORY_PALETTES[category],
    };
    const requests: BookingRequest[] = [
      {
        id: `${id}-venue`,
        type: "venue",
        targetId: venue.id,
        eventId: id,
        eventTitle: event.title,
        fromName: hostName,
        dayOffset,
        fee: venue.pricePerNight,
        note: "just published on nuclii — would love to hold the date.",
        status: "pending",
      },
      ...TALENTS.filter((t) => talentIds.includes(t.id)).map((t) => ({
        id: `${id}-${t.id}`,
        type: "talent" as const,
        targetId: t.id,
        eventId: id,
        eventTitle: event.title,
        fromName: hostName,
        dayOffset,
        fee: t.rateFrom,
        note: "line-up invite from the event page.",
        status: "pending" as const,
      })),
    ];
    dispatch({ type: "create-event", event, requests });
    void celebrateWaitlistSignup({
      anchor: publishRef.current,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    go({ name: "home" });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 0 ? go({ name: "home" }) : setStep(step - 1))}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BackIcon className="size-4" />
          {step === 0 ? "dashboard" : "back"}
        </button>
        <StepDots step={step} />
      </div>

      {step === 0 && (
        <div>
          <h1 className="text-xl font-extrabold lowercase tracking-tight text-foreground">
            what are we making?
          </h1>
          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground/80">
                event name
              </span>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="late summer listening party"
                className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </label>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground/80">what kind of night?</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={category === key}
                    onClick={() => setCategory(key)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                      category === key
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground/85 hover:border-foreground/40",
                    )}
                  >
                    {CATEGORY_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground/80">when?</p>
              <div className="flex flex-wrap gap-2">
                {DATE_CHOICES.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    aria-pressed={dayOffset === choice.dayOffset}
                    onClick={() => setDayOffset(choice.dayOffset)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                      dayOffset === choice.dayOffset
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground/85 hover:border-foreground/40",
                    )}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block max-w-40">
              <span className="mb-1.5 block text-xs font-semibold text-foreground/80">
                ticket price (₦)
              </span>
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!basicsDone}
            onClick={() => setStep(1)}
            className="mt-8 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            find a space
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl font-extrabold lowercase tracking-tight text-foreground">
            pick your space
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            we&apos;ll send the booking request the moment you publish.
          </p>
          <ul className="mt-6 space-y-2.5">
            {VENUES.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  aria-pressed={venueId === v.id}
                  onClick={() => setVenueId(v.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-[border-color,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                    venueId === v.id
                      ? "border-[var(--demo-accent-bright)] bg-accent"
                      : "border-transparent bg-card hover:bg-accent",
                  )}
                >
                  <EventCover
                    event={{ title: v.name, palette: v.palette, image: v.image }}
                    sizes="64px"
                    className="size-16 shrink-0 rounded-lg"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-foreground">{v.name}</span>
                      {venueId === v.id && <CheckIcon className="size-4 shrink-0 text-[var(--demo-accent-bright)]" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {v.area} · fits {v.capacity} · {naira(v.pricePerNight)}/night
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-foreground/70">{v.vibe}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={!venueId}
            onClick={() => setStep(2)}
            className="mt-8 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            now the line-up
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-extrabold lowercase tracking-tight text-foreground">
            book the line-up
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            optional — pick up to two. requests go out when you publish.
          </p>
          <ul className="mt-6 space-y-2.5">
            {TALENTS.map((t) => {
              const selected = talentIds.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setTalentIds((prev) =>
                        selected ? prev.filter((x) => x !== t.id) : prev.length < 2 ? [...prev, t.id] : prev,
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-[var(--demo-accent-bright)] bg-accent"
                        : "border-transparent bg-card hover:bg-accent",
                    )}
                  >
                    <InitialsAvatar name={t.name} hue={t.palette[1]} image={t.image} className="size-10" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-foreground">{t.name}</span>
                        {selected && <CheckIcon className="size-4 shrink-0 text-[var(--demo-accent-bright)]" />}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {t.craft} · from {naira(t.rateFrom)} · {t.eventsPlayed} events
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-2xl bg-card px-4 py-3.5 text-sm">
            <p className="font-bold lowercase text-foreground">{title || "your event"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {venue?.name} · {DATE_CHOICES.find((d) => d.dayOffset === dayOffset)?.label} ·{" "}
              {naira(Number(price) || 0)} entry
              {talentIds.length > 0 && ` · ${talentIds.length} on the line-up`}
            </p>
          </div>

          <button
            ref={publishRef}
            type="button"
            onClick={publish}
            className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            publish & send requests
          </button>
        </div>
      )}
    </div>
  );
}
