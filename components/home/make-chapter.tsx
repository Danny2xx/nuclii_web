"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import {
  BatteryFull,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  GraduationCap,
  Headphones,
  House,
  IdCard,
  ImagePlus,
  Mail,
  Plus,
  Send,
  Signal,
  Wifi,
  X,
} from "lucide-react";

import { CollaborateSection, steps } from "@/components/home/collaborate-section";
import { CreateSection, EventScreen, LookArt, looks, type LookId } from "@/components/home/create-section";
import { Avatar, HostingSection, members, messages, tools } from "@/components/home/hosting-section";
import { profilePhotos, ProfileImage, type ProfilePhoto } from "@/components/home/profile-photos";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { cn } from "@/lib/utils";

// The "make" chapter as one pinned scene: the phone stays put on the left and
// moves through the app (event page → new-event form → group chat →
// collaborate tab) while the words and cards on the right swap per step.
//
// Smoothness: scroll only decides *which* state is shown; every change then
// plays as a fixed-length transform/opacity animation, so it looks the same
// at any scroll speed. All screens and card sets stay mounted (no mount work
// or image pop-in mid-scroll), and nothing uses blur.
//
// Phones and reduced-motion visitors get the three original sections stacked.

const STEP_COUNT = 4;
const ease = [0.32, 0.72, 0, 1] as const;

const stepMeta = [
  { label: "create", eyebrow: "CREATE", accent: "#FF0000" },
  { label: "control", eyebrow: "CONTROL", accent: "#FFDD00" },
  { label: "collaborate", eyebrow: "COLLABORATE", accent: "#FFA200" },
  { label: "circle", eyebrow: "CIRCLE", accent: "#00A6FF" },
] as const;

type Place = "before" | "active" | "after";
const placeOf = (index: number, step: number): Place =>
  index === step ? "active" : index < step ? "after" : "before";

// ---------- scroll → state ----------

// cover, name, date, location, four audience picks, price, media, notify
const FORM_FIELDS = 11;
// The phone's chat runs longer than the section version, so it fills the screen.
const chatMessages: readonly { from: (typeof members)[number]["name"]; text: string; time: string; sent?: boolean }[] = [
  ...messages,
  { from: "Zara", text: "Address just dropped 📍 Digbeth, 10 mins from the station", time: "18:31" },
  { from: "Liv", text: "Link at mine first? I've got the glitter", time: "18:33" },
  { from: "Tobi", text: "Say less. Who's on the last bus back?", time: "18:34", sent: true },
  { from: "Zara", text: "Me, save me a seat 🙋‍♀️", time: "18:36" },
  { from: "Hamza", text: "See you all at 7 ✨", time: "18:38", sent: true },
  { from: "Liv", text: "Bringing snacks for the queue", time: "18:40" },
  { from: "Tobi", text: "Legend 🙌", time: "18:41", sent: true },
];
const CHAT_MESSAGES = chatMessages.length;
const GROUP_NAME = "Late Night Activities";

function useChapterState(progress: MotionValue<number>) {
  const [state, setState] = useState({ step: 0, fill: 0, collab: 0, chat: 0 });
  const stepRef = useRef(0);

  useMotionValueEvent(progress, "change", (v) => {
    const s = Math.min(Math.max(v, 0), 0.99999) * STEP_COUNT;
    const raw = Math.floor(s);
    // hold the current step while resting right on a boundary (no flicker)
    let step = stepRef.current;
    if (raw !== step && Math.abs(s - Math.round(s)) > 0.015) step = raw;
    stepRef.current = step;

    const clampInt = (x: number, max: number) => Math.min(max, Math.max(0, Math.floor(x)));
    const fill = s < 1 ? 0 : s >= 2 ? FORM_FIELDS : clampInt(((s - 1 - 0.06) / 0.78) * (FORM_FIELDS + 1), FORM_FIELDS);
    const collab = s < 2 ? 0 : s >= 3 ? COLLAB_MAX : clampInt(((s - 2 - 0.04) / 0.82) * (COLLAB_MAX + 1), COLLAB_MAX);
    const chat =
      s < 3.05 ? 0 : clampInt(1 + ((s - 3 - 0.05) / 0.65) * CHAT_MESSAGES, CHAT_MESSAGES);

    setState((current) =>
      current.step === step && current.fill === fill && current.collab === collab && current.chat === chat
        ? current
        : { step, fill, collab, chat },
    );
  });

  return state;
}

// ---------- phone screens ----------

const photos = {
  cover: "/images/categories/soft-life.jpg",
};

// extra shots the host adds in the form's media row
const formMedia = [
  "/images/categories/something-different.jpg",
  "/images/explore-hover/bible-study.jpg",
  "/images/categories/lowkey-low-effort.jpg",
] as const;

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-white px-[7cqw] pb-[2cqw] pt-[4cqw] text-[3.4cqw] font-semibold">
      <span>9:41</span>
      <span className="h-[6.5cqw] w-[26cqw] rounded-full bg-black" />
      <span className="flex items-center gap-[1.2cqw]">
        <Signal className="size-[3.6cqw]" strokeWidth={2.5} />
        <Wifi className="size-[3.6cqw]" strokeWidth={2.5} />
        <BatteryFull className="size-[4.6cqw]" strokeWidth={2} />
      </span>
    </div>
  );
}

// Text that "types" in: revealed left to right when it becomes filled.
function Typed({ on, children, placeholder }: { on: boolean; children: ReactNode; placeholder: string }) {
  return (
    <span className="relative block min-h-[1.3em]">
      <motion.span
        animate={{ opacity: on ? 0 : 1 }}
        className="absolute inset-0 text-black/30"
        initial={false}
        transition={{ duration: 0.2 }}
      >
        {placeholder}
      </motion.span>
      <span className="relative block overflow-hidden">
        <motion.span
          animate={{ opacity: on ? 1 : 0 }}
          className="block"
          initial={false}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>
        {/* a white cover that slides off to the right: reads like typing, moves only by transform */}
        <motion.span
          animate={{ x: on ? "101%" : "0%" }}
          className="absolute inset-0 bg-white"
          initial={false}
          transition={{ duration: on ? 0.55 : 0.01, ease: "easeOut" }}
        />
      </span>
    </span>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <motion.span
      animate={{ backgroundColor: on ? "#A3BF1C" : "#D9DBDF" }}
      className="relative inline-flex h-[5.4cqw] w-[9.4cqw] shrink-0 rounded-full"
      initial={false}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        animate={{ x: on ? "4cqw" : "0cqw" }}
        className="absolute left-[0.7cqw] top-[0.7cqw] size-[4cqw] rounded-full bg-white shadow"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </motion.span>
  );
}

