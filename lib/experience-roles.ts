export const EXPERIENCE_ROLES = {
  explorer: {
    label: "explorers",
    formLabel: "attendee",
    value: "attendee",
    signal: "#7A9E6E",
  },
  host: {
    label: "hosts & organisers",
    shortLabel: "hosts",
    formLabel: "host",
    value: "host",
    signal: "#8E7CA8",
    partnerAccent: "#DA4F28",
  },
  venue: {
    label: "spaces & venues",
    shortLabel: "venues",
    formLabel: "venue",
    value: "venue-business",
    signal: "#6F89A8",
    partnerAccent: "#8FC9E8",
  },
  talent: {
    label: "talent & makers",
    formLabel: "talent & maker",
    value: "talent-creative",
    signal: "#B5736E",
    partnerAccent: "#E9C44A",
  },
} as const;

export type ExperienceRoleKey = keyof typeof EXPERIENCE_ROLES;
