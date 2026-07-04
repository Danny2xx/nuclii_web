const QUOTES = [
  {
    quote:
      "i post my work all the time and still get zero bookings lol. what am i missing?",
    who: "Independent Creative",
  },
  {
    quote:
      "our performer cancelled two hours before doors and we were basically like... okay, now what?",
    who: "Event Organiser",
  },
  {
    quote: "i’d actually go to more events if i knew who else was going. turning up alone? idk.",
    who: "Potential Attendee",
  },
  {
    quote: "why do i always hear about the good events the day after 😭",
    who: "University Student",
  },
  {
    quote:
      "people keep trying to book the space through dms and ngl, it gets chaotic fast.",
    who: "Venue Manager",
  },
  {
    quote:
      "i’ve been saying ‘i should run a comedy night’ for months lol. i just need help starting.",
    who: "First Time Host",
  },
] as const;

// Muted signal palette — one quiet accent per card.
const DOTS = ["#7A9E6E", "#6F89A8", "#8E7CA8", "#C2A968", "#B5736E", "#6E9CA0"];

function Testimonials() {
  // Doubled so the marquee can loop seamlessly at translateX(-50%).
  const row = [...QUOTES, ...QUOTES];

  return (
    <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="nuclii-marquee flex w-max items-stretch gap-5 py-1 group-hover:[animation-play-state:paused] sm:gap-6">
        {row.map((item, index) => (
          <li
            className="flex w-[18rem] shrink-0 flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] sm:w-[21rem]"
            key={`${index}-${item.who}`}
          >
            <p className="text-[1.05rem] italic leading-snug text-white/85 sm:text-[1.15rem]">
              &ldquo;{item.quote}&rdquo;
            </p>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/45">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: DOTS[index % DOTS.length] }}
              />
              {item.who}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Testimonials };
