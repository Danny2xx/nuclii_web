"use client";

import { useEffect, useState } from "react";

// Whether the page's opening section is still behind the top bar. The home
// page folds after its hero (#waitlist); every other page after its first
// section. The top bar and the menu button both shrink once it's gone.
export function useOverHomeHero(pathname: string) {
  const [overHero, setOverHero] = useState(true);

  // An IntersectionObserver does the watching, so scrolling never forces a
  // layout. The nav lives in the layout and can mount before the page content
  // does, so until the section turns up each scroll tries the lookup again
  // (and pages without one fold after a short scroll).
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const set = (over: boolean) => setOverHero((current) => (current === over ? current : over));
    const attach = () => {
      const top =
        pathname === "/" ? document.getElementById("waitlist") : document.querySelector("main section");
      if (!top) return false;
      // collapses once the section has scrolled up behind the bar (96px)
      observer = new IntersectionObserver(([entry]) => set(entry.isIntersecting), {
        rootMargin: "-96px 0px 0px 0px",
      });
      observer.observe(top);
      return true;
    };
    const onScroll = () => {
      if (observer || attach()) return;
      set(window.scrollY < 160);
    };
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return overHero;
}
