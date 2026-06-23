"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className={cn(
          "nuclii-mobile-menu-button fixed z-[70] flex size-11 items-center justify-center text-white mix-blend-difference transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="relative block h-4 w-7" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-1 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "translate-y-[5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-1 left-0 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "-translate-y-[5px] -rotate-45",
            )}
          />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-white text-black">
          <nav aria-label="Mobile navigation" className="nuclii-mobile-drawer flex min-h-full flex-col px-6">

            {/* Primary CTA */}
            <Button asChild className="w-full bg-black text-white hover:bg-black/85" size="lg">
              <Link href="/#waitlist" onClick={() => setOpen(false)}>
                join the waitlist
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
                        "inline-flex items-center gap-2 text-4xl font-extrabold lowercase leading-none tracking-[-0.04em] transition-colors hover:text-black/60",
                        active ? "text-black" : "text-black/55",
                      )}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      target={item.external ? "_blank" : undefined}
                    >
                      {item.label}
                      {item.external && (
                        <>
                          <ArrowUpRight aria-hidden="true" className="size-6" />
                          <span className="sr-only">(opens in new tab)</span>
                        </>
                      )}
                    </Link>

                    {item.children && (
                      <div className="mt-2 flex flex-col gap-2 pl-1">
                        {item.children.map((child) => (
                          <Link
                            className="text-xl font-extrabold lowercase tracking-[-0.04em] text-black/55 transition-colors hover:text-black/70"
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
            <div className="mt-8 border-t border-black/12 pt-5">
              <p className="mb-3 text-xs font-semibold lowercase text-black/35">
                legal
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <Link
                    className="text-xs font-semibold lowercase text-black/60 transition hover:text-black"
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
