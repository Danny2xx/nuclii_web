import type { ExperienceRoleKey } from "@/lib/experience-roles";

export type DemoRole = ExperienceRoleKey; // "explorer" | "host" | "venue" | "talent"

export type PlanTier = {
  id: string;
  name: string;
  price: number; // £/month, 0 = free
  tagline: string;
  features: string[];
  highlight?: boolean;
};

export type RolePlans = {
  role: DemoRole;
  tiers: PlanTier[];
};

export type Persona = {
  id: string;
  name: string;
  handle: string;
  area: string;
  bio: string;
  leadRole: DemoRole;
  hats: DemoRole[];
  planId: string; // tier id from the plan ladder for their lead role
  avatarHue: string; // hex used for the initials avatar fallback
  avatarImage?: string; // /public path; initials shown when absent
  /** id into VENUES / TALENTS when this persona runs one of those listings */
  listingId?: string;
};

export type EventCategory =
  | "supper-clubs"
  | "workshops"
  | "nightlife"
  | "live-music"
  | "markets"
  | "pickup-sports"
  | "wellness"
  | "talks-film";

export type DemoEvent = {
  id: string;
  title: string;
  category: EventCategory;
  area: string;
  venueName: string;
  hostName: string;
  hostId?: string; // persona id when hosted by a seeded persona
  talentNames?: string[];
  /** days from "today" at runtime — the world never goes stale */
  dayOffset: number;
  startTime: string; // "20:00"
  price: number; // £, 0 = free
  capacity: number;
  going: number;
  blurb: string;
  tags: string[];
  palette: [string, string]; // duotone cover art + header bleed
  image?: string; // optional real photo, /public path
  featured?: boolean;
};

export type VenueListing = {
  id: string;
  name: string;
  area: string;
  capacity: number;
  pricePerNight: number;
  vibe: string;
  amenities: string[];
  palette: [string, string];
  image?: string;
};

export type TalentListing = {
  id: string;
  name: string;
  craft: string;
  area: string;
  rateFrom: number;
  tagline: string;
  eventsPlayed: number;
  palette: [string, string];
  image?: string;
};

export type BookingRequestType = "venue" | "talent";
export type BookingRequestStatus = "pending" | "accepted" | "declined";

export type BookingRequest = {
  id: string;
  type: BookingRequestType;
  targetId: string; // VenueListing.id or TalentListing.id
  eventId: string;
  eventTitle: string;
  fromName: string;
  dayOffset: number;
  fee: number;
  note?: string;
  status: BookingRequestStatus;
};

export type MessageThread = {
  id: string;
  betweenPersonaIds: [string, string];
  subject: string;
  messages: { fromPersonaId: string; text: string; minutesAgo: number }[];
};

export type Review = {
  eventTitle: string;
  author: string;
  text: string;
  rating: number; // 1-5
};
