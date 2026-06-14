import Image from "next/image";
import Link from "next/link";

import { LegalDrawer } from "@/components/layout/legal-drawer";
import { SocialLinks } from "@/components/social/SocialLinks";
import {
  cookieSections,
  guidelinesSections,
  privacySections,
  termsSections,
} from "@/lib/legal-content";
import { footerLinks, footerNavGroups } from "@/lib/navigation";

const LAST_UPDATED = "May 27, 2026";

const legalDrawers: Record<string, { title: string; sections: Parameters<typeof LegalDrawer>[0]["sections"] }> = {
  "/privacy":              { title: "Privacy Policy",        sections: privacySections     },
  "/terms":                { title: "Terms of Use",           sections: termsSections       },
  "/cookies":              { title: "Cookie Policy",          sections: cookieSections      },
  "/community-guidelines": { title: "Community Guidelines",   sections: guidelinesSections  },
};

function Footer() {
  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  return (
    <footer className="border-t border-border bg-background">
      <div className="nuclii-container flex flex-col items-center gap-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <Link
          aria-label="Nuclii home"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <Image
            alt="Nuclii"
            className="h-7 w-auto"
            height={28}
            src="/nuclii-logo.png"
            width={75}
          />
        </Link>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              className="text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SocialLinks />
      </div>

      <div className="border-t border-border">
        <div className="nuclii-container flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nuclii. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => {
              const drawer = legalDrawers[link.href];

              return drawer ? (
                <LegalDrawer
                  key={link.href}
                  lastUpdated={LAST_UPDATED}
                  sections={drawer.sections}
                  title={drawer.title}
                >
                  {link.label}
                </LegalDrawer>
              ) : (
                <Link
                  className="text-xs text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
