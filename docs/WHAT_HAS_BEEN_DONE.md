# What Has Been Done

Last updated: 2026-06-23

This file consolidates the current state of the Nuclii pre-launch website work. It is based on the actual project files in the repo, plus the existing handover and session log notes.

## Current Direction

The site has moved into a Redwood Founders-inspired campaign direction:

- Black, white, and grayscale are now the active visual system.
- Blue has been removed from the active UI styling in favor of contrast, photography, spacing, and type.
- The site uses lowercase editorial copy, hard-edged buttons, real video/photo media, and numbered content rhythms.
- The product positioning is still Nuclii-specific: infrastructure for discovering, hosting, booking, access, and coordination for real-world experiences.
- The site remains a pre-launch marketing site, not the full app website.

## Current Routes

The actual page routes currently present in `app/` are:

- `/` - Home
- `/about` - About
- `/early-access` - Early Access
- `/for-hosts` - For Hosts
- `/build-with-us` - Build With Us
- `/get-in-touch` - Get in Touch
- `/investors` - Investors
- `/privacy` - Privacy Policy
- `/terms` - Terms of Use
- `/cookies` - Cookie Policy
- `/community-guidelines` - Community Guidelines

The documented main navigation is now represented in the file tree. Investors remains footer-only.

## Design System Work

Completed design system and styling changes:

- Added `DESIGN.md` as the current campaign design reference.
- Added `PRODUCT.md` as the current product and audience reference.
- Reworked `app/globals.css` around a monochrome active theme:
  - Dark default theme.
  - Light theme support.
  - CSS variables for backgrounds, text, borders, surfaces, rings, spacing, radii, and shadows.
  - Responsive container and section spacing.
  - Safe-area-aware mobile navigation controls.
  - Reduced-motion handling.
- Changed primary CTA styling to white-on-black rather than blue gradients.
- Removed legacy blue glow, map-grid, moving-border, decorative photo-placeholder, infinite-scroll, and button-pulse CSS.
- Switched display typography to Fredoka and kept Plus Jakarta Sans for body/UI text.
- Added large lowercase display headline styling through `.nuclii-display`.
- Added numbered editorial list styling through `.nuclii-numbered-item`.
- Kept reusable `.nuclii-card`, `.nuclii-container`, `.nuclii-section`, and `.nuclii-page` primitives.

## Layout Work

Completed layout work:

- `app/layout.tsx`
  - Uses `Plus_Jakarta_Sans` and `Fredoka` from `next/font/google`.
  - Adds Vercel Analytics.
  - Sets default theme to dark.
  - Adds viewport settings with `viewportFit: "cover"`.
- `components/layout/PageShell.tsx`
  - Wraps every page in the shared site shell.
- `components/layout/SideNav.tsx`
  - Fixed right-side desktop navigation.
  - Lowercase navigation labels.
  - Active route states.
  - Theme toggle included.
  - Theme toggle sizing issue has been addressed with `min-h-0`.
- `components/layout/MobileNav.tsx`
  - Mobile drawer navigation.
  - Safe-area-aware fixed menu and theme buttons.
  - Primary waitlist CTA first.
  - Legal links included as secondary drawer links.
- `components/layout/Footer.tsx`
  - Footer logo, footer navigation, social links, and legal links.
  - Legal links open drawer content where available.
- `components/layout/legal-drawer.tsx`
  - Drawer-based legal reading experience.
  - Fixed a Unicode minus sign in a Tailwind arbitrary shadow value.
- `lib/navigation.ts`
  - Current main nav: home, about us, early access, build with us.
  - Current footer nav: about, early access, for hosts, build with us, get in touch, investors.
  - Legal footer group: privacy, terms, cookies, community guidelines.
  - Social links for Instagram, TikTok, Threads, and LinkedIn.

## Home Page

Completed in `app/page.tsx`:

- Video hero using `VideoBackgroundCarousel`.
- Hero videos:
  - `/videos/nightlife.mp4`
  - `/videos/pickup.mp4`
  - `/videos/reveal.mp4`
  - `/videos/society.mp4`
  - `/videos/workshop.mp4`
- Hero headline keeps the Nuclii brand line structure:
  - "every"
  - rotating word
  - "starts here."
- Inline waitlist form in the hero.
- Secondary CTAs:
  - Become an early host
  - Get in touch
- "why nuclii exists" text section.
- "how it works" numbered section.
- "who it's for" sticky scroll section.
- Safety and privacy section.
- FAQ section.
- Final CTA section.

## About Page

Completed in `app/about/page.tsx`:

