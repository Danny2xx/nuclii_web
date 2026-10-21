import {
  AtSign,
  Blocks,
  Eye,
  Handshake,
  Building2,
  KeyRound,
  MapPin,
  Megaphone,
  MessagesSquare,
  Repeat,
  ShieldCheck,
  Sparkles,
  SquarePen,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

// Content for /who-its-for: one shared list of tool names (the same names the
// home page's 01–04 host tools use), then each audience in the order the
// footer's "made for" column lists them. Each section leads with what's in
// that audience's way, then how nuclii opens it, then the tools.

export type ToolId =
  | "create"
  | "control"
  | "local"
  | "collaborate"
  | "multi"
  | "chats"
  | "repeat"
  | "uni"
  | "seen"
  | "vibe"
  | "portfolio"
  | "community"
  | "spaces"
  | "updates";

export const tools: Record<ToolId, { name: string; line: string; icon: LucideIcon }> = {
  create: { name: "create", line: "an event in minutes, from a night in to a party", icon: SquarePen },
  control: { name: "control", line: "decide exactly who sees it", icon: KeyRound },
  local: { name: "local reach", line: "down to your street and postcode", icon: MapPin },
  collaborate: { name: "collaborate", line: "build a line-up, find people to help", icon: Handshake },
  multi: { name: "multi-organiser access", line: "run it as a team, hand over control", icon: Users },
  chats: { name: "group chats", line: "every event comes with its own", icon: MessagesSquare },
  repeat: { name: "repeat", line: "run it again, bring your people back", icon: Repeat },
  uni: { name: "uni email check", line: "student spaces stay student", icon: AtSign },
  seen: { name: "get seen", line: "show what your space can be used for", icon: Eye },
  vibe: { name: "vibe matching", line: "hosts whose events fit your space", icon: Sparkles },
  portfolio: { name: "profile & portfolio", line: "your work and every line-up you've been on", icon: UserRound },
  community: { name: "start a community", line: "your own society, with its own chat", icon: Blocks },
  spaces: { name: "venues & talent", line: "find both in the app, no contacts needed", icon: Building2 },
  updates: { name: "updates that land", line: "changes and reminders everyone actually sees", icon: Megaphone },
};

export type Audience = {
  id: string;
  label: string;
  headline: string;
  // a plain gloss under the label, where the label needs one
  gloss?: string;
  body: string[];
  tools: ToolId[];
  example: { title: string; meta: string; tag: string };
  // venues and talent can also work with nuclii directly
  partnerLine?: string;
};

export const audiences: readonly Audience[] = [
  {
    id: "students",
    label: "students",
    headline: "your home, your building, your campus.",
    body: [
      "Post it once and the people around you see it: your house, your halls, your street. No collecting numbers, no sign-in sheets.",
      "Campus rules in the way? Start your own community with its own group chat, checked with a uni email so it stays student. Keep it closed if you need to (women only, LGBTQ+ or faith spaces) and approve who joins.",
    ],
    tools: ["create", "control", "local", "community", "chats", "uni"],
    example: { title: "House games night", meta: "Thu · 8pm · Selly Oak", tag: "your street only" },
  },
  {
    id: "organisers",
    label: "organisers",
    headline: "new to the area? start with the street.",
    body: [
      "Club nights, day parties, pop-ups: the hard part is getting something new in front of the right people. nuclii reaches people down to the street and postcode, so it doesn't depend on an audience you haven't built yet.",
      "Don't know where to start? Find a venue and talent in the app, no connections needed. Run it as a team with co-organisers, hand over control when you need to, and send updates that actually land: changes, reminders and location reveals go straight to everyone going, not into their email.",
    ],
    tools: ["create", "control", "local", "spaces", "collaborate", "multi", "updates", "repeat"],
    example: { title: "Day party", meta: "Sat · 2pm · Digbeth", tag: "reaching B9 and nearby" },
    partnerLine: "Want to co-host events with nuclii?",
  },
  {
    id: "offline-communities",
    label: "offline communities",
    gloss: "communities that meet up in person",
    headline: "the same faces, every week.",
    body: [
      "Run clubs, pop-ups, supper clubs, worship nights, watch parties. Keep it to your members, find venues and talent when you need them, and let everyone know when plans change.",
    ],
    tools: ["create", "control", "chats", "spaces", "updates", "repeat"],
    example: { title: "Sunday run club", meta: "Every Sun · 9am · Cannon Hill Park", tag: "members" },
    partnerLine: "Want to bring your community on as a nuclii partner?",
  },
  {
    id: "venues",
    label: "venues",
    headline: "let people see what your space can be.",
    body: [
      "Most people don't know what your space can be used for. nuclii shows it to hosts nearby, without the cost of managing listings everywhere.",
      "We match you with events that suit your space, so a calm studio isn't booked for a rave.",
    ],
    tools: ["seen", "vibe", "local"],
    example: { title: "The Old Print Works", meta: "Digbeth · up to 60 people", tag: "suits workshops, supper clubs" },
    partnerLine: "Want to host a nuclii Studio night or become a recommended venue?",
  },
  {
    id: "talent",
    label: "talent & makers",
    headline: "you don't need a big name to share what you do.",
    body: [
      "Just starting out, or new to a scene? Craft, food, music, anything worth sharing. From DJs to pottery sessions, get on line-ups near you and build a portfolio as you go. It's as easy as sending an interest.",
    ],
    tools: ["collaborate", "portfolio"],
    example: { title: "Beginner pottery", meta: "Sat · 11am · Jewellery Quarter", tag: "first line-up" },
    partnerLine: "Want to perform at nuclii events or be featured?",
  },
];

// what every account gets, whoever you are
export const everyone: readonly { label: string; icon: LucideIcon }[] = [
  { label: "free to use", icon: Sparkles },
  { label: "18+", icon: ShieldCheck },
  { label: "no follower counts, no public going counts", icon: Users },
  { label: "you decide who sees it", icon: KeyRound },
  { label: "your address stays private until you choose", icon: MapPin },
];

export const comingSoon: readonly string[] = ["sponsorship", "paid promotion"];
