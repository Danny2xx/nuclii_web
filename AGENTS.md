# AGENTS.md — Nuclii Pre-Launch Website

## Project Summary

Build a clean, premium, animated pre-launch marketing website for Nuclii.

Nuclii is a UK-based real-world experience platform. It helps people discover, host, book, and manage real-world experiences such as events, workshops, private gatherings, pickup windows, pop-ups, services, talent showcases, society events, and venue-led experiences.

Nuclii is not a generic events app, nightlife app, or social media feed. It is positioning itself as the infrastructure layer for real-life experiences.

Core brand line:

> more than memories.

(This replaced "Every event starts here" as the anchor line. See `PRODUCT.md`.)

Launch city: **Birmingham first.** Example events, places, and landmarks should lean on Birmingham.

Primary goal of this website:

- drive web sign-ups (the primary action; sign up / log in and create flows are planned, and point at `/join` until built)
- drive early access signups
- attract early hosts
- attract societies, communities, service providers, talent, and venues
- recruit early team members and contributors
- collect investor/partner interest
- make Nuclii feel alive before launch

This is a pre-launch website, not the full app website.

---

## Source of Truth

Before making major changes, read these files:

- `PRODUCT.md` (current product truth; wins where older docs disagree)
- `docs/NUCLII_BRAND.md`
- `docs/SITE_STRUCTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/COPY_GUIDE.md`

Use these files as the source of truth for positioning, colours, page structure, tone, and product language.

Do not invent new Nuclii positioning, colours, pages, or product features unless clearly supported by the docs.

---

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Magic UI where useful
- Motion Primitives where useful
- Framer Motion / Motion for animation
- Responsive layouts for desktop, tablet, and mobile

Recommended deployment target:

- Vercel

Recommended form/storage options:

- Supabase for waitlist/contact/team submissions
- Resend or EmailJS for email notifications

Do not hard-code fake traction numbers.

---

## Main Navigation Pages

Main nav (as built):

1. explore (→ `/events`)
2. for hosts (→ Partner With Us, `/early-access`)
3. studio (→ Build With Us form)
4. Log in
5. sign up
6. accessibility control

The logo links home. `demo`, `motives`, `create`, and `home` stay in the nav config but are hidden; the `/demo` page still exists.

Footer-only pages:

1. Investors
2. Privacy Policy
3. Terms of Use
4. Cookie Policy
5. Community Guidelines

Do not put Investors, Terms, Privacy, Cookies, or Community Guidelines in the main navigation.

---

## Design Direction

The site should feel:

- clean
- premium
- animation-esque
- calm but energetic
- investor-ready
- Gen Z / young professional friendly
- socially alive without looking like a social media app
- map-first inspired
- product-led
- trustworthy

Use a black / white visual identity with Nuclii lime (`#A3BF1C`) as the brand accent. Light (`#F7F7FA`) sections may break up the dark canvas.

Avoid making the website:

- generic
- corporate boring
- overcrowded
- childish
- too flashy
- nightlife-only
- student-only
- social-media-feed-like

The site should feel like a future category-defining startup, but still clean and simple.

---

## Colour Rules

Primary colours:

- Black background: `#0A0A0B`
- Secondary dark: `#121316`
- Surface cards: `#18191D`
- Subtle border: `#26282F`
- Primary text: `#FFFFFF`
- Secondary text: `#A1A1AA`
- Nuclii lime: `#A3BF1C` (exact value, do not approximate)
- Soft light background: `#F7F7FA` / `#F8FAFC`
- Supporting accents: make `#F04A23`, book `#35A9E0`, go `#A3BF1C` (from "you make it. you book it. you go.")

Use Nuclii lime as the main accent (logo, primary CTAs, motion controls).

Electric blue (`#5B8CFF`) is no longer the brand accent. Purple may only be used as a subtle secondary glow if needed.

---

## Animation Rules

Use motion to make the site feel alive, but not chaotic.

Good animation ideas:

- subtle scroll reveals
- floating UI cards
- map pins pulsing gently
- scroll-driven sequences (pinned, transform/opacity only)
- phone mockups with slight parallax
- hover microinteractions
- animated bento cards
- smooth page transitions
- sticky nav with blur
- form step transitions

Avoid:

- constant aggressive movement
- too many glowing effects
- distracting cursor effects
- overusing Aceternity-style hero effects everywhere
- fake loading delays

Animations should support clarity, not distract from the CTA.

Every auto-moving section gets a play/pause control (the shared `MotionToggleButton`) and a reduced-motion path.

---

## Product Positioning Rules

Nuclii should be described as:

- infrastructure for real-life experiences
- a platform for discovery, hosting, booking, access, and coordination
- privacy-first
- map-first
- eligibility-aware
- useful for events, services, workshops, pickups, pop-ups, private gatherings, talent, communities, and venues

Do not describe Nuclii as:

- just an events app
- just a nightlife app
- just a student app
- a social media app
- a follower-based platform
- an influencer-first platform

Students can be referenced as one early community, but do not publicly box the brand into student-only positioning.

---

## Core UX Rules

The website must strongly push:

- Sign up (primary)
- Join Early Access
- Become an Early Host
- Get in Touch
- Build With Us

The waitlist / early access flow should allow people to identify as:

- attendee
- host
- society/community
- service provider
- talent/creative
- venue/business
- partner
- investor
- team/contributor

Every form should be clean, short, and purposeful.

Do not collect unnecessary personal information.

Include 16+ confirmation on Early Access forms.

Include marketing consent for updates.

---

## Development Rules

- Build reusable components.
- Keep page layouts consistent.
- Use TypeScript types properly.
- Keep components small and readable.
- Prefer composition over huge single-file pages.
- Keep copy in a clear structure where possible.
- Ensure good accessibility: labels, focus states, semantic HTML, alt text.
- Ensure mobile responsiveness.
- Add metadata for SEO.
- Do not add fake data that appears as real traction.
- Do not use placeholder lorem ipsum in final visible pages.

---

## Implementation Order

Build in this order:

1. Design system tokens and global styling
2. Layout shell: navbar and footer
3. Shared components: buttons, cards, section headers, form fields, animated backgrounds
4. Home page
5. Early Access page
6. For Hosts page
7. About page
8. Build With Us page
9. Get in Touch page
10. Footer-only Investors page
11. Legal pages
12. Responsive fixes
13. Animation polish
14. SEO/accessibility/performance pass

After major changes, run the project checks and fix errors.
