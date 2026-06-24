# Nuclii Website — Overview & Changelog

_Last updated: 2026-06-23_

A single source-of-truth summary of the Nuclii pre-launch marketing site: what it
is, how it's built, the current pages, the design system, and what has changed
recently. (Supersedes the older `WHAT_HAS_BEEN_DONE.md`, which still references
pages that have since been removed.)

---

## 1. What it is

Nuclii is a UK-based real-world experience platform. This repo is its **pre-launch
marketing site** — the public site that explains the category, drives early-access
signups, recruits builders, and collects contact/interest before the product
launches.

- **Live domain:** nuclii.co.uk
- **Core line:** "every event starts here."
- **Register:** brand / marketing (design _is_ the product here)
- **Audience:** attendees, hosts, venues, talent, communities, plus builders,
  partners, and investors evaluating the platform pre-launch.

Strategic context lives in `PRODUCT.md`; the visual system in `DESIGN.md`.

---

## 2. Tech stack & deployment

| Area | Choice |
|---|---|
| Framework | Next.js (App Router, v16, Turbopack) |
| Language | TypeScript, React |
| Styling | Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`) |
| Motion | `motion` (Framer Motion successor) |
| Icons | `lucide-react` |
| UI primitives | Radix (`react-slot`, `react-label`), `class-variance-authority`, `clsx`, `tailwind-merge` |
| Email / audience | `resend` (waitlist) |
| Analytics | `@vercel/analytics` |
| Hosting | **Vercel** (project `nuclii-web`), production deploys from the **`main`** branch |
| Repo | `github.com/Danny2xx/nuclii_web` |

**Scripts:** `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

**Deploy flow:** merge/push to `main` → Vercel auto-builds and deploys to
nuclii.co.uk. Run `npm run build` locally as a pre-push gate.

---

## 3. Site map (current routes)

Public pages currently shipped:

| Route | Page | In nav? |
|---|---|---|
| `/` | Home | main nav |
| `/about` | About us | main nav + footer |
| `/early-access` | Early access (application + waitlist) | main nav + footer |
| `/privacy` | Privacy policy | footer (legal) |
| `/terms` | Terms of use | footer (legal) |
| `/cookies` | Cookie policy | footer (legal) |
| `/community-guidelines` | Community guidelines | footer (legal) |
| `/api/waitlist` | Waitlist API (POST) | — |

**"build with us"** is no longer a page — the nav/footer link goes directly to an
external **Tally application form** (`https://tally.so/r/xX6O1J`), opening in a new
tab and marked with an external-link indicator.

**Removed pages:** `/for-hosts`, `/get-in-touch`, `/investors`, `/build-with-us`.
Their CTAs were repointed (contact → `mailto:hello@nuclii.co.uk`, build-with-us →
Tally).

---

## 4. Design system

Direction: **"Redwood Energy, Nuclii Utility"** — a Redwood-Founders-inspired
monochrome campaign style.

- **Theme:** dark by default (`#0a0a0b` ink background, white type). A light theme
  exists (used for legal content) and is reachable via the header theme toggle.
- **Palette:** monochrome — black / charcoal surfaces, white type and primary CTAs,
  grayscale for secondary info. The one deliberate splash of color is the home
  hero's **rotating word**, which cycles through a neon palette (green, blue, red,
  orange, pink, purple, cyan, lime, yellow).
- **Typography:** Fredoka (display, lowercase, big) + Plus Jakarta Sans (body).
- **Voice:** lowercase, confident, editorial. Body copy stays sentence-cased in
  meaning but rendered lowercase.
- **Buttons:** hard-edged (square corners). The signature primary CTA is the
  `nuclii-action-button` — a white fill that slides to black on hover with the text
  inverting and an arrow nudging.
- **Recurring patterns:** full-bleed video heroes with a dark gradient; ruled
  "role row" lists (name │ description); numbered editorial lists
  (`nuclii-numbered-item`); real community photography over decorative panels.
- **Tokens & primitives:** defined in `app/globals.css` (`--background`, `--border`,
  `--muted-foreground`, radius scale, `--container-x`, section spacing, etc.).
- **Accessibility target:** WCAG 2.2 AA — visible focus rings, labelled controls,
  alt text, keyboard nav, reduced-motion fallbacks, and `svh`-based heroes.

---

## 5. Navigation & conversion paths

- **Side nav** (desktop, fixed top-right): home · about us · early access ·
  build with us (external ↗).
- **Mobile nav** (drawer): same items + a "join the waitlist" CTA + legal links.
- **Footer:** about · early access · build with us (external ↗) · get in touch
  (`mailto:`); a separate legal group (privacy / terms / cookies / community
  guidelines, rendered as drawers); social links.
