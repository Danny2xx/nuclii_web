// Content for the home "explore" section: example listings fanned around the
// app preview. Each card's photo is looked up by `imageKey` (its filename in
// /public/images/explore-hover), never by array order; a key with no file keeps
// the card's placeholder colour.

const exploreAssets: Record<string, string> = {
  footy: "/images/explore-hover/footy.jpg",
  "pop-up": "/images/explore-hover/pop-up.jpg",
  rave: "/images/explore-hover/rave.jpg",
  study: "/images/explore-hover/study.jpg",
  "watch-party": "/images/explore-hover/watch-party.webp",
  "fifa-tournament": "/images/explore-hover/fifa-tournament.jpg",
  "love-island-watchparty": "/images/explore-hover/love-island-watchparty.jpg",
  "mario-party": "/images/explore-hover/mario-party.jpg",
  "painting-park": "/images/explore-hover/painting-park.jpg",
  "sunday-dinner": "/images/explore-hover/sunday-diner.jpg",
  "uno-match": "/images/explore-hover/uno-match.jpg",
  "unpopular-opinions": "/images/explore-hover/unpopular-opinions.jpg",
  "bible-study": "/images/explore-hover/bible-study.jpg",
  "grace-birthday-linkup": "/images/explore-hover/grace-birthday-linkup.jpg",
};

// Card centre, as a % of the stage, plus a resting tilt in degrees.
type Placement = { x: number; y: number; rotate: number };

// What a card says, independent of where it sits.
export type ExploreEvent = {
  id: string;
  imageKey: string;
  imageAlt: string;
  placeholderColor: string;
  title: string;
  blurb: string;
  location: string;
  time: string;
  tags: readonly [string, string];
};

// A card placed in the static collage.
export type ExploreCard = ExploreEvent & {
  // stacking at rest: cards above 2 sit in front of the phone
  layer: number;
  desktop: Placement;
  mobile: Placement;
};

export function exploreImage(card: ExploreEvent): string | undefined {
  return exploreAssets[card.imageKey];
}

export const exploreCards: readonly ExploreCard[] = [
  {
    id: "footy",
    imageKey: "footy",
    imageAlt: "A football at someone's feet on a floodlit pitch",
    placeholderColor: "#E2A09F",
    title: "Sunday 5-a-side",
    blurb: "Friendly game, all levels. Boots optional.",
    location: "Hackney Marshes",
    time: "Sun, 10:00",
    tags: ["Open to all", "£5"],
    layer: 1,
    desktop: { x: 15, y: 64, rotate: -13 },
    mobile: { x: 14, y: 72, rotate: -10 },
  },
  {
    id: "pop-up",
    imageKey: "pop-up",
    imageAlt: "A clothing pop-up with a rail and trainer boxes laid out on grass",
    placeholderColor: "#E2D9A2",
    title: "Garden Drop",
    blurb: "Fresh tees, trainers and a DJ on the grass.",
    location: "Digbeth",
    time: "Sat, 12:00 – 18:00",
    tags: ["Pop-up", "Free entry"],
    layer: 2,
    desktop: { x: 25, y: 43, rotate: -10 },
    mobile: { x: 17, y: 33, rotate: -8 },
  },
  {
    id: "rave",
    imageKey: "rave",
    imageAlt: "A crowd with hands up under red flares at an outdoor rave",
    placeholderColor: "#A2D2E3",
    title: "Flare Night",
    blurb: "Open-air sound system till late. Bring your people.",
    location: "Shared on booking",
    time: "Fri, 22:00 – late",
    tags: ["18+", "£12"],
    layer: 3,
    desktop: { x: 76, y: 41, rotate: -10 },
    mobile: { x: 84, y: 30, rotate: 9 },
  },
  {
    id: "study",
    imageKey: "study",
    imageAlt: "People working at desks in a bright open-plan studio",
    placeholderColor: "#A8A3E3",
    title: "Late Library",
    blurb: "Quiet focus, coffee on us. Deadlines hit different together.",
    location: "Main library, level 2",
    time: "Wed, 18:00 – 22:00",
    tags: ["Members only", "Free"],
    layer: 4,
    desktop: { x: 66, y: 70, rotate: 6 },
    mobile: { x: 80, y: 66, rotate: 6 },
  },
  {
    id: "watch-party",
    imageKey: "watch-party",
    imageAlt: "Someone watching a wall of screens in a common room",
    placeholderColor: "#D4E29F",
    title: "Final Watch Party",
    blurb: "Big screen, snacks and everyone shouting. Come early.",
    location: "Block C lounge",
    time: "Sun, 16:00",
    tags: ["Residents only", "Free"],
    layer: 1,
    desktop: { x: 85, y: 60, rotate: 11 },
    mobile: { x: 88, y: 85, rotate: 12 },
  },
];

