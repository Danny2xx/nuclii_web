"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { EXPERIENCE_ROLES, type ExperienceRoleKey } from "@/lib/experience-roles";
import { PERSONAS, SEED_THREADS, countdownLabel, whenLabel } from "@/lib/demo/world";
import { cn } from "@/lib/utils";
import { useDemoRouter, type Screen } from "./demo-router";
import { useWorld } from "./world-store";
import { EventCover, InitialsAvatar, StatusChip } from "./primitives";
import { SwitchIcon } from "./icons";
import {
  BrowseMark,
  CalendarMark,
  CreateMark,
  HomeMark,
  HostMark,
  InboxMark,
  NightsMark,
  SettingsMark,
  TalentMark,
} from "./marks";

/** brighter companions to each role signal, for text on dark surfaces */
const ACCENT_BRIGHT: Record<ExperienceRoleKey, string> = {
  explorer: "#9DC08F",
  host: "#B3A3CC",
  venue: "#92ACC9",
  talent: "#D1928C",
};

type MarkComponent = React.ComponentType<{ className?: string; accent?: string }>;
type NavItem = { label: string; screen: Screen; icon: MarkComponent };

function navForHat(hat: ExperienceRoleKey): NavItem[] {
  if (hat === "explorer") {
    return [
      { label: "home", screen: { name: "home" }, icon: HomeMark },
      { label: "browse", screen: { name: "browse" }, icon: BrowseMark },
      { label: "your nights", screen: { name: "library" }, icon: NightsMark },
      { label: "inbox", screen: { name: "inbox" }, icon: InboxMark },
      { label: "settings", screen: { name: "settings" }, icon: SettingsMark },
    ];
  }
  const homeMark = hat === "venue" ? CalendarMark : hat === "talent" ? TalentMark : HostMark;
  const base: NavItem[] = [
    {
      label: hat === "venue" ? "your space" : hat === "talent" ? "your gigs" : "dashboard",
      screen: { name: "home" },
      icon: homeMark,
    },
    { label: "inbox", screen: { name: "inbox" }, icon: InboxMark },
    { label: "settings", screen: { name: "settings" }, icon: SettingsMark },
  ];
  if (hat === "host") {
    base.splice(1, 0, { label: "create event", screen: { name: "create" }, icon: CreateMark });
  }
  return base;
}

export function useActiveHat() {
  const { identity, hatsOf } = useWorld();
  const identityKey = identity?.kind === "persona" ? identity.persona.id : "you";
  // explorer is the base layer every account holds — a supply account can always
  // switch to exploring. Guests created through sign-up get [role, explorer].
  const hats: ExperienceRoleKey[] = (() => {
    if (identity?.kind === "persona") return hatsOf(identity.persona.id);
    if (!identity) return [];
    const role = identity.guest.role;
    return role === "explorer" ? ["explorer"] : [role, "explorer"];
  })();
  const [hatByIdentity, setHatByIdentity] = useState<Record<string, ExperienceRoleKey>>({});
  const active = hatByIdentity[identityKey] ?? hats[0] ?? "explorer";
  return {
    hats,
    activeHat: hats.includes(active) ? active : (hats[0] ?? "explorer"),
    setActiveHat: (hat: ExperienceRoleKey) =>
      setHatByIdentity((prev) => ({ ...prev, [identityKey]: hat })),
  };
}

