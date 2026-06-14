"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { footerNavGroups, sideNavItems } from "@/lib/navigation";
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
        className="fixed right-4 top-4 z-50"
        onClick={() => setOpen((current) => !current)}
        size="icon"
        type="button"
        variant="ghost"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-background/98 backdrop-blur-xl">
          <nav aria-label="Mobile navigation" className="flex min-h-full flex-col px-6 pb-8 pt-24">

            {/* Primary CTA */}
            <Button asChild className="w-full" size="lg">
              <Link href="/#waitlist" onClick={() => setOpen(false)}>
                Join the waitlist
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>

            {/* Main pages */}
            <div className="mt-8 flex flex-col gap-5">
              {sideNavItems.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <div key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "text-3xl font-extrabold tracking-tight transition-colors hover:text-white",
                        active ? "text-white" : "text-white/55",
                      )}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>

                    {item.children && (
                      <div className="mt-2 flex flex-col gap-2 pl-1">
                        {item.children.map((child) => (
                          <Link
                            className="text-sm text-white/40 transition-colors hover:text-white/80"
                            href={child.href}
                            key={child.href}
                            onClick={() => setOpen(false)}
                          >
                            ↳ {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legal links */}
            <div className="mt-auto border-t border-border pt-5 mt-8">
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/50">
                Legal
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
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
