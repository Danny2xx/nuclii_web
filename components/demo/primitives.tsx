"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { DemoEvent } from "@/lib/demo/types";

/** stable tiny hash so each event gets its own light composition */
function seedFrom(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 997;
  return h;
}

/**
 * Cover art for events: real photo when present, otherwise a layered
 * gradient composition seeded by the title — editorial art direction, not a
 * placeholder. Swapping in photography later needs no code changes: just set
 * `image` on the seed record.
 */
export function EventCover({
  event,
  className,
  sizes,
}: {
  event: Pick<DemoEvent, "title" | "palette" | "image">;
  className?: string;
  sizes?: string;
}) {
  if (event.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={event.image}
          alt=""
          fill
          sizes={sizes ?? "300px"}
          className="object-cover [filter:saturate(0.72)_contrast(1.05)_brightness(0.82)]"
        />
      </div>
    );
  }

  const [deep, bright] = event.palette;
  const seed = seedFrom(event.title);
  const x = 22 + (seed % 56); // glow position wanders per event
  const y = 14 + ((seed >> 3) % 42);
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
      style={{
        background: [
          `radial-gradient(105% 85% at ${x}% ${y}%, ${bright}b8 0%, transparent 58%)`,
          `radial-gradient(130% 110% at ${100 - x}% ${118 - y}%, ${bright}38 0%, transparent 52%)`,
          `linear-gradient(158deg, ${deep} 12%, ${deep} 55%, ${bright}66 130%)`,
        ].join(", "),
      }}
    >
      {/* soft vignette keeps overlaid type readable on any composition */}
      <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_55%,rgba(0,0,0,0.28)_100%)]" />
    </div>
  );
}

/**
 * Apple-Music-style artwork card: the text lives ON the art over a scrim.
 * Used for shelves, heroes and anywhere an event should read as culture,
 * not admin.
 */
export function ArtCard({
  event,
  topLeft,
  topRight,
  title,
  meta,
  metaSecondary,
  className,
  sizes,
}: {
  event: Pick<DemoEvent, "title" | "palette" | "image">;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  title: string;
  meta?: string;
  metaSecondary?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <EventCover event={event} sizes={sizes} className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/78 via-black/34 to-transparent" />
      {topLeft && <div className="absolute left-3 top-3">{topLeft}</div>}
      {topRight && <div className="absolute right-3 top-3">{topRight}</div>}
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="line-clamp-2 font-display text-base font-extrabold lowercase leading-tight tracking-[-0.03em] text-white text-balance">
          {title}
        </p>
        {meta && <p className="mt-1 truncate text-xs font-medium text-white/78">{meta}</p>}
        {metaSecondary && (
          <p className="mt-0.5 truncate text-xs font-semibold text-white/92">{metaSecondary}</p>
        )}
      </div>
    </div>
  );
}

/** iOS-style inset grouped list — the dashboard surfaces' quiet grammar. */
export function GroupedList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card divide-y divide-white/6", className)}>
      {children}
    </div>
  );
}

export function InitialsAvatar({
  name,
  hue,
  image,
  className,
}: {
  name: string;
  hue: string;
  image?: string;
  className?: string;
}) {
  if (image) {
    return (
      <span
        aria-hidden="true"
        className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", className)}
      >
        <Image src={image} alt="" fill sizes="96px" className="object-cover" />
      </span>
    );
  }
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full text-xs font-bold text-white",
        className,
      )}
      style={{ background: hue }}
    >
      {initials}
    </span>
  );
}

/** Small status chip: pending / accepted / declined, sold out, plan badges. */
export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: "neutral" | "positive" | "attention" | "accent";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold leading-tight",
        tone === "neutral" && "bg-foreground/8 text-muted-foreground",
        tone === "positive" && "bg-[#7A9E6E]/18 text-[#9DC08F]",
        tone === "attention" && "bg-[#C2A968]/18 text-[#D6C08A]",
        tone === "accent" && "bg-[var(--demo-accent)]/18 text-[var(--demo-accent-bright)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading inside app screens — fixed rem scale, product register. */
export function ScreenSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "mt-9 border-t border-white/10 pt-6 first:mt-0 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-extrabold lowercase tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
