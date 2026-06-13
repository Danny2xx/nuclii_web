# Nuclii Home Ecosystem Canvas Direction

## Purpose

This document defines the updated homepage direction for the Nuclii pre-launch website.

The goal is to move the homepage away from a generic SaaS landing-page layout and towards a more memorable, product-led, modular ecosystem canvas.

Nuclii should feel like a living platform for real-world discovery, hosting, booking, collaboration, and access — not just a static waitlist page.

---

## Core Homepage Concept

The homepage should feel like a premium interactive Nuclii platform board.

Instead of a normal hero section with basic cards underneath, the top of the homepage should show a modular canvas made up of:

- intro copy
- connected feature tiles
- product/story cards
- video-style preview cards
- map discovery card
- preview listings card

This should visually communicate that Nuclii is an ecosystem, not a single-purpose event app.

---

## Main Layout Structure

### 1. Left Intro Block

This block introduces Nuclii clearly and quickly.

**Content:**

- Nuclii logo/name
- headline
- short description
- primary CTA
- supporting signal pills

**Headline:**

> Every event starts here.

**Description:**

> Discover, host, book, and manage real-world experiences around you — without relying on followers, group chats, or social pressure.

**Primary CTA:**

> Join Early Access

**Signal pills:**

- Launching in the UK
- Privacy-first
- Built for real life

Do not use “Marketplace seeding” publicly. That is internal strategy language, not user-facing copy.

---

## 2. Top Connected Feature Tiles

The homepage should include three connected tiles that represent the core Nuclii ecosystem.

Use:

1. Discover
2. Host
3. Connect

These should replace generic separate feature cards.

### Tile 1: Discover

**Purpose:** Users find real-world experiences around them.

**Copy:**

> Find events, services, workshops, pickups, and private experiences near you.

**Suggested icon:**

- Compass
- MapPin
- Search

---

### Tile 2: Host

**Purpose:** Hosts create structured listings and manage access.

**Copy:**

> Create listings with capacity, timing, privacy, access, and booking controls.

**Suggested icon:**

- CalendarPlus
- LayoutDashboard
- TicketCheck

---

### Tile 3: Connect

**Purpose:** Nuclii connects hosts, venues, talent, societies, services, and communities.

**Copy:**

> Bring together hosts, venues, talent, societies, and communities in one ecosystem.

**Suggested icon:**

- Network
- UsersRound
- Handshake

---

# Connected / Merged Tile Design Direction

## Desired Visual Style

The Discover / Host / Connect tiles should feel merged, layered, and connected — not like three isolated boxes.

The design should be inspired by:

- stacked cards
- overlapping cards
- merged tiles
- card stack carousel
- inter-stacked cards
- layered feature cards

The visual idea is that the three cards slightly overlap each other horizontally, almost like a connected deck of cards.

This supports Nuclii’s message: separate ecosystem actors are connected through one infrastructure layer.

---

## Recommended Tile Layout

Use a horizontal stacked-card group:

```text
[ Discover ] [ Host ] [ Connect ]
```

But with visual overlap:

```text
[ Discover  ]
      [ Host     ]
            [ Connect  ]
```

The middle card can be slightly more prominent.

---

## Interaction Behaviour

On hover or focus:

- hovered card comes forward using higher `z-index`
- card lifts slightly
- subtle blue border glow appears
- card scale increases very slightly
- neighbouring cards shift gently, not dramatically
- icon animates subtly
- arrow or “Learn more” hint appears

The animation should feel premium and calm, not playful or gimmicky.

---

## Card Styling Rules

Use:

- blue / black / white Nuclii colour system
- soft rounded corners
- subtle border
- layered shadows
- thin electric-blue active border
- clean Lucide icons
- no emojis
- no colourful 3D icons
- no rainbow gradients
- no excessive glassmorphism

Cards should feel like a premium product interface, not a casino/crypto carousel.

---

## Best Reference Keywords

Search for these references when looking for design examples:

- stacked cards UI
- overlapping cards website
- card stack carousel Framer
- inter-stacked cards UI
- layered feature cards web design
- overlapping tiles landing page
- horizontal stacked card carousel
- merged cards UI design

---

## Useful Reference Types

### 1. Stacked Slider

A horizontally overlapping card carousel where each card is visible but partially layered.

Use this as the closest reference for the Discover / Host / Connect tile group.

### 2. Inter-Stacked Cards

Interactive cards that spread, rotate, or come forward on hover.

Use this only as inspiration. Keep Nuclii calmer and more professional.

### 3. Card Stack Carousel

A card group where one card is active and the others sit behind it.

This works well if the homepage later wants auto-cycling or click-to-focus behaviour.

### 4. Layered Feature Cards

Overlapping cards used to show related features in one connected system.

This is probably the most realistic implementation for Nuclii.

---

## Recommended Nuclii Implementation

Use a custom component rather than installing a heavy card carousel package.

Suggested component name:

```text
components/sections/ConnectedFeatureTiles.tsx
```

Possible data structure:

```ts
const ecosystemTiles = [
  {
    title: "Discover",
    description: "Find events, services, workshops, pickups, and private experiences near you.",
    icon: Compass,
  },
  {
    title: "Host",
    description: "Create listings with capacity, timing, privacy, access, and booking controls.",
    icon: CalendarPlus,
  },
  {
    title: "Connect",
    description: "Bring together hosts, venues, talent, societies, and communities in one ecosystem.",
    icon: Network,
  },
]
```

---

## Responsive Behaviour

### Desktop

