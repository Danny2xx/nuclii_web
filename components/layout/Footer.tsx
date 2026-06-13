import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { LegalDrawer } from "@/components/layout/legal-drawer";
import { SocialLinks } from "@/components/social/SocialLinks";
import {
  cookieSections,
  guidelinesSections,
  privacySections,
  termsSections,
} from "@/lib/legal-content";
import { footerNavGroups } from "@/lib/navigation";

const LAST_UPDATED = "May 27, 2026";

const legalDrawers: Record<string, { title: string; sections: Parameters<typeof LegalDrawer>[0]["sections"] }> = {
  "/privacy":              { title: "Privacy Policy",        sections: privacySections     },
  "/terms":                { title: "Terms of Use",           sections: termsSections       },
  "/cookies":              { title: "Cookie Policy",          sections: cookieSections      },
  "/community-guidelines": { title: "Community Guidelines",   sections: guidelinesSections  },
};

function Footer() {
  return (
    <footer className="border-t border-border bg-background/92">
      <div className="nuclii-container py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          {/* Brand column */}
          <div className="max-w-md">
            <Link
              aria-label="Nuclii home"
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="/"
            >
              <Image
                alt="Nuclii"
                className="h-9 w-auto"
                height={36}
                src="/nuclii-logo.png"
                width={96}
              />
            </Link>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Discovery, hosting, booking, and access infrastructure for
              real-world experiences. Preparing for beta launch.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-2">
            {footerNavGroups.map((group) => (
              <nav aria-label={group.title} key={group.title}>
                <h2 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => {
                    const drawer = legalDrawers[link.href];

                    return (
                      <li key={link.href + link.label}>
                        {drawer ? (
                          <LegalDrawer
                            lastUpdated={LAST_UPDATED}
                            sections={drawer.sections}
                            title={drawer.title}
                          >
                            {link.label}
                          </LegalDrawer>
                        ) : (
                          <Link
                            className="text-sm text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nuclii. All rights reserved.</p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              Preparing for beta launch
            </p>
            <p className="text-xs text-muted-foreground/60">
              Pre-launch website. Product features subject to change before beta.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
