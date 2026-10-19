import { routes } from "@/lib/routes";

const BUILD_WITH_US_FORM = "https://tally.so/r/xX6O1J";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  // kept in config but not rendered — the logo covers home, explore covers
  // motives, and the demo page stays live at its route without a nav entry.
  hidden?: boolean;
  variant?: "login" | "signup";
  children?: readonly { label: string; href: string }[];
};

export const sideNavItems: readonly NavItem[] = [
  { label: "home", href: routes.home, hidden: true },
  { label: "demo", href: routes.demoSection, hidden: true },
  { label: "motives", href: routes.events, hidden: true },
  { label: "explore", href: routes.explore },
  { label: "for hosts", href: routes.partner },
  { label: "studio", href: BUILD_WITH_US_FORM, external: true },
  { label: "create", href: routes.create, hidden: true },
  { label: "Log in", href: routes.login, variant: "login" },
  { label: "sign up", href: routes.signup, variant: "signup" },
] as const;

export const visibleNavItems = sideNavItems.filter((item) => !item.hidden);

export const footerLinks: readonly {
  label: string;
  href: string;
  external?: boolean;
  // the part of the label set in bold
  bold?: string;
}[] = [
  { label: "events", href: routes.events },
  { label: "partner with us", href: routes.partner },
  { label: "nuclii studio", bold: "studio", href: BUILD_WITH_US_FORM, external: true },
  { label: "get in touch", href: "mailto:hello@nuclii.co.uk" },
] as const;

// The footer's "use cases" column; each goes to For Hosts for now.
export const useCaseLinks = [
  { label: "students", href: routes.partner },
  { label: "organisers", href: routes.partner },
  { label: "offline communities", href: routes.partner },
  { label: "venues", href: routes.partner },
  { label: "talent & makers", href: routes.partner },
] as const;

// Instagram, TikTok and Threads are all @wearenuclii.
export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/wearenuclii/" },
  { label: "TikTok", href: "https://www.tiktok.com/@wearenuclii" },
  { label: "Threads", href: "https://www.threads.com/@wearenuclii" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hello-nuclii/" },
] as const;

export const footerNavGroups = [
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Community Guidelines", href: "/community-guidelines" },
    ],
  },
] as const;