// `strong` for the headline facts (name, date); `focus` for the field the
// step is about (who can see it), which reads in lime and a touch larger.
function Field({
  label,
  children,
  strong = false,
  focus = false,
}: {
  label: string;
  children: ReactNode;
  strong?: boolean;
  focus?: boolean;
}) {
  return (
    <div className="border-b border-black/10 py-[1.8cqw]">
      <span
        className={cn(
          "block font-medium uppercase tracking-[0.06em]",
          focus ? "text-[3.1cqw] font-semibold text-[var(--nuclii-lime)]" : "text-[2.6cqw] text-black/45",
        )}
      >
        {label}
      </span>
      <div className={cn("!mt-[0.8cqw] text-[3.5cqw] leading-tight", strong ? "font-semibold" : "font-normal")}>
        {children}
      </div>
    </div>
  );
}

// Step 2: the host's side of step 1 — the same event, being filled in.
function FormScreen({ fill }: { fill: number }) {
  const has = (n: number) => fill >= n;
  const done = fill >= FORM_FIELDS;
  // "Everyone" stays off; the others are picked one at a time (fields 5–8),
  // matching the "pick your people" card alongside
  const audience = [
    { label: "Everyone", at: 0 },
    { label: "Women only", at: 5 },
    { label: "21+", at: 6 },
    { label: "My building", at: 7 },
    { label: "Art society", at: 8 },
  ];

  return (
    <div className="relative h-full px-[4.5cqw] pt-[13cqw] font-display">
      <div className="flex items-center justify-between">
        <X className="size-[5cqw]" strokeWidth={2} />
        <span className="text-[4.2cqw] font-bold">New event</span>
        <motion.span
          animate={{ backgroundColor: done ? "#EEF6D6" : "rgba(0,0,0,0.06)", color: done ? "#5E7A08" : "rgba(0,0,0,0.55)" }}
          className="rounded-full px-[2.4cqw] py-[1cqw] text-[2.6cqw]"
          initial={false}
        >
          {done ? "Ready" : "Draft"}
        </motion.span>
      </div>

      {/* cover */}
      <div className="relative !mt-[3cqw] aspect-[2/1] overflow-hidden rounded-[4cqw] border-[0.5cqw] border-dashed border-black/15 bg-black/[0.03]">
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-[1.5cqw] text-[3cqw] text-black/40">
          <ImagePlus className="size-[6cqw]" strokeWidth={1.5} />
          Add a cover
        </span>
        <motion.span
          animate={{ opacity: has(1) ? 1 : 0, scale: has(1) ? 1 : 1.08 }}
          className="absolute inset-0"
          initial={false}
          transition={{ duration: 0.5, ease }}
        >
          <Image alt="" className="object-cover" fill sizes="20rem" src={photos.cover} />
        </motion.span>
      </div>

      <Field label="Event name" strong>
        <Typed on={has(2)} placeholder="Give it a name">
          Candle Making
        </Typed>
      </Field>
      <Field label="Date & time" strong>
        <Typed on={has(3)} placeholder="Pick a date">
          Sun, 24 May · 14:00 – 16:00
        </Typed>
      </Field>
      <Field label="Location">
        <span className="flex items-center justify-between gap-[2cqw]">
          <Typed on={has(4)} placeholder="Add a place">
            Birmingham, UK
          </Typed>
        </span>
        <span className="!mt-[1.2cqw] flex items-center justify-between text-[2.9cqw] text-black/60">
          Keep private, reveal at 6pm the day before
          <Toggle on={has(4)} />
        </span>
      </Field>
      <Field focus label="Who can see it">
        <span className="flex flex-wrap gap-[1.5cqw]">
          {audience.map((chip) => {
            const on = chip.at > 0 && has(chip.at);
            return (
              <motion.span
                animate={{
                  backgroundColor: on ? "#FFFFFF" : "rgba(0,0,0,0.04)",
                  borderColor: on ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.1)",
                  scale: on ? [1, 1.08, 1] : 1,
                }}
                className="flex items-center gap-[1cqw] rounded-full border px-[2.4cqw] py-[1cqw] text-[2.8cqw]"
                initial={false}
                key={chip.label}
                transition={{ duration: 0.35 }}
              >
                {on && <Check className="size-[2.8cqw] text-[#5E7A08]" strokeWidth={3} />}
                {chip.label}
              </motion.span>
            );
          })}
        </span>
      </Field>
      <Field label="Price">
        <Typed on={has(9)} placeholder="Free or paid">
          £18
        </Typed>
      </Field>
      <Field label="Media">
        <span className="flex gap-[2cqw]">
          {formMedia.map((src, index) => (
            <motion.span
              animate={{ opacity: has(10) ? 1 : 0, scale: has(10) ? 1 : 0.85 }}
              className="relative aspect-[1.25] w-[27cqw] overflow-hidden rounded-[3cqw] bg-black/[0.05]"
              initial={false}
              key={src}
              transition={{ duration: 0.4, ease, delay: has(10) ? index * 0.08 : 0 }}
            >
              <Image alt="" className="object-cover" fill sizes="6rem" src={src} />
            </motion.span>
          ))}
        </span>
      </Field>
      <div className="flex items-center justify-between py-[2.4cqw] text-[3.1cqw]">
        Notify everyone going about changes
        <Toggle on={has(11)} />
      </div>

      {/* pinned to the bottom of the screen, like a real form's action bar */}
      <motion.span
        animate={{ opacity: done ? 1 : 0.35 }}
        className="absolute inset-x-[4.5cqw] bottom-[6cqw] flex h-[10cqw] items-center justify-center gap-[1.5cqw] rounded-[3cqw] bg-[var(--nuclii-lime)] text-[3.6cqw] font-semibold"
        initial={false}
      >
        {done && <Check className="size-[3.6cqw]" strokeWidth={3} />}
        Publish event
      </motion.span>
    </div>
  );
}

