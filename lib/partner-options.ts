// Shared by the partner form and its API route, so the choices a visitor can
// pick are exactly the ones the server accepts.

export const PARTNER_TYPES = [
  { id: "society", label: "societies & unis" },
  { id: "venue", label: "venues & spaces" },
  { id: "talent", label: "talent & makers" },
  { id: "organiser", label: "organisers & communities" },
  { id: "brand", label: "brands", soon: true },
] as const;

export const EVENT_KINDS = [
  "music",
  "food",
  "craft & workshops",
  "sport & wellness",
  "faith",
  "culture",
  "student & society",
  "other",
] as const;

export const WAYS = [
  "co-host an event",
  "host a Studio night",
  "perform or run a session",
  "get featured",
  "become a recommended venue",
  "sponsor (coming soon)",
] as const;

export type PartnerTypeId = (typeof PARTNER_TYPES)[number]["id"];

export const REPLY_TIME = "3–5 business days";
