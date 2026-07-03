---
name: Nuclii Pre-Launch Website
description: Every event starts here — a quiet operating layer for real-world experiences.
colors:
  ink-black: "#0A0A0B"
  surface-card: "#101114"
  surface-soft: "#16171B"
  popover: "#18191D"
  secondary-dark: "#0F1012"
  accent-surface: "#1C1D22"
  quiet-border: "#26282F"
  primary-white: "#FFFFFF"
  soft-white: "#F8FAFC"
  secondary-text: "#A1A1AA"
  signal-sage: "#7A9E6E"
  signal-slate: "#6F89A8"
  signal-clay: "#B5736E"
  signal-mauve: "#8E7CA8"
  signal-ochre: "#C2A968"
  signal-teal: "#6E9CA0"
  danger: "#FF6B6B"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.85rem, 8vw, 5.8rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.55rem, 2.3vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.98rem, 1.15vw, 1.12rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.02em"
  label:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  "2xl": "1.5rem"
  "3xl": "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-white}"
    textColor: "{colors.ink-black}"
  button-outline:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.primary-white}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.75rem"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary-white}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.primary-white}"
    rounded: "{rounded.2xl}"
    padding: "0.75rem 1rem"
---

# Design System: Nuclii Pre-Launch Website

## 1. Overview

**Creative North Star: "The Quiet Operating Layer"**

Nuclii is infrastructure for real life, and the interface behaves like it. The canvas is near-black (`#0A0A0B`), the voice is white, and colour is treated as a rare signal rather than decoration. The feeling is a calm, premium system you trust to coordinate real-world moments — discovery, hosting, booking, access — not a social feed competing for attention. Restraint is the brand: most of any screen is black, white, and one quiet grey, so the rare moments of colour and motion land.

Type carries the energy. Oversized lowercase **Sora** headlines (`make the moment happen.`) set a confident, modern, slightly editorial tone, while **Plus Jakarta Sans** keeps body copy readable and humane. Photography is warm, low-light, real — candlelit tables, packed rooms, makers at work — and always sits behind heavy darkening so the white type stays legible. Motion is alive but disciplined: a rotating word, a scroll-pinned image deck, a Snapchat-style map, springy form micro-interactions — each tied to meaning, each with a reduced-motion fallback.

This system explicitly rejects the generic events / nightlife app look: no flyer-grid energy, no neon, no club-only positioning, no follower-first or feed-first framing, no fake traction or vanity metrics, no overcrowded or childish layouts. It is investor-ready and Gen-Z friendly at the same time because it is quiet, not loud.

**Key Characteristics:**
- Near-black surface; white as the primary voice; grey as the connective tissue.
- Colour is a signal used on a small fraction of any screen.
- Oversized lowercase Sora display; readable Plus Jakarta body.
- Warm real photography under heavy darkening overlays.
- Motion is intentional and always has a reduced-motion path.

## 2. Colors

A near-monochrome dark system: a black-to-grey neutral spine, white as the one dominant non-neutral voice, and a muted multi-hue accent set used only as a discovery signal.

### Primary
- **Primary White** (`#FFFFFF`): The brand's loudest tool. Headlines, body, the primary CTA fill (white button, black text), active nav, and the focus ring. White *is* the accent here.

### Secondary — The Muted Signal Set
A dulled, earthy spectrum used sparingly to differentiate categories (events / spaces / talent), the rotating hero word, map pins, and the Partner mascots. Never neon, never saturated.
- **Signal Sage** (`#7A9E6E`): events / "gathering" register; the sage mascot.
- **Signal Slate** (`#6F89A8`): spaces & venues; "your location" / locate accents.
- **Signal Clay** (`#B5736E`): talent; the "comedy night" rotating-word register.
- **Signal Mauve** (`#8E7CA8`): hosts; the host mascot.
- **Signal Ochre** (`#C2A968`): warm highlight sparkles, "run club" register.
- **Signal Teal** (`#6E9CA0`): pickup / secondary spatial accents.