// Step 4: the group chat, messages landing as you scroll.
function ChatScreen({ count }: { count: number }) {
  const next = chatMessages[count];

  return (
    <div className="flex h-full flex-col bg-[#F7F7FA] pt-[12cqw] font-display">
      <div className="flex items-center gap-[2.5cqw] border-b border-black/8 bg-white px-[4cqw] py-[2.5cqw]">
        <ChevronLeft className="size-[5cqw]" strokeWidth={2} />
        <span className="flex">
          {members.slice(0, 3).map((m, index) => (
            <Avatar className={cn("size-[7cqw]", index > 0 && "-ml-[2.5cqw]")} key={m.name} name={m.name} />
          ))}
        </span>
        <span className="leading-tight">
          <span className="block text-[3.6cqw] font-bold">{GROUP_NAME}</span>
          <span className="block text-[2.6cqw] text-black/45">8 members</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-start gap-[2.5cqw] overflow-hidden px-[3.5cqw] pb-[3cqw] pt-[4cqw]">
        {chatMessages.map((message, index) => (
          <motion.div
            animate={index < count ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
            className={cn("flex items-end gap-[2cqw]", message.sent && "flex-row-reverse")}
            initial={false}
            key={message.time}
            transition={{ duration: 0.4, ease }}
          >
            <Avatar className="size-[7cqw]" name={message.from} />
            <span
              className={cn(
                "max-w-[72%] rounded-[4cqw] px-[3cqw] py-[2cqw] text-[3.1cqw] leading-snug",
                message.sent ? "rounded-br-[1cqw] bg-[#E3ECFD]" : "rounded-bl-[1cqw] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
              )}
            >
              {!message.sent && <span className="block text-[2.5cqw] font-semibold text-black/45">{message.from}</span>}
              {message.text}
            </span>
          </motion.div>
        ))}
        {/* whoever speaks next is typing */}
        <motion.div
          animate={{ opacity: next ? 1 : 0 }}
          className="flex items-center gap-[1.5cqw] text-[2.6cqw] text-black/45"
          initial={false}
        >
          <span className="flex gap-[0.8cqw] rounded-full bg-white px-[2.4cqw] py-[1.8cqw]">
            {[0, 1, 2].map((dot) => (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                className="size-[1.4cqw] rounded-full bg-black/50"
                key={dot}
                transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18 }}
              />
            ))}
          </span>
          {next ? `${next.from} is typing` : ""}
        </motion.div>
      </div>

      <div className="flex items-center gap-[2cqw] bg-white px-[3.5cqw] pb-[6cqw] pt-[2.5cqw]">
        <span className="flex-1 rounded-full bg-black/[0.05] px-[3.5cqw] py-[2.2cqw] text-[3cqw] text-black/40">Message</span>
        <Send className="size-[5cqw] shrink-0 text-black" strokeWidth={1.75} />
      </div>
    </div>
  );
}

// Screens push in from the right like app navigation; the one being left
// slides back a little and dims, as on iOS.
const screenVariants: Variants = {
  before: { x: "102%" },
  active: { x: "0%" },
  after: { x: "-28%" },
};

const MemoEventScreen = memo(EventScreen);
const MemoFormScreen = memo(FormScreen);
const MemoChatScreen = memo(ChatScreen);
const MemoCollabScreen = memo(CollabPhoneScreen);

