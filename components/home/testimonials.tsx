const SIGNALS = [
  {
    quote:
      "i get likes, but likes do not turn into bookings. people still ask for prices and times in dms.",
    role: "creative / maker",
  },
  {
    quote:
      "i can get people excited, but one speaker cancels and suddenly the whole plan is in ten chats.",
    role: "host / organiser",
  },
  {
    quote:
      "i want to find plans near me without asking around or scrolling stories for half an hour.",
    role: "explorer",
  },
  {
    quote:
      "our society posts everywhere, and people still say they missed it after the event.",
    role: "society / community lead",
  },
  {
    quote:
      "people want the space, but availability lives in email, calls and random voice notes.",
    role: "venue team",
  },
  {
    quote:
      "i have the idea and a few people saying they are down. making it real should not feel this long.",
    role: "first-time host",
  },
] as const;

// Muted signal palette — one quiet accent per card.
const DOTS = ["#7A9E6E", "#6F89A8", "#8E7CA8", "#C2A968", "#B5736E", "#6E9CA0"];

function Testimonials() {
  // Doubled so the marquee can loop seamlessly at translateX(-50%).
  const row = [...SIGNALS, ...SIGNALS];

  return (
    <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="nuclii-marquee flex w-max items-stretch gap-5 py-1 group-hover:[animation-play-state:paused] sm:gap-6">
        {row.map((item, index) => (
          <li
            className="flex w-[18rem] shrink-0 flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] sm:w-[21rem]"
            key={`${index}-${item.role}`}
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
              {item.role}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Testimonials };
