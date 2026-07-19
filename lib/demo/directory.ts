import type { Persona, TalentListing, VenueListing } from "./types";

/**
 * The four playable personas. Maya is deliberately dual-role (host + explorer)
 * so the roles-as-hats model is visible in the demo.
 */
export const PERSONAS: Persona[] = [
  {
    id: "maya",
    avatarImage: "/demo/avatar-maya.jpg",
    name: "maya adeyemi",
    handle: "@tablefortwelve",
    area: "peckham",
    bio: "runs table for twelve — a roaming supper club pairing home cooking with records.",
    leadRole: "host",
    hats: ["host", "explorer"],
    planId: "host-premium",
    avatarHue: "#8E7CA8",
  },
  {
    id: "sofia",
    avatarImage: "/demo/avatar-sofia.jpg",
    name: "sofia marin",
    handle: "@sofiaoutside",
    area: "new cross",
    bio: "will try anything once. six events this month and counting.",
    leadRole: "explorer",
    hats: ["explorer"],
    planId: "explorer-free",
    avatarHue: "#7A9E6E",
  },
  {
    id: "priya",
    avatarImage: "/demo/avatar-priya.jpg",
    name: "priya shah",
    handle: "@theglasshouse",
    area: "peckham",
    bio: "manages the glasshouse — a plant-filled events space above the rye.",
    leadRole: "venue",
    hats: ["venue", "explorer"],
    planId: "venue-basic",
    avatarHue: "#6F89A8",
    listingId: "glasshouse",
  },
  {
    id: "jerome",
    avatarImage: "/demo/avatar-jerome.jpg",
    name: "jerome okafor",
    handle: "@jeromeselects",
    area: "deptford",
    bio: "selector & dj. vinyl only — rare groove, amapiano, and everything between.",
    leadRole: "talent",
    hats: ["talent", "explorer"],
    planId: "talent-pro",
    avatarHue: "#B5736E",
    listingId: "jerome-selects",
  },
];

export function personaById(id: string) {
  return PERSONAS.find((p) => p.id === id);
}

/** Bookable spaces shown inside the host create-event flow. */
export const VENUES: VenueListing[] = [
  {
    id: "glasshouse",
    image: "/demo/venue-glasshouse.jpg",
    name: "the glasshouse",
    area: "peckham",
    capacity: 48,
    pricePerNight: 260,
    vibe: "plant-filled loft, long tables, golden-hour light",
    amenities: ["kitchen access", "sound system", "long tables", "rooftop terrace"],
    palette: ["#28352B", "#7A9E6E"],
  },
  {
    id: "arch-42",
    image: "/demo/venue-arch-42.jpg",
    name: "arch 42",
    area: "deptford",
    capacity: 120,
    pricePerNight: 420,
    vibe: "raw railway arch, big sound, late licence",
    amenities: ["function-one rig", "bar", "late licence", "smoking yard"],
    palette: ["#292433", "#8E7CA8"],
  },
  {
    id: "corner-store",
    image: "/demo/venue-corner-store.jpg",
    name: "the corner store",
    area: "hackney",
    capacity: 35,
    pricePerNight: 180,
    vibe: "converted shopfront, street-facing windows, intimate",
    amenities: ["street frontage", "small pa", "kitchenette"],
    palette: ["#38301F", "#C2A968"],
  },
  {
    id: "rye-studios",
    image: "/demo/venue-rye-studios.jpg",
    name: "rye studios",
    area: "peckham",
    capacity: 60,
    pricePerNight: 300,
    vibe: "white-wall studio, flexible layout, natural light",
    amenities: ["projector", "movable walls", "loading access"],
    palette: ["#26303C", "#8FA9C9"],
  },
  {
    id: "old-baths",
    image: "/demo/venue-old-baths.jpg",
    name: "the old baths",
    area: "walthamstow",
    capacity: 200,
    pricePerNight: 650,
    vibe: "restored victorian baths, dramatic ceilings",
    amenities: ["stage", "full bar", "green room", "capacity 200"],
    palette: ["#332A2E", "#B5736E"],
  },
];

export function venueById(id: string) {
  return VENUES.find((v) => v.id === id);
}

/** Bookable talent shown inside the host create-event flow. */
export const TALENTS: TalentListing[] = [
  {
    id: "jerome-selects",
    image: "/demo/talent-jerome-selects.jpg",
    name: "jerome okafor",
    craft: "dj / selector",
    area: "deptford",
    rateFrom: 150,
    tagline: "vinyl-only sets — rare groove, amapiano, broken beat",
    eventsPlayed: 34,
    palette: ["#3A2A28", "#B5736E"],
  },
  {
    id: "ada-kitchen",
    image: "/demo/talent-ada-kitchen.jpg",
    name: "ada's kitchen",
    craft: "chef / supper club catering",
    area: "brixton",
    rateFrom: 320,
    tagline: "west african sharing plates for long tables",
    eventsPlayed: 21,
    palette: ["#3A2E1E", "#C2A968"],
  },
  {
    id: "lumen-collective",
    image: "/demo/talent-lumen-collective.jpg",
    name: "lumen collective",
    craft: "lighting & set design",
    area: "hackney wick",
    rateFrom: 240,
    tagline: "rooms that glow — light installations for gatherings",
    eventsPlayed: 17,
    palette: ["#26303C", "#8FA9C9"],
  },
  {
    id: "tomi-shoots",
    image: "/demo/talent-tomi-shoots.jpg",
    name: "tomi shoots",
    craft: "photographer",
    area: "peckham",
    rateFrom: 120,
    tagline: "35mm event photography, prints in a week",
    eventsPlayed: 42,
    palette: ["#2B2A36", "#A8A2C9"],
  },
  {
    id: "strings-attached",
    image: "/demo/talent-strings-attached.jpg",
    name: "strings attached",
    craft: "live trio",
    area: "camberwell",
    rateFrom: 200,
    tagline: "jazz trio for dinners, weddings and slow sundays",
    eventsPlayed: 28,
    palette: ["#243330", "#6E9CA0"],
  },
  {
    id: "mona-throws",
    image: "/demo/talent-mona-throws.jpg",
    name: "mona throws",
    craft: "ceramics workshop lead",
    area: "hackney",
    rateFrom: 180,
    tagline: "hands-on wheel throwing for complete beginners",
    eventsPlayed: 15,
    palette: ["#382B23", "#BC8E71"],
  },
];

export function talentById(id: string) {
  return TALENTS.find((t) => t.id === id);
}
