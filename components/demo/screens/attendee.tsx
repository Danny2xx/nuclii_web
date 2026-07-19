"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_PALETTES,
  browseCategories,
  buildShelves,
  priceLabel,
  whenLabel,
} from "@/lib/demo/world";
import type { DemoEvent, EventCategory } from "@/lib/demo/types";
import { cn } from "@/lib/utils";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { ArtCard, EventCover, GroupedList, ScreenSection, StatusChip } from "../primitives";
import { BackIcon, ForwardIcon, MapPinIcon } from "../icons";
import { BookmarkMark, NightsMark } from "../marks";
import { MapScreen } from "./map";

export function EventCard({
  event,
  className,
  large,
}: {
  event: DemoEvent;
  className?: string;
  large?: boolean;
}) {
  const { go } = useDemoRouter();
  const { mySaved } = useWorld();
  const nearlyFull = event.capacity > 0 && event.going / event.capacity >= 0.9;

  return (
    <button
      type="button"
      onClick={() => go({ name: "event", id: event.id })}
      className={cn(
        "group shrink-0 snap-start text-left transition-transform duration-200 ease-out motion-safe:hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        large ? "w-64 sm:w-72" : "w-48 sm:w-56",
        className,
      )}
    >
      <ArtCard
        event={event}
        sizes={large ? "288px" : "224px"}
        className={large ? "aspect-[4/5]" : "aspect-square"}
        title={event.title}
        meta={`${whenLabel(event)} · ${event.area}`}
        metaSecondary={priceLabel(event.price)}
        topLeft={
          nearlyFull ? (
            <StatusChip tone="attention" className="bg-black/55 backdrop-blur-sm">
              almost full
            </StatusChip>
          ) : undefined
        }
        topRight={
          mySaved.includes(event.id) ? (
            <span className="rounded-full bg-black/55 p-1.5 backdrop-blur-sm">
              <BookmarkMark className="size-4" />
            </span>
          ) : undefined
        }
      />
    </button>
  );
}

function ShelfRow({
  title,
  events,
  large,
}: {
  title: string;
  events: DemoEvent[];
  large?: boolean;
}) {
  return (
    <ScreenSection title={title}>
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 lg:-mx-16 lg:px-16 2xl:-mx-24 2xl:px-24 [scrollbar-width:none]">
        {events.map((event) => (
          <EventCard key={event.id} event={event} large={large} />
        ))}
      </div>
    </ScreenSection>
  );
}

export function AttendeeHome() {
  const { allEvents, identity, myRsvps } = useWorld();
  const { go } = useDemoRouter();
  const shelves = useMemo(() => buildShelves(allEvents), [allEvents]);
  const firstName =
    identity?.kind === "persona"
      ? identity.persona.name.split(" ")[0]
      : (identity?.guest.name.split(" ")[0] ?? "you");

  // tonight's pick: the featured event, unless you're already going
  const pick =
    allEvents.find((e) => e.featured && e.dayOffset >= 0 && !myRsvps.includes(e.id)) ??
    allEvents.find((e) => e.dayOffset >= 0 && !myRsvps.includes(e.id));

  return (
    <div>
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        good evening, {firstName}
      </h1>

      {pick && (
        <button
          type="button"
          onClick={() => go({ name: "event", id: pick.id })}
          className="group mt-7 block w-full text-left transition-transform duration-200 ease-out motion-safe:hover:scale-[1.005] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <p className="mb-3 text-xs font-bold lowercase text-muted-foreground">
            our pick for you
          </p>
          <div className="relative overflow-hidden rounded-3xl">
            <EventCover event={pick} sizes="1024px" className="aspect-[16/10] sm:aspect-[21/9]" />
            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/82 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold lowercase leading-[1.02] tracking-[-0.03em] text-white text-balance sm:text-4xl">
                  {pick.title}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-white/80">
                  {whenLabel(pick)} · {pick.venueName}, {pick.area} ·{" "}
                  <span className="font-bold text-white">{priceLabel(pick.price)}</span>
                </p>
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black sm:inline-flex">
                have a look
                <ForwardIcon className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </button>
      )}

      {shelves.map((shelf, i) => (
        <ShelfRow
          key={shelf.id}
          title={shelf.title}
          large={i === 0}
          events={shelf.eventIds
            .map((id) => allEvents.find((e) => e.id === id))
            .filter((e): e is DemoEvent => Boolean(e) && e!.id !== pick?.id)}
        />
      ))}
    </div>
  );
}

