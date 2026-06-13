"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { footerNavGroups, mobileNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const legalLinks = footerNavGroups.find((g) => g.title === "Legal")?.links ?? [];

  return (
    <div className="lg:hidden">
      <Button
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((current) => !current)}
        size="icon"
        type="button"
        variant="ghost"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 top-[4.75rem] z-40 max-h-[calc(100dvh-4.75rem)] overflow-y-auto overscroll-contain border-b border-border bg-background/98 shadow-card backdrop-blur-xl">
          <nav aria-label="Mobile navigation" className="flex flex-col px-4 pb-8 pt-4 sm:px-6">

            {/* Primary CTA */}
            <Button asChild className="w-full" size="lg">
              <Link href="/early-access" onClick={() => setOpen(false)}>
                Join Early Access
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>

            {/* Main pages */}
            <div className="mt-5 flex flex-col gap-1">
              {mobileNavItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-4 py-4 transition",
                      "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-primary/8 text-primary" : "text-foreground",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <div>
                      <p className={cn(
                        "text-sm font-semibold",
                        active ? "text-primary" : "text-foreground",
                      )}>
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </Link>
                );
              })}
            </div>

            {/* Legal links */}
            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 px-4 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/50">
                Legal
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 px-4">
                {legalLinks.map((link) => (
                  <Link
                    className="text-xs text-muted-foreground transition hover:text-primary"
                    href={link.href}
                    key={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </nav>
        </div>
      )}
    </div>
  );
}

export { MobileNav };
