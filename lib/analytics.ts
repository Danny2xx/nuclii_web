"use client";

import posthog from "posthog-js";

import {
  ANALYTICS_EVENTS,
  compactAnalyticsProperties,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics-events";

const ATTRIBUTION_STORAGE_KEY = "nuclii-analytics-attribution";
const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "source",
  "campaign",
] as const;

type AttributionTouch = {
  landing_path?: string;
  referrer_domain?: string;
} & Partial<Record<(typeof ATTRIBUTION_QUERY_KEYS)[number], string>>;

type StoredAttribution = {
  first_touch?: AttributionTouch;
  last_touch?: AttributionTouch;
};

function hasPostHogToken() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

function cleanAnalyticsValue(value: string | null | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, 120) || undefined;
}

function readStoredAttribution(): StoredAttribution {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return stored ? JSON.parse(stored) as StoredAttribution : {};
  } catch {
    return {};
  }
}

function getReferrerDomain() {
  if (typeof document === "undefined" || !document.referrer) return undefined;

  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function getTouchFromCurrentLocation(): AttributionTouch {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const touch: AttributionTouch = {
    landing_path: window.location.pathname,
    referrer_domain: getReferrerDomain(),
  };

  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = cleanAnalyticsValue(params.get(key));
    if (value) touch[key] = value;
  }

  return touch;
}

function flattenTouch(prefix: "first" | "last", touch?: AttributionTouch) {
  const properties: AnalyticsProperties = {};
  if (!touch) return properties;

  properties[`${prefix}_landing_path`] = touch.landing_path;
  properties[`${prefix}_referrer_domain`] = touch.referrer_domain;

  for (const key of ATTRIBUTION_QUERY_KEYS) {
    properties[`${prefix}_${key}`] = touch[key];
  }

  return properties;
}

function getPageProperties() {
  if (typeof window === "undefined") return {};

  return {
    page_path: window.location.pathname,
    page_title: document.title,
  };
}

export function refreshAnalyticsAttribution() {
  if (typeof window === "undefined") return;

  const currentTouch = getTouchFromCurrentLocation();
  const stored = readStoredAttribution();
  const next: StoredAttribution = {
    first_touch: stored.first_touch ?? currentTouch,
    last_touch: currentTouch,
  };

  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Attribution should never block analytics or page behavior.
  }
}

export function getAnalyticsAttributionProperties() {
  const stored = readStoredAttribution();

  return {
    ...flattenTouch("first", stored.first_touch),
    ...flattenTouch("last", stored.last_touch),
  };
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
      ...getPageProperties(),
      ...getAnalyticsAttributionProperties(),
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
