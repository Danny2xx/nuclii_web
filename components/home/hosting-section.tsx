import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  Heart,
  IdCard,
  Lock,
  MapPin,
  Navigation,
  Palette,
  Users,
  Venus,
  type LucideIcon,
} from "lucide-react";

import { profilePhotos, ProfileImage } from "@/components/home/profile-photos";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

// Two host-side stories in one light section: three tool cards, then the
// built-in group chat. Photos: the mini event reuses a supplied event photo;
// chat members use the supplied profile portraits.

// "Everyone" stays unticked to show the host narrowing the audience down.
const audiences: readonly { label: string; icon: LucideIcon; selected?: boolean }[] = [
  { label: "Everyone", icon: Users },
  { label: "Women only", icon: Venus, selected: true },
  { label: "21+", icon: IdCard, selected: true },
  { label: "My building", icon: Building2, selected: true },
  { label: "Art society", icon: Palette, selected: true },
];

function PickYourPeople() {
  return (
    <div aria-hidden="true" className="grid h-full grid-cols-[1fr_1.05fr] gap-[4%] p-[5%]">
      <ul className="flex flex-col justify-center gap-[5%]">
        {audiences.map(({ label, icon: Icon, selected }) => (
          <li
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-[0.45rem] text-[0.7rem] font-medium leading-none",
              selected ? "bg-white shadow-[0_2px_6px_rgba(40,40,80,0.08)]" : "bg-white/45 text-black/45",
            )}
            key={label}
          >
            <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
            {label}
            {selected && (
              <span className="ml-auto flex size-3.5 items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-white">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_-8px_rgba(40,40,80,0.25)]">
        <div className="relative h-[52%] shrink-0">
          <Image alt="" className="object-cover" fill sizes="10rem" src="/images/categories/soft-life.jpg" />
          <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-white">
            <Heart className="size-3" strokeWidth={2} />
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 px-3 text-[0.62rem] leading-none text-black/70">
          <p className="font-display text-[0.75rem] font-bold text-black">Candle Making</p>
          <p className="flex items-center gap-1.5">
            <CalendarDays className="size-3" strokeWidth={1.75} /> Sun, 24 May
          </p>
          <p className="flex items-center gap-1.5">
            <Clock3 className="size-3" strokeWidth={1.75} /> 14:00 – 16:00
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3" strokeWidth={1.75} /> TBA
          </p>
        </div>
      </div>
    </div>
  );
}

function RevealItLater() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col p-[5%]">
      <div className="relative flex-1 overflow-hidden rounded-t-2xl bg-[#EDEFF2]">
        <svg className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 300 170">
          <g fill="#E1E4E9">
            {[10, 62, 114, 166, 218, 270].flatMap((x) =>
              [8, 52, 96, 140].map((y) => <rect height="34" key={`${x}-${y}`} rx="3" width="42" x={x} y={y} />),
            )}
          </g>
          <ellipse cx="70" cy="120" fill="#CFEBC1" rx="46" ry="28" />
          <path d="M -10 150 C 60 120, 120 175, 200 140 S 290 110, 320 130" fill="none" stroke="#BCD8F4" strokeWidth="10" />
          <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5">
            <path d="M -10 47 H 310" />
            <path d="M 110 -10 V 180" />
            <path d="M 214 -10 C 205 60, 230 120, 215 180" />
          </g>
          <circle cx="238" cy="32" fill="#D6F46C" opacity="0.9" r="11" />
        </svg>
        <span className="absolute left-1/2 top-[34%] flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.3)]">
          <Lock className="size-4" fill="currentColor" strokeWidth={2} />
        </span>
        <span className="absolute left-1/2 top-[66%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-medium shadow-[0_6px_16px_-6px_rgba(0,0,0,0.3)]">
          <Clock3 className="size-3.5" strokeWidth={1.75} /> Address reveals at 6pm
        </span>
      </div>
      <div className="flex items-center justify-between rounded-b-2xl bg-white px-3 py-2.5">
        <span className="leading-tight">
          <span className="block text-[0.68rem] font-semibold">Private location</span>
          <span className="block text-[0.62rem] text-black/55">Birmingham, UK</span>
        </span>
        <span className="flex size-7 items-center justify-center rounded-full border border-black/10">
          <Navigation className="size-3.5" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

const updates = [
  { title: "Venue changed", body: "New location sent to 127 attendees.", time: "now" },
  { title: "New set time", body: "Doors now open at 8pm.", time: "5m ago" },
] as const;

function KeepEveryonePosted() {
  return (
    <ul aria-hidden="true" className="mx-auto flex h-full w-full max-w-[28rem] flex-col justify-center gap-[5%] p-[5%]">
      {updates.map((update) => (
        <li
          className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[0_4px_12px_-6px_rgba(30,60,30,0.25)]"
          key={update.title}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black">
            <Image alt="" className="h-auto w-[70%]" height={160} src="/logo/nuclii-icon.png" width={291} />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[0.72rem] font-semibold">{update.title}</span>
              <span className="shrink-0 text-[0.58rem] text-black/45">{update.time}</span>
            </span>
            <span className="block truncate text-[0.62rem] text-black/55">{update.body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

const tools = [
  {
    title: "pick your people",
    body: "Choose who can see your event, from your uni to specific interests.",
    tint: "bg-[#E6E5F4]",
    Visual: PickYourPeople,
  },
  {
    title: "reveal it later",
    body: "Keep the location private and let it reveal at the right time.",
    tint: "bg-[#F3E3F0]",
    Visual: RevealItLater,
  },
  {
    title: "keep everyone posted.",
    body: "Make a change and we'll notify everyone going.",
    tint: "bg-[#E4EFE0]",
    Visual: KeepEveryonePosted,
  },
] as const;

const members = [
  { name: "Zara", photo: profilePhotos.asianWoman },
  { name: "Tobi", photo: profilePhotos.man },
  { name: "Liv", photo: profilePhotos.whiteWoman },
  { name: "Hamza", photo: profilePhotos.southAsianMan },
] as const;

const messages: readonly { from: (typeof members)[number]["name"]; text: string; time: string; sent?: boolean }[] = [
  { from: "Zara", text: "Pre-drinks at mine from 7? Who's in? 🍾👀", time: "18:24" },
  { from: "Tobi", text: "I'm in! I'll bring the aux 🎧", time: "18:25", sent: true },
  { from: "Liv", text: "Group costume sorted? thinking angels n devils 👀", time: "18:27" },
  { from: "Hamza", text: "Calm, got my outfit. Everyone good for the social at 10?", time: "18:29", sent: true },
];

function Avatar({ name, className }: { name: string; className?: string }) {
  const member = members.find((m) => m.name === name) ?? members[0];
  return (
    <span
      aria-hidden="true"
      className={cn("relative shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#2A2B30]", className)}
    >
      <ProfileImage photo={member.photo} />
    </span>
  );
}

function GroupChat() {
  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div className="flex items-center gap-4">
        <span className="flex">
          {members.slice(0, 3).map((m, index) => (
            <Avatar className={cn("size-11 text-sm", index > 0 && "-ml-3")} key={m.name} name={m.name} />
          ))}
          <span className="-ml-3 flex size-11 items-center justify-center rounded-full border-2 border-white bg-[#E3E5EA] text-sm font-medium text-black/60">
            +3
          </span>
        </span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-semibold sm:text-xl">Late Night Activities</span>
          <span className="block text-sm text-white/50">8 members</span>
        </span>
      </div>

      <ol aria-label="Late Night Activities group chat" className="mt-5 flex flex-col gap-2.5">
        {messages.map((message, index) => (
          <li key={message.time}>
            <Reveal
              className={cn("flex items-end gap-3", message.sent && "pl-[12%]")}
              delay={index * 0.18}
              y={14}
            >
              <Avatar className="size-10 text-sm" name={message.from} />
              <span className="min-w-0">
                <span className="mb-1 block text-xs text-white/50">{message.from}</span>
                <span
                  className={cn(
                    "flex items-end gap-4 rounded-2xl px-4 py-2 text-[0.92rem] leading-snug text-black shadow-[0_2px_10px_-4px_rgba(30,40,80,0.18)]",
                    message.sent ? "rounded-bl-md bg-[#E3ECFD]" : "rounded-bl-md bg-white",
                  )}
                >
                  <span>{message.text}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[0.7rem] text-black/45">
                    {message.time}
                    {message.sent && <CheckCheck aria-label="read" className="size-3.5 text-[#3D7BE8]" strokeWidth={2} />}
                  </span>
                </span>
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HostingSection() {
  return (
    <section
      aria-labelledby="circle-heading"
      className="bg-[#0A0A0B] px-[var(--container-x)] py-[clamp(3rem,5vw,4.5rem)] text-white"
      data-analytics-section="home_hosting"
    >
      <div className="mx-auto w-full max-w-[72rem]">
        <h2 className="sr-only">hosting tools</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {tools.map(({ title, body, tint, Visual }, index) => (
            <li className={cn(index === 2 && "sm:col-span-2 lg:col-span-1")} key={title}>
              <Reveal
                className={cn("flex h-full flex-col rounded-none p-3 pb-5 text-black", tint)}
                delay={index * 0.08}
              >
                {/* the wide third card (tablet) keeps the same height as the others */}
                <div className={cn("aspect-[1.55] w-full lg:aspect-[1.7]", index === 2 && "sm:max-lg:aspect-[3.2]")}>
                  <Visual />
                </div>
                <h3 className="!mt-3 px-3 font-display text-[clamp(1.4rem,2vw,1.75rem)] !font-bold leading-[1.1] tracking-[-0.02em] !text-black">
                  {title}
                </h3>
                <p className="!mt-2 px-3 text-sm leading-snug text-black/65 sm:text-[0.95rem]">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="!mt-[clamp(3rem,5vw,4.5rem)] grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <h2
              className="font-display text-[clamp(3rem,5.6vw,5.25rem)] !font-bold leading-[0.98] tracking-[-0.035em] !text-white"
              id="circle-heading"
            >
              your built in circle.
            </h2>
            <p className="!mt-5 max-w-[26rem] text-lg leading-snug text-white/60 sm:text-2xl">
              Start a group chat, share updates and keep everyone in the loop.
            </p>
          </div>
          <GroupChat />
        </div>
      </div>
    </section>
  );
}

export { Avatar, HostingSection, members, messages, tools };
