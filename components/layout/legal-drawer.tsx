"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { PolicySection } from "@/components/content/policy-page";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32 };

function LegalDrawer({
  children,
  lastUpdated,
  sections,
  title,
}: {
  children: React.ReactNode;
  lastUpdated: string;
  sections: PolicySection[];
  title: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className="text-sm text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
        onClick={() => setOpen(true)}
        type="button"
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer panel */}
            <motion.aside
              animate={{ x: 0 }}
              aria-label={title}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-background shadow-[-32px_0_80px_rgba(0,0,0,0.18)]"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              role="dialog"
              transition={SPRING}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 py-5 backdrop-blur">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Legal
                  </p>
                  <h2 className="mt-0.5 text-lg font-semibold">{title}</h2>
                </div>
                <button
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-xl border border-border transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <p className="mb-8 text-xs text-muted-foreground/60">
                  Last updated: {lastUpdated}
                </p>
                <div className="space-y-8">
                  {sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-base font-semibold text-foreground">
                        {section.title}
                      </h3>
                      {"body" in section && section.body && (
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {section.body}
                        </p>
                      )}
                      {"items" in section && section.items && (
                        <ul className="mt-3 space-y-2">
                          {section.items.map((item) => (
                            <li
                              className="border-t border-border pt-2 text-sm leading-6 text-muted-foreground"
                              key={item}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { LegalDrawer };
