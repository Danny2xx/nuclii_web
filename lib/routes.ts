export const routes = {
  home: "/",
  // The join buttons go to the app's sign-up now it's live (24 Nov 2026); the /join page and its
  // referral links still work for anybody who has one.
  waitlist: "https://app.nuclii.co.uk/signup",
  partner: "/partner",
  events: "/events",
  whoItsFor: "/who-its-for",
  studio: "/studio",
  // the join-the-team form, linked from the Studio flyer
  joinTeamForm: "https://tally.so/r/xX6O1J",
  demo: "/demo",
  demoSection: "/#demo",
  // The app is live at app.nuclii.co.uk (24 Nov 2026): explore, create, log in and
  // sign up go to it. Shared by the navbar and the home hero so each pair can't drift apart.
  explore: "https://app.nuclii.co.uk/explore",
  create: "https://app.nuclii.co.uk/create",
  login: "https://app.nuclii.co.uk/login",
  signup: "https://app.nuclii.co.uk/signup",
} as const;
