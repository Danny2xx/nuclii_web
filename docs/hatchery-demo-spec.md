# Nuclii — Hatchery Demo Spec

> Handoff doc: everything agreed about the Hatchery submission demo. If you're a new chat/agent, read this top-to-bottom before touching code. Written 2026-07-16.

## Context

- Hatchery (incubator) submission due soon. No backend MVP exists.
- The site (nuclii.co.uk, this repo, Next.js on Vercel) is a polished marketing site with a real waitlist (Resend + count API), partner pipeline, gated events page, PostHog analytics.
- Strategy: don't build a backend. Build a **sandbox demo app** — the full web-app UI running on a seeded in-browser world — plus reframe existing waitlist/analytics numbers as traction.

## The core strategy: real app shell, fake world

Build the entire web-app UI (sign-in, feeds, dashboards, settings) on a single richly-seeded "world" living in localStorage/client state. Every action genuinely works *within the sandbox*: a host creates an event → it appears in the attendee feed; an attendee RSVPs → the host's count ticks up. No auth backend, no database.

**Rule #1: demo the full app, not the empty app.** Real signup would give a judge an empty account. Pre-built personas give them a lived-in life.

## Entry point

- Navbar gets `{ label: "demo", href: "/#demo" }` in `lib/navigation.ts` (plain hrefs, works cross-page).
- `/#demo` = a **doorway section** on the home page, placed **right after the "experience layers" section** (which introduces the four roles in words; the demo says "now play them"). Section shows an angled live preview of the app + persona cards ("enter as host / attendee / talent / venue").
- Entering takes over full-screen into the app shell (route `/demo`).
- Hatchery form link: `nuclii.co.uk/#demo`.
- Section is lazy-loaded (dynamic import + IntersectionObserver) — home page perf untouched (hero already ships 5 videos).
- Tag `data-analytics-section="home_demo"`; track role selections + demo engagement in PostHog (usage stats double as submission stats).

## Core model: one world, one event object, four lenses

The atom is the **event**. Every role is a lens on the same event record:

- **Host** creates it → sees RSVP count, budget, assembly checklist.
- **Venue** hosts it → sees a booking on their calendar.
- **Talent** plays it → sees a gig + payout.
- **Attendee** discovers it → sees a night out, price, who's going.

When a host creates an event it goes into *the world*, not "the host's data." Same object, four renderings.

## Identity: roles are hats, not account types

- Airbnb model: an account is a person; roles are hats they add. Home screen/dashboard follows the *leading* hat.
- Each demo persona leads with one role. **Maya (host) is dual-role** (also has an attendee "going" list) — one detail that makes the model read as real platform thinking and answers "where does supply come from?" (hosts grow out of attendees).
- Users with 2+ hats get a **mode switcher in the topbar** ("hosting" ↔ "exploring") that flips dashboard + colour tint.

### How an attendee switches (real product mechanic)

- Quiet persistent entry: account menu → "become a host" / "list your space" / "offer your talent."
- **Contextual invitations** (the creative bit): attendee who's been to 3 supper clubs sees "run your own?"; a photographer sees "events like this book photographers." The platform recruits supply from demand — the flywheel made visible.
- Clicking runs the **add-a-role onboarding** (same 2–3 step role fork as signup, for the new hat). Account gains a mode; topbar grows the switcher.
- Demo beat: let the judge do this themselves — enter as attendee, "become a host," walk onboarding, watch their topbar grow the switcher.

### "View as" (demo-only device)

Account-menu switcher labelled "view as" that swaps between *seeded personas* over persistent world state. Distinct from the real mode-switcher mechanic; both exist in the demo.

## The 5-step demo loop (this IS the Hatchery demo)

1. Enter as Maya (host) → create an event → pick venue and talent inside the flow.
2. "View as" venue → request on their calendar → accept.
3. "View as" talent → gig offer in inbox → accept.
4. "View as" attendee → event live in feed → RSVP.
5. Back to Maya → RSVPs up, venue confirmed, talent booked. Event fully assembled in under 3 minutes.

Whichever role you play, flows converge on the same **featured shared event** (working fiction: a supper-club-turned-listening-party in Peckham, Thursday). Every role's home surfaces it above the fold so the loop is demoable from any entry point.

## Sign-in screen

- Real-looking sign-in form (proper validation) but the star is **"continue as..." persona cards** — four pre-built accounts with lived-in lives.
- Real **sign-up flow** also works: name + location → "what brings you to nuclii?" role fork (four role cards) → 2–3 role-specific steps (attendee: interests; host: what they run; venue: space basics; talent: craft) → lands in the right dashboard. Creates a local account.
- No real auth backend ever. localStorage only.

## Subscriptions (Nuclii has packages per role — business model fact)