- Rebuilt the About page in a photography-led editorial style.
- Video hero using:
  - `/videos/about/team1.mp4`
  - `/videos/about/team2.mp4`
- Added above-the-fold CTAs for joining early access and getting in touch.
- Sections added:
  - Hero
  - Why we exist
  - Our principles
  - What Nuclii connects
  - For every first connection
  - Final CTA
- Added icon set for connected audiences:
  - Attendees
  - Hosts
  - Venues
  - Talent
  - Communities
- Final talent icon is `Drama` from `lucide-react`.
- Added real imagery:
  - `/images/about-conversation.jpg`
  - `/images/about-gathering.jpg`
  - `/images/about-circle.jpg`
  - `/images/venue.jpg`
  - `/images/talent.jpg`

## Early Access Page

Completed in `app/early-access/page.tsx`:

- Reworked Early Access into a concise application page.
- Added "apply for early access" hero.
- Added above-the-fold CTAs for applying and host-specific interest.
- Added explanation steps:
  - What it is
  - What you'll do
  - What you get
- Added real photo row:
  - Attendee
  - Host
  - Venue
  - Talent
- Added role descriptions:
  - Attendees
  - Hosts
  - Venues
  - Talent
  - Collaborators
- Uses Tally CTA link:
  - `https://tally.so/r/RGjlyp`

## Build With Us Page

Completed in `app/build-with-us/page.tsx`:

- Video hero using:
  - `/videos/workshop.mp4`
  - `/videos/society.mp4`
- Added above-the-fold CTAs for applying to build and asking a question.
- Added "who you are and what you get" section.
- Added numbered contributor roles:
  - Builders
  - Designers
  - Community leads
  - Campus ambassadors
  - Content creators
  - Collaborators
- Added real image collage using attendee, host, talent, and venue photos.
- Uses Tally CTA link:
  - `https://tally.so/r/RGjlyp`

## For Hosts Page

Completed in `app/for-hosts/page.tsx`:

- Added a video-led host page using:
  - `/videos/workshop.mp4`
  - `/videos/pickup.mp4`
- Added host positioning around events, workshops, pickups, services, private gatherings, venues, and communities.
- Added host tool sections for listings, capacity, QR access, location reveal, eligibility, and arrival coordination.
- Added a real image section using `/images/host.jpg`.
- Uses Tally CTA link:
  - `https://tally.so/r/RGjlyp`

## Get In Touch Page

Completed in `app/get-in-touch/page.tsx`:

- Added a dedicated contact route for early access, host/venue interest, partnerships, and investor interest.
- Uses direct email for team contact without adding unnecessary personal-information collection.
- Added social links using the existing social navigation data.
- Added real image media using `/images/about-gathering.jpg`.

## Investors Page

Completed in `app/investors/page.tsx`:

- Added a footer-only investor interest route.
- Keeps claims conservative with no fake traction or financial claims.
- Uses direct email for investor information requests.

## Legal Pages

Completed legal routes:

- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/cookies/page.tsx`
- `app/community-guidelines/page.tsx`

Supporting work:

- `components/content/policy-page.tsx` renders legal-style content.
- `lib/legal-content.ts` stores legal and guideline section content.
- Footer legal links use `LegalDrawer` for drawer-based access where configured.
- Metadata descriptions were cleaned up to remove em-dash style copy.

## Waitlist Flow

Completed in `components/home/waitlist-form.tsx`:

- Name, email, and role fields.
- Real visible labels for accessibility.
- Role options:
  - Attendee
  - Host
  - Society / community
  - Service provider
  - Talent / creative
  - Venue / business
  - Partner
  - Investor
  - Team / contributor
- 16+ confirmation checkbox.
- Marketing/update consent checkbox.
- Client-side validation.
- Success and duplicate signup states.
- Local storage marker to avoid showing the form again after joining.
- "Join with a different email" reset control.
- Uses white/black form styling that matches the new campaign direction.

Completed in `app/api/waitlist/route.ts`:

- Validates name, email, role, 16+ confirmation, and consent.
- Escapes user-provided content before building email HTML.
- Supports Resend Audience storage when `RESEND_AUDIENCE_ID` is configured.
- Checks for duplicate contacts when an audience ID is available.
- Sends admin notification email.
- Sends subscriber confirmation email.
- Does not fail the signup if notification email sending has an issue after contact save.
- Returns a success warning if `RESEND_API_KEY` is missing instead of crashing the page.

## Shared Components

Current reusable components include:

- `components/ui/button.tsx`
  - shadcn-style button variants.
  - Hard-edged primary, secondary, outline, ghost, link, and icon variants.
  - Blue gradient and pulse animation removed.
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/media/video-background-carousel.tsx`
  - Crossfading video backgrounds.
  - Reduced-motion handling.
  - Preloads only active and next media more carefully.
