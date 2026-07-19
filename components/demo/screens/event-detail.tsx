"use client";

import { useRef } from "react";
import { SEED_REVIEWS, priceLabel, whenLabel } from "@/lib/demo/world";
import { celebrateWaitlistSignup } from "@/components/motion/success-confetti";
import { cn } from "@/lib/utils";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { EventCover, GroupedList, InitialsAvatar, ScreenSection, StatusChip } from "../primitives";
import { BackIcon, CheckIcon, MapPinIcon } from "../icons";
import { BookmarkMark, GoingMark, NightsMark } from "../marks";

export function EventDetailScreen({ id }: { id: string }) {
  const { eventById, myRsvps, mySaved, dispatch } = useWorld();
  const { back, go } = useDemoRouter();
  const rsvpRef = useRef<HTMLButtonElement>(null);

  const event = eventById(id);
  if (!event) {
    return (
      <p className="text-sm text-muted-foreground">
        this event has come and gone.{" "}
        <button type="button" onClick={back} className="font-semibold text-foreground underline-offset-4 hover:underline">
          go back
        </button>
      </p>
    );
  }

  const going = myRsvps.includes(event.id);
  const saved = mySaved.includes(event.id);
  const isPast = event.dayOffset < 0;
  const spotsLeft = Math.max(event.capacity - event.going, 0);
  const fillRatio = event.capacity > 0 ? Math.min(event.going / event.capacity, 1) : 0;
  const reviews = SEED_REVIEWS.filter((r) => r.eventTitle === event.title);
  const [deep] = event.palette;

  const onRsvp = () => {
    if (going) {
      dispatch({ type: "un-rsvp", eventId: event.id });
      return;
    }
    dispatch({ type: "rsvp", eventId: event.id });
    void celebrateWaitlistSignup({
      anchor: rsvpRef.current,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* colour-bled header */}
      <div
        className="-mx-5 -mt-7 px-5 pb-6 pt-4 sm:-mx-6 sm:px-6 lg:-mx-16 lg:-mt-9 lg:rounded-b-3xl lg:px-16 2xl:-mx-24 2xl:px-24"
        style={{
          background: `linear-gradient(180deg, ${deep}66 0%, transparent 100%)`,
        }}
      >
        <button
          type="button"
          onClick={back}
          className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-foreground/80 transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BackIcon className="size-4" />
          back
        </button>

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:text-left">
          <EventCover
            event={event}
            sizes="224px"
            className="aspect-square w-44 rounded-2xl shadow-[var(--shadow-card)] sm:w-52"
          />
          <div className="min-w-0 flex-1 pb-1">
            {isPast ? (
              <StatusChip tone="neutral">past event</StatusChip>
            ) : spotsLeft <= 8 ? (
              <StatusChip tone="attention">{spotsLeft} spots left</StatusChip>
            ) : null}
            <h1 className="mt-2 text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground text-balance sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-foreground/80 sm:justify-start">
              <span className="font-semibold">{whenLabel(event)}</span>
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="size-3.5" />
                {event.venueName}, {event.area}
              </span>
              <span className="font-bold text-foreground">{priceLabel(event.price)}</span>
            </p>

            {/* actions — pill row, apple-music grammar */}
            {!isPast && (
              <div className="mt-5 flex items-center justify-center gap-2.5 sm:justify-start">
                <button
                  ref={rsvpRef}
                  type="button"
                  onClick={onRsvp}
                  className={cn(
                    "inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold transition-[background-color,color,opacity,transform] duration-150 motion-safe:active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    going
                      ? "bg-white/12 text-foreground hover:bg-white/16"
                      : "bg-primary text-primary-foreground hover:opacity-85",
                  )}
                >
                  {going && <CheckIcon className="size-4 text-[var(--demo-accent-bright)]" />}
                  {going
                    ? "you're in"
                    : event.price === 0
                      ? "count me in"
                      : `rsvp · ${priceLabel(event.price)}`}
                </button>
                {going && (
                  <button
                    type="button"
                    onClick={() => go({ name: "ticket", id: event.id })}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white/8 px-5 text-sm font-bold text-foreground transition-colors duration-150 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <NightsMark className="size-5" />
                    ticket
                  </button>
                )}
                <button
                  type="button"
                  aria-pressed={saved}
                  onClick={() => dispatch({ type: "toggle-save", eventId: event.id })}
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-full transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    saved
                      ? "bg-white/14 text-foreground"
                      : "bg-white/8 text-muted-foreground hover:bg-white/12 hover:text-foreground",
                  )}
                >
                  <BookmarkMark className="size-5" />
                  <span className="sr-only">{saved ? "remove from saved" : "save for later"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* the room so far */}
      {!isPast && event.capacity > 0 && (
        <div className="mt-6 rounded-2xl bg-card p-4">
          <p className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <GoingMark className="size-[1.15rem]" />
              {event.going} going
            </span>
            <span className="text-muted-foreground">capacity {event.capacity}</span>
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${fillRatio * 100}%`, background: "var(--demo-accent)" }}
            />
          </div>
        </div>
      )}

      <ScreenSection title="the plan">
        <p className="max-w-[65ch] text-sm leading-6 text-foreground/85">{event.blurb}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <StatusChip key={tag} tone="neutral">
              {tag}
            </StatusChip>
          ))}
        </div>
      </ScreenSection>

      <ScreenSection title="who's making it happen">
        <GroupedList>
          <div className="flex items-center gap-3 px-4 py-3">
            <InitialsAvatar name={event.hostName} hue="#8E7CA8" className="size-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{event.hostName}</p>
              <p className="text-xs text-muted-foreground">host</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <InitialsAvatar name={event.venueName} hue="#6F89A8" className="size-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{event.venueName}</p>
              <p className="text-xs text-muted-foreground">venue · {event.area}</p>
            </div>
          </div>
          {event.talentNames?.map((name) => (
            <div key={name} className="flex items-center gap-3 px-4 py-3">
              <InitialsAvatar name={name} hue="#B5736E" className="size-9" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">talent</p>
              </div>
            </div>
          ))}
        </GroupedList>
      </ScreenSection>

      {reviews.length > 0 && (
        <ScreenSection title="what people said">
          <GroupedList>
            {reviews.map((review) => (
              <div key={review.author} className="px-4 py-3.5">
                <p className="text-sm leading-6 text-foreground/85">“{review.text}”</p>
                <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
                  {review.author} · {"★".repeat(review.rating)}
                </p>
              </div>
            ))}
          </GroupedList>
        </ScreenSection>
      )}
    </div>
  );
}
