"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ExperienceLayer = {
  number: string;
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  alt: string;
};

function ExperienceLayersScroll({
  layers,
}: {
  layers: readonly ExperienceLayer[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const mobileAutoResumeAtRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const pauseMobileAutoAdvance = useCallback(() => {
    mobileAutoResumeAtRef.current = Date.now() + 8000;
  }, []);

  const syncMobileIndex = useCallback(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-layer-card]"),
    );
    if (!cards.length) return;

    const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let nextIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(scrollerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        nextIndex = index;
      }
    });

    setActiveIndex(nextIndex);
  }, []);

  const scrollToMobileLayer = useCallback(
    (index: number, options: { pause?: boolean } = {}) => {
      const scroller = mobileScrollerRef.current;
      const cards = scroller?.querySelectorAll<HTMLElement>("[data-layer-card]");
      const card = cards?.[index];
      if (!scroller || !card) return;

      if (options.pause) {
        pauseMobileAutoAdvance();
      }

      const left =
        card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      scroller.scrollTo({
        behavior: reduceMotion ? "auto" : "smooth",
        left,
      });
      setActiveIndex(index);
    },
    [pauseMobileAutoAdvance],
  );

  const selectDesktopLayer = useCallback(
    (index: number) => {
      setActiveIndex(index);

      const wrapper = wrapperRef.current;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (!wrapper || !isDesktop) return;

      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const wrapperTop = window.scrollY + wrapper.getBoundingClientRect().top;
      const progress =
        index === layers.length - 1
          ? 0.98
          : Math.min((index + 0.12) / layers.length, 0.98);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        behavior: reduceMotion ? "auto" : "smooth",
        top: wrapperTop + total * progress,
      });
    },
    [layers.length],
  );

  useEffect(() => {
    if (layers.length <= 1) return;

    const mobile = window.matchMedia("(max-width: 767px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const advance = () => {
      if (!mobile.matches || reduceMotion.matches || document.hidden) return;
      if (Date.now() < mobileAutoResumeAtRef.current) return;

      const nextIndex = (activeIndexRef.current + 1) % layers.length;
      scrollToMobileLayer(nextIndex);
    };

    const interval = window.setInterval(advance, 3600);
    return () => window.clearInterval(interval);
  }, [layers.length, scrollToMobileLayer]);

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
        <div className="md:hidden">
          <h2 className="sr-only">who nuclii is for</h2>
          <div
            aria-label="who nuclii is for"
            className="relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto px-[11vw] pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
            onScroll={() => syncMobileIndex()}
            onPointerDown={pauseMobileAutoAdvance}
            ref={mobileScrollerRef}
          >
            {layers.map((layer, index) => (
              <article
                className={`relative aspect-[4/5] w-[78vw] flex-none snap-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.5)] transition duration-500 ease-out motion-reduce:transition-none ${
                  index === activeIndex
                    ? "scale-100 opacity-100"
                    : "scale-[0.94] opacity-55"
                }`}
                data-layer-card
                key={layer.number}
              >
                <Image
                  alt={layer.alt}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="78vw"
                  src={layer.image}
                  style={{ objectPosition: layer.imagePosition }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-[1.05rem] font-extrabold lowercase leading-none tracking-[-0.03em] text-white">
                    {layer.number} {layer.title}
                  </p>
                  <p className="mt-2 overflow-hidden text-sm leading-[1.45] tracking-[-0.02em] text-white/72 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {layer.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex justify-center gap-1">
            {layers.map((layer, index) => (
              <button
                aria-label={`show ${layer.title}`}
                aria-pressed={index === activeIndex}
                className="flex h-8 w-8 items-center justify-center rounded-full"
                key={layer.number}
                onClick={() => scrollToMobileLayer(index, { pause: true })}
                type="button"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index === activeIndex
                      ? "w-2 bg-white"
                      : "w-2 bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="hidden w-full gap-12 md:grid lg:grid-cols-[minmax(20rem,32rem)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:grid-cols-[minmax(23rem,34rem)_minmax(0,1fr)]">
          <div>
            <h2 className="sr-only">who nuclii is for</h2>
            <ol className="border-t border-white/12">
              {layers.map((layer, index) => (
                <li
                  className="border-b border-white/12"
                  key={layer.number}
                >
                  <button
                    aria-label={`show ${layer.title}`}
                    aria-pressed={index === activeIndex}
                    className="grid w-full gap-5 rounded-sm py-6 text-left sm:grid-cols-[3.25rem_1fr] sm:gap-6 lg:py-7"
                    onClick={() => selectDesktopLayer(index)}
                    type="button"
                  >
                    <span
                      className={`font-display text-[clamp(1.35rem,2vw,1.8rem)] font-bold leading-none tracking-[-0.03em] transition-colors duration-300 ${
                        index === activeIndex ? "text-white" : "text-white/40"
                      }`}
                    >
                      {layer.number}
                    </span>
                    <span
                      className={`block transition-opacity duration-300 ${
                        index === activeIndex ? "opacity-100" : "lg:opacity-45"
                      }`}
                    >
                      <span className="block text-[clamp(1.55rem,2.3vw,2rem)] font-extrabold lowercase leading-[1.05] tracking-[-0.03em] text-white">
                        {layer.title}
                      </span>
                      <span className="mt-2 block max-w-[27rem] text-[clamp(0.98rem,1.15vw,1.12rem)] leading-[1.55] tracking-[-0.02em] text-white/68">
                        {layer.description}
                      </span>
                    </span>
                  </button>
                  <div className="relative mb-6 h-[17rem] overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:h-[22rem] lg:hidden">
                    <Image
                      alt={layer.alt}
                      className="object-cover"
                      fill
                      sizes="calc(100vw - 2rem)"
                      src={layer.image}
                      style={{ objectPosition: layer.imagePosition }}
                    />
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
                      style={{ objectPosition: layer.imagePosition }}
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
                    <button
                      aria-label={`show ${layer.title}`}
                      aria-pressed={index === activeIndex}
                      className="flex size-4 items-center justify-center rounded-full"
                      key={layer.number}
                      onClick={() => selectDesktopLayer(index)}
                      type="button"
                    >
                      <span
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          index === activeIndex ? "h-5 bg-white" : "h-1.5 bg-white/35"
                        }`}
                      />
                    </button>
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
