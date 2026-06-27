const QUOTES = [
  {
    quote: "i've been posting all my work, but i can't get a single booking.",
    who: "most creatives",
  },
  {
    quote: "the dj just cancelled, and the event starts in two hours.",
    who: "event host",
  },
  { quote: "i'd go, but i don't know who with.", who: "everyone" },
  { quote: "i can't believe i missed another game night.", who: "student" },
  {
    quote: "people keep calling the pub, but we don't take nightlife bookings.",
    who: "venue owner",
  },
  {
    quote: "i'd love to host a sketch night but don't know where to start.",
    who: "maker",
  },
] as const;

function Testimonials() {
  // Doubled so the marquee can loop seamlessly at translateX(-50%).
  const row = [...QUOTES, ...QUOTES];

  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
      <ul className="nuclii-marquee flex w-max items-start gap-12 sm:gap-16">
        {row.map((item, index) => (
          <li
            className="flex max-w-[20rem] shrink-0 flex-col gap-3"
            key={`${index}-${item.who}`}
          >
            <p className="text-lg italic leading-snug text-white/80 sm:text-xl">
              &ldquo;{item.quote}&rdquo;
            </p>
            <p className="text-sm font-semibold lowercase tracking-tight text-white/45">
              — {item.who}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Testimonials };
