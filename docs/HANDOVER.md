# Nuclii Website Handover

## 1. Current Project Goal

Build a clean, premium, animated pre-launch marketing website for Nuclii.

The site should:

- Drive early access signups.
- Attract early hosts, societies, communities, service providers, talent, venues, partners, and investors.
- Recruit early team members and contributors.
- Make Nuclii feel alive before launch.
- Position Nuclii as infrastructure for real-world experiences, not just an events app, nightlife app, student app, or social media feed.

This is a pre-launch website, not the full product application.

## 2. Nuclii Brand Summary

Core brand line:

> Every event starts here.

Nuclii is a UK-based real-world experience platform for discovering, hosting, booking, and managing real-life experiences.

Supported use cases include:

- Events
- Workshops
- Private gatherings
- Pickup windows
- Pop-ups
- Services
- Talent showcases
- Society and community experiences
- Venue-led experiences

The website should feel:

- Clean
- Premium
- Calm but energetic
- Investor-ready
- Gen Z and young professional friendly
- Map-first inspired
- Product-led
- Trustworthy
- Blue, black, and white

Avoid:

- Fake traction numbers
- Public financial claims
- Generic corporate styling
- Overcrowding
- Childish visuals
- Nightlife-only positioning
- Student-only positioning
- Social-media-feed-like UI

Primary brand colours from the docs:

- Black background: `#0A0A0B`
- Secondary dark: `#121316`
- Surface cards: `#18191D`
- Subtle border: `#26282F`
- Primary text: `#FFFFFF`
- Secondary text: `#A1A1AA`
- Electric blue: `#5B8CFF`
- Deep blue: `#0B1B3F`
- Soft light background: `#F8FAFC`

## 3. Pages Already Created

Main pages:

- `app/page.tsx` - Home
- `app/about/page.tsx` - About
- `app/early-access/page.tsx` - Early Access
- `app/hosts/page.tsx` - For Hosts
- `app/build-with-us/page.tsx` - Build With Us
- `app/contact/page.tsx` - Get in Touch

Footer-only pages:

- `app/investors/page.tsx` - Investors
- `app/privacy/page.tsx` - Privacy Policy
- `app/terms/page.tsx` - Terms of Use
- `app/cookies/page.tsx` - Cookie Policy
- `app/community-guidelines/page.tsx` - Community Guidelines

The Investors page is serious and investor-ready. It does not use public "Pre-seed" language and does not include fake metrics, valuation, equity, or financial claims.

The legal pages are styled draft placeholders with "Last updated" dates.

## 4. Components Already Created

Layout:

- `components/layout/Navbar.tsx`
- `components/layout/MobileNav.tsx`
- `components/layout/Footer.tsx`
- `components/layout/PageShell.tsx`
- `components/layout/section-shell.tsx`
- `components/layout/index.ts`

UI:

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
- `components/ui/accordion.tsx`
- `components/ui/label.tsx`
- `components/ui/form.tsx`

Motion:

- `components/motion/fade-in.tsx`
- `components/motion/reveal.tsx`
- `components/motion/floating-element.tsx`
- `components/motion/use-is-client.ts`
- `components/motion/index.ts`

Forms:

- `components/forms/early-access-form.tsx`
- `components/forms/build-with-us-form.tsx`
- `components/forms/contact-form.tsx`

Content helpers:

- `components/content/policy-page.tsx`

Utilities:

- `lib/utils.ts`
- `lib/navigation.ts`

Global styling and config:

- `app/globals.css`
- `tailwind.config.ts`
- `components.json`

## 5. Dependencies Installed

Runtime dependencies:

- `next`
- `react`
- `react-dom`
- `motion`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `zod`
- `react-hook-form`
- `@radix-ui/react-accordion`
- `@radix-ui/react-label`
- `@radix-ui/react-slot`

Development dependencies:

- `typescript`
- `tailwindcss`
- `@tailwindcss/postcss`
- `eslint`
- `eslint-config-next`
- `@types/node`
- `@types/react`
- `@types/react-dom`

Project scripts:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## 6. Current Folder Structure

