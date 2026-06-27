import posthog from "posthog-js";

export const COOKIE_CONSENT_KEY = "nuclii-cookie-consent";
/** Fired on the window whenever the stored consent choice changes. */
export const COOKIE_CONSENT_EVENT = "nuclii-cookie-consent-change";

export type CookieConsent = "accepted" | "rejected";

function hasPostHogToken() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

/** Opt analytics in or out to match a consent choice. */
export function applyConsentToPostHog(consent: CookieConsent) {
  if (typeof window === "undefined" || !hasPostHogToken()) return;
  try {
    if (consent === "accepted") {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  } catch {
    // PostHog may not be initialised (e.g. no token in this environment).
  }
}

export function setConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, consent);
  } catch {
    // Storage can fail (private mode); consent still applies for this session.
  }
  applyConsentToPostHog(consent);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
