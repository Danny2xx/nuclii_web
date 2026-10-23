"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { motion, type MotionValue } from "motion/react";
import {
  ArrowRight,
  BatteryFull,
  Bell,
  CalendarDays,
  ChevronDown,
  Compass,
  Heart,
  House,
  MapPin,
  Plus,
  Search,
  Signal,
  SlidersHorizontal,
  Ticket,
  User,
  Wifi,
} from "lucide-react";

import { exploreCards, exploreImage, type ExploreEvent } from "@/components/home/explore-content";
import { profilePhotos, ProfileImage } from "@/components/home/profile-photos";
import { MotionToggleButton, useMotionPlayback } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { cn } from "@/lib/utils";

// Ticket cut-outs: a semicircle notch on each side at two heights, masked out
// of the card so the section background shows through. In container units, so
// the notches scale with the card.
const ticketNotches = ["22%", "78%"].flatMap((y) =>
  ["0", "100%"].map((x) => `radial-gradient(circle 5cqw at ${x} ${y}, transparent 98%, #000 100%)`),
);

const ticketMask: CSSProperties = {
  maskImage: ticketNotches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: ticketNotches.join(", "),
  WebkitMaskComposite: "source-in",
};

// App preview in the middle of the stage: a realistic nuclii explore screen
// (Birmingham, real photos). Sized in container units so the whole screen
// scales with the phone at every breakpoint. (The phone's own radius uses % —
// container units on the container itself measure the viewport.)
// `contentY` lets a scroll sequence drift the feed as if it were scrolling;
// the status bar and tab bar stay put like real app chrome.
const phoneShots = {
  popular: "/images/categories/get-active.jpg",
  forYou: [
    { src: "/images/categories/main-character.jpg", title: "Portrait Day", meta: "Sun, 24 May · £15" },
    { src: "/images/categories/soft-life.jpg", title: "Flower Workshop", meta: "Sat, 23 May · £28" },
    { src: "/images/categories/for-the-plot.jpg", title: "Supermarket Sweep", meta: "Fri, 22 May · £6" },
  ],
  areas: [
    { src: "/images/categories/after-dark.jpg", name: "Digbeth", active: true },
    { src: "/images/categories/something-different.jpg", name: "Moseley", active: false },
    { src: "/images/categories/faith.jpg", name: "Jewellery Quarter", active: false },
  ],
  nearby: [
    { src: "/images/categories/im-just-open.jpg", title: "Pizza & Vinyl Night", meta: "Tue, 19 May · 19:00", price: "£12", saved: true },
    { src: "/images/explore-hover/just-roaming.jpg", title: "Late-Night Bike Ride", meta: "Wed, 20 May · 21:00", price: "Free", saved: false },
    { src: "/images/categories/lowkey-low-effort.jpg", title: "House Party Karaoke", meta: "Fri, 22 May · 20:00", price: "£5", saved: true },
  ],
};

