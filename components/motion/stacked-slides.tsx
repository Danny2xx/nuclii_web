"use client";

import { Children, createRef, useEffect, useState, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useLessMotion } from "@/components/motion/use-less-motion";
import { cn } from "@/lib/utils";

// Sections that pile up like stacked slides: each fills at least the screen
// and sticks once its bottom reaches the bottom of the screen (so taller ones
// are seen in full first), then the next slides up over it while the one
// underneath dims. Only an overlay's opacity animates, so it stays smooth.

function Slide({
  children,
  index,
  nextRef,
  slideRef,
}: {
  children: ReactNode;
  index: number;
  nextRef?: RefObject<HTMLDivElement | null>;
  slideRef: RefObject<HTMLDivElement | null>;
}) {
  const [top, setTop] = useState(0);

  // stick when the bottom edge meets the bottom of the screen
  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [slideRef]);

  // how far the next slide has covered this one (0 → 1)
  const { scrollYProgress: covered } = useScroll({
    target: nextRef ?? slideRef,
    offset: ["start end", "start start"],
  });
  // Covered slides only dim; they stay visible (not visibility: hidden) so
  // screen readers, keyboard focus and find-in-page can still reach them.
  const dim = useTransform(covered, (v) => (nextRef ? 0.6 * v : 0));

  return (
    <div
      className={cn("sticky", index > 0 && "-mt-px")}
      ref={slideRef}
      style={{ top, zIndex: index + 1 }}
    >
      <div
        className={cn(
          // clip, not hidden: hidden would stop pinned content inside from sticking
          "relative flex min-h-[100svh] flex-col overflow-clip [&>section]:flex [&>section]:flex-1 [&>section]:flex-col [&>section]:justify-center",
          // later slides show a rounded top edge as they arrive over the pile
          index > 0 && "rounded-t-[1.75rem] border-t border-white/10 shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.9)]",
        )}
      >
        {children}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
      </div>
    </div>
  );
}

function StackedSlides({ children }: { children: ReactNode }) {
  const lessMotion = useLessMotion();
  const slides = Children.toArray(children);
  // stable ref objects, one per slide (held in state so render never reads .current)
  const [refs] = useState(() => slides.map(() => createRef<HTMLDivElement>()));

  if (lessMotion) return <>{children}</>;

  return (
    <div className="relative bg-[#0A0A0B]">
      {slides.map((child, index) => (
        <Slide index={index} key={index} nextRef={refs[index + 1]} slideRef={refs[index]}>
          {child}
        </Slide>
      ))}
    </div>
  );
}

export { StackedSlides };