### Neutral
- **Ink Black** (`#0A0A0B`): The body background and the primary-button text colour.
- **Surface Card** (`#101114`) / **Surface Soft** (`#16171B`) / **Popover** (`#18191D`): tonal layering for cards, sticky decks, and floating panels — depth by lightness step, not by shadow.
- **Accent Surface** (`#1C1D22`): hover fills and chip backgrounds.
- **Secondary Text** (`#A1A1AA`): muted copy; pair with white for hierarchy. Body copy commonly runs at `white/68–78` for contrast on photography.
- **Quiet Border** (`#26282F`): hairline dividers and card edges, usually expressed as `white/10–12`.
- **Soft White** (`#F8FAFC`): light-on-light surfaces (mobile menu sheet).

### Tertiary
- **Danger** (`#FF6B6B`): form validation errors only.

### Named Rules
**The Rare Signal Rule.** The muted accent colours appear on a small fraction of any screen — one rotating word, a handful of map pins, the mascots. Their scarcity is what makes them read as signal, not decoration. Never tile a screen in them.

**The No-Neon Rule.** Every accent is desaturated and earthy. Bright/neon values (`#39FF14`, `#4D8DFF`, `#FF5FD2`, electric blue) are prohibited — they were deliberately removed.

## 3. Typography

**Display Font:** Sora (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Plus Jakarta Sans (with `ui-sans-serif, system-ui, sans-serif`)

**Character:** A pairing of two geometric-humanist sans families that contrast on *role and weight*, not silhouette. Sora goes heavy (800) and tight for oversized lowercase display; Jakarta stays light-to-medium and open for reading. Lowercase is the house style for headings and CTAs.

### Hierarchy
- **Display** (800, `clamp(2.85rem, 8vw, 5.8rem)`, lh 0.98, `-0.02em`): hero statements only — `make the moment happen.`
- **Headline** (800, `clamp(2.5rem, 5vw, 4.5rem)`, lh 1.03, `-0.03em`): section openers — `great moments should not be hard to find`.
- **Title** (800, `clamp(1.55rem, 2.3vw, 2rem)`, lh 1.05): role/sub-section headings — `explorers`, `privacy by default`.
- **Body** (400, `clamp(0.98rem, 1.15vw, 1.12rem)`, lh 1.55): paragraph copy, capped ~65–75ch; typically `white/68–78` on photography.
- **Label** (600, `0.6875rem`, `0.02em`, lowercase): field labels, chips, meta — `email`, `joining as`.

### Named Rules
**The Lowercase Voice Rule.** Headings, nav, and CTAs are lowercase by default. It reads calm and modern; sentence/Title Case is the exception, not the rule.

**The Tight Display Rule.** Display and headline tracking sits at `-0.02em` to `-0.03em` (never tighter than `-0.04em`), and the clamp ceiling stays ≤ 5.8rem. Big, but never shouting or letter-colliding.

## 4. Elevation

The system is flat-by-tone. Depth is conveyed primarily by stepping the surface lightness (`#0A0A0B` → `#101114` → `#16171B` → `#18191D`) and hairline `white/10` borders, not by drop shadows. Shadows appear only on genuinely floating UI: the accessibility popover, the map detail sheet, the stacked image deck, and lifted CTAs on hover.

### Shadow Vocabulary
- **Floating panel** (`box-shadow: 0 20px 60px -12px rgba(0,0,0,0.7)`): the accessibility popover and other elements that detach from the page.
- **Card deck** (`box-shadow: 0 28px 90px rgba(0,0,0,0.5)`): the scroll-pinned image deck and map cards.
- **Sheet rise** (`box-shadow: 0 -12px 40px rgba(0,0,0,0.55)`): the map's slide-up event detail sheet.
- **CTA hover lift** (`box-shadow: 0 10px 28px -8px rgba(0,0,0,0.55)`): buttons on hover, paired with a -2px translate.

### Named Rules
**The Flat-By-Tone Rule.** Surfaces are flat at rest; reach for a lighter surface token and a hairline border before reaching for a shadow. Shadow is reserved for things that actually float.

## 5. Components

### Buttons
- **Shape:** Gently rounded (`0.75rem` / `rounded-md`); pill (`rounded-full`) for the hero "join the waitlist" CTA.
- **Primary:** White fill, black text (`#0A0A0B`). The dominant CTA.
- **Hover / Focus:** `-translate-y-0.5` with the CTA-hover-lift shadow; `active:scale-0.97`; trailing icon (arrow) nudges right on hover. Focus-visible shows a 2px white ring offset from the background. All motion is `motion-safe`.
- **Outline / Ghost:** Transparent on black with a `white/20` border that brightens to `white/45` on hover; used as the secondary CTA beside a primary.

### Chips
- **Style:** Pill, `white/12` border on `white/[0.03]`, lowercase. Category chips carry a small accent-tinted icon coin (`{signal}33` background, signal-coloured glyph).
- **State:** Active = filled with the relevant accent or white; the accessibility segmented control slides a shared-layout pill between options.

### Cards / Containers
- **Corner Style:** `1rem`–`2rem` (`rounded-lg` to `rounded-3xl`); larger radii on big feature panels.
- **Background:** Surface tokens (`#101114`/`#16171B`) or `white/[0.02–0.06]`; sections may add a faint accent radial-gradient wash.
- **Shadow Strategy:** Flat by default (see Elevation); deck/floating cards are the exception.
- **Border:** Hairline `white/8–12`.
- **Internal Padding:** `1.5rem`–`2.5rem`.

### Inputs / Fields
- **Style:** Grouped inside one rounded `white/25` container on `black/55`; per-field stacked label + input, divided by hairline borders. Lowercase labels.
- **Focus:** Container border brightens to `white/70` (`focus-within`); field background lifts to `white/[0.06]`.
- **Error:** `#FF6B6B` message that fades in with a short shake. **Checkbox:** custom — box springs on tap, check stroke draws itself in.

### Navigation
- **Style:** Fixed top, lowercase, `text-sm` semibold. Links use `mix-blend-difference` so they invert against any background, with an animated underline on hover/active. The panel/popover that drops from the accessibility trigger must NOT inherit the blend.
- **Mobile:** Slide-in sheet on a `#F8FAFC` light surface.

### Signature Components
- **Rotating Word:** A single hero word cycles through experience types, each in a muted signal colour, with a blurred vertical crossfade.
- **Experience Map:** A stylised dark city map with photo pins (the muted signal rings); tapping a pin springs up an event detail sheet.
- **Scroll-Pinned Deck:** The "who it's for" section pins while scroll advances roles 1→4 and crossfades a stacked image deck.
- **Partner Mascots:** Round gradient-sphere characters in the muted tones, with blinking eyes, a hover squish, and a floating idle — used on the (in-progress) Partner page.
- **Accessibility Popover:** A spark/contrast-icon trigger opens an anchored, animated preferences panel (motion, text size, contrast, focus).

## 6. Do's and Don'ts

### Do:
- **Do** keep the surface near-black (`#0A0A0B`) with white as the primary voice; let grey (`#A1A1AA`, `white/68`) carry secondary copy.
- **Do** treat the muted signal colours as rare accents (the Rare Signal Rule) — category differentiation, the rotating word, map pins, mascots.
- **Do** set headings and CTAs in lowercase Sora with tracking between `-0.02em` and `-0.03em`.
- **Do** convey depth by stepping surface lightness and hairline borders first; reserve shadow for floating UI.
- **Do** give every animation a `prefers-reduced-motion` fallback (crossfade or instant), as the live components already do.
- **Do** keep body copy ≥ 4.5:1 against its background; on photography, darken the image and keep type at `white/78`+.

### Don't:
- **Don't** reintroduce neon or bright accents (`#39FF14`, `#4D8DFF`, electric blue) — they were deliberately removed (the No-Neon Rule).
- **Don't** let the brand look like a generic events app, nightlife app, flyer grid, follower-first feed, Eventbrite/Instagram/TikTok clone.
- **Don't** use gradient text (`background-clip: text`), decorative glassmorphism, side-stripe borders, or numbered/eyebrow scaffolding on every section.
- **Don't** apply `mix-blend-difference` to floating panels — only nav links and the trigger icon get it, or popovers bleed into the page behind them.
- **Don't** put Investors, Terms, Privacy, Cookies, or Community Guidelines in the main nav — footer-only.
- **Don't** add fake traction numbers, vanity metrics, fake urgency, or public attendee-list framing.
