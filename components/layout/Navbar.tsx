import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { mainNavItems } from "@/lib/navigation";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="nuclii-container flex h-[4.75rem] items-center justify-between gap-4">
        <Link
          aria-label="Nuclii home"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <Image
            alt="Nuclii"
            className="h-16 w-auto"
            height={64}
            priority
            src="/nuclii-logo.png"
            width={160}
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <MagneticButton>
            <Button asChild size="sm">
              <Link href="/early-access">
                Join Early Access
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </MagneticButton>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export { Navbar };
