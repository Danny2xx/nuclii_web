# Nuclii analytics setup

Nuclii uses PostHog as the shared analytics layer for the pre-launch website.
Vercel Analytics can remain enabled as a lightweight fallback, but PostHog is
the source of truth for conversion, funnel, and investor/grant reporting.

## Environment variables

Add these in local `.env.local` and in the hosting provider environment:

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_project_token_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_POSTHOG_DEBUG=false
```

Use the EU host for a UK/EU PostHog Cloud project.

## Privacy rule

Do not send personal form content into PostHog.

Allowed analytics properties:

- page or CTA location
- role/category selected by the visitor
- source page
- UTM/referral source
- device/browser metadata captured by PostHog
- signup outcome, such as `new`, `duplicate`, or `accepted_without_resend`

Do not send:

- names
- emails
- phone numbers
- message text
- organisation or society names
- free-text application answers

## Current tracked events

- `cta_clicked`
- `navigation_clicked`
- `outbound_link_clicked`
- `social_link_clicked`
- `waitlist_form_started`
- `waitlist_role_selected`
- `waitlist_submit_attempted`
- `waitlist_signup_completed`
- `waitlist_form_error`
- `waitlist_signup_received`
- `waitlist_signup_rejected`
- `waitlist_signup_failed`
- `waitlist_share_clicked`
- `waitlist_referral_link_copied`

## First dashboard

Create one PostHog dashboard with these headline cards:

- total qualified signups
- weekly signup growth
- signup conversion rate
- host, venue, society, service provider, talent, investor, and contributor mix
- top acquisition source by conversion
- top CTA locations by completed signup
- waitlist funnel drop-off
- form errors by reason

Recommended launch funnel:

```text
page viewed
-> cta_clicked
-> waitlist_form_started
-> waitlist_submit_attempted
-> waitlist_signup_completed
```

Break the funnel down by `source`, `role`, `location`, and device.
