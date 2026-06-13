export const mainNavItems: readonly { label: string; href: string }[] = [
  { label: "Investors", href: "/investors" },
];

export const mobileNavItems: readonly { label: string; href: string; description: string }[] = [
  { label: "Early Access",  href: "/early-access",  description: "Join the first wave"              },
  { label: "Investors",     href: "/investors",      description: "Investor information"             },
  { label: "Careers",       href: "/build-with-us",  description: "Build with Nuclii"               },
  { label: "Contact",       href: "/contact",        description: "Get in touch"                    },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/wearenuclii/" },
  { label: "TikTok", href: "https://tiktok.com/@nuclii" },
  { label: "Threads", href: "https://www.threads.com/@wearenuclii" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hello-nuclii/" },
] as const;

export const footerNavGroups = [
  {
    title: "Nuclii",
    links: [
      { label: "Early Access", href: "/early-access" },
      { label: "Investors", href: "/investors" },
      { label: "Careers", href: "/build-with-us" },
      { label: "Contact", href: "/contact" },
    ],
  },
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
