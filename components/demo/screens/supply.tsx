"use client";

import {
  countdownLabel,
  resolveDate,
  talentById,
  tierById,
  venueById,
  whenLabel,
} from "@/lib/demo/world";
import type { BookingRequest } from "@/lib/demo/types";
import { cn } from "@/lib/utils";
import { useWorld } from "../world-store";
import { GroupedList, ScreenSection, StatusChip } from "../primitives";
import { CheckIcon, CloseIcon } from "../icons";

function RequestCard({ request, unit }: { request: BookingRequest; unit: string }) {
  const { dispatch } = useWorld();
  const d = resolveDate(request.dayOffset);
  const dateLabel = `${["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()]} ${d.getDate()}`;

  return (
    <li className="rounded-2xl bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold lowercase text-foreground">{request.eventTitle}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            from {request.fromName} · {dateLabel} · £{request.fee} {unit}
          </p>
        </div>
        <StatusChip tone="attention">new request</StatusChip>
      </div>
      {request.note && (
        <p className="mt-2.5 rounded-lg bg-background/55 px-3 py-2 text-xs leading-5 text-foreground/80">
          “{request.note}”
        </p>
      )}
      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "set-request-status", requestId: request.id, status: "accepted" })}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <CheckIcon className="size-3.5" />
          accept
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "set-request-status", requestId: request.id, status: "declined" })}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground transition-colors duration-150 hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <CloseIcon className="size-3.5" />
          decline
        </button>
      </div>
    </li>
  );
}

/* ── venue ─────────────────────────────────────────────────── */

