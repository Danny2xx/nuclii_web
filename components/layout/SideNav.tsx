"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sideNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed right-6 top-8 z-50 hidden flex-col items-end gap-2 text-right lg:right-10 lg:flex"
    >
      {sideNavItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <div key={item.href}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "font-semibold text-white" : "text-white/55",
              )}
              href={item.href}
            >
              {item.label}
            </Link>

            {item.children && (
              <div className="mt-1 flex flex-col gap-1">
                {item.children.map((child) => (
                  <Link
                    className="text-xs text-white/40 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={child.href}
                    key={child.href}
                  >
                    ↳ {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export { SideNav };
