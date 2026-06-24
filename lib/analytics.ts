"use client";

import posthog from "posthog-js";

import {
  ANALYTICS_EVENTS,
  compactAnalyticsProperties,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics-events";

function hasPostHogToken() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

export function captureAnalyticsEvent(
  event: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (typeof window === "undefined" || !hasPostHogToken()) return;

  posthog.capture(
    event,
    compactAnalyticsProperties({
      app: "nuclii_web",
      environment: process.env.NODE_ENV,
      ...properties,
    }),
  );
}

export function getAnalyticsDistinctId() {
  if (typeof window === "undefined" || !hasPostHogToken()) return undefined;

  try {
    return posthog.get_distinct_id();
  } catch {
    return undefined;
  }
}

export { ANALYTICS_EVENTS };
