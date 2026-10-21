// Shared by the join-the-team pop-up and its API route, so the choices a
// visitor can pick are exactly the ones the server accepts.

// what someone wants to help with; the Studio flyer has one tab for each
export const HELP_WITH = [
  "campaigns",
  "ambassadors",
  "media",
  "outreach",
  "venue & events",
  "design",
  "engineering",
] as const;

export const WHAT_ARE_YOU = [
  "content creator",
  "photographer / videographer",
  "editor",
  "DJ",
  "artist / performer",
  "promoter",
  "host",
  "designer",
  "developer",
  "I just know people",
] as const;

export const TALKING = ["I'm built for it", "with a team, yes", "I'm better behind the scenes"] as const;
export const FILMED = ["yes", "depends on the content", "no, behind the scenes only"] as const;
export const AVAILABILITY = [
  "a few hours a week",
  "weekends only",
  "flexible",
  "only for specific campaigns or events",
  "not sure yet",
] as const;

// the small print: all four required ones must be ticked to submit
export const REQUIRED_TERMS = [
  "I won't share private nuclii plans before they're public. That includes campaign ideas, locations, dates, unreleased content, app or partner details, group chats, documents and screenshots.",
  "If nuclii introduces me to a venue, host, promoter, creator, brand, sponsor, supplier or opportunity, I won't use it to cut nuclii out or recreate it privately without written permission.",
  "Content, ideas, designs, edits, copy or footage I make specifically for nuclii can be used for nuclii's marketing and community activity, unless we agree otherwise in writing.",
  "I understand this is a community and campaign opportunity, not a guaranteed paid role, job or partnership. Any paid work will be agreed separately.",
] as const;

export const OPTIONAL_TERMS = {
  whatsapp: "Add me to the nuclii WhatsApp group chat if I'm selected. I can leave any time.",
  updates: "Send me nuclii updates about campaigns, events and community activity. I can opt out any time.",
} as const;

export type HelpWith = (typeof HELP_WITH)[number];
