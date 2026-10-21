export const routes = {
  home: "/",
  waitlist: "/join",
  partner: "/partner",
  events: "/events",
  whoItsFor: "/who-its-for",
  studio: "/studio",
  // the join-the-team form, linked from the Studio flyer
  joinTeamForm: "https://tally.so/r/xX6O1J",
  demo: "/demo",
  demoSection: "/#demo",
  // Shared by the navbar and the home hero so each pair can't drift apart.
  explore: "/events",
  // create, log in and sign up aren't built yet — they point at early access
  // until their pages exist, then each only needs its value changed here.
  create: "/join",
  login: "/join",
  signup: "/join",
} as const;
