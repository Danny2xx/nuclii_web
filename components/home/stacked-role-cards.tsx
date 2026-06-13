"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarPlus, Compass, Handshake } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface RoleCard {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

const CARDS: RoleCard[] = [
  { id: "explore", label: "Explore", icon: Compass,     href: "/early-access"            },
  { id: "host",    label: "Host",    icon: CalendarPlus, href: "/early-access?role=host"  },
  { id: "collab",  label: "Collab",  icon: Handshake,    href: "/early-access"            },
];

const SIZES = {
  sm: { compact: 88,  expanded: 176, overlap: 14 },
  md: { compact: 130, expanded: 260, overlap: 24 },
} as const;

const SPRING   = { type: "spring" as const, stiffness: 420, damping: 22 };
const CARD_IDS = CARDS.map((c) => c.id);

function StackedRoleCards({ size = "md" }: { size?: "sm" | "md" }) {
  const { compact: COMPACT, expanded: EXPANDED_W, overlap: OVERLAP } = SIZES[size];
  const [active, setActive] = useState<string>("host");
  // Whether the user has tapped a card on mobile (pauses auto-cycle)
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    // Only auto-cycle on touch-primary devices (no hover)
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch || tapped) return;

    const timer = setInterval(() => {
      setActive((current) => {
        const next = (CARD_IDS.indexOf(current) + 1) % CARD_IDS.length;
        return CARD_IDS[next];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [tapped]);

  return (
    <div
      className="flex items-center select-none"
      onMouseLeave={() => setActive("host")}
    >
      {CARDS.map((card, index) => {
        const isActive = active === card.id;
        const Icon = card.icon;

        return (
          <motion.a
            key={card.id}
            href={card.href}
            aria-label={card.label}
            className="relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden"
            style={{
              height: COMPACT,
              marginLeft: index === 0 ? 0 : -OVERLAP,
              background: "#0a0a0b",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            animate={{
              width:        isActive ? EXPANDED_W : COMPACT,
              borderRadius: COMPACT / 2,
              scale:        isActive ? 1 : 0.82,
              opacity:      isActive ? 1 : 0.62,
              zIndex:       isActive ? 20 : CARDS.length - index,
              borderColor:  isActive
                ? "rgba(91,140,255,0.4)"
                : "rgba(255,255,255,0.08)",
              boxShadow: isActive
                ? "0 0 0 1px rgba(91,140,255,0.2), 0 0 32px rgba(91,140,255,0.22)"
                : "0 0 0 0px rgba(91,140,255,0)",
            }}
            transition={SPRING}
            // Desktop hover
            onHoverStart={() => setActive(card.id)}
            // Mobile tap — pause cycling and lock to this card
            onTouchStart={() => {
              setActive(card.id);
              setTapped(true);
            }}
          >
            {/* Compact — icon + label, scales away when active */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1"
              animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.5 : 1 }}
              transition={SPRING}
            >
              <Icon
                aria-hidden="true"
                className={size === "sm" ? "size-5 !text-[rgba(255,255,255,0.85)]" : "size-6 !text-[rgba(255,255,255,0.85)]"}
              />
              <span className="text-[0.55rem] font-semibold uppercase tracking-wider !text-[rgba(255,255,255,0.65)]">
                {card.label}
              </span>
            </motion.div>

            {/* Expanded — icon pops in with rotation, label slides in */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center gap-3.5"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ ...SPRING, delay: 0.04 }}
                >
                  <motion.div
                    initial={{ rotate: -15, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={SPRING}
                  >
                    <Icon aria-hidden="true" className={size === "sm" ? "size-6 !text-[#ffffff]" : "size-8 !text-[#ffffff]"} />
                  </motion.div>

                  <motion.span
                    className={size === "sm" ? "text-base font-bold !text-[#ffffff]" : "text-xl font-bold !text-[#ffffff]"}
                    initial={{ x: -8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.06 }}
                  >
                    {card.label}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}
    </div>
  );
}

export { StackedRoleCards };
