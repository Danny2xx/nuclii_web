const QUOTES = [
  {
    quote:
      "I share my work online constantly, yet I struggle to secure a single booking.",
    who: "Independent Creative",
  },
  {
    quote:
      "Our performer withdrew two hours before the event, and we had no way to find a replacement.",
    who: "Event Organiser",
  },
  {
    quote: "I would attend far more often if I simply had someone to go with.",
    who: "Prospective Attendee",
  },
  {
    quote: "I continue to miss gatherings I would genuinely have enjoyed.",
    who: "University Student",
  },
  {
    quote:
      "We receive regular enquiries, yet we are not equipped to manage nightlife bookings.",
    who: "Venue Manager",
  },
  {
    quote:
      "I am eager to host a comedy evening but lack the guidance to begin.",
    who: "Aspiring Host",
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