export function AppShell({
  activeHat,
  hats,
  setActiveHat,
  children,
}: {
  activeHat: ExperienceRoleKey;
  hats: ExperienceRoleKey[];
  setActiveHat: (hat: ExperienceRoleKey) => void;
  children: React.ReactNode;
}) {
  const { identity, state, allEvents, allRequests, myRsvps } = useWorld();
  const { screen, go } = useDemoRouter();
  const accent = EXPERIENCE_ROLES[activeHat].signal;
  const accentBright = ACCENT_BRIGHT[activeHat];

  const nav = navForHat(activeHat);

  const displayName =
    identity?.kind === "persona" ? identity.persona.name : (identity?.guest.name ?? "you");
  const avatarHue = identity?.kind === "persona" ? identity.persona.avatarHue : accent;
  const avatarImage = identity?.kind === "persona" ? identity.persona.avatarImage : undefined;

  const unread = useMemo(() => {
    if (identity?.kind !== "persona") return 0;
    return SEED_THREADS.filter(
      (t) => t.betweenPersonaIds.includes(identity.persona.id) && !state.readThreads.includes(t.id),
    ).length;
  }, [identity, state.readThreads]);

  // the up-next strip: your next thing, whatever your hat
  const upNext = useMemo(() => {
    const personaId = identity?.kind === "persona" ? identity.persona.id : "you";
    if (activeHat === "explorer") {
      const going = allEvents
        .filter((e) => e.dayOffset >= 0 && myRsvps.includes(e.id))
        .sort((a, b) => a.dayOffset - b.dayOffset);
      return going[0] ? { event: going[0], verb: "you're going" } : null;
    }
    if (activeHat === "host") {
      const mine = allEvents
        .filter((e) => e.dayOffset >= 0 && e.hostId === personaId)
        .sort((a, b) => a.dayOffset - b.dayOffset);
      return mine[0] ? { event: mine[0], verb: "you're hosting" } : null;
    }
    const listingId = identity?.kind === "persona" ? identity.persona.listingId : undefined;
    const booked = allRequests
      .filter((r) => r.targetId === listingId && r.status === "accepted" && r.dayOffset >= 0)
      .sort((a, b) => a.dayOffset - b.dayOffset);
    if (!booked[0]) return null;
    const event = allEvents.find((e) => e.id === booked[0].eventId);
    return {
      event: event ?? {
        id: booked[0].eventId,
        title: booked[0].eventTitle,
        dayOffset: booked[0].dayOffset,
        startTime: "19:00",
        palette: ["#1C1D22", accentBright] as [string, string],
        image: undefined,
      },
      verb: activeHat === "venue" ? "next booking" : "next gig",
    };
  }, [activeHat, allEvents, allRequests, identity, myRsvps, accentBright]);

  return (
    <div
      className="flex min-h-dvh flex-col lg:flex-row"
      style={{ "--demo-accent": accent, "--demo-accent-bright": accentBright } as React.CSSProperties}
    >
      {/* sidebar — desktop */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/6 bg-secondary/60 lg:flex">
        <div className="flex h-14 items-center px-5">
          <Image src="/logo/nuclii-green.png" alt="nuclii" width={78} height={24} className="h-5 w-auto" />
          <StatusChip tone="neutral" className="ml-2.5">
            sandbox
          </StatusChip>
        </div>
        <nav aria-label="app" className="flex-1 space-y-0.5 px-3 py-4">
          {nav.map((item) => {
            const current =
              screen.name === item.screen.name ||
              (item.screen.name === "browse" && screen.name === "browse-category");
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => go(item.screen)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  current
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
                )}
              >
                <Icon
                  accent={accentBright}
                  className={cn(
                    "size-[1.35rem] transition-opacity duration-150",
                    current ? "opacity-100" : "opacity-45 group-hover:opacity-70",
                  )}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.label === "inbox" && unread > 0 && (
                  <span className="rounded-full bg-[var(--demo-accent)] px-1.5 py-0.5 text-[0.625rem] font-bold leading-none text-white">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        {hats.length > 1 && (
          <ModeSwitcher hats={hats} activeHat={activeHat} setActiveHat={setActiveHat} />
        )}
      </aside>

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/6 bg-background/92 px-4 backdrop-blur-sm lg:px-8">
          <Image
            src="/logo/nuclii-green.png"
            alt="nuclii"
            width={70}
            height={22}
            className="h-4.5 w-auto lg:hidden"
          />
          <span className="hidden text-sm font-bold lowercase text-foreground/85 lg:block">
            {EXPERIENCE_ROLES[activeHat].label}
          </span>
          <div className="flex-1" />
          <AccountMenu displayName={displayName} avatarHue={avatarHue} avatarImage={avatarImage} />
        </header>

        <main className="min-w-0 flex-1 px-5 pb-36 pt-7 sm:px-6 lg:px-16 lg:pb-28 lg:pt-9 2xl:px-24">
          {children}
        </main>

        {/* up-next mini-player, floating above the tab bar */}
        {upNext && (
          <div className="pointer-events-none fixed inset-x-3 bottom-[4.1rem] z-30 lg:bottom-4 lg:left-[calc(14rem+4rem)] lg:right-16">
            <button
              type="button"
              onClick={() => go({ name: "event", id: upNext.event.id })}
              className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-popover/92 py-2 pl-2 pr-4 text-left shadow-[var(--shadow-card)] backdrop-blur-md transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EventCover
                event={upNext.event}
                sizes="44px"
                className="size-11 shrink-0 rounded-xl"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-extrabold lowercase tracking-[-0.02em] text-foreground">
                  {upNext.event.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {upNext.verb} · {whenLabel(upNext.event)}
                </span>
              </span>
              <span
                className="shrink-0 text-xs font-bold"
                style={{ color: accentBright }}
              >
                {countdownLabel(upNext.event.dayOffset)}
              </span>
            </button>
          </div>
        )}

        {/* bottom tabs — mobile */}
        <nav
          aria-label="app"
          className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-white/6 bg-popover/95 backdrop-blur-sm lg:hidden"
        >
          {nav.map((item) => {
            const current =
              screen.name === item.screen.name ||
              (item.screen.name === "browse" && screen.name === "browse-category");
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => go(item.screen)}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.625rem] font-semibold transition-colors duration-150",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon
                  accent={accentBright}
                  className={cn("size-6 transition-opacity duration-150", current ? "opacity-100" : "opacity-45")}
                />
                {item.label}
                {item.label === "inbox" && unread > 0 && (
                  <span
                    aria-label={`${unread} unread`}
                    className="absolute right-1/2 top-1.5 mr-[-1.1rem] size-1.5 rounded-full bg-[var(--demo-accent)]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function ModeSwitcher({
  hats,
  activeHat,
  setActiveHat,
}: {
  hats: ExperienceRoleKey[];
  activeHat: ExperienceRoleKey;
  setActiveHat: (hat: ExperienceRoleKey) => void;
}) {
  return (
    <div className="border-t border-white/6 p-3">
      <p className="mb-1.5 px-1 text-[0.625rem] font-semibold text-muted-foreground">your hats</p>
      <div className="flex rounded-lg bg-background p-0.5">
        {hats.map((hat) => {
          const r = EXPERIENCE_ROLES[hat];
          const current = hat === activeHat;
          return (
            <button
              key={hat}
              type="button"
              aria-pressed={current}
              onClick={() => setActiveHat(hat)}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                current ? "bg-foreground/12 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                style={{ background: r.signal, opacity: current ? 1 : 0.4 }}
              />
              {hat === "explorer" ? "exploring" : hat === "host" ? "hosting" : hat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccountMenu({
  displayName,
  avatarHue,
  avatarImage,
}: {
  displayName: string;
  avatarHue: string;
  avatarImage?: string;
}) {
  const { identity, dispatch } = useWorld();
  const { go } = useDemoRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const others = PERSONAS.filter(
    (p) => !(identity?.kind === "persona" && identity.persona.id === p.id),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors duration-150 hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <InitialsAvatar name={displayName} hue={avatarHue} image={avatarImage} className="size-8" />
        <span className="hidden max-w-32 truncate text-sm font-semibold text-foreground sm:block">
          {displayName.split(" ")[0]}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-[var(--shadow-card)]"
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              go({ name: "settings" });
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SettingsMark className="size-[1.15rem]" />
            settings & plan
          </button>

          <div className="my-1.5 border-t border-border" />
          <p className="flex items-center gap-1.5 px-3 pb-1 pt-1.5 text-[0.625rem] font-semibold text-muted-foreground">
            <SwitchIcon className="size-3" />
            sandbox · view as
          </p>
          {others.map((p) => (
            <button
              key={p.id}
              role="menuitem"
              type="button"
              onClick={() => {
                dispatch({ type: "sign-in", personaId: p.id });
                go({ name: "home" });
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <InitialsAvatar
                name={p.name}
                hue={p.avatarHue}
                image={p.avatarImage}
                className="size-6 text-[0.5625rem]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {p.name}
                </span>
                <span className="block text-[0.6875rem] text-muted-foreground">
                  {EXPERIENCE_ROLES[p.leadRole].formLabel}
                </span>
              </span>
            </button>
          ))}

          <div className="my-1.5 border-t border-border" />
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              dispatch({ type: "sign-out" });
              setOpen(false);
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:bg-foreground/8 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            sign out
          </button>
        </div>
      )}
    </div>
  );
}
