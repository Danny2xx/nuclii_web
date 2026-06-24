import { randomUUID } from "node:crypto";

import { PostHog } from "posthog-node";

import {
  compactAnalyticsProperties,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics-events";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export async function captureServerAnalyticsEvent(
  event: AnalyticsEventName,
  distinctId: string | undefined,
  properties: AnalyticsProperties = {},
) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return;

  const client = new PostHog(token, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    client.capture({
      distinctId: distinctId || `server:${randomUUID()}`,
      event,
      properties: compactAnalyticsProperties({
        app: "nuclii_web",
        environment: process.env.NODE_ENV,
        source_runtime: "server",
        ...properties,
      }),
    });
  } catch (error) {
    console.error("[Nuclii] PostHog capture error:", error);
  } finally {
    try {
      await client.shutdown();
    } catch (error) {
      console.error("[Nuclii] PostHog shutdown error:", error);
    }
  }
}
