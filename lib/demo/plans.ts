import type { RolePlans } from "./types";

/**
 * Per-role subscription ladder — nuclii launch pricing (GBP/month unless noted).
 * Demand side stays free & frictionless; the optional attendee product and all
 * supply tiers carry the paid packages. Prices mirror the launch pricing sheet.
 */
export const PLAN_LADDER: RolePlans[] = [
  {
    role: "explorer",
    tiers: [
      {
        id: "explorer-free",
        name: "explorer",
        price: 0,
        tagline: "everything you need to find your people",
        features: [
          "discover every public event",
          "rsvp & mobile tickets",
          "save events and follow hosts",
          "reviews & photos after the night",
        ],
      },
      {
        id: "explorer-buddyup",
        name: "buddy up",
        price: 2.99,
        tagline: "bring someone along",
        features: [
          "add a plus-one to member events",
          "early access to event drops",
          "priority rsvp on limited events",
          "no booking fees",
        ],
        highlight: true,
      },
    ],
  },
  {
    role: "host",
    tiers: [
      {
        id: "host-free",
        name: "host",
        price: 0,
        tagline: "run your first events",
        features: [
          "2 live listings",
          "rsvp & guest management",
          "book venues & talent",
          "standard booking fees",
        ],
      },
      {
        id: "host-plus",
        name: "host plus",
        price: 19.99,
        tagline: "for hosts building a following",
        features: [
          "unlimited listings",
          "discovery boost",
          "full audience analytics",
          "followers & event drops",
          "lower booking fees",
        ],
        highlight: true,
      },
      {
        id: "host-premium",
        name: "host premium",
        price: 49.99,
        tagline: "for hosts who sell out",
        features: [
          "everything in plus",
          "featured placement",
          "verified host badge",
          "priority support",
        ],
      },
      {
        id: "host-business",
        name: "host business",
        price: 99.99,
        tagline: "for teams & event brands",
        features: [
          "everything in premium",
          "team seats & roles",
          "multiple brands",
          "dedicated support",
        ],
      },
    ],
  },
  {
    role: "venue",
    tiers: [
      {
        id: "venue-basic",
        name: "venue basic",
        price: 0,
        tagline: "put your space on the map",
        features: [
          "space listing & calendar",
          "receive booking requests",
          "messaging with hosts",
          "10% booking commission",
        ],
      },
      {
        id: "venue-plus",
        name: "venue plus",
        price: 19.99,
        tagline: "fill the quiet nights",
        features: [
          "boosted discovery",
          "who's viewing your space",
          "calendar sync",
          "instant-book settings",
        ],
        highlight: true,
      },
      {
        id: "venue-premium",
        name: "venue premium",
        price: 49.99,
        tagline: "for spaces in demand",
        features: [
          "everything in plus",
          "featured venue placement",
          "multiple spaces",
          "dedicated support",
        ],
      },
    ],
  },
  {
    role: "talent",
    tiers: [
      {
        id: "talent-free",
        name: "talent free",
        price: 0,
        tagline: "get found by organisers",
        features: [
          "portfolio profile",
          "receive booking requests",
          "gig calendar",
        ],
      },
      {
        id: "talent-pro",
        name: "talent pro",
        price: 9.99,
        tagline: "book more of the right gigs",
        features: [
          "priority in search",
          "video on your portfolio",
          "search & profile insights",
          "faster payouts",
        ],
        highlight: true,
      },
      {
        id: "talent-premium",
        name: "talent premium",
        price: 19.99,
        tagline: "for talent in demand",
        features: [
          "everything in pro",
          "featured talent placement",
          "multiple profiles",
          "verified talent badge",
        ],
      },
    ],
  },
];

export function plansForRole(role: RolePlans["role"]): RolePlans | undefined {
  return PLAN_LADDER.find((p) => p.role === role);
}

export function tierById(id: string) {
  for (const rolePlans of PLAN_LADDER) {
    const tier = rolePlans.tiers.find((t) => t.id === id);
    if (tier) return { role: rolePlans.role, tier };
  }
  return undefined;
}

/** Optional paid add-ons beyond the role subscriptions — launch pricing. */
export const ADD_ONS = [
  { name: "three-day boost", price: "£4.99", unit: "per push" },
  { name: "seven-day boost", price: "£12.99", unit: "per push" },
  { name: "featured event", price: "£9.99", unit: "per week" },
  { name: "featured venue", price: "£29.99", unit: "per month" },
  { name: "featured talent", price: "£9.99", unit: "per week" },
  { name: "verification", price: "£9.99", unit: "one-off" },
  { name: "request-to-join", price: "£2.99", unit: "per event" },
  { name: "host + venue bundle", price: "£129.99", unit: "per month" },
] as const;