```text
nuclii_web/
  app/
    about/
      page.tsx
    build-with-us/
      page.tsx
    community-guidelines/
      page.tsx
    contact/
      page.tsx
    cookies/
      page.tsx
    early-access/
      page.tsx
    hosts/
      page.tsx
    investors/
      page.tsx
    privacy/
      page.tsx
    terms/
      page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    content/
      policy-page.tsx
    forms/
      build-with-us-form.tsx
      contact-form.tsx
      early-access-form.tsx
    layout/
      Footer.tsx
      MobileNav.tsx
      Navbar.tsx
      PageShell.tsx
      index.ts
      section-shell.tsx
    motion/
      fade-in.tsx
      floating-element.tsx
      index.ts
      reveal.tsx
      use-is-client.ts
    ui/
      accordion.tsx
      badge.tsx
      button.tsx
      card.tsx
      form.tsx
      input.tsx
      label.tsx
  docs/
    COPY_GUIDE.md
    DESIGN_SYSTEM.md
    HANDOVER.md
    NUCLII_BRAND.md
    SITE_STRUCTURE.md
  lib/
    navigation.ts
    utils.ts
  public/
  AGENTS.md
  components.json
  eslint.config.mjs
  next-env.d.ts
  next.config.ts
  package.json
  package-lock.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
```

## 7. Prompt Number Reached

Prompt 12 was completed.

Prompt sequence so far:

1. Read `AGENTS.md` and every file in `docs/`, then summarize the website plan.
2. Initialize the full Next.js project in the current folder.
3. Install and configure UI and animation dependencies.
4. Create the Nuclii design system.
5. Build the shared layout system.
6. Build the Home page.
7. Build the Early Access page.
8. Build the About page.
9. Build the For Hosts page.
10. Build the Build With Us page.
11. Build the Get in Touch page.
12. Create the footer-only pages.

## 8. What Prompt 12 Completed Or Did Not Complete

Prompt 12 completed:

- Created `app/investors/page.tsx`.
- Created `app/privacy/page.tsx`.
- Created `app/terms/page.tsx`.
- Created `app/cookies/page.tsx`.
- Created `app/community-guidelines/page.tsx`.
- Created reusable `components/content/policy-page.tsx`.
- Added draft legal copy with clear draft labelling and last updated dates.
- Added Community Guidelines covering respectful use, no fake events, no harassment, privacy respect, reporting, and safety-first behaviour.
- Verified the footer-only routes returned HTTP `200`.
- Ran `npm run lint`.
- Ran `npm run build`.

Prompt 12 did not complete:

- Legal review or final legal copy.
- Supabase, Resend, EmailJS, or backend form integration.
- Full responsive QA.
- Full accessibility QA.
- Full SEO metadata pass across every page.
- Performance audit.
- Visual browser screenshot review.

## 9. Known Issues Or Build Errors

No known current lint or build errors.

Last checks passed:

- `npm run lint`
- `npm run build`

Known warning:

- `npm audit` previously reported 2 moderate vulnerabilities through the Next/PostCSS dependency chain. `npm audit fix --force` was not run because it would make broad dependency changes.

Other notes:

- Forms currently store submission state locally and log to the console only.
- No Supabase or email notification integration has been added yet.
- Legal pages are placeholders and should be reviewed before launch.

## 10. Exact Next Steps

Recommended next phase:

1. Read `AGENTS.md` and the docs again before editing.
2. Inspect the current app structure.
3. Perform a responsive QA pass across mobile, tablet, and desktop.
4. Perform an accessibility pass:
   - Heading hierarchy
   - Labels
   - Focus states
   - Button and link semantics
   - Keyboard navigation
   - Contrast
5. Perform an SEO metadata pass across all routes.
6. Review animations for calm, premium behaviour.
7. Check spacing consistency and remove any overcrowding.
8. Run `npm run lint`.
9. Run `npm run build`.
10. Summarize changed files and remaining risks.

Later phases:

- Connect Early Access, Contact, and Build With Us forms to Supabase or another backend.
- Add email notifications with Resend or EmailJS if required.
- Replace draft legal pages with reviewed legal copy.
- Deploy to Vercel.

## 11. Exact First Prompt For A New Codex Chat

```text
Read AGENTS.md first, then read every file inside /docs, including docs/HANDOVER.md.

Do not reinitialize the project.
Do not delete any existing files.
Do not make backend integrations yet.

Continue from the current Nuclii Next.js project state.

Perform a responsive, accessibility, SEO, performance, and animation polish pass across all existing pages.

Focus on:
- mobile, tablet, and desktop layout fixes
- heading hierarchy
- metadata for every page
- button and link accessibility
- form labels and focus states
- keyboard navigation
- spacing consistency
- reducing overcrowding
- keeping the design clean, premium, blue/black/white, and map-first inspired
- ensuring there are no fake metrics or fake traction claims

After making changes, run:
- npm run lint
- npm run build

Then summarize:
1. What changed
2. Files changed
3. Checks run
4. Any remaining issues
```
