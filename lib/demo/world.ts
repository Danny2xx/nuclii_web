import { EXPERIENCE_ROLES } from "@/lib/experience-roles";
import { CATEGORY_LABELS, SEED_EVENTS } from "./events";
import type { DemoEvent, DemoRole } from "./types";

export { CATEGORY_LABELS, CATEGORY_PALETTES, SEED_EVENTS, eventById } from "./events";
export { PERSONAS, VENUES, TALENTS, personaById, venueById, talentById } from "./directory";
export { PLAN_LADDER, plansForRole, tierById } from "./plans";
export { SEED_REQUESTS, SEED_THREADS, SEED_REVIEWS } from "./social";

export function roleSignal(role: DemoRole): string {
  return EXPERIENCE_ROLES[role].signal;
}

/** Resolve a seed dayOffset against the real clock so the world never goes stale. */
export function resolveDate(dayOffset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

/** "tonight" / "tomorrow" / "thu 24 jul" style label. */
export function whenLabel(event: Pick<DemoEvent, "dayOffset" | "startTime">): string {
  if (event.dayOffset === 0) return `tonight · ${event.startTime}`;
  if (event.dayOffset === 1) return `tomorrow · ${event.startTime}`;
  const d = resolveDate(event.dayOffset);
  const day = DAY_NAMES[d.getDay()];
  return `${day} ${d.getDate()} · ${event.startTime}`;
}

/** "sat 18" — weekday + date for a seed offset, always true to the real clock. */
export function shortDayLabel(dayOffset: number): string {
  const d = resolveDate(dayOffset);
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
}

/** "2 days away" style label for the up-next bar. */
export function countdownLabel(dayOffset: number): string {
  if (dayOffset <= 0) return "today";
  if (dayOffset === 1) return "tomorrow";
  return `${dayOffset} days away`;
}

/** Illustrative naira formatting, e.g. 12000 → "₦12,000". */
export function naira(n: number): string {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

export function priceLabel(price: number): string {
  return price === 0 ? "free" : naira(price);
}

export function isWeekend(dayOffset: number): boolean {
  const day = resolveDate(dayOffset).getDay();
  return day === 0 || day === 6;
}

export type Shelf = { id: string; title: string; eventIds: string[] };

/**
 * Build the attendee home shelves from a full event list (seed + any events
 * created during the session). Rule: 4–5 FULL shelves — an event may appear
 * in more than one shelf, and thin shelves are dropped entirely.
 */
export function buildShelves(events: DemoEvent[]): Shelf[] {
  const upcoming = events.filter((e) => e.dayOffset >= 0);
  const ids = (list: DemoEvent[]) => list.map((e) => e.id);

  const tonight = upcoming.filter((e) => e.dayOffset === 0);
  const weekend = upcoming.filter((e) => e.dayOffset > 0 && isWeekend(e.dayOffset));
  const suppers = upcoming.filter((e) => e.category === "supper-clubs");
  const becauseYouWent = upcoming.filter(
    (e) => e.category === "workshops" || e.category === "talks-film",
  );
  const fromFollowed = upcoming.filter(
    (e) =>
      e.hostId === "maya" ||
      e.hostName === "mona throws" ||
      e.hostName === "piano nights" ||
      e.talentNames?.includes("jerome okafor"),
  );

  const shelves: Shelf[] = [
    { id: "tonight", title: "tonight near you", eventIds: ids(tonight) },
    { id: "weekend", title: "this weekend", eventIds: ids(weekend) },
    { id: "followed", title: "new from people you follow", eventIds: ids(fromFollowed) },
    { id: "suppers", title: "supper clubs", eventIds: ids(suppers) },
    {
      id: "because",
      title: "because you went to hackney ceramics evening",
      eventIds: ids(becauseYouWent),
    },
  ];

  // a sparse shelf breaks the illusion faster than a missing one
  return shelves.filter((s) => s.eventIds.length >= 3);
}

export function browseCategories() {
  return (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    count: SEED_EVENTS.filter((e) => e.category === key && e.dayOffset >= 0).length,
  }));
}
