export const ANALYTICS_EVENTS = {
  ctaClicked: "cta_clicked",
  navigationClicked: "navigation_clicked",
  outboundLinkClicked: "outbound_link_clicked",
  socialLinkClicked: "social_link_clicked",
  waitlistFormStarted: "waitlist_form_started",
  waitlistRoleSelected: "waitlist_role_selected",
  waitlistSubmitAttempted: "waitlist_submit_attempted",
  waitlistSignupCompleted: "waitlist_signup_completed",
  waitlistFormError: "waitlist_form_error",
  waitlistSignupReceived: "waitlist_signup_received",
  waitlistSignupRejected: "waitlist_signup_rejected",
  waitlistSignupFailed: "waitlist_signup_failed",
  waitlistShareClicked: "waitlist_share_clicked",
  waitlistReferralCopied: "waitlist_referral_link_copied",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsPropertyValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;

export function compactAnalyticsProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, Exclude<AnalyticsPropertyValue, undefined>>;
}