// More events for the scroll sequence, which fills the whole screen.
export const moreExploreEvents: readonly ExploreEvent[] = [
  {
    id: "fifa-tournament",
    imageKey: "fifa-tournament",
    imageAlt: "A packed living room watching a FIFA match",
    placeholderColor: "#C9C3BB",
    title: "FIFA Tournament",
    blurb: "Bring your controller. Winner takes the pot.",
    location: "Northfield",
    time: "Sat, 18:00",
    tags: ["16 players", "£5"],
  },
  {
    id: "love-island-watchparty",
    imageKey: "love-island-watchparty",
    imageAlt: "People lying on duvets watching a projector on the wall",
    placeholderColor: "#9A9AA0",
    title: "Love Island Watch Party",
    blurb: "Duvets, snacks and very loud opinions.",
    location: "Your building",
    time: "Mon, 21:00",
    tags: ["Residents only", "Free"],
  },
  {
    id: "mario-party",
    imageKey: "mario-party",
    imageAlt: "Mario Party projected onto a wall beside a fire pit",
    placeholderColor: "#5A3A2A",
    title: "Mario Party by the Fire",
    blurb: "Big screen, fire pit, zero mercy.",
    location: "Moseley",
    time: "Fri, 20:00",
    tags: ["BYO snacks", "Free"],
  },
  {
    id: "painting-park",
    imageKey: "painting-park",
    imageAlt: "A group painting on blankets in a sunny park",
    placeholderColor: "#8FB07A",
    title: "Painting in the Park",
    blurb: "Canvases provided, good weather ordered.",
    location: "Cannon Hill Park",
    time: "Sun, 13:00",
    tags: ["Materials incl.", "£10"],
  },
  {
    id: "sunday-dinner",
    imageKey: "sunday-dinner",
    imageAlt: "Friends cooking together around a kitchen island",
    placeholderColor: "#6A5A4A",
    title: "Sunday Dinner Club",
    blurb: "Everyone brings a dish. Nobody leaves hungry.",
    location: "Selly Oak",
    time: "Sun, 17:00",
    tags: ["Potluck", "Free"],
  },
  {
    id: "uno-match",
    imageKey: "uno-match",
    imageAlt: "Friends playing cards around a coffee table",
    placeholderColor: "#7A6A5A",
    title: "Uno Tournament",
    blurb: "Friendships will be tested.",
    location: "Harborne",
    time: "Thu, 19:30",
    tags: ["Games night", "£3"],
  },
  {
    id: "unpopular-opinions",
    imageKey: "unpopular-opinions",
    imageAlt: "A red-lit room with a debate question on the screen",
    placeholderColor: "#6A1A22",
    title: "Unpopular Opinions",
    blurb: "Say it with your chest.",
    location: "Digbeth",
    time: "Fri, 20:00",
    tags: ["18+", "£5"],
  },
  {
    id: "bible-study",
    imageKey: "bible-study",
    imageAlt: "A group sitting with notebooks in a bright living room",
    placeholderColor: "#D9D2C6",
    title: "Bible Study & Brunch",
    blurb: "Open discussion, good food, all welcome.",
    location: "Edgbaston",
    time: "Sun, 11:00",
    tags: ["All welcome", "Free"],
  },
  {
    id: "grace-birthday-linkup",
    imageKey: "grace-birthday-linkup",
    imageAlt: "A crowd of friends at a birthday gathering",
    placeholderColor: "#8A8A90",
    title: "Grace's Birthday Link-up",
    blurb: "Invite only. Dress code: all black.",
    location: "Shared on booking",
    time: "Sat, 21:00",
    tags: ["Invite only", "Free"],
  },
];