export function VenueHome() {
  const { identity, requestsFor, allEvents, state } = useWorld();
  const listingId = identity?.kind === "persona" ? identity.persona.listingId : undefined;
  const listing = listingId ? venueById(listingId) : undefined;

  const requests = listingId ? requestsFor(listingId) : [];
  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted" && r.dayOffset >= 0);

  // bookings on the calendar: accepted requests + seeded events already at this space
  const fromEvents = listing
    ? allEvents.filter((e) => e.venueName === listing.name && e.dayOffset >= 0).map((e) => e.dayOffset)
    : [];
  const bookedOffsets = new Set([...accepted.map((r) => r.dayOffset), ...fromEvents]);

  const plan =
    identity?.kind === "persona"
      ? tierById(state.planOverrides[identity.persona.id] ?? identity.persona.planId)
      : undefined;
  const isPaid = (plan?.tier.price ?? 0) > 0;
  const revenue = accepted.reduce((sum, r) => sum + r.fee, 0);

  if (!listing) {
    return (
      <div className="max-w-md rounded-2xl bg-card p-8 text-center">
        <p className="text-sm font-semibold text-foreground">your space isn&apos;t listed yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          add photos, capacity and availability — hosts are searching every day.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        {listing.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {pending.length > 0
          ? `${pending.length} booking ${pending.length === 1 ? "request" : "requests"} waiting on you`
          : "all caught up — the calendar is filling nicely"}
      </p>

      {pending.length > 0 && (
        <ScreenSection title="booking requests">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {pending.map((request) => (
              <RequestCard key={request.id} request={request} unit="for the night" />
            ))}
          </ul>
        </ScreenSection>
      )}

      <ScreenSection title="this month">
        <div className="grid grid-cols-3 gap-3">
          <Stat value={String(bookedOffsets.size)} label="nights booked" />
          <Stat value={`£${revenue}`} label="booking revenue" />
          <Stat value={`${Math.min(Math.round((bookedOffsets.size / 30) * 100), 100)}%`} label="utilisation" />
        </div>
      </ScreenSection>

      <ScreenSection title="the diary">
        <MonthGrid bookedOffsets={bookedOffsets} />
      </ScreenSection>

      <ScreenSection title="your listing">
        <div className="rounded-2xl bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{listing.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {listing.area} · fits {listing.capacity} · £{listing.pricePerNight}/night
              </p>
              <p className="mt-1 text-xs text-foreground/70">{listing.vibe}</p>
            </div>
            <StatusChip tone="neutral">{plan?.tier.name ?? "open"} plan</StatusChip>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/80">profile strength</span>
              <span className="text-muted-foreground">70%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-[100%] w-[70%] rounded-full bg-[var(--demo-accent)]" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              spaces with 5+ photos get about 3× more requests — add two more to hit 100%.
            </p>
          </div>
        </div>
      </ScreenSection>

      <ScreenSection title="who's looking">
        <div className={cn("relative rounded-2xl bg-card p-4", !isPaid && "overflow-hidden")}>
          <div className={cn("grid grid-cols-3 gap-3", !isPaid && "blur-[7px]")} aria-hidden={!isPaid}>
            <Stat value="212" label="search views" />
            <Stat value="31" label="profile visits" />
            <Stat value="6" label="hosts shortlisted you" />
          </div>
          {!isPaid && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="rounded-lg bg-background/85 px-4 py-2 text-center text-sm font-semibold text-foreground backdrop-blur-sm">
                see who&apos;s viewing on venue plus
              </p>
            </div>
          )}
        </div>
      </ScreenSection>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card px-3 py-3.5 text-center">
      <p className="text-xl font-extrabold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-[0.6875rem] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function MonthGrid({ bookedOffsets }: { bookedOffsets: Set<number> }) {
  const today = new Date();
  const startWeekday = (today.getDay() + 6) % 7; // monday-first
  const cells = Array.from({ length: 28 + startWeekday }, (_, i) => i - startWeekday);

  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["m", "t", "w", "t", "f", "s", "s"].map((d, i) => (
          <span key={i} className="pb-1 text-[0.625rem] font-semibold text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((offset, i) => {
          if (offset < 0) return <span key={i} />;
          const date = resolveDate(offset);
          const booked = bookedOffsets.has(offset);
          const isToday = offset === 0;
          return (
            <span
              key={i}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md text-xs font-semibold",
                booked
                  ? "bg-[var(--demo-accent)]/25 text-[var(--demo-accent-bright)]"
                  : "text-foreground/60",
                isToday && "ring-1 ring-foreground/50",
              )}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
        <span aria-hidden="true" className="size-2 rounded-sm bg-[var(--demo-accent)]/50" />
        booked night
      </p>
    </div>
  );
}

/* ── talent ────────────────────────────────────────────────── */

export function TalentHome() {
  const { identity, requestsFor, allEvents, state } = useWorld();
  const listingId = identity?.kind === "persona" ? identity.persona.listingId : undefined;
  const listing = listingId ? talentById(listingId) : undefined;

  const requests = listingId ? requestsFor(listingId) : [];
  const pending = requests.filter((r) => r.status === "pending");
  const confirmed = requests
    .filter((r) => r.status === "accepted" && r.dayOffset >= 0)
    .sort((a, b) => a.dayOffset - b.dayOffset);
  const nextGig = confirmed[0];
  const nextGigEvent = nextGig ? allEvents.find((e) => e.id === nextGig.eventId) : undefined;

  const plan =
    identity?.kind === "persona"
      ? tierById(state.planOverrides[identity.persona.id] ?? identity.persona.planId)
      : undefined;

  const confirmedTotal = confirmed.reduce((sum, r) => sum + r.fee, 0);

  if (!listing) {
    return (
      <div className="max-w-md rounded-2xl bg-card p-8 text-center">
        <p className="text-sm font-semibold text-foreground">your portfolio isn&apos;t live yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          add your craft, rates and a few photos — organisers book from here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        {listing.craft}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {pending.length > 0
          ? `${pending.length} ${pending.length === 1 ? "booking wants" : "bookings want"} an answer`
          : "no requests waiting — your calendar is yours"}
      </p>

      {nextGig && (
        <div className="mt-6 rounded-3xl bg-card p-5">
          <StatusChip tone="accent">{countdownLabel(nextGig.dayOffset)}</StatusChip>
          <p className="mt-2 text-lg font-extrabold lowercase tracking-tight text-foreground">
            {nextGig.eventTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {nextGigEvent ? `${whenLabel(nextGigEvent)} · ${nextGigEvent.venueName}` : `booked by ${nextGig.fromName}`}
            {" · "}
            <span className="font-bold text-foreground">£{nextGig.fee}</span>
          </p>
        </div>
      )}

      {pending.length > 0 && (
        <ScreenSection title="booking requests">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {pending.map((request) => (
              <RequestCard key={request.id} request={request} unit="for the set" />
            ))}
          </ul>
        </ScreenSection>
      )}

      <ScreenSection title="money">
        <div className="grid grid-cols-3 gap-3">
          <Stat value={`£${confirmedTotal}`} label="confirmed this month" />
          <Stat value={`£${nextGig?.fee ?? 0}`} label="next payout" />
          <Stat value={String(listing.eventsPlayed)} label="events played" />
        </div>
      </ScreenSection>

      {confirmed.length > 1 && (
        <ScreenSection title="confirmed gigs">
          <GroupedList>
            {confirmed.slice(1).map((gig) => (
              <div
                key={gig.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold lowercase text-foreground">{gig.eventTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {countdownLabel(gig.dayOffset)} · booked by {gig.fromName}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-foreground">£{gig.fee}</span>
              </div>
            ))}
          </GroupedList>
        </ScreenSection>
      )}

      <ScreenSection title="how you're getting found">
        <div className="rounded-2xl bg-card p-4">
          <p className="text-sm leading-6 text-foreground/85">
            you appeared in <span className="font-bold text-foreground">12 searches</span> for{" "}
            {listing.craft}s in se london this week, and{" "}
            <span className="font-bold text-foreground">4 hosts</span> viewed your profile.
          </p>
          <p className="mt-2.5 text-xs text-muted-foreground">
            profiles with video get booked about 2× as often —{" "}
            <span className="font-semibold text-foreground/80">
              add one on {plan?.tier.name ?? "talent pro"}
            </span>
            .
          </p>
        </div>
      </ScreenSection>
    </div>
  );
}
