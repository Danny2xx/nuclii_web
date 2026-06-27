import posthog from "posthog-js";

import { getStoredConsent } from "@/lib/cookie-consent";

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-05-30",
    // No capturing or analytics cookies until the visitor opts in via the
    // cookie banner. Returning visitors who already accepted are restored below.
    opt_out_capturing_by_default: true,
    loaded: (client) => {
      if (getStoredConsent() === "accepted") {
        client.opt_in_capturing();
      }
      if (process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "true") {
        client.debug();
      }
    },
  });
}
