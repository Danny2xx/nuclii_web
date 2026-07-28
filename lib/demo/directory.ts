import type { Persona, TalentListing, VenueListing } from "./types";

/**
 * The four playable personas (a simulated lagos world). Tolu is deliberately
 * dual-role (host + explorer) so the roles-as-hats model is visible in the demo.
 */
export const PERSONAS: Persona[] = [
  {
    id: "maya",
    avatarImage: "/demo/avatar-maya.jpg",
    name: "tolu adeyemi",
    handle: "@tolustable",
    area: "lekki",
    bio: "runs tolu's table — a roaming supper club pairing home cooking with records.",
    leadRole: "host",
    hats: ["host", "explorer"],
    planId: "host-premium",
    avatarHue: "#8E7CA8",
  },
  {
    id: "sofia",
    avatarImage: "/demo/avatar-sofia.jpg",
    name: "amaka eze",
    handle: "@amakaout",
    area: "yaba",
    bio: "will try anything once. six events this month and counting.",
    leadRole: "explorer",
    hats: ["explorer"],
    planId: "explorer-free",
    avatarHue: "#7A9E6E",
  },
  {
    id: "priya",
    avatarImage: "/demo/avatar-priya.jpg",
    name: "funke bakare",
    handle: "@thegreenhouse",
    area: "lekki",
    bio: "manages the greenhouse — a plant-filled rooftop space on the island.",
    leadRole: "venue",
    hats: ["venue", "explorer"],
    planId: "venue-basic",
    avatarHue: "#6F89A8",
    listingId: "glasshouse",
  },
  {
    id: "jerome",
    avatarImage: "/demo/avatar-jerome.jpg",
    name: "emeka okafor",
    handle: "@emekaselects",
    area: "surulere",
    bio: "selector & dj. vinyl only — afrobeats, amapiano, and everything between.",
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

/** Bookable spaces shown inside the host create-event flow. Prices are naira. */
export const VENUES: VenueListing[] = [
  {
    id: "glasshouse",
    image: "/demo/venue-glasshouse.jpg",
    name: "the greenhouse",
    area: "lekki",
    capacity: 48,
    pricePerNight: 150000,
    vibe: "plant-filled rooftop, long tables, island light",
    amenities: ["kitchen access", "sound system", "long tables", "rooftop terrace"],
    palette: ["#28352B", "#7A9E6E"],
  },
  {
    id: "arch-42",
    image: "/demo/venue-arch-42.jpg",
    name: "the warehouse, yaba",
    area: "yaba",
    capacity: 120,
    pricePerNight: 250000,
    vibe: "raw warehouse, big sound, late nights",
    amenities: ["full rig", "bar", "late licence", "open yard"],
    palette: ["#292433", "#8E7CA8"],
  },
  {
    id: "corner-store",
    image: "/demo/venue-corner-store.jpg",
    name: "the shop, surulere",
    area: "surulere",
    capacity: 35,
    pricePerNight: 100000,
    vibe: "converted shopfront, street-facing windows, intimate",
    amenities: ["street frontage", "small pa", "kitchenette"],
    palette: ["#38301F", "#C2A968"],
  },
  {
    id: "rye-studios",
    image: "/demo/venue-rye-studios.jpg",
    name: "white space, ikoyi",
    area: "ikoyi",
    capacity: 60,
    pricePerNight: 180000,
    vibe: "white-wall studio, flexible layout, natural light",
    amenities: ["projector", "movable walls", "loading access"],
    palette: ["#26303C", "#8FA9C9"],
  },
  {
    id: "old-baths",
    image: "/demo/venue-old-baths.jpg",
    name: "the terminal, vi",
    area: "victoria island",
    capacity: 200,
    pricePerNight: 400000,
    vibe: "grand hall, dramatic ceilings, full production",
    amenities: ["stage", "full bar", "green room", "capacity 200"],
    palette: ["#332A2E", "#B5736E"],
  },
];

export function venueById(id: string) {
  return VENUES.find((v) => v.id === id);
}

/** Bookable talent shown inside the host create-event flow. Rates are naira. */
export const TALENTS: TalentListing[] = [
  {
    id: "jerome-selects",
    image: "/demo/talent-jerome-selects.jpg",
    name: "emeka okafor",
    craft: "dj / selector",
    area: "surulere",
    rateFrom: 80000,
    tagline: "vinyl-only sets — afrobeats, amapiano, alté",
    eventsPlayed: 34,
    palette: ["#3A2A28", "#B5736E"],
  },
  {
    id: "ada-kitchen",
    image: "/demo/talent-ada-kitchen.jpg",
    name: "ada's kitchen",
    craft: "chef / supper club catering",
    area: "yaba",
    rateFrom: 150000,
    tagline: "igbo & efik sharing plates for long tables",
    eventsPlayed: 21,
    palette: ["#3A2E1E", "#C2A968"],
  },
  {
    id: "lumen-collective",
    image: "/demo/talent-lumen-collective.jpg",
    name: "glow lagos",
    craft: "lighting & set design",
    area: "ikeja",
    rateFrom: 120000,
    tagline: "rooms that glow — light installations for gatherings",
    eventsPlayed: 17,
    palette: ["#26303C", "#8FA9C9"],
  },
  {
    id: "tomi-shoots",
    image: "/demo/talent-tomi-shoots.jpg",
    name: "tomi shoots",
    craft: "photographer",
    area: "lekki",
    rateFrom: 60000,
    tagline: "35mm event photography, prints in a week",
    eventsPlayed: 42,
    palette: ["#2B2A36", "#A8A2C9"],
  },
  {
    id: "strings-attached",
    image: "/demo/talent-strings-attached.jpg",
    name: "the highlife trio",
    craft: "live band",
    area: "surulere",
    rateFrom: 100000,
    tagline: "highlife & jazz for dinners, weddings and slow sundays",
    eventsPlayed: 28,
    palette: ["#243330", "#6E9CA0"],
  },
  {
    id: "mona-throws",
    image: "/demo/talent-mona-throws.jpg",
    name: "nkechi throws",
    craft: "ceramics workshop lead",
    area: "yaba",
    rateFrom: 90000,
    tagline: "hands-on wheel throwing for complete beginners",
    eventsPlayed: 15,
    palette: ["#382B23", "#BC8E71"],
  },
];

export function talentById(id: string) {
  return TALENTS.find((t) => t.id === id);
}
