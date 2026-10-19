// Content for the home concept section. Category cards resolve their photo by
// `imageKey` through the manifest below (never by array order); a key with no
// file keeps its placeholder colour. Mode photos come from
// /public/images/carousel-images. Cards keep the same size either way.

// Files in /public/images/categories, keyed by their filename (minus extension).
const categoryAssets: Record<string, string> = {
  "after-dark": "/images/categories/after-dark.jpg",
  faith: "/images/categories/faith.jpg",
  "for-creatives": "/images/categories/for-creatives.jpg",
  "for-the-plot": "/images/categories/for-the-plot.jpg",
  "get-active": "/images/categories/get-active.jpg",
  "im-just-open": "/images/categories/im-just-open.jpg",
  "lowkey-low-effort": "/images/categories/lowkey-low-effort.jpg",
  "main-character": "/images/categories/main-character.jpg",
  "on-campus": "/images/categories/on-campus.jpg",
  outside: "/images/categories/outside.jpg",
  "soft-life": "/images/categories/soft-life.jpg",
  "something-different": "/images/categories/something-different.jpg",
};

export function categoryImage(item: CategoryItem): string | undefined {
  return categoryAssets[item.imageKey];
}

export type CategoryItem = {
  title: string;
  description: string;
  imageKey: string;
  // only where a centre crop would cut the subject
  imagePosition?: string;
  placeholderColor: string;
};

export type ModeItem = {
  mode: string;
  // caption renders as: <from> to <to>
  caption: { from: string; to: string };
  image?: string;
  imageAlt?: string;
  placeholderColor: string;
  // decorative cards fanned out behind the main visual
  backgroundCards: readonly { color: string; rotate: number }[];
};

export const categoryItems: readonly CategoryItem[] = [
  { title: "after dark", description: "parties, live music + late nights", imageKey: "after-dark", placeholderColor: "#D9C6AF" },
  { title: "outside!!!", description: "day parties, festivals + big plans", imageKey: "outside", placeholderColor: "#D5B46B" },
  { title: "for the plot", description: "spontaneous plans + stories to tell", imageKey: "for-the-plot", placeholderColor: "#E79A8D" },
  { title: "\"i'm just open\"", description: "singles, dates + maybe something more", imageKey: "im-just-open", placeholderColor: "#CDB8D9" },
  { title: "lowkey, low effort", description: "casual plans without the big commitment", imageKey: "lowkey-low-effort", placeholderColor: "#B9C8D9" },
  { title: "main character activities", description: "experiences, pop-ups + things to try", imageKey: "main-character", placeholderColor: "#E6C79C" },
  { title: "for the creat*ves", description: "art, fashion, film + creative culture", imageKey: "for-creatives", placeholderColor: "#C7B6CB" },
  { title: "get active", description: "runs, games, sport + movement", imageKey: "get-active", placeholderColor: "#AEC7AD" },
  { title: "soft life", description: "wellness, good food + slower plans", imageKey: "soft-life", placeholderColor: "#DDD5B7" },
  { title: "something different", description: "niche, unexpected + hard to categorise", imageKey: "something-different", placeholderColor: "#B8CDD1" },
  { title: "on campus", description: "societies, student events + campus life", imageKey: "on-campus", placeholderColor: "#C5B8D7" },
  { title: "faith", description: "faith, community + gatherings", imageKey: "faith", imagePosition: "50% 25%", placeholderColor: "#D6CCBE" },
];

export const modeItems: readonly ModeItem[] = [
  {
    mode: "host",
    caption: { from: "idea", to: "audience" },
    image: "/images/carousel-images/host.png",
    imageAlt: "An art pop-up laid out on picnic blankets in a sunny park",
    placeholderColor: "#D9D9D9",
    backgroundCards: [
      { color: "#A9D5ED", rotate: -5 },
      { color: "#BCE69D", rotate: 6 },
    ],
  },
  {
    mode: "collaborate",
    caption: { from: "skill", to: "opportunity" },
    // the folder has no collaborate-named file: talent.png is the image shown
    // under "collaborate" in the design reference (and talent is the site's
    // "skill to opportunity" role on the partner page)
    image: "/images/carousel-images/talent.png",
    imageAlt: "A busy subway carriage full of people heading out",
    placeholderColor: "#D9D9D9",
    backgroundCards: [
      { color: "#E4D89A", rotate: -6 },
      { color: "#E59A9A", rotate: 5 },
    ],
  },
  {
    mode: "explore",
    caption: { from: "curiosity", to: "experience" },
    image: "/images/carousel-images/explore.png",
    imageAlt: "A snowy mountain trail with pins marking places to go",
    placeholderColor: "#D9D9D9",
    backgroundCards: [
      { color: "#A9D5ED", rotate: 3 },
      { color: "#8C7595", rotate: -6 },
      { color: "#AEBCA5", rotate: 5 },
    ],
  },
];

// Ticker use cases. FIFA + society lines are from the design reference; the
// supper clubs, ceramics studio, waterfight, vinyl selector, rooftop social and
// "idea + people saying they're down" reuse existing site copy (experience map,
// demo doorway, testimonials); run club, film night, fashion showcase,
// five-a-side and food pop-up were added to cover sport, film, fashion + food.
export const useCases: readonly string[] = [
  "that FIFA tournament everyone keeps talking about in the gc",
  "a candlelit supper club",
  "a run club that meets before work",
  "a society putting something together",
  "an open ceramics studio",
  "a film night in the back room of a café",
  "a supper club that sells out in days",
  "a fashion student’s first showcase",
  "a waterfight hosted by london splash club",
  "a five-a-side game that needs two more",
  "a vinyl selector with a full gig calendar",
  "a food pop-up for one weekend only",
  "a rooftop social",
  "an idea, a few people saying they’re down + a group chat",
];
