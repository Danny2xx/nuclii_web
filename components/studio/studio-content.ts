// Content for /studio. Everything here is placeholder until the real events,
// roles and journal posts are ready; swap the entries, the layout stays.

// one clip, looped; web copies of public/studio_videos/*.MOV (smaller, no sound)
export const heroVideos = ["/studio_videos/hero_main.mp4"] as const;

// the rail's trailer: a short muted loop, cropped to drop the CapCut mark (upcoming event, the team, a past
// night or anything worth sharing); `href` is where tapping it goes
export const trailer = {
  src: "/studio_videos/trailer.mp4",
  label: "watch the trailer",
  href: "https://www.tiktok.com/@wearenuclii",
} as const;

// the next event in the rail; set to null and the rail shows "catch-up"
// (the journal) instead
export const comingUp: {
  title: string;
  category: string;
  where: string;
  when: string;
  image: string;
  // an optional prize, shown as a stamp on the poster
  prize?: string;
} | null = {
  title: "spelling bee",
  category: "for the plot",
  where: "location: tbc",
  when: "date tbc",
  image: "/images/categories/spelling_bee.jpg",
  prize: "£100 voucher up for grabs",
};

export const whyJoin = "we're the ones who turn a quiet tuesday into a 6am story. come build the thing you'd actually use.";

// placeholder team moments for the photo pile above the flyer
export const teamPhotos: readonly { src: string; tilt: number }[] = [
  { src: "/images/categories/games.jpg", tilt: -6 },
  { src: "/images/explore-hover/grace-birthday-linkup.jpg", tilt: 4 },
  { src: "/images/categories/image-3.jpg", tilt: -2 },
  { src: "/images/categories/image-4.jpg", tilt: 7 },
];

// The memories wall: photos taped onto the calendar on the day they happened.
// Add one per event (date as YYYY-MM-DD); months with memories get a page.
// Placeholders for now.
export const memoriesWall: readonly { date: string; title: string; image: string }[] = [
  { date: "2026-09-05", title: "rooftop till sunrise", image: "/images/categories/roof.jpg" },
  { date: "2026-09-17", title: "the first watch party", image: "/images/categories/movien.jpg" },
  { date: "2026-09-23", title: "flowers & candles workshop", image: "/images/categories/soft-life.jpg" },
  { date: "2026-10-04", title: "sunday living-room session", image: "/images/categories/group.jpg" },
  { date: "2026-10-09", title: "board games, no rules", image: "/images/categories/group-chill.jpg" },
  { date: "2026-10-15", title: "picnic in the park", image: "/images/categories/outside.jpg" },
];

export const mission = [
  "tbh, nuclii was built for us. for the house parties we missed, the do-it-for-the-plot moments, chilling on a rooftop car park till 6am and the no-sleep recaps the morning after.",
  "now it's yours. make the moments happen, make the memories last.",
] as const;

export const missionCta = { label: "tap in", href: "/join" } as const;

// events we're hosting: pinned posters on the board
export const hosting: readonly { title: string; when: string; where: string; image: string; tilt: number }[] = [
  { title: "UFC tournament", when: "date tbc", where: "Birmingham", image: "/images/categories/ufc.jpg", tilt: -3 },
  { title: "unpopular opinions", when: "date tbc", where: "Birmingham", image: "/images/explore-hover/unpopular-opinions.jpg", tilt: 2.5 },
  { title: "puff puff contest", when: "date tbc", where: "Birmingham", image: "/images/categories/puffpuff.jpg", tilt: -1.5 },
];

// ideas we're thinking of hosting: sticky notes
export const ideas: readonly { title: string; tilt: number }[] = [
  { title: "pitch my friend", tilt: 3 },
  { title: "sunday potluck", tilt: -2.5 },
  { title: "board games night", tilt: 1.5 },
  { title: "are we compatible?", tilt: -3.5 },
];


export const journal: readonly { date: string; title: string; line: string }[] = [
  { date: "Oct 2026", title: "studio is open", line: "this is where we'll share the nights, the tests, the fails and the wins." },
  { date: "coming soon", title: "studio night #1", line: "games, snacks and a lot of noise. date and place soon." },
  { date: "coming soon", title: "why we built nuclii", line: "the rooftop, the 6am finishes and the cold-water swims that started it." },
  { date: "coming soon", title: "the first recap", line: "photos, the fails and what we'd change next time." },
];
