"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

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
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    function updateActiveLayer() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const range = Math.max(1, rect.height - viewport * 0.7);
      const progress = Math.min(
        1,
        Math.max(0, (viewport * 0.38 - rect.top) / range),
      );
      const next = Math.min(
        layers.length - 1,
        Math.round(progress * (layers.length - 1)),
      );

      setActive(next);
    }

    function scheduleUpdate() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveLayer);
    }

    updateActiveLayer();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [layers.length]);

  return (
    <div
      className="grid gap-12 lg:min-h-[220vh] lg:grid-cols-[24rem_minmax(0,34rem)] lg:justify-between xl:grid-cols-[25rem_minmax(0,36rem)]"
      ref={sectionRef}
    >
      <div className="lg:sticky lg:top-[30vh] lg:h-fit">
        <h2 className="sr-only">roles on nuclii</h2>
        <div className="space-y-0">
          {layers.map((layer, index) => (
            <button
              aria-pressed={index === active}
              className={cn(
                "group/role w-full border-t py-4 text-left outline-none transition duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                index === active
                  ? "border-white/75"
                  : "border-white/12 hover:-translate-y-0.5 hover:border-white/45",
              )}
              key={layer.number}
              onClick={() => setActive(index)}
              type="button"
            >
              <p
                className={cn(
                  "flex items-baseline gap-2 text-[clamp(1.3rem,1.8vw,1.75rem)] font-bold lowercase leading-[1.08] tracking-[-0.03em] transition-colors duration-300",
                  index === active ? "text-white" : "text-white/55 group-hover/role:text-white/78",
                )}
              >
                <span
                  className={cn(
                    "text-[0.8em] transition-opacity duration-300",
                    index === active ? "opacity-90" : "opacity-70",
                  )}
                >
                  {layer.number}
                </span>
                {layer.title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-auto mt-1 size-2 shrink-0 transition duration-300",
                    index === active
                      ? "scale-100 bg-white"
                      : "scale-0 bg-white/45 group-hover/role:scale-100",
                  )}
                />
              </p>
              <p
                className={cn(
                  "mt-2 max-w-[22rem] text-[clamp(0.95rem,1.1vw,1.05rem)] leading-[1.55] tracking-[-0.02em] transition-colors duration-300",
                  index === active ? "text-white/68" : "text-white/50 group-hover/role:text-white/62",
                )}
              >
                {layer.description}
              </p>
              <div className="relative mt-5 h-[17rem] w-full overflow-hidden rounded-[10px] bg-white/10 sm:h-[22rem] lg:hidden">
                <Image
                  alt={layer.alt}
                  className="object-cover"
                  fill
                  sizes="calc(100vw - 2rem)"
                  src={layer.image}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative hidden h-[min(58vh,30rem)] w-full max-w-[34rem] overflow-hidden rounded-[10px] bg-white/10 lg:sticky lg:top-[25vh] lg:block lg:justify-self-end xl:max-w-[36rem]">
        {layers.map((layer, index) => (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === active ? "opacity-100" : "opacity-0",
            )}
            key={layer.image}
          >
            <Image
              alt={layer.alt}
              className={cn(
                "object-cover transition-transform duration-700 ease-out",
                index === active ? "scale-100" : "scale-[1.035]",
              )}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 36rem, 34rem"
              src={layer.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { ExperienceLayersScroll };