- Cards overlap horizontally.
- Middle card sits slightly forward.
- Hover brings any card to the front.

### Tablet

- Reduce overlap.
- Keep all cards readable.

### Mobile

Do not force overlap if it becomes cramped.

Use either:

1. horizontal scroll with snap points, or
2. stacked vertical cards with slight offset, or
3. carousel-style swipe interaction.

Mobile must remain clean and accessible.

---

## Accessibility Rules

- Do not rely only on hover.
- Cards must be keyboard focusable if interactive.
- Use `focus-visible` styles.
- Maintain strong text contrast in light and dark mode.
- Respect `prefers-reduced-motion`.
- Use semantic buttons or links if cards are clickable.

---

# 3. Middle Product / Story Cards

The homepage should include video-style or preview-style content cards.

These should feel like future product demos, not random placeholders.

Possible cards:

- How discovery works
- Host your first experience
- Private location reveal
- QR access and ticket wallet
- Society events and community moments

Design them like product-preview cards with:

- subtle play icon
- gradient overlay
- mock UI screenshot area
- short title
- one-line description

Do not use real video files yet unless they exist.

---

# 4. Map-First Discovery Card

Include a map-inspired card that shows:

- city grid
- blue pins
- “Nearby now” label
- radius/area indicator
- privacy-aware location preview

**Title:**

> Map-first discovery

**Description:**

> Find what is happening around you without needing to know everyone first.

This card should be animated subtly:

- pulsing blue pins
- drifting grid background
- soft glow around active area

---

# 5. Preview Listings Card

Include an upcoming/preview listing card.

Important: do not imply fake live activity.

Label this section clearly as:

> Preview listings

or

> Example listings

Possible listing examples:

- Creative Workshop
- Society Mixer
- Food Pickup Window
- Private Listening Session
- Pop-up Market

Each listing can include:

- type label
- time/date placeholder
- privacy/location note
- small icon

Do not use fake attendance numbers unless clearly marked as mock/demo data.

---

# 6. Animation Direction

Use tasteful motion only.

Recommended animations:

- floating cards
- subtle map pin movement
- hover depth on tiles
- soft blue spotlight
- scroll reveal
- slight parallax in hero canvas
- staggered entrance for cards

Avoid:

- excessive bouncing
- rainbow gradients
- crypto-style beams everywhere
- too much blur
- too many moving elements at once

---

# 7. Button and Pill Direction

The page should not use generic pills or mechanical CTA copy.

## Signal Pills

Use:

- Early Access
- Launching in the UK
- Privacy-first

or:

- Early Access
- Built for real life
- Privacy-first

## Primary CTA

Use:

> Join Early Access

Avoid:

> Start Early Access Form

## Secondary CTA

Use:

> Choose your role

or:

> Explore Nuclii

Avoid overly generic or mechanical labels.

---

# Claude / Codex Prompt

Use the following prompt when asking Claude or Codex to implement this direction.

```text
I want to update the Nuclii homepage hero / above-the-fold section using the new Home Ecosystem Canvas direction.

Do not rebuild the entire website.
Do not change the Nuclii brand direction.
Do not remove existing pages or forms.

Read:
- AGENTS.md
- docs/NUCLII_BRAND.md
- docs/SITE_STRUCTURE.md
- docs/DESIGN_SYSTEM.md
- docs/COPY_GUIDE.md
- docs/NUCLII_HOME_ECOSYSTEM_CANVAS.md

Implement a premium modular homepage hero that feels like a living Nuclii ecosystem board.

Required structure:

1. Left intro block
- headline: Every event starts here.
- description: Discover, host, book, and manage real-world experiences around you — without relying on followers, group chats, or social pressure.
- CTA: Join Early Access
- signal pills: Early Access, Launching in the UK, Privacy-first

2. Connected feature tiles
Create a merged / overlapping 3-card group using:
- Discover
- Host
- Connect

The tiles should not look like three separate generic boxes.
They should feel connected, layered, and ecosystem-driven.

Use a stacked-card / overlapping-card design inspired by:
- Stacked Slider
- Inter-Stacked Cards
- Card Stack Carousel
- Layered Feature Cards

Tile behaviour:
- middle tile slightly more prominent
- hovered/focused tile comes forward
- subtle blue glow
- slight lift
- neighbouring cards shift gently
- works in light and dark mode
- mobile responsive

3. Product/story cards
Add preview cards such as:
- How discovery works
- Host your first experience
- Private location reveal
- QR access and ticket wallet
- Society events and community moments

4. Bottom ecosystem cards
Add:
- Map-first discovery card with animated blue pins
- Preview listings card with clearly labelled mock/example listings

Design rules:
- blue / black / white
- clean
- premium
- animation-esque
- privacy-first
- map-first inspired
- no emojis
- use lucide-react icons
- no fake traction numbers
- no fake testimonials
- no public “marketplace seeding” copy
- do not make it crypto-looking
- do not make it nightlife-only
- do not make it social-media-like

Animation rules:
- floating cards
- subtle hover depth
- soft blue spotlight
- gentle map pin motion
- respect prefers-reduced-motion
- keep animations performant

After implementation:
1. Run npm run lint
2. Run npm run build
3. Fix all errors
4. Summarise what changed
```

---

## Final Direction Summary

The Nuclii homepage should feel like:

> A living map of real-world experiences.

The connected Discover / Host / Connect tiles should communicate that Nuclii brings separate actors into one ecosystem.

The page should feel premium and animated, but still clean, trustworthy, and product-first.

