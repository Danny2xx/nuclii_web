"use client";

import Link from "next/link";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";

import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
} from "@/lib/analytics";
import type {
  AnalyticsEventName,
  AnalyticsProperties,
} from "@/lib/analytics-events";

type TrackingProps = {
  analyticsEvent?: AnalyticsEventName;
  analyticsProperties?: AnalyticsProperties;
};

type TrackedAnchorProps = ComponentPropsWithoutRef<"a"> & TrackingProps;
type TrackedLinkProps = ComponentPropsWithoutRef<typeof Link> & TrackingProps;

function hrefToString(href: TrackedLinkProps["href"] | TrackedAnchorProps["href"]) {
  if (!href) return "";
  if (typeof href === "string") return href;

  const pathname = href.pathname ?? "";
  const query = href.query ? `?${new URLSearchParams(href.query as Record<string, string>).toString()}` : "";
  const hash = href.hash ? `#${href.hash}` : "";

  return `${pathname}${query}${hash}`;
}

function captureLinkClick(
  event: AnalyticsEventName | undefined,
  href: string,
  properties: AnalyticsProperties | undefined,
) {
  captureAnalyticsEvent(event ?? ANALYTICS_EVENTS.ctaClicked, {
    href,
    ...properties,
  });
}

const TrackedAnchor = forwardRef<HTMLAnchorElement, TrackedAnchorProps>(
  (
    {
      analyticsEvent,
      analyticsProperties,
      href,
      onClick,
      ...props
    },
    ref,
  ) => {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      captureLinkClick(analyticsEvent, hrefToString(href), analyticsProperties);
      onClick?.(event);
    }

    return <a href={href} onClick={handleClick} ref={ref} {...props} />;
  },
);

TrackedAnchor.displayName = "TrackedAnchor";

const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  (
    {
      analyticsEvent,
      analyticsProperties,
      href,
      onClick,
      ...props
    },
    ref,
  ) => {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      captureLinkClick(analyticsEvent, hrefToString(href), analyticsProperties);
      onClick?.(event);
    }

    return <Link href={href} onClick={handleClick} ref={ref} {...props} />;
  },
);

TrackedLink.displayName = "TrackedLink";

export { TrackedAnchor, TrackedLink };
