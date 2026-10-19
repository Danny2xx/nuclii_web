import { useCases } from "@/components/home/concept-content";

// Lime strip of real-life use cases, looping sideways. Pausing freezes it in
// place; while playing, the stylesheet's hover/accessibility pauses still apply.
function UseCaseTicker({ playing }: { playing: boolean }) {
  // Doubled so the marquee can loop seamlessly at translateX(-50%).
  const row = [...useCases, ...useCases];

  return (
    <div className="overflow-hidden bg-[var(--nuclii-lime)] py-[clamp(0.625rem,1vw,0.875rem)]">
      <ul
        className="nuclii-marquee flex w-max gap-[clamp(1.25rem,2.5vw,2.25rem)] whitespace-nowrap font-display text-sm leading-none text-white sm:text-base lg:text-lg"
        style={{
          animationDuration: `${useCases.length * 6}s`,
          animationPlayState: playing ? undefined : "paused",
        }}
      >
        {row.map((phrase, index) => (
          <li aria-hidden={index >= useCases.length || undefined} key={`${index}-${phrase}`}>
            &ldquo;{phrase}&rdquo;
          </li>
        ))}
      </ul>
    </div>
  );
}

export { UseCaseTicker };