- Nav data is centralized in `lib/navigation.ts`. An `external` flag drives both the
  new-tab behavior and the ↗ external-link indicator (with an sr-only "opens in new
  tab" cue).
- **Conversion paths:** join early access (`/early-access`), apply to build
  (Tally form), get in touch (`mailto:hello@nuclii.co.uk`).

Per brand rules, Investors / Terms / Privacy / Cookies / Community Guidelines are
kept **out** of the main nav (footer-only).

---

## 6. Forms & integrations

### Waitlist form (`components/home/waitlist-form.tsx` → `POST /api/waitlist`)
- Collects name, email, role, **16+ confirmation**, and **marketing consent**.
- Validates client- and server-side; shows inline errors and a success/duplicate
  state; remembers a successful signup in `localStorage`.
- Server (`app/api/waitlist/route.ts`):
  - Saves the contact to a **Resend audience** (dedupes via contact lookup).
  - Sends an **admin notification** email and a **subscriber confirmation** email
    (failures are non-blocking — the signup still succeeds).
  - Degrades gracefully if `RESEND_API_KEY` is unset.
- **Env vars:** `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NUCLII_EMAIL`,
  `NUCLII_FROM_EMAIL`.
- Used on: home hero, the early-access page.

### Build-with-us (external Tally form)
- Applications go to Tally (`https://tally.so/r/xX6O1J`), **not** the internal
  waitlist. Age/consent must be handled inside the Tally form.

### Contact
- `mailto:hello@nuclii.co.uk` (footer + contextual "get in touch" / "ask a
  question" / "send us a message" links).

---

## 7. Page-by-page summary

- **Home (`/`)** — video hero with the neon **rotating word** + waitlist form;
  "why we exist"; "built for real life"; sticky role-scroll showcase
  (`experience-layers-scroll`); "who you are and what you get" rows; "privacy by
  default"; final CTA.
- **About (`/about`)** — video hero (team footage); "why we exist"; principles list
  + photo collage; "what nuclii connects" (ruled role rows); "for every first
  connection"; final CTA. One distinct CTA per moment (get early access at the top,
  get in touch at the close).
- **Early access (`/early-access`)** — split hero (intro steps + waitlist form);
  photo row; "who early access is for" (ruled role rows); apply CTA. Submit/CTA
  copy uses "apply for early access."
- **Legal (`/privacy`, `/terms`, `/cookies`, `/community-guidelines`)** — long-form
  policy content, also surfaced as footer drawers.

---

## 8. Recent changes (current work cycle)

**Home**
- Expanded the hero rotating word to 26 phrases on a neon color cycle.
- Removed a redundant duplicate image strip; de-duplicated repeated role sections.
- Standardized a section divider to the border token; aligned heading weights.
- A11y: stopped the rotating word re-announcing via `aria-live`.
- Raised sub-12px form labels.

**About**
- Lowercased the hero voice to match the site.
- Replaced the "what nuclii connects" icon-card grid with an editorial ruled role
  list (removed unused icon imports).
- De-duplicated the bookend CTAs → one distinct CTA per moment.
- Hero switched to `svh` units; CTAs adopted the signature primary treatment.

**Early access**
- Rebuilt "who early access is for" as ruled role rows.
- Aligned form submit + CTA copy to "apply for early access."
- Upgraded the closing button to the signature primary CTA.

**Pages & navigation**
- Removed `/for-hosts`, `/get-in-touch`, `/investors`; repointed their links
  (contact → mailto).
- Replaced `/build-with-us` with the external Tally form; deleted the page; nav +
  footer link out with an external-link (↗ / new-tab) indicator driven by an
  `external` flag in `lib/navigation.ts`.

**Tooling / repo**
- `.gitignore` now excludes agent/tooling artifacts (`.agents/`, `.codex/`,
  `.impeccable/`, `.claude/skills/`, `skills-lock.json`) and the `nuclii_aboutus/`
  raw-source folder.
- Redesign committed and deployed to `main` (Vercel → nuclii.co.uk).

---

## 9. Known follow-ups / open items

- **Light-theme primary CTAs:** the signature white CTA is hardcoded for the
  dark-first design. On always-dark surfaces (video heroes) it's correct; in light
  theme, page-background CTAs (e.g. final CTAs) would read poorly. Make them
  theme-aware (`bg-primary` / `hover:text-foreground`) if light mode on marketing
  pages becomes a requirement — and do it on home + about together.
- **Stale docs:** `docs/SITE_STRUCTURE.md` and `docs/WHAT_HAS_BEEN_DONE.md` still
  describe removed routes; update or retire them.
- **Uncommitted locally:** `DESIGN.md`, `PRODUCT.md`, session notes, the
  `docs/DESIGN_SYSTEM.md` / `docs/SITE_STRUCTURE.md` edits, and the
  `.claude/settings.local.json` change are intentionally not committed.
- **Early-access hero:** currently a clean split with no video, unlike the other
  heroes — a conscious choice, but could gain a video backdrop for consistency.
- **Tally form fields:** confirm the external build-with-us form includes 16+ and
  marketing-consent fields (required by PRODUCT.md for interest-collection flows).