export function BrowseScreen() {
  const { go } = useDemoRouter();
  const { allEvents } = useWorld();
  const categories = useMemo(() => browseCategories(), []);
  const [view, setView] = useState<"categories" | "map">("categories");

  // one representative photo per category, drawn from the seeded world
  const coverFor = (key: string) =>
    allEvents.find((e) => e.category === key && e.dayOffset >= 0 && e.image) ??
    allEvents.find((e) => e.category === key);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
            browse
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">every kind of night, one place.</p>
        </div>
        <div className="flex rounded-full bg-card p-1">
          {(["categories", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                view === v ? "bg-white/12 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "map" ? "map" : "categories"}
            </button>
          ))}
        </div>
      </div>

      {view === "map" ? (
        <div className="mt-6">
          <MapScreen />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
          {categories
            .filter((c) => c.count > 0)
          .map((category) => {
            const cover = coverFor(category.key);
            const [deep, bright] = CATEGORY_PALETTES[category.key];
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => go({ name: "browse-category", category: category.key })}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left transition-transform duration-200 ease-out motion-safe:hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <EventCover
                  event={cover ?? { title: category.label, palette: [deep, bright] }}
                  sizes="320px"
                  className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="font-display text-base font-extrabold lowercase leading-tight tracking-[-0.03em] text-white">
                    {category.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white/72">
                    {category.count} coming up
                  </p>
                </div>
              </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export function CategoryScreen({ category }: { category: string }) {
  const { allEvents } = useWorld();
  const { back } = useDemoRouter();
  const events = allEvents
    .filter((e) => e.category === category && e.dayOffset >= 0)
    .sort((a, b) => a.dayOffset - b.dayOffset);
  const label = CATEGORY_LABELS[category as EventCategory] ?? category;

  return (
    <div>
      <button
        type="button"
        onClick={back}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BackIcon className="size-4" />
        browse
      </button>
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        {label}
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-5">
        {events.map((event) => (
          <EventCard key={event.id} event={event} className="w-full sm:w-full" />
        ))}
      </div>
      {events.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          nothing scheduled here yet — check back after the weekend.
        </p>
      )}
    </div>
  );
}

export function LibraryScreen() {
  const { allEvents, myRsvps, mySaved } = useWorld();

  const going = allEvents
    .filter((e) => e.dayOffset >= 0 && myRsvps.includes(e.id))
    .sort((a, b) => a.dayOffset - b.dayOffset);
  const saved = allEvents.filter((e) => e.dayOffset >= 0 && mySaved.includes(e.id));
  const past = allEvents
    .filter(
      (e) =>
        e.dayOffset < 0 &&
        (myRsvps.includes(e.id) || ["ceramics-past", "dub-past", "table-vol-8"].includes(e.id)),
    )
    .sort((a, b) => b.dayOffset - a.dayOffset);

  return (
    <div className="max-w-2xl">
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        your nights
      </h1>
      <ScreenSection title="going">
        {going.length > 0 ? (
          <LibraryRows events={going} note="ticket" asTicket />
        ) : (
          <p className="rounded-2xl bg-card px-4 py-6 text-sm text-muted-foreground">
            nothing booked yet — your next great night is one rsvp away.
          </p>
        )}
      </ScreenSection>
      {saved.length > 0 && (
        <ScreenSection title="saved for later">
          <LibraryRows events={saved} />
        </ScreenSection>
      )}
      {past.length > 0 && (
        <ScreenSection title="where you've been">
          <LibraryRows events={past} />
        </ScreenSection>
      )}
    </div>
  );
}

function LibraryRows({
  events,
  note,
  asTicket,
}: {
  events: DemoEvent[];
  note?: string;
  asTicket?: boolean;
}) {
  const { go } = useDemoRouter();
  return (
    <GroupedList>
      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => go({ name: asTicket ? "ticket" : "event", id: event.id })}
          className="flex w-full items-center gap-3.5 px-3.5 py-3 text-left transition-colors duration-150 hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <EventCover event={event} sizes="56px" className="size-13 shrink-0 rounded-lg" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold lowercase text-foreground">
              {event.title}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPinIcon className="size-3" />
              {event.venueName} · {whenLabel(event)}
            </span>
          </span>
          {note &&
            (asTicket ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--demo-accent)]/18 px-2.5 py-1 text-[0.6875rem] font-semibold text-[var(--demo-accent-bright)]">
                <NightsMark className="size-4" />
                {note}
              </span>
            ) : (
              <StatusChip tone="accent">{note}</StatusChip>
            ))}
        </button>
      ))}
    </GroupedList>
  );
}
