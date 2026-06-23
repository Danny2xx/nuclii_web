"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type Role = {
  number: string;
  title: string;
  description: string;
  image: string;
};

function WhoItsForScroll({ roles }: { roles: readonly Role[] }) {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = panelRefs.current.map((panel, index) => {
      if (!panel) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(index);
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(panel);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <div className="lg:sticky lg:top-32 lg:h-fit">
        <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
          who it&apos;s for
        </h2>
        <div className="mt-8">
          {roles.map((role, index) => (
            <div
              className={cn(
                "nuclii-numbered-item transition-opacity duration-300",
                index === active ? "opacity-100" : "lg:opacity-35",
              )}
              key={role.number}
            >
              <p className="nuclii-numbered-item__heading">
                <span className="nuclii-numbered-item__number">
                  {role.number}
                </span>
                {role.title}
              </p>
              <p className="nuclii-numbered-item__description">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <div
            className="space-y-3"
            key={role.number}
            ref={(panel) => {
              panelRefs.current[index] = panel;
            }}
          >
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border sm:aspect-video">
              <Image
                alt={role.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={role.image}
              />
            </div>
            <p className="text-sm font-semibold lowercase text-muted-foreground">
              {role.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { WhoItsForScroll };