- **Demand side free & frictionless.** Attendees never hit a paywall. Optional attendee premium = "membership" framing (early access to drops, priority RSVPs, member-only events).
- **Packages live at the switch.** End of "become a host" onboarding shows host plans: free starter tier (switching never blocked) + paid tiers (more listings, discovery boost, analytics, lower commission). Same for venue/talent. Role switch = monetization funnel.
- **Every persona has a billing page** in settings: current plan, renewal, comparison table, an invoice or two. Highest-credibility screen in the demo. Seed across the ladder: Maya on Host Pro; venue on free tier w/ tasteful upgrade nudge; talent mid-tier.
- **Show gates, never enforce.** "Pro" badge on advanced analytics, blurred insights panel w/ upgrade prompt. Core demo loop must run fully on free tier. "Upgrade" button opens the plan sheet / "start trial" + confetti — no fake card forms.
- Prices labelled **early-access pricing** — plausible, not publicly committed.
- Seed world includes a **plans table** (tiers/prices/features per role).

## Attendee home (Spotify grammar — grammar, not skin)

Mapping (adapt freely; another grammar is fine if it suits nuclii better):

- **Shelves** (horizontal card rows): *tonight near you · this weekend · supper clubs · because you went to X · new from hosts you follow*. "Because you went to..." demos recommendations without a recommender.
- **Library sidebar**: going, saved, past events, followed hosts/venues/talent.
- **Event page**: gradient header colour-bled from event photo.
- **Talent profile** maps 1:1 to Spotify artist page: events played, past gigs, upcoming bookings.
- **Collections** (playlists): "peckham this week," "first-date energy," "under £15" — editorial taste + future community feature.
- **Browse grid**: category tiles (supper clubs, workshops, nightlife, pickup sports, markets) tinted from palette.
- **"Up next" bar** (now-playing bar): slim persistent strip w/ your next confirmed event ("vinyl & supper · thu 8pm · 2 days away"). For supply roles it shows next booking/gig.

Cautions: (1) copy layout grammar, never Spotify's visual identity — everything in nuclii tokens (lowercase type, role signal colours, borders). (2) Spotify grammar is attendee-only; supply POVs use dashboard grammar. (3) Shelves are hungry — render 4–5 FULL shelves (6–8 cards, events may repeat across shelves), never a sparse one.

## Supply-side homes

Design rule: **the home answers that role's anxiety question in one screen, zero clicks.**
Shared skeleton across all three: *one hero (your next thing) · one action queue (what needs you) · one money/momentum module · one growth nudge.* One dashboard layout, different organs.

### Host — "how's my event doing?" (producer's control room)

- Next-event hero card: RSVP-vs-capacity ring, days-to-go, revenue. (Where the judge watches counts tick.)
- **Assembly strip** — signature Nuclii module: slots for venue · talent · promotion, each in role colour, each with state (confirmed ✓ / awaiting ⏳). The marketplace rendered as UI.
- "Needs your attention" queue: venue reply, attendee question, payout.
- Your events: upcoming / drafts / past w/ mini stats.
- Insights teaser: views → saves → RSVPs funnel; deeper analytics = Pro badge.
- Persistent CTA: **create event**.

### Venue — "what's coming into my space?" (front-desk diary)

