const BUILD_WITH_US_FORM = "https://tally.so/r/xX6O1J";

export const sideNavItems: readonly {
  label: string;
  href: string;
  external?: boolean;
  children?: readonly { label: string; href: string }[];
}[] = [
  { label: "home", href: "/" },
  { label: "partner with us", href: "/early-access" },
  { label: "build with us", href: BUILD_WITH_US_FORM, external: true },
] as const;

export const footerLinks: readonly {
  label: string;
  href: string;
  external?: boolean;
}[] = [
  { label: "partner with us", href: "/early-access" },
  { label: "build with us", href: BUILD_WITH_US_FORM, external: true },
  { label: "get in touch", href: "mailto:hello@nuclii.co.uk" },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/wearenuclii/" },
  { label: "TikTok", href: "https://tiktok.com/@nuclii" },
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