// `bare` drops the tab bar on phones (fading the feed out instead), so the
// mockup doesn't read as the bottom of the website.
function PhonePreview({ contentY, bare = false }: { contentY?: MotionValue<string>; bare?: boolean } = {}) {
  return (
    <div
      aria-label="Preview of the nuclii app in Digbeth, Birmingham: a popular sunrise run club, events picked for you, neighbourhoods to explore and events nearby"
      className="@container relative aspect-[1/2] w-full overflow-hidden rounded-[12%/6%] border-[1.5px] border-black bg-white text-black"
      role="img"
    >
      {/* status bar */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-[7cqw] pb-[2cqw] pt-[4cqw] text-[3.4cqw] font-semibold"
      >
        <span>9:41</span>
        <span className="h-[6.5cqw] w-[26cqw] rounded-full bg-black" />
        <span className="flex items-center gap-[1.2cqw]">
          <Signal className="size-[3.6cqw]" strokeWidth={2.5} />
          <Wifi className="size-[3.6cqw]" strokeWidth={2.5} />
          <BatteryFull className="size-[4.6cqw]" strokeWidth={2} />
        </span>
      </div>

      {/* own compositor layer while drifting, so the phone isn't repainted every frame */}
      <motion.div
        aria-hidden="true"
        className={cn("px-[5cqw] pb-[20cqw] pt-[15cqw] font-display", contentY && "will-change-transform")}
        data-phone-feed=""
        style={{ y: contentY }}
      >
        <div className="flex items-center justify-between">
          <span className="leading-tight">
            <span className="block text-[2.9cqw] text-black/50">Good evening, Amaka</span>
            <span className="flex items-center gap-[1cqw] text-[4.4cqw] font-semibold">
              <MapPin className="size-[4cqw]" strokeWidth={2} />
              Digbeth, Birmingham
              <ChevronDown className="size-[3.6cqw]" strokeWidth={2.25} />
            </span>
          </span>
          <span className="flex items-center gap-[2.5cqw]">
            <Bell className="size-[5cqw]" strokeWidth={1.75} />
            <span className="relative size-[8cqw] overflow-hidden rounded-full">
              <ProfileImage photo={profilePhotos.womanAsian} />
            </span>
          </span>
        </div>

        <div className="!mt-[3.5cqw] flex items-center gap-[2cqw] rounded-full bg-black/[0.05] px-[3.5cqw] py-[2.4cqw] text-[3.2cqw] text-black/45">
          <Search className="size-[3.8cqw]" strokeWidth={2} />
          <span className="flex-1">Search events, places, people</span>
          <SlidersHorizontal className="size-[3.8cqw] text-black/70" strokeWidth={2} />
        </div>

        <div className="!mt-[3cqw] -mr-[5cqw] flex gap-[1.8cqw] text-[3cqw] font-medium">
          {["for you", "music", "food", "sport", "art", "wellness"].map((chip, index) => (
            <span
              className={cn(
                "shrink-0 rounded-full px-[3cqw] py-[1.4cqw]",
                index === 0 ? "bg-[var(--nuclii-lime)] text-black" : "border border-black/12 text-black/70",
              )}
              key={chip}
            >
              {chip}
            </span>
          ))}
        </div>

        <p className="!mt-[5cqw] flex items-baseline justify-between">
          <span className="text-[5.6cqw] font-semibold leading-none">popular this week</span>
          <span className="text-[2.9cqw] text-black/50">see all</span>
        </p>
        <div className="relative !mt-[2.5cqw] aspect-[16/11] overflow-hidden rounded-[5cqw]">
          <Image alt="" className="object-cover" fill sizes="20rem" src={phoneShots.popular} />
          <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute inset-x-[3.5cqw] top-[3.5cqw] flex items-start justify-between">
            <span className="rounded-full bg-white px-[2.5cqw] py-[1cqw] text-[2.7cqw] font-medium">run club</span>
            <span className="flex size-[7cqw] items-center justify-center rounded-full bg-white/90">
              <Heart className="size-[3.8cqw]" strokeWidth={2} />
            </span>
          </span>
          <span className="absolute inset-x-[3.5cqw] bottom-[3cqw] text-white">
            <span className="block text-[5cqw] font-bold leading-tight">Sunrise Run Club</span>
            <span className="block text-[2.8cqw] text-white/85">Victoria Square · Sat, 23 May · 07:30</span>
            <span className="!mt-[1.8cqw] flex items-center justify-between">
              <span className="flex items-center gap-[1.5cqw] text-[2.7cqw] text-white/90">
                <span className="flex">
                  {[profilePhotos.man, profilePhotos.whiteWoman, profilePhotos.southAsianMan].map((photo, index) => (
                    <span
                      className={cn(
                        "relative size-[5.5cqw] overflow-hidden rounded-full border border-white",
                        index > 0 && "-ml-[1.8cqw]",
                      )}
                      key={photo.src}
                    >
                      <ProfileImage photo={photo} />
                    </span>
                  ))}
                </span>
                Tobi + 2 friends going
              </span>
              <span className="rounded-full bg-[var(--nuclii-lime)] px-[2.5cqw] py-[1cqw] text-[2.8cqw] font-bold text-black">
                Free
              </span>
            </span>
          </span>
        </div>

        <p className="!mt-[5cqw] flex items-baseline justify-between">
          <span className="text-[5.6cqw] font-semibold leading-none">for you</span>
          <span className="text-[2.9cqw] text-black/50">see all</span>
        </p>
        <div className="!mt-[2.5cqw] -mr-[5cqw] flex gap-[2.5cqw]">
          {phoneShots.forYou.map((item) => (
            <div className="w-[36cqw] shrink-0" key={item.title}>
              <span className="relative block aspect-square overflow-hidden rounded-[4cqw]">
                <Image alt="" className="object-cover" fill sizes="8rem" src={item.src} />
                <span className="absolute right-[2cqw] top-[2cqw] flex size-[6cqw] items-center justify-center rounded-full bg-white/90">
                  <Heart className="size-[3.2cqw]" strokeWidth={2} />
                </span>
              </span>
              <span className="!mt-[1.5cqw] block text-[3.3cqw] font-semibold leading-tight">{item.title}</span>
              <span className="block text-[2.6cqw] text-black/50">{item.meta}</span>
            </div>
          ))}
        </div>

        <p className="!mt-[5cqw] text-[5.6cqw] font-semibold leading-none">explore your city</p>
        <div className="!mt-[3cqw] -mr-[5cqw] flex gap-[2cqw] text-[3.2cqw]">
          {phoneShots.areas.map((area) => (
            <span
              className={cn(
                "flex shrink-0 items-center gap-[1.8cqw] rounded-full py-[1.2cqw] pl-[1.2cqw] pr-[3.2cqw]",
                area.active ? "border-[0.5cqw] border-black font-semibold" : "border border-black/12 text-black/70",
              )}
              key={area.name}
            >
              <span className="relative size-[6.5cqw] overflow-hidden rounded-full">
                <Image alt="" className="object-cover" fill sizes="2rem" src={area.src} />
              </span>
              {area.name}
            </span>
          ))}
        </div>

        <div className="!mt-[3cqw]">
          {phoneShots.nearby.map((row) => (
            <div className="flex items-center gap-[3cqw] border-b border-black/10 py-[2.2cqw]" key={row.title}>
              <span className="relative size-[13cqw] shrink-0 overflow-hidden rounded-[3cqw]">
                <Image alt="" className="object-cover" fill sizes="3rem" src={row.src} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[3.6cqw] font-semibold">{row.title}</span>
                <span className="block text-[2.7cqw] text-black/50">{row.meta}</span>
              </span>
              <span className="flex flex-col items-end gap-[1cqw] text-[3cqw] font-bold">
                <Heart className={cn("size-[4cqw]", row.saved && "fill-[#E0443E] text-[#E0443E]")} strokeWidth={2} />
                {row.price}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {bare && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-10 h-[24cqw] bg-gradient-to-t from-white via-white/80 to-transparent lg:hidden"
        />
      )}

      {/* tab bar */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-black/10 bg-white/95 px-[4cqw] pb-[5cqw] pt-[2.5cqw] text-black/45",
          bare && "max-lg:hidden",
        )}
      >
        <span className="flex flex-col items-center gap-[0.6cqw] text-[2.3cqw] font-semibold text-black">
          <House className="size-[5.4cqw]" strokeWidth={2} />
          home
        </span>
        <span className="flex flex-col items-center gap-[0.6cqw] text-[2.3cqw]">
          <Compass className="size-[5.4cqw]" strokeWidth={1.75} />
          explore
        </span>
        <span className="flex flex-col items-center gap-[0.6cqw] text-[2.3cqw] text-black">
          <span className="flex size-[7.5cqw] items-center justify-center rounded-full bg-[var(--nuclii-lime)]">
            <Plus className="size-[4.6cqw]" strokeWidth={2.25} />
          </span>
          create
        </span>
        <span className="flex flex-col items-center gap-[0.6cqw] text-[2.3cqw]">
          <Ticket className="size-[5.4cqw]" strokeWidth={1.75} />
          tickets
        </span>
        <span className="flex flex-col items-center gap-[0.6cqw] text-[2.3cqw]">
          <User className="size-[5.4cqw]" strokeWidth={1.75} />
          profile
        </span>
      </div>
    </div>
  );
}

// Event ticket in the style of an in-app listing. Details that can't be read
// at small card sizes drop out below 12rem wide; the title always shows.
// `lite` swaps the blurred chips for solid ones (blur behind moving cards is
// re-rendered every frame) and loads the photo up front, for the sequence.
function EventCard({ card, lite = false }: { card: ExploreEvent; lite?: boolean }) {
  const image = exploreImage(card);

  return (
    <div className="@container relative aspect-[4/5] w-full text-left text-white">
      <div
        className="absolute inset-0 overflow-hidden rounded-none"
        style={{ backgroundColor: card.placeholderColor, ...ticketMask }}
      >
        {image && (
          <Image
            alt={card.imageAlt}
            className="object-cover"
            fill
            loading={lite ? "eager" : undefined}
            sizes="(min-width: 1024px) 16rem, 34vw"
            src={image}
          />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5"
        />

        <Heart
          aria-hidden="true"
          className="absolute right-[6cqw] top-[6cqw] size-[max(8cqw,1rem)]"
          strokeWidth={1.75}
        />
        {/* perforation between the top notches */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[7cqw] top-[22%] border-t-[1.5px] border-dashed border-white/50"
        />

        <span className="absolute inset-x-[6cqw] bottom-[6cqw] flex flex-col">
          <span className="font-display text-[max(10cqw,0.85rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            {card.title}
          </span>
          <span className="mt-[2cqw] hidden text-[4.6cqw] leading-snug text-white/90 @min-[12rem]:block">
            {card.blurb}
          </span>

          <span className="mt-[3cqw] hidden flex-col items-start gap-[1.5cqw] text-[3.9cqw] leading-none @min-[12rem]:flex">
            <span className={`inline-flex items-center gap-[2cqw] rounded-full px-[3cqw] py-[1.8cqw] ${lite ? "bg-black/55" : "bg-black/35 backdrop-blur-sm"}`}>
              <MapPin aria-hidden="true" className="size-[1.2em]" strokeWidth={1.75} />
              {card.location}
            </span>
            <span className={`inline-flex items-center gap-[2cqw] rounded-full px-[3cqw] py-[1.8cqw] ${lite ? "bg-black/55" : "bg-black/35 backdrop-blur-sm"}`}>
              <CalendarDays aria-hidden="true" className="size-[1.2em]" strokeWidth={1.75} />
              {card.time}
            </span>
          </span>

          <span className="mt-[3cqw] hidden items-center justify-between @min-[12rem]:flex">
            <span className="flex gap-[1.5cqw] text-[3.9cqw] font-medium leading-none">
              <span className="rounded-full bg-[var(--nuclii-lime)] px-[3.5cqw] py-[2cqw] text-black">{card.tags[0]}</span>
              <span className="rounded-full bg-white px-[3.5cqw] py-[2cqw] text-black">{card.tags[1]}</span>
            </span>
            <span
              aria-hidden="true"
              className="flex size-[12cqw] items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-black"
            >
              <ArrowRight className="size-[50%]" strokeWidth={1.75} />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

function ExploreSection() {
  // One state for the cards' idle float; bringing a card forward always works.
  const { playing, toggle } = useMotionPlayback();
  // hovered previews a card; pinned keeps it forward after a click or tap
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const forwardId = hoveredId ?? pinnedId;

  return (
    <section
      aria-labelledby="explore-heading"
      className="relative bg-[#0A0A0B] pb-24 text-white"
      data-analytics-section="home_explore"
    >
      <div className="px-[var(--container-x)] pt-[clamp(3rem,6vw,5.5rem)]">
        <h2 className="sr-only" id="explore-heading">
          what&apos;s on around you
        </h2>

        {/* stage: portrait on phones/tablets, wide from lg */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[40rem] lg:aspect-[1.45] lg:max-w-[72rem]">
          <div className="absolute left-1/2 top-1/2 z-[2] w-[50%] -translate-x-1/2 -translate-y-1/2 lg:w-[27%]">
            <PhonePreview />
          </div>

          <ul aria-label="example events">
            {exploreCards.map((card, index) => {
              const forward = forwardId === card.id;
              const position = {
                "--mx": `${card.mobile.x}%`,
                "--my": `${card.mobile.y}%`,
                "--mr": `${card.mobile.rotate}deg`,
                "--x": `${card.desktop.x}%`,
                "--y": `${card.desktop.y}%`,
                "--r": `${card.desktop.rotate}deg`,
              } as CSSProperties;

              return (
                <li
                  className="absolute left-[var(--mx)] top-[var(--my)] w-[32%] -translate-x-1/2 -translate-y-1/2 lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[22%]"
                  key={card.id}
                  style={{ ...position, zIndex: forward ? 10 : card.layer }}
                >
                  {/* float layer, kept apart from the tilt so the two never fight */}
                  <motion.div
                    animate={playing ? { y: [0, -8, 0] } : { y: 0 }}
                    transition={
                      playing
                        ? { duration: 6, delay: index * 1.1, ease: "easeInOut", repeat: Infinity }
                        : { duration: 0.4 }
                    }
                  >
                    <button
                      aria-pressed={pinnedId === card.id}
                      className={cn(
                        "block w-full rounded-none transition-[rotate,scale] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none",
                        forward
                          ? "rotate-0 scale-[1.14]"
                          : "rotate-[var(--mr)] lg:rotate-[var(--r)]",
                      )}
                      onBlur={() => setHoveredId(null)}
                      onClick={() => setPinnedId((current) => (current === card.id ? null : card.id))}
                      onFocus={(event) => {
                        // keyboard focus previews; a tap's focus is left to the pin toggle
                        if (event.currentTarget.matches(":focus-visible")) setHoveredId(card.id);
                      }}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setHoveredId(card.id);
                      }}
                      onPointerLeave={(event) => {
                        if (event.pointerType === "mouse") setHoveredId(null);
                      }}
                      type="button"
                    >
                      <EventCard card={card} />
                    </button>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <MotionToggleButton
        className={`absolute bottom-4 ${motionToggleEdgeClassName}`}
        label="explore motion"
        onToggle={toggle}
        playing={playing}
      />
    </section>
  );
}

export { EventCard, ExploreSection, PhonePreview };