- **Requests inbox at the top**: event, host, date, offer, accept/decline inline. (Maya's request lands here.)
- Month calendar w/ bookings as colour blocks, tonight highlighted. Seed densely — an empty calendar kills the illusion.
- Three big stats: nights booked, revenue, utilisation %.
- Space card: cover photo, capacity, amenities + profile-completeness meter + nudge ("spaces with 5+ photos get 3× more requests").
- Free tier: blurred "who's viewing your space" panel w/ upgrade prompt.

### Talent — "who wants to book me, when do I get paid?" (agent's pipeline)

- Booking pipeline: new / in discussion / confirmed. New-request card leads w/ event, date, venue, fee + inline accept.
- Next-gig hero card: where, when, set details, fee.
- Earnings module: this month, pending payout, small trend graph.
- Compact gig calendar.
- **Discovery pulse**: "appeared in 12 searches for DJs in SE London this week · viewed by 4 hosts." (The growth-story module.)
- Portfolio health: views, media count, "add a video" nudge.

## Features ranked by realism-per-hour

1. **POV switching on a shared world** (create as Maya → see it as attendee — nearly free once world exists).
2. **Ambient liveness** — scripted background activity: RSVP ticks in ~20s after landing on host dashboard, a message arrives, notification badge, event "almost full."
3. **A believable London** — 25–40 real-sounding events (Peckham supper club, Hackney ceramics workshop, rooftop listening session, five-a-side pickup) w/ photos, prices, capacities, reviews in different voices. Data quality = 50% of the illusion. "Event 1 / Test Venue" kills it.
4. **Settings & profile editing** — cheap, disproportionately convincing. Nobody fakes settings pages.
5. **Messages** — 2–3 seeded threads (host↔venue negotiating a date; attendee question).
6. **Role-tinted theming** — each POV tinted w/ its signal colour from `lib/experience-roles.ts` (explorer `#7A9E6E`, host `#8E7CA8`, venue `#6F89A8`, talent `#B5736E`).

## Build tiers (stop wherever the clock runs out; each tier demoable alone)

- **Tier 1 (demo exists):** app shell + sign-in w/ persona cards + attendee feed & event pages + RSVP + host dashboard + create-event appearing in feed + POV switch.
- **Tier 2 (demo impresses):** talent portfolio & booking requests, venue calendar, seeded message threads, signup onboarding flow.
- **Tier 3 (demo astonishes):** ambient liveness, notifications, settings + billing pages, role theming, earnings graphs.

## Seed world spec (build this FIRST — everything hangs off it)

- **4 personas** w/ names + backstories: Maya (host, dual-role, Host Pro plan, 3 past supper clubs, event selling this week), a talent (portfolio, booking requests, earnings, mid-tier plan), a venue (calendar w/ bookings, free tier), an attendee (saved events, "going" list, past events).
- **~30 London events**, tagged for 4–5 full shelves + browse grid, each w/ good photography (shelf cards live or die on images) + a header colour.
- **The featured shared event** the loop revolves around.
- **Plans table**: tiers, prices (early-access framing), features per role — doubles as actual pricing thinking for the Hatchery form.
- 2–3 message threads; reviews in varied voices.

## Finishing touches

- Discreet **"sandbox — full version in build"** chip: honest, frames everything as your design coming to life.
- **Reset demo** button (one click back to fresh seed).
- Confetti (canvas-confetti already a dep) on first event created / upgrade.
- Bespoke icons — no generic lucide (standing design preference).
- Record a 2–3 min **Loom** of the 5-step loop for the submission; de-risks live demo.
- Submission framing: lead with live-site traction ("Live at nuclii.co.uk, X signups, Z% conversion, N partner inquiries" — pull real numbers from PostHog/waitlist) + demo link.

## Backlog idea: X-style "studio" nav (agreed direction, NOT yet built)

Inspired by X's Creator Studio: one nav, one identity — supply tools as a nav *section*, not a separate mode.

- When an account holds a supply hat, the sidebar grows a **"studio" group** under the consumer items (host: your events · insights · payouts; talent: portfolio · bookings · earnings; venue: your space · calendar · requests). Both lives visible at once.
- **Pure attendees see a locked "studio" entry** ("start hosting", host-signal dot) → opens become-a-host onboarding + plan ladder. The recruit-supply-from-demand funnel becomes structural nav furniture.
- Demo beat: judge playing sofia taps it, finishes onboarding, watches their own sidebar grow the studio section.
- Also stealable from X nav: "member" entry (attendee premium), "circles" teaser (scene communities), "drops" badge (limited releases from followed hosts), verified host/venue badges, "your year in nights" attendee stats.
- Relationship to current mode switcher: hybrid — keep role-tinted dashboards as studio pages, restructure sidebar to one nav with a studio group. Locked-studio-entry is the highest-value first slice.

## Shipped since first build (state of the demo)

- **Real launch pricing** in `lib/demo/plans.ts` (GBP/mo): explorer free + **buddy up £2.99**; host free / **plus £19.99 / premium £49.99 / business £99.99**; venue basic free / **plus £19.99 / premium £49.99**; talent free / **pro £9.99 / premium £19.99**. Add-ons captured in `ADD_ONS` (boosts £4.99/£12.99, featured event/talent £9.99, featured venue £29.99, verification £9.99, request-to-join £2.99, host+venue bundle £129.99). Personas: Maya→host premium, Priya→venue basic, Jerome→talent pro, Sofia→explorer free.
- **Role model = explorer is the base hat for EVERYONE.** Guest accounts from sign-up get `[role, explorer]`; all personas carry explorer. A supply account always shows the hosting↔exploring switcher. (`useActiveHat` in app-shell.)
- **Tickets + QR**: RSVP'd events open a ticket screen (`screens/ticket.tsx`) with a deterministic sandbox QR (`qr.tsx`), reference code, perforated stub. Entry: your-nights "going" rows + "ticket" button on event pages.
- **Map-first discovery** (`screens/map.tsx`): stylised London, photo pins by area tinted by category, filters (all/tonight/weekend/free), slide-up card → event detail. Surfaced as a "categories | map" toggle in browse.
- **Onboarding elevated**: prominent "create your account" button on sign-in (was a tiny link); full role-fork flow works end-to-end.
- **Bespoke nuclii marks** (`marks.tsx`) reusing `components/home/feature-marks.tsx` dimensional icons in nav + content (not raw lucide).
- **48–96px responsive content gutter**; nuclii green logo, Sora titles, pill buttons, grouped-list vocabulary, 46 topic-matched licensed images (`public/demo/`, credits in `public/demo/manifest.json`).

### Still open
- Wire settings "become a host" to run the real onboarding + plan ladder (currently instant add-hat).
- QR check-in view for hosts/venues (scan attendee tickets; `ScanMark` exists).
- The X-style studio nav restructure (see backlog idea above).
- Surface add-ons (boosts/featured/verification) as purchasable UI.
- Photo-credits colophon before public launch.

## Don't build (before the deadline)

Real auth, databases, payments, mobile app, anything invisible in a 3-minute walkthrough.