- `components/motion/fade-in.tsx`
- `components/motion/reveal.tsx`
- `components/motion/rotating-word.tsx`
- `components/motion/use-is-client.ts`
- `components/home/faq.tsx`
- `components/home/who-its-for-scroll.tsx`
  - Sticky role text.
  - Photo panels.
  - Image overlay pill issue has been resolved by moving the role label under each image.
- `components/home/waitlist-form.tsx`
- `components/theme/ThemeToggle.tsx`
- `components/social/SocialLinks.tsx`

## Assets Added

Current media assets include:

- `public/nuclii-logo.png`
- `public/videos/nightlife.mp4`
- `public/videos/pickup.mp4`
- `public/videos/reveal.mp4`
- `public/videos/society.mp4`
- `public/videos/workshop.mp4`
- `public/videos/about/team1.mp4`
- `public/videos/about/team2.mp4`
- `public/images/attendee.jpg`
- `public/images/host.jpg`
- `public/images/talent.jpg`
- `public/images/venue.jpg`
- `public/images/about-conversation.jpg`
- `public/images/about-gathering.jpg`
- `public/images/about-circle.jpg`

Source/reference assets also exist under:

- `nuclii_aboutus/`

## Cleanup Completed

Deleted unused or superseded components:

- `components/aceternity/card-spotlight.tsx`
- `components/aceternity/moving-border.tsx`
- `components/aceternity/spotlight.tsx`
- `components/brand/nuclii-mascot.tsx`
- `components/layout/section-shell.tsx`
- `components/media/photo-placeholder.tsx`
- `components/motion/floating-element.tsx`
- `components/motion/particle-network.tsx`
- `components/ui/form.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`

Cleanup also included:

- Removed unused barrel exports from layout and motion indexes.
- Removed Aceternity-style decorative effects.
- Removed placeholder photo components in favor of real photos.
- Removed button glow pulse animation.
- Removed decorative dot list markers in policy and legal drawer content.
- Replaced placeholder names/emails in the waitlist form with more realistic examples.
- Removed em-dashes from real visible copy and metadata descriptions where they were flagged.
- Removed visible legal "placeholder content" language from policy pages.
- Reconciled `docs/DESIGN_SYSTEM.md` with the current monochrome campaign direction in `DESIGN.md`.

## Skills And Tooling Added

Added local design-audit tooling:

- `.agents/skills/impeccable/`
- `.claude/skills/impeccable/`
- `skills-lock.json`

The installed skill was used to audit frontend polish issues such as:

- Em-dash copy.
- Placeholder-as-label form fields.
- Decorative dots.
- Infinite glow/pulse animation.
- Unused components.
- Theme toggle sizing.
- Image overlay labels.
- Overly generic or AI-looking UI patterns.

## Current Git Worktree Shape

The worktree is not clean. Current changes include:

- Modified app pages, layout files, global CSS, waitlist API, waitlist form, legal drawer, footer/nav components, media component, theme toggle, and UI components.
- Deleted unused components listed in the cleanup section.
- New docs:
  - `DESIGN.md`
  - `PRODUCT.md`
  - `docs/SESSION_LOG_redwood_founders_redesign.md`
  - `docs/WHAT_HAS_BEEN_DONE.md`
- New public media assets for about and campaign pages.
- New local skill/tooling folders and `skills-lock.json`.

## Verification

Latest checks run after the polish pass:

- `npm run lint`
  - Result: passed with 0 errors and 0 warnings after excluding local agent/tooling bundles from project linting.
- `./node_modules/.bin/tsc --noEmit`
  - Result: passed.
- `npm run build`
  - Result: passed.
- `git diff --check`
  - Result: passed.
- Production route smoke test via `next start` on `127.0.0.1:3001`
  - `/` returned `200 OK`.
  - `/about` returned `200 OK`.
  - `/early-access` returned `200 OK`.
  - `/build-with-us` returned `200 OK`.
  - `/for-hosts` returned `200 OK`.
  - `/get-in-touch` returned `200 OK`.
  - `/investors` returned `200 OK`.

Browser screenshot tooling was not available in the current Codex session, so visual review should still be performed in a real browser before public launch.

## Still To Do

Open items based on the actual current file tree and project docs:

- Run a fresh full verification pass after any next code changes:
  - lint
  - TypeScript
  - build
  - browser/mobile visual review
