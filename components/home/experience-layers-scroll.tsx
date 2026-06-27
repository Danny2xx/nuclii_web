"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ExperienceLayer = {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

function ExperienceLayersScroll({
  layers,
}: {
  layers: readonly ExperienceLayer[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pinned-scroll driver: while the tall wrapper passes through the viewport,
  // the inner panel stays stuck and scroll progress selects the active layer.
  // Only runs on large screens; mobile keeps a normal stacked flow.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el || !desktop.matches) return;

      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const index = Math.min(layers.length - 1, Math.floor(progress * layers.length));
      setActiveIndex(index);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [layers.length]);

  const active = layers[activeIndex] ?? layers[0];

  return (
    // Tall on desktop so the inner panel can pin while scrolling through 1–4.
    <div ref={wrapperRef} className="lg:relative lg:h-[320vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(20rem,32rem)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:grid-cols-[minmax(23rem,34rem)_minmax(0,1fr)]">
          <div>
            <h2 className="sr-only">who nuclii is for</h2>
            <ol className="border-t border-white/12">
              {layers.map((layer, index) => (
                <li
                  className="grid gap-5 border-b border-white/12 py-6 sm:grid-cols-[3.25rem_1fr] sm:gap-6 lg:py-7"
                  key={layer.number}
                >
                  <p
                    className={`font-display text-[clamp(1.35rem,2vw,1.8rem)] font-bold leading-none tracking-[-0.03em] transition-colors duration-300 ${
                      index === activeIndex ? "text-white" : "text-white/40"
                    }`}
                  >
                    {layer.number}
                  </p>
                  <div
                    className={`transition-opacity duration-300 ${
                      index === activeIndex ? "opacity-100" : "lg:opacity-45"
                    }`}
                  >
                    <h3 className="text-[clamp(1.55rem,2.3vw,2rem)] font-extrabold lowercase leading-[1.05] tracking-[-0.03em] text-white">
                      {layer.title}
                    </h3>
                    <p className="mt-2 max-w-[27rem] text-[clamp(0.98rem,1.15vw,1.12rem)] leading-[1.55] tracking-[-0.02em] text-white/68">
                      {layer.description}
                    </p>
                    <div className="relative mt-5 h-[17rem] overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:h-[22rem] lg:hidden">
                      <Image
                        alt={layer.alt}
                        className="object-cover"
                        fill
                        sizes="calc(100vw - 2rem)"
                        src={layer.image}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Pinned stacked-card deck — swaps image as you scroll through 1–4. */}
          <div className="hidden lg:block">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
              {/* Back cards keep the stacked-deck silhouette. */}
              <div className="absolute inset-0 translate-x-6 translate-y-7 rotate-[3.5deg] rounded-[20px] border border-white/8 bg-white/[0.04]" />
              <div className="absolute inset-0 translate-x-3 translate-y-3.5 -rotate-[2deg] rounded-[20px] border border-white/10 bg-white/[0.06]" />

              {/* Front card — every layer image pre-stacked, crossfaded by opacity. */}
              <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-white/12 bg-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
                {layers.map((layer, index) => (
                  <div
                    aria-hidden={index !== activeIndex}
                    className="absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none"
                    key={layer.number}
                    style={{ opacity: index === activeIndex ? 1 : 0 }}
                  >
                    <Image
                      alt={layer.alt}
                      className="object-cover"
                      fill
                      priority={index === 0}
                      sizes="30rem"
                      src={layer.image}
                    />
                  </div>
                ))}

                {/* Caption pinned to the active layer. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                  <p className="font-display text-sm font-bold tracking-[-0.02em] text-white/60">
                    {active?.number}
                  </p>
                  <p className="text-lg font-extrabold lowercase tracking-[-0.02em] text-white">
                    {active?.title}
                  </p>
                </div>

                {/* Progress dots for the four layers. */}
                <div className="absolute right-5 top-5 flex flex-col gap-2">
                  {layers.map((layer, index) => (
                    <span
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeIndex ? "h-5 bg-white" : "bg-white/35"
                      } w-1.5`}
                      key={layer.number}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ExperienceLayersScroll };