function Phone({
  step,
  fill,
  collab,
  chat,
  look,
}: {
  step: number;
  fill: number;
  collab: number;
  chat: number;
  look: LookId;
}) {
  const screens = [
    <MemoEventScreen key="event" look={look} />,
    <MemoFormScreen fill={fill} key="form" />,
    <MemoCollabScreen collab={collab} key="collab" />,
    <MemoChatScreen count={chat} key="chat" />,
  ];

  return (
    <div
      aria-label="The nuclii app, moving from an event page to the new-event form, the collaborate tab and a group chat"
      className="@container relative isolate aspect-[9/19.5] w-full overflow-hidden rounded-[12%/5.5%] bg-white text-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] [clip-path:inset(0_round_12%_/_5.5%)]"
      role="img"
    >
      <StatusBar />
      {screens.map((screen, index) => {
        const place = placeOf(index, step);
        return (
          <motion.div
            animate={place}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden bg-white will-change-transform"
            initial={false}
            key={index}
            style={{ zIndex: index + 1 }}
            transition={{ duration: 0.6, ease }}
            variants={screenVariants}
          >
            {screen}
            <motion.span
              animate={{ opacity: place === "after" ? 0.18 : 0 }}
              className="pointer-events-none absolute inset-0 bg-black"
              initial={false}
              transition={{ duration: 0.6, ease }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------- right-hand words ----------

const copy: readonly { title: ReactNode; body: ReactNode }[] = [
  {
    title: (
      <>
        <span className="text-[var(--nuclii-lime)]">simple</span> where it should be.
        <br />
        <span className="text-[var(--nuclii-lime)]">flexible</span> where it matters.
      </>
    ),
    body: (
      <>
        Choose the look, the audience and the details. Keep it simple, change it when{" "}
        <span className="text-[var(--nuclii-lime)]">you</span> need to.
      </>
    ),
  },
  {
    title: "your event, your rules.",
    body: "Pick who can see it, keep the location private until you're ready, and tell everyone going the moment plans change.",
  },
  {
    title: "You've got the idea. Find the people who can pull it off.",
    body: "Open a call, find the right people and spaces, and keep the plan moving in one place.",
  },
  {
    title: "your built in circle.",
    body: "Start a group chat, share updates and keep everyone in the loop.",
  },
];

const Words = memo(function Words({ step, beat }: { step: number; beat: number }) {
  return (
    <div className="grid [grid-template-areas:'stack']">
      {copy.map((item, index) => {
        const place = placeOf(index, step);
        return (
          <motion.div
            animate={place}
            aria-hidden={place !== "active" || undefined}
            className="[grid-area:stack]"
            initial={false}
            key={stepMeta[index].label}
            variants={{
              before: { opacity: 0, y: 28, transition: { duration: 0.3, ease } },
              active: { opacity: 1, y: 0, transition: { duration: 0.55, ease, delay: 0.12 } },
              after: { opacity: 0, y: -28, transition: { duration: 0.3, ease } },
            }}
          >
            <p
              className="inline-block border-b-2 pb-1 text-xs font-semibold uppercase tracking-[0.06em] text-white"
              style={{ borderColor: stepMeta[index].accent }}
            >
              {stepMeta[index].eyebrow}
            </p>
            <h2 className="!mt-4 font-display text-[clamp(1.9rem,2.7vw,2.7rem)] !font-bold leading-[1.08] tracking-[-0.025em] !text-white">
              {item.title}
            </h2>
            <p className="!mt-3 max-w-[34rem] text-base leading-relaxed text-white/65 xl:text-lg">{item.body}</p>
            {index === 2 && <CollabBeats accent={stepMeta[2].accent} beat={beat} />}
          </motion.div>
        );
      })}
    </div>
  );
});

// ---------- right-hand card sets (each enters its own way) ----------

function Stage({ index, step, variants, children }: { index: number; step: number; variants: Variants; children: ReactNode }) {
  const place = placeOf(index, step);
  return (
    <motion.div
      animate={place}
      aria-hidden={place !== "active" || undefined}
      className={cn("absolute inset-0 flex items-center justify-center", place !== "active" && "pointer-events-none")}
      initial={false}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

const stagger = (child: number) => ({
  before: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  active: { transition: { staggerChildren: child, delayChildren: 0.15 } },
  after: { transition: { staggerChildren: 0.03 } },
});

// 1: the looks deal in from the phone, fanned; leave upward together
const dealCard: Variants = {
  before: { opacity: 0, x: -140, rotate: -8, scale: 0.9, transition: { duration: 0.35, ease } },
  active: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { duration: 0.6, ease } },
  after: { opacity: 0, y: -40, transition: { duration: 0.35, ease } },
};

const LooksStage = memo(function LooksStage({ step, onLook }: { step: number; onLook: (id: LookId) => void }) {
  return (
    <Stage index={0} step={step} variants={stagger(0.07)}>
      <ul
        aria-label="event page looks"
        className="relative aspect-[1.45] w-[min(100cqw,calc(100cqh*1.45))]"
      >
        {looks.map((look) => (
          <motion.li className={cn("absolute", look.place)} key={look.id} variants={dealCard}>
            <button
              className={cn(
                "relative flex size-full flex-col overflow-hidden p-[5%] text-left shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                look.className,
              )}
              onClick={() => onLook(look.id)}
              onFocus={() => onLook(look.id)}
              onPointerEnter={() => onLook(look.id)}
              type="button"
            >
              <span className="relative z-10 block leading-tight">
                <span className="block text-[0.6rem] opacity-70">{look.number}</span>
                <span className="block font-display text-[clamp(0.8rem,1.1vw,1rem)] font-medium">{look.name}</span>
              </span>
              <LookArt id={look.id} />
            </button>
          </motion.li>
        ))}
      </ul>
    </Stage>
  );
});

// Ticket notches cut into both sides (square corners kept), level with the
// perforation under each card's picture area. The picture area is a fixed
// 1.35 ratio of the card's width (100cqw of the li), so the notch height is
// computed from it and lines up on every card.
const NOTCH_Y = "calc(0.75rem + (100cqw - 1.5rem) / 1.35 + 0.5rem)";
const ticketNotches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.6rem at ${x} ${NOTCH_Y}, transparent 98%, #000 100%)`,
);
const ticketMask = {
  maskImage: ticketNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: ticketNotches.join(", "),
  WebkitMaskComposite: "source-in",
} as const;

// Pick your people's stub: the kinds of filters a host can set, ticking on
// once the phone's audience is picked.
const audienceFilters = [
  { label: "Age · 21+", icon: IdCard },
  { label: "University", icon: GraduationCap },
  { label: "My building", icon: Building2 },
] as const;

function AudienceChips({ lit }: { lit: boolean }) {
  return (
    <ul aria-hidden="true" className="flex h-full flex-col items-start justify-center gap-[7%] px-[6%]">
      {audienceFilters.map(({ label, icon: Icon }, index) => (
        <motion.li
          animate={{ x: lit ? 0 : -6, opacity: lit ? 1 : 0.7 }}
          className="flex items-center gap-2 rounded-full bg-white px-3 py-[0.45rem] text-[0.75rem] font-medium leading-none shadow-[0_2px_6px_rgba(40,40,80,0.08)]"
          initial={false}
          key={label}
          transition={{ duration: 0.35, ease, delay: lit ? index * 0.08 : 0 }}
        >
          <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
          {label}
          <motion.span
            animate={{ scale: lit ? 1 : 0 }}
            className="ml-1 flex size-3.5 items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-white"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 26, delay: lit ? 0.1 + index * 0.08 : 0 }}
          >
            <Check className="size-2.5" strokeWidth={3} />
          </motion.span>
        </motion.li>
      ))}
    </ul>
  );
}

// 2: the tool cards rise in a row; each lights up as its field fills
const riseCard: Variants = {
  before: { opacity: 0, y: 70, transition: { duration: 0.35, ease } },
  active: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  after: { opacity: 0, y: -50, transition: { duration: 0.35, ease } },
};
const toolFieldAt = [8, 4, 11]; // pick your people ← last audience pick, reveal ← location, posted ← notify

const ToolsStage = memo(function ToolsStage({ step, fill }: { step: number; fill: number }) {
  return (
    <Stage index={1} step={step} variants={stagger(0.09)}>
      <ul className="grid w-[min(100cqw,calc(100cqh*2.6))] grid-cols-3 gap-4">
        {tools.map(({ title, body, tint, Visual }, index) => {
          const lit = fill >= toolFieldAt[index];
          return (
            <motion.li className="@container" key={title} variants={riseCard}>
              <motion.div
                animate={{ opacity: lit ? 1 : 0.5, y: lit ? -6 : 0 }}
                className={cn("relative flex h-full flex-col p-3 pb-4 text-black", tint)}
                initial={false}
                style={ticketMask}
                transition={{ duration: 0.45, ease }}
              >
                {/* the phone shows the audience being picked, so "pick your people"
                    keeps just its words under a blank ticket stub */}
                <div className="aspect-[1.35] w-full">
                  {index === 0 ? <AudienceChips lit={lit} /> : <Visual />}
                </div>
                {/* perforation between the two notches */}
                <span aria-hidden="true" className="mx-2 !mt-2 border-t-[1.5px] border-dashed border-black/20" />
                <h3 className="!mt-2 px-2 font-display text-[clamp(1.1rem,1.5vw,1.4rem)] !font-bold leading-tight !text-black">
                  {title}
                </h3>
                <p className="!mt-1 px-2 text-sm leading-snug text-black/65 [@container(max-height:400px)]:hidden">{body}</p>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </Stage>
  );
});

// 4: the circle — members gather in, then the event's updates land in the group
const popIn: Variants = {
  before: { opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.3, ease } },
  active: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  after: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease } },
};
const slideFromRight: Variants = {
  before: { opacity: 0, x: 60, transition: { duration: 0.3, ease } },
  active: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
  after: { opacity: 0, x: -30, transition: { duration: 0.3, ease } },
};

const CircleStage = memo(function CircleStage({ step }: { step: number }) {
  return (
    <Stage index={3} step={step} variants={stagger(0.1)}>
      <div className="flex w-full max-w-[30rem] flex-col gap-3">
        <motion.div className="flex items-center gap-4 rounded-[1.4rem] bg-white/[0.06] p-4" variants={popIn}>
          <span className="flex">
            {members.map((m, index) => (
              <Avatar className={cn("size-12", index > 0 && "-ml-4")} key={m.name} name={m.name} />
            ))}
            <span className="-ml-4 flex size-12 items-center justify-center rounded-full border-2 border-white bg-[#E3E5EA] text-sm font-medium text-black/60">
              +4
            </span>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-white">{GROUP_NAME}</span>
            <span className="block text-sm text-white/50">8 members · made from the event</span>
          </span>
        </motion.div>
        {["Address revealed · Digbeth, Birmingham", "Doors now open at 8pm"].map((update) => (
          <motion.div
            className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/80"
            key={update}
            variants={slideFromRight}
          >
            <span className="size-2 rounded-full bg-[var(--nuclii-lime)]" />
            {update}
          </motion.div>
        ))}
      </div>
    </Stage>
  );
});

// ---------- step 3: collaborate, played out beat by beat ----------
//
// `collab` (0 → COLLAB_MAX) walks the host through the four beats:
//   1–2  put the call out: DJ, then photography, open calls
//   3–4  find your people: the talent sheet opens, Femi is picked
//   5–6  bring them in:    Femi joins, Tami is invited
//   7–8  pull it together: the space confirms, final details done
// The phone, the line-up, the checklist and the beat tracker all read it.

const COLLAB_MAX = 8;
const beatOf = (collab: number) => (collab <= 2 ? 0 : collab <= 4 ? 1 : collab <= 6 ? 2 : 3);

const collabPhotos = {
  cover: "/images/explore-hover/movies.jpg",
  courtyard: "/images/explore-hover/pop-up.jpg",
};

const talent = [
  { name: "Femi", skill: "DJ selector", style: "afrobeats · amapiano", photo: profilePhotos.curlyWhiteMan },
  { name: "Kai", skill: "Open-format DJ", style: "garage · r&b", photo: profilePhotos.whiteManVest },
  { name: "Marco", skill: "DJ", style: "house · disco", photo: profilePhotos.europeMan },
] as const;

function RoundPhoto({ photo, className }: { photo: ProfilePhoto; className?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-full", className)}>
      <ProfileImage photo={photo} />
    </span>
  );
}

// Two states in one slot: crossfades from `from` to `to` when `on` flips.
function Swap({ on, from, to, className }: { on: boolean; from: ReactNode; to: ReactNode; className?: string }) {
  return (
    <span className={cn("grid [grid-template-areas:'s']", className)}>
      <motion.span animate={{ opacity: on ? 0 : 1 }} className="[grid-area:s]" initial={false} transition={{ duration: 0.3 }}>
        {from}
      </motion.span>
      <motion.span
        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 4 }}
        className="[grid-area:s]"
        initial={false}
        transition={{ duration: 0.35, ease }}
      >
        {to}
      </motion.span>
    </span>
  );
}

function Pill({ tone, children }: { tone: "lime" | "grey" | "outline"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[1cqw] whitespace-nowrap rounded-full px-[2.4cqw] py-[1.2cqw] text-[2.6cqw] font-medium",
        tone === "lime" && "bg-[var(--nuclii-lime)] font-semibold text-black",
        tone === "grey" && "bg-black/[0.06] text-black/55",
        tone === "outline" && "border border-[#A3BF1C] text-[#5E7A08]",
      )}
    >
      {children}
    </span>
  );
}

// A collaborator row that appears when its call goes out (fixed slot, fades in).
function PhoneRow({ shown, children }: { shown: boolean; children: ReactNode }) {
  return (
    <motion.div
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
      className="flex items-center gap-[3cqw] rounded-[3cqw] border border-black/10 p-[2.5cqw]"
      initial={false}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}

function OpenCallCircle() {
  return (
    <span className="flex size-[9cqw] shrink-0 items-center justify-center rounded-full border border-dashed border-black/35">
      <Plus className="size-[4cqw]" strokeWidth={1.75} />
    </span>
  );
}

function CollabPhoneScreen({ collab }: { collab: number }) {
  const needs = [
    { label: "DJ", icon: Headphones, at: 1 },
    { label: "Photographer", icon: Camera, at: 2 },
    { label: "Space", icon: House, at: 0 },
    { label: "Something else", icon: Plus, at: 99 },
  ];
  const sheetOpen = collab === 3 || collab === 4;

  return (
    <div className="relative h-full overflow-hidden pt-[13cqw] font-display">
      <div className="px-[4.5cqw]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[4cqw]">
          <Image alt="" className="object-cover" fill sizes="18rem" src={collabPhotos.cover} />
        </div>
        <p className="!mt-[3cqw] flex items-center justify-between">
          <span className="text-[6cqw] font-bold leading-none tracking-[-0.02em]">Movie Night</span>
          <Swap from={<Pill tone="grey">Draft</Pill>} on={collab >= COLLAB_MAX} to={<Pill tone="outline">Ready</Pill>} />
        </p>
        <p className="!mt-[1.5cqw] text-[3cqw] text-black/55">Cannon Hill Park · Sun 20 Dec · 6:00 PM</p>

        <div className="!mt-[3cqw] flex justify-between border-b border-black/10 text-[3.1cqw] text-black/55">
          {["Overview", "Collaborate", "Plan", "Tickets"].map((tab) => (
            <span
              className={cn("pb-[2cqw]", tab === "Collaborate" && "border-b-2 border-[var(--nuclii-lime)] font-semibold text-[#6E8A0C]")}
              key={tab}
            >
              {tab}
            </span>
          ))}
        </div>

        <p className="!mt-[3.5cqw] text-[4.2cqw] font-bold leading-none">What do you need?</p>
        <div className="!mt-[2.5cqw] grid grid-cols-4 gap-[2cqw]">
          {needs.map(({ label, icon: Icon, at }) => {
            const on = collab >= at;
            return (
              <motion.span
                animate={{ backgroundColor: on ? "#EEF6D6" : "#FFFFFF", borderColor: on ? "#A3BF1C" : "rgba(0,0,0,0.1)" }}
                className="flex aspect-[0.95] flex-col items-center justify-center gap-[1.5cqw] rounded-[3cqw] border text-center text-[2.4cqw] leading-tight"
                initial={false}
                key={label}
                transition={{ duration: 0.3 }}
              >
                <Icon className="size-[5cqw]" strokeWidth={1.75} />
                {label}
              </motion.span>
            );
          })}
        </div>

        <p className="!mt-[3.5cqw] text-[4cqw] font-bold leading-none">Collaborators</p>
        <div className="!mt-[2.5cqw] flex flex-col gap-[2cqw]">
          <PhoneRow shown>
            <span className="relative size-[9cqw] shrink-0 overflow-hidden rounded-[2cqw]">
              <Image alt="" className="object-cover" fill sizes="3rem" src={collabPhotos.courtyard} />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[3.2cqw] font-semibold">Space</span>
              <span className="block text-[2.7cqw] text-black/50">The Courtyard</span>
            </span>
            <Swap from={<Pill tone="grey">Pending</Pill>} on={collab >= 7} to={<Pill tone="outline">Confirmed</Pill>} />
          </PhoneRow>
          <PhoneRow shown={collab >= 1}>
            <Swap
              from={<OpenCallCircle />}
              on={collab >= 5}
              to={<RoundPhoto className="size-[9cqw]" photo={talent[0].photo} />}
            />
            <span className="min-w-0 flex-1 leading-tight">
              <Swap
                from={
                  <>
                    <span className="block text-[3.2cqw] font-semibold">DJ</span>
                    <span className="block text-[2.7cqw] text-black/50">Open call</span>
                  </>
                }
                on={collab >= 5}
                to={
                  <>
                    <span className="block text-[3.2cqw] font-semibold">Femi</span>
                    <span className="block text-[2.7cqw] text-black/50">DJ selector</span>
                  </>
                }
              />
            </span>
            <Swap from={<Pill tone="lime">Find people</Pill>} on={collab >= 5} to={<Pill tone="outline">Joined</Pill>} />
          </PhoneRow>
          <PhoneRow shown={collab >= 2}>
            <Swap
              from={<OpenCallCircle />}
              on={collab >= 6}
              to={<RoundPhoto className="size-[9cqw]" photo={profilePhotos.womanAsian} />}
            />
            <span className="min-w-0 flex-1 leading-tight">
              <Swap
                from={
                  <>
                    <span className="block text-[3.2cqw] font-semibold">Photography</span>
                    <span className="block text-[2.7cqw] text-black/50">Open call</span>
                  </>
                }
                on={collab >= 6}
                to={
                  <>
                    <span className="block text-[3.2cqw] font-semibold">Tami</span>
                    <span className="block text-[2.7cqw] text-black/50">Photography</span>
                  </>
                }
              />
            </span>
            <Swap from={<Pill tone="lime">Find people</Pill>} on={collab >= 6} to={<Pill tone="outline">Invited</Pill>} />
          </PhoneRow>
        </div>
      </div>

      {/* find your people: the results sheet slides up over the tab */}
      <motion.span
        animate={{ opacity: sheetOpen ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 bg-black/30"
        initial={false}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        animate={{ y: sheetOpen ? "0%" : "105%" }}
        className="absolute inset-x-0 bottom-0 rounded-t-[6cqw] bg-white px-[4.5cqw] pb-[8cqw] pt-[2.5cqw] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] will-change-transform"
        initial={false}
        transition={{ duration: 0.55, ease }}
      >
        <span className="mx-auto block h-[1.2cqw] w-[12cqw] rounded-full bg-black/15" />
        <p className="!mt-[3cqw] text-[4.2cqw] font-bold leading-none">DJs near Cannon Hill Park</p>
        <p className="!mt-[1.2cqw] text-[2.8cqw] text-black/50">Available Sun 20 Dec · 3 matches</p>
        <div className="!mt-[3cqw] flex flex-col gap-[2cqw]">
          {talent.map((person, index) => {
            const picked = index === 0 && collab >= 4;
            return (
              <motion.div
                animate={{ backgroundColor: picked ? "#EEF6D6" : "#FFFFFF" }}
                className="flex items-center gap-[3cqw] rounded-[3cqw] border border-black/10 p-[2.5cqw]"
                initial={false}
                key={person.name}
              >
                <RoundPhoto className="size-[10cqw]" photo={person.photo} />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block text-[3.3cqw] font-semibold">{person.name}</span>
                  <span className="block text-[2.6cqw] text-black/50">
                    {person.skill} · {person.style}
                  </span>
                </span>
                {index === 0 ? (
                  <Swap from={<Pill tone="lime">Invite</Pill>} on={picked} to={<Pill tone="outline">Invited</Pill>} />
                ) : (
                  <Pill tone="grey">Invite</Pill>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// Beat tracker under the headline (replaces the topic pills).
function CollabBeats({ beat, accent }: { beat: number; accent: string }) {
  return (
    <ol aria-label="how collaborating works" className="!mt-5 grid max-w-[40rem] grid-cols-4 gap-3">
      {steps.map((item, index) => {
        const active = index === beat;
        const done = index < beat;
        return (
          <li className="flex items-start gap-2.5" key={item.title}>
            <motion.span
              animate={{
                backgroundColor: active ? accent : "rgba(255,255,255,0)",
                borderColor: active || done ? accent : "rgba(255,255,255,0.2)",
                color: active ? "#0A0A0B" : done ? accent : "rgba(255,255,255,0.6)",
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
              initial={false}
              transition={{ duration: 0.3 }}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : String(index + 1).padStart(2, "0")}
            </motion.span>
            <span className="leading-tight">
              <motion.span
                animate={{ opacity: active ? 1 : 0.5 }}
                className="block font-display text-sm font-semibold text-white"
                initial={false}
              >
                {item.title}
              </motion.span>
              <span className="block text-xs text-white/45">{item.body}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- step 3 cards: live line-up + checklist, and the talent picks ----------

// Ticket panel: square corners, notches level with the perforation under the title.
const panelNotches = ["0", "100%"].map((x) => `radial-gradient(circle 0.55rem at ${x} 2.75rem, transparent 98%, #000 100%)`);
const panelMask = {
  maskImage: panelNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: panelNotches.join(", "),
  WebkitMaskComposite: "source-in",
} as const;

function TicketPanel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white px-[1.1em] pb-[1.1em] text-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]", className)} style={panelMask}>
      <p className="flex h-[2.75rem] items-center text-[1.15em] font-bold leading-none">{title}</p>
      <span aria-hidden="true" className="block border-t-[1.5px] border-dashed border-black/15" />
      {children}
    </div>
  );
}

function LineUpRow({
  shown,
  on,
  from,
  to,
  tail,
}: {
  shown: boolean;
  on: boolean;
  from: ReactNode;
  to: ReactNode;
  tail: [ReactNode, ReactNode];
}) {
  return (
    <motion.li
      animate={{ opacity: shown ? 1 : 0.25 }}
      className="flex items-center gap-[0.6em] py-[0.5em]"
      initial={false}
      transition={{ duration: 0.4 }}
    >
      <Swap className="min-w-0 flex-1" from={from} on={on} to={to} />
      <Swap from={tail[0]} on={on} to={tail[1]} />
    </motion.li>
  );
}

function Who({ lead, name, role }: { lead: ReactNode; name: string; role: string }) {
  return (
    <span className="flex items-center gap-[0.6em]">
      {lead}
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-semibold">{name}</span>
        <span className="block truncate text-[0.85em] text-black/55">{role}</span>
      </span>
    </span>
  );
}

function StatusPill({ tone, children }: { tone: "lime" | "grey" | "outline"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.3em] whitespace-nowrap rounded-full px-[0.7em] py-[0.3em] text-[0.8em]",
        tone === "lime" && "bg-[var(--nuclii-lime)] font-semibold",
        tone === "grey" && "bg-black/[0.06] text-black/55",
        tone === "outline" && "border border-[#A3BF1C] text-[#5E7A08]",
      )}
    >
      {children}
    </span>
  );
}

const openCallDot = (
  <span className="flex size-[2.2em] shrink-0 items-center justify-center rounded-full border border-dashed border-black/35">
    <Plus className="size-[1em]" strokeWidth={1.75} />
  </span>
);

function LineUpPanel({ collab }: { collab: number }) {
  return (
    <TicketPanel title="The line up">
      <ul className="flex flex-col divide-y divide-black/10">
        <LineUpRow
          from={<Who lead={<RoundPhoto className="size-[2.2em]" photo={profilePhotos.whiteMan} />} name="You" role="Host" />}
          on={false}
          shown
          tail={[<StatusPill key="h" tone="grey">Host</StatusPill>, null]}
          to={null}
        />
        <LineUpRow
          from={
            <Who
              lead={
                <span className="relative size-[2.2em] shrink-0 overflow-hidden rounded-[0.5em]">
                  <Image alt="" className="object-cover" fill sizes="2.5rem" src={collabPhotos.courtyard} />
                </span>
              }
              name="The Courtyard"
              role="Venue"
            />
          }
          on={collab >= 7}
          shown
          tail={[
            <StatusPill key="p" tone="grey">Pending</StatusPill>,
            <StatusPill key="c" tone="outline">
              <Check className="size-[1em]" strokeWidth={2.5} /> Confirmed
            </StatusPill>,
          ]}
          to={
            <Who
              lead={
                <span className="relative size-[2.2em] shrink-0 overflow-hidden rounded-[0.5em]">
                  <Image alt="" className="object-cover" fill sizes="2.5rem" src={collabPhotos.courtyard} />
                </span>
              }
              name="The Courtyard"
              role="Venue"
            />
          }
        />
        <LineUpRow
          from={<Who lead={openCallDot} name="DJ" role="Open call" />}
          on={collab >= 5}
          shown={collab >= 1}
          tail={[
            <StatusPill key="f" tone="lime">Find people</StatusPill>,
            <StatusPill key="j" tone="outline">
              <Check className="size-[1em]" strokeWidth={2.5} /> Joined
            </StatusPill>,
          ]}
          to={<Who lead={<RoundPhoto className="size-[2.2em]" photo={talent[0].photo} />} name="Femi" role="DJ selector" />}
        />
        <LineUpRow
          from={<Who lead={openCallDot} name="Photography" role="Open call" />}
          on={collab >= 6}
          shown={collab >= 2}
          tail={[
            <StatusPill key="f" tone="lime">Find people</StatusPill>,
            <StatusPill key="i" tone="outline">
              <Mail className="size-[1em]" strokeWidth={1.75} /> Invited
            </StatusPill>,
          ]}
          to={<Who lead={<RoundPhoto className="size-[2.2em]" photo={profilePhotos.womanAsian} />} name="Tami" role="Photography" />}
        />
      </ul>
    </TicketPanel>
  );
}

function ChecklistPanel({ collab }: { collab: number }) {
  const items = [
    { label: "DJ joined", at: 5 },
    { label: "Photography invited", at: 6 },
    { label: "Space confirmed", at: 7 },
    { label: "Final event details", at: 8 },
  ];
  return (
    <TicketPanel title="Coming together">
      <ul className="!mt-[0.8em] flex flex-col gap-[0.6em]">
        {items.map((item) => {
          const done = collab >= item.at;
          return (
            <li className="flex items-center gap-[0.55em]" key={item.label}>
              <motion.span
                animate={{
                  backgroundColor: done ? "#A3BF1C" : "rgba(0,0,0,0)",
                  borderColor: done ? "#A3BF1C" : "rgba(0,0,0,0.25)",
                }}
                className="flex size-[1.25em] items-center justify-center rounded-full border-[1.5px] text-white"
                initial={false}
                transition={{ duration: 0.3 }}
              >
                <motion.span animate={{ scale: done ? 1 : 0 }} initial={false} transition={{ type: "spring", stiffness: 500, damping: 26 }}>
                  <Check className="size-[0.8em]" strokeWidth={3} />
                </motion.span>
              </motion.span>
              <motion.span animate={{ opacity: done ? 1 : 0.5 }} initial={false}>
                {item.label}
              </motion.span>
            </li>
          );
        })}
      </ul>
      <motion.span
        animate={{ opacity: collab >= COLLAB_MAX ? 1 : 0.4 }}
        className="!mt-[1em] flex items-center justify-center gap-[0.4em] rounded-full bg-[var(--nuclii-lime)] py-[0.6em] font-semibold"
        initial={false}
      >
        <Plus className="size-[1em]" strokeWidth={2.25} /> Invite someone
      </motion.span>
    </TicketPanel>
  );
}

// the talent picks mirror the phone's results sheet while it's open
function TalentCard({ person, picked }: { person: (typeof talent)[number]; picked: boolean }) {
  return (
    <motion.div
      animate={{ y: picked ? -10 : 0, opacity: picked ? 1 : 0.85 }}
      className="relative flex flex-col bg-white p-2.5 pb-3 text-black shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]"
      initial={false}
      style={panelMaskLow}
      transition={{ duration: 0.45, ease }}
    >
      <span className="relative block aspect-square overflow-hidden bg-black/5">
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="12rem"
          src={person.photo.src}
          style={{ objectPosition: person.photo.focus }}
        />
      </span>
      <span aria-hidden="true" className="mx-1 !mt-2.5 block border-t-[1.5px] border-dashed border-black/15" />
      <span className="!mt-2 block px-1 leading-tight">
        <span className="block font-display text-base font-bold">{person.name}</span>
        <span className="block text-xs text-black/55">{person.skill}</span>
        <span className="block text-xs text-black/40">{person.style}</span>
      </span>
      <span className="!mt-2 px-1">
        <Swap
          from={<StatusPill tone="lime">Invite</StatusPill>}
          on={picked}
          to={
            <StatusPill tone="outline">
              <Check className="size-[1em]" strokeWidth={2.5} /> Invited
            </StatusPill>
          }
        />
      </span>
    </motion.div>
  );
}

// talent tickets: notches level with the perforation under the photo
const lowNotches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.55rem at ${x} calc(0.625rem + (100cqw - 1.25rem) + 0.625rem), transparent 98%, #000 100%)`,
);
const panelMaskLow = {
  maskImage: lowNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: lowNotches.join(", "),
  WebkitMaskComposite: "source-in",
} as const;

// 3: panels stay close to the phone and overlap a little; during "find your
// people" they make way for the talent picks, then return with people in
const fromPhone: Variants = {
  before: { opacity: 0, x: -90, transition: { duration: 0.35, ease } },
  active: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
  after: { opacity: 0, transition: { duration: 0.3 } },
};

const CollabStage = memo(function CollabStage({ step, collab }: { step: number; collab: number }) {
  const picking = collab === 3 || collab === 4;
  return (
    <Stage index={2} step={step} variants={stagger(0.12)}>
      <div className="grid w-full max-w-[42rem] [grid-template-areas:'s']">
        <motion.div
          animate={{ opacity: picking ? 0 : 1, y: picking ? 16 : 0 }}
          className="flex items-start self-center text-[clamp(0.72rem,0.95vw,0.9rem)] [grid-area:s]"
          initial={false}
          transition={{ duration: 0.4, ease }}
        >
          <motion.div className="w-[56%]" variants={fromPhone}>
            <LineUpPanel collab={collab} />
          </motion.div>
          <motion.div className="ml-[3%] mt-[3.5em] w-[41%]" variants={fromPhone}>
            <ChecklistPanel collab={collab} />
          </motion.div>
        </motion.div>
        <motion.ul
          animate={{ opacity: picking ? 1 : 0, y: picking ? 0 : 20 }}
          aria-hidden={!picking || undefined}
          className={cn(
            "grid w-[min(100cqw,calc(100cqh*1.45))] grid-cols-3 gap-4 self-center [grid-area:s]",
            !picking && "pointer-events-none",
          )}
          initial={false}
          transition={{ duration: 0.45, ease }}
        >
          {talent.map((person, index) => (
            <motion.li
              animate={{ opacity: picking ? 1 : 0, y: picking ? 0 : 24 }}
              className="@container"
              initial={false}
              key={person.name}
              transition={{ duration: 0.45, ease, delay: picking ? 0.1 + index * 0.08 : 0 }}
            >
              <TalentCard person={person} picked={index === 0 && collab >= 4} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Stage>
  );
});

// ---------- step indicator ----------

function StepTab({
  index,
  step,
  progress,
  onJump,
}: {
  index: number;
  step: number;
  progress: MotionValue<number>;
  onJump: (index: number) => void;
}) {
  const fillScale = useTransform(progress, (v) => Math.min(1, Math.max(0, v * STEP_COUNT - index)));
  const active = index === step;
  return (
    <li className="flex-1">
      <button
        aria-current={active ? "step" : undefined}
        className="group flex w-full flex-col gap-2 text-left focus-visible:outline-none"
        onClick={() => onJump(index)}
        type="button"
      >
        <span className="relative block h-[2px] w-full overflow-hidden bg-white/15">
          <motion.span className="absolute inset-0 origin-left bg-[var(--nuclii-lime)]" style={{ scaleX: fillScale }} />
        </span>
        <span
          className={cn(
            "font-display text-xs font-semibold transition-colors duration-300 group-focus-visible:underline",
            active ? "text-white" : "text-white/40 group-hover:text-white/70",
          )}
        >
          {String(index + 1).padStart(2, "0")} {stepMeta[index].label}
        </span>
      </button>
    </li>
  );
}

// ---------- the pinned scene ----------

function PinnedChapter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 38, mass: 0.4, restDelta: 0.0004 });
  const { step, fill, collab, chat } = useChapterState(progress);
  const [look, setLook] = useState<LookId>("photo-led");

  // decode every photo in the scene before it arrives, so nothing decodes mid-transition
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.querySelectorAll("img").forEach((img) => {
          img.loading = "eager";
          img.decode?.().catch(() => {});
        });
        observer.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const jump = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.04) / STEP_COUNT) * span, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Make it happen: create, control, collaborate and circle"
      className="relative h-[460vh] bg-[#0A0A0B]"
      data-analytics-section="home_make"
      ref={sectionRef}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[86rem] items-center gap-[clamp(2.5rem,5vw,6rem)] px-[clamp(3rem,5.5vw,7rem)] pb-8 pt-24">
          <div className="w-[min(21rem,calc((100svh-9rem)*0.4615))] shrink-0">
            <Phone chat={chat} collab={collab} fill={fill} look={look} step={step} />
          </div>

          <div className="flex h-full min-w-0 flex-1 flex-col">
            <Words beat={beatOf(collab)} step={step} />
            {/* size container: each card set scales to the room actually left */}
            <div className="relative !mt-6 min-h-0 flex-1 [container-type:size]">
              <LooksStage onLook={setLook} step={step} />
              <ToolsStage fill={fill} step={step} />
              <CircleStage step={step} />
              <CollabStage collab={collab} step={step} />
            </div>
            <ol aria-label="chapter steps" className="!mt-6 flex gap-4">
              {stepMeta.map((meta, index) => (
                <StepTab index={index} key={meta.label} onJump={jump} progress={progress} step={step} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return desktop;
}

function MakeChapter() {
  const desktop = useIsDesktop();
  const lessMotion = useLessMotion();

  if (!desktop || lessMotion) {
    return (
      <>
        <CreateSection />
        <HostingSection />
        <CollaborateSection />
      </>
    );
  }
  return <PinnedChapter />;
}

export { MakeChapter };
