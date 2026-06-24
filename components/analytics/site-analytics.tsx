"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
  refreshAnalyticsAttribution,
} from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 90] as const;
const ENGAGEMENT_THRESHOLDS_SECONDS = [10, 30, 60] as const;

function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    refreshAnalyticsAttribution();

    const frame = window.requestAnimationFrame(() => {
      captureAnalyticsEvent(ANALYTICS_EVENTS.pageViewed, {
        path: pathname,
        has_query: searchParams.toString().length > 0,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  useEffect(() => {
    const reached = new Set<number>();

    function trackScrollDepth() {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const scrollDepth = Math.min(
        100,
        Math.round((window.scrollY / scrollableHeight) * 100),
      );

      for (const threshold of SCROLL_THRESHOLDS) {
        if (scrollDepth >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          captureAnalyticsEvent(ANALYTICS_EVENTS.scrollDepthReached, {
            path: pathname,
            percent: threshold,
          });
        }
      }
    }

    trackScrollDepth();
    window.addEventListener("scroll", trackScrollDepth, { passive: true });
    window.addEventListener("resize", trackScrollDepth);

    return () => {
      window.removeEventListener("scroll", trackScrollDepth);
      window.removeEventListener("resize", trackScrollDepth);
    };
  }, [pathname, routeKey]);

  useEffect(() => {
    const timers = ENGAGEMENT_THRESHOLDS_SECONDS.map((seconds) =>
      window.setTimeout(() => {
        captureAnalyticsEvent(ANALYTICS_EVENTS.pageEngaged, {
          path: pathname,
          seconds,
        });
      }, seconds * 1000),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [pathname, routeKey]);

  useEffect(() => {
    const trackedSections = new Set<string>();
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-analytics-section]"),
    );

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const section = entry.target.getAttribute("data-analytics-section");
          if (!section || trackedSections.has(section)) continue;

          trackedSections.add(section);
          captureAnalyticsEvent(ANALYTICS_EVENTS.sectionViewed, {
            path: pathname,
            section,
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, [pathname, routeKey]);

  return null;
}

export { SiteAnalytics };
