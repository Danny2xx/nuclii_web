---
name: Nuclii Pre-Launch Website
description: Every event starts here, in a Redwood-inspired mobile-first campaign style.
colors:
  ink-black: "#0A0A0B"
  secondary-dark: "#121316"
  surface-card: "#18191D"
  quiet-border: "#26282F"
  primary-text: "#FFFFFF"
  secondary-text: "#A1A1AA"
  electric-blue: "#5B8CFF"
  deep-blue: "#0B1B3F"
  soft-light: "#F8FAFC"
  light-muted-text: "#475569"
  danger: "#FF6B6B"
typography: about usear
  display:
    fontFamily: "Fredoka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 11vw, 8rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fredoka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.625rem, 6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fredoka, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  label:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
spacing:
  container-mobile: "16px"
  container-tablet: "32px"
  container-desktop: "48px"
  section-mobile: "56px"
  section-tablet: "80px"
  section-desktop: "112px"
components:
  button-primary:
    backgroundColor: "{colors.primary-text}"
    textColor: "{colors.ink-black}"
    rounded: "0px"
    padding: "12px 28px"
  button-current-solid:
    backgroundColor: "{colors.primary-text}"
    textColor: "{colors.ink-black}"
    rounded: "0px"
    padding: "12px 28px"
  card-surface:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  waitlist-field:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.primary-text}"
    rounded: "0px"
    padding: "8px 16px"
---
# Design System: Nuclii Pre-Launch Website

## 1. Overview

**Creative North Star: "Redwood Energy, Nuclii Utility"**

Nuclii's current campaign direction intentionally references Redwood Founders: black / white restraint, lowercase editorial copy, real community photography, hard-edged buttons, spare navigation, and confident numbered content rhythms. This is not a generic startup-blue interface; it should feel human, founder-community adjacent, and alive before launch.

The Nuclii layer is the product clarity: early access, hosts, societies, service providers, talent, venues, partners, and contributors must all understand where they fit. The Redwood reference is a visual language, not a reason to hide conversion paths or make the site desktop-only.

Mobile is a first-class surface. The design must work on a phone held one-handed, on a slow connection, and in short attention windows. Desktop can feel editorial and spacious; mobile must be thumb-friendly, quick to scan, and decisive.

**Key Characteristics:**

- Monochrome Redwood-inspired base: black, white, grayscale, real media, hard edges.
- Real media and community energy, not decorative placeholder panels.
- Lowercase, confident display language with readable body copy.
- Simple role-based conversion paths for attendees, hosts, communities, talent, venues, partners, and contributors.
- Mobile-first interaction: 44px+ touch targets, safe-area-aware controls, reduced-motion and lighter media fallbacks.

## 2. Colors

The active campaign palette is Redwood-inspired monochrome: black and charcoal carry the surface, white carries core type and primary CTAs, grayscale handles secondary information. Electric blue remains a reserved Nuclii brand token, not an active campaign color unless the user explicitly asks to bring it back.

### Primary

- **White Signal**: The primary action color in the Redwood-inspired branch. Use white fills on black for the strongest CTA moments.
- **Ink Black**: The primary environmental color. The surface should feel photographic and editorial, not glossy SaaS.

### Neutral

- **Ink Black**: The default dark background and trust-building base.
- **Secondary Dark**: The secondary dark layer for bands, panels, and lower-contrast surfaces.
- **Surface Card**: The primary card and overlay surface.
- **Quiet Border**: The subtle divider and control border.
- **Primary Text**: High-contrast text on dark backgrounds.
- **Secondary Text**: Body and support text on dark backgrounds.
- **Soft Light**: Legal pages, high-readability content panels, and selective light sections.
- **Light Muted Text**: Body text on light surfaces.

### Named Rules

**The Monochrome Reference Rule.** The Redwood-inspired branch uses black, white, and grayscale as the active visual system. Do not reintroduce blue as decoration.

**The No Fake Traction Rule.** Never use numbers, stats, or badges that imply active traction unless backed by real data.

**The Contrast Is The Accent Rule.** When the palette is monochrome, hierarchy must come from contrast, scale, spacing, imagery, and copy. Weak gray-on-black text is not minimal; it is illegible.

## 3. Typography

**Display Font:** Fredoka, with system sans fallback.
**Body Font:** Plus Jakarta Sans, with system sans fallback.

**Character:** The current pairing is round, friendly, and young without feeling childish when paired with dark surfaces and restrained spacing. Display type is used for large, low-friction brand lines; body type does the explanatory work.

### Hierarchy

- **Display** (800, `clamp(3rem, 11vw, 8rem)`, 0.95): Hero headlines and final CTA moments only.
- **Headline** (700, `clamp(2.625rem, 6vw, 5.25rem)`, 1.08): Major section titles.
- **Title** (700, `clamp(1.875rem, 4vw, 2.5rem)`, 1.12): Card groups, feature clusters, and page subheads.
- **Body** (400-500, 1rem to 1.125rem, 1.6-1.75): Explanatory copy, capped around 65-75ch.
- **Label** (600, 0.75rem to 0.875rem, normal tracking): Form labels, badges, nav labels, and metadata. Avoid repeated tiny uppercase eyebrows.

### Named Rules

**The Headline Ceiling Rule.** Display headings must not exceed 8rem in the current implementation, and any new hero should prefer readable line breaks over oversized single-line spectacle.

**The Mobile Headline Rule.** On phones, display headlines must fit without horizontal scroll, cramped line breaks, or hidden words. If a Redwood-style headline becomes awkward on mobile, rewrite the line before shrinking it into mush.

**The No Empty Scaffolding Rule.** Numbered sections are allowed because Redwood uses them, but each number must represent a real ordered list or editorial index. Do not number every section by reflex.

## 4. Elevation

Nuclii uses a hybrid of tonal layering, subtle borders, video/photo depth, and restrained shadows. The current `.nuclii-card` shadow is broad and ambient; use it selectively, and prefer tonal separation when a card already has a visible border.

### Shadow Vocabulary

- **Ambient Card** (`0 24px 80px rgba(0, 0, 0, 0.32)`): Large dark-surface cards and floating panels only. Do not apply to every repeated item.
- **Light Card** (`0 4px 24px rgba(15, 23, 42, 0.09), 0 1px 4px rgba(15, 23, 42, 0.06)`): Light-surface content panels and legal content.

### Named Rules

**The Depth Must Earn It Rule.** If an element has a border and a large soft shadow, the shadow must be doing real spatial work. Otherwise choose one.

## 5. Components

### Buttons

- **Shape:** Hard-edged buttons (`0px`) are the current branch standard and match the Redwood reference.
- **Primary:** White background, black text, high contrast. Use for `Join Early Access`, `Become an Early Host`, `Build With Us`, and `Get in Touch`.
- **Hover / Focus:** Use a slight translate, clear color shift, and visible focus ring. Avoid constant glow animations or fake loading delays.
- **Secondary / Ghost:** Transparent or dark-surface buttons with subtle borders and clear hover contrast.
- **Mobile:** Primary CTAs must be at least 44px tall, full-width when placed in forms or drawers, and reachable without precise tapping.

### Chips

- **Style:** Small badges use monochrome contrast: dark translucent surfaces, white text, quiet borders.
- **State:** Use weight, fill, border, and opacity for selected states. Do not depend on color alone.

### Cards / Containers

- **Corner Style:** Cards use 24px in the current system; reserve 32px for rare brand-scale panels, not ordinary cards or inputs.
- **Background:** Surface Card over Ink Black or Secondary Dark.
- **Shadow Strategy:** Use Ambient Card sparingly. Prefer border or tonal layering for repeated grids.
- **Border:** Quiet Border or white alpha borders. Avoid colored side-stripes.
- **Internal Padding:** 24px minimum for cards; larger hero overlays can scale up with the section.

### Inputs / Fields

- **Style:** Dark, minimal fields with clear labels, strong placeholder contrast, and enough height for touch.
- **Focus:** Border or ring should shift clearly using white or high-contrast grayscale in this branch.
- **Error / Disabled:** Error text must remain legible on dark backgrounds; disabled states should reduce opacity without hiding labels.
- **Mobile:** Forms must be short, autocomplete-friendly, and readable at 320px. Avoid side-by-side fields on phone unless each field remains comfortably tappable.

### Navigation

- **Style:** Current desktop navigation is fixed on the right with lowercase links; mobile navigation is separate. Keep Investors, Terms, Privacy, Cookies, and Community Guidelines out of the main nav.
- **States:** Active pages need clear contrast. Hover and focus states must not depend on color alone.
- **Mobile:** The drawer must be safe-area-aware, scrollable, and thumb-friendly. Primary action appears first, legal links stay secondary, and controls must not collide with notches or browser chrome.

### Media Hero

Video and photography should show actual social, hosting, service, venue, workshop, and community energy. Avoid stock-like darkness, club-only imagery, or pure abstract gradients when the visitor needs to understand the product world.

### Mobile & Responsiveness

- **Layout:** Mobile is single-column first. Desktop split layouts should collapse into clear vertical sequences.
- **Touch:** All interactive controls must be 44px minimum with visible focus and active feedback.
- **Safe areas:** Fixed mobile controls must account for `env(safe-area-inset-*)`.
- **Media:** Do not preload every video on mobile. Respect reduced motion and use lower-cost fallbacks where possible.
- **Text:** Body copy should remain at 16px or larger, with no horizontal overflow at 320px.

## 6. Do's and Don'ts

### Do:

- **Do** keep the brand line "Every event starts here." central to Home.
- **Do** use Redwood Founders as the active visual reference: black / white, real media, lowercase confidence, and hard-edged CTAs.
- **Do** keep Nuclii's product clarity intact: discovery, hosting, booking, access, privacy, and coordination.
- **Do** make Early Access, Become an Early Host, Build With Us, and Get in Touch obvious conversion paths.
- **Do** include real accessibility affordances: labels, focus states, semantic landmarks, alt text, and reduced-motion behavior.
- **Do** treat phone layouts as first-class: safe areas, touch targets, readable type, and lighter media loading.
- **Do** show Nuclii as infrastructure for real-life experiences across attendees, hosts, communities, service providers, talent, venues, partners, investors, and contributors.

### Don't:

- **Don't** make Nuclii look like a generic events app, nightlife app, student-only app, social media feed, Eventbrite clone, Instagram clone, TikTok-like feed, or party flyer site.
- **Don't** use fake traction numbers, fake urgency, valuation claims, public financial claims, or vanity metrics.
- **Don't** put Investors, Terms, Privacy, Cookies, or Community Guidelines in the main navigation.
- **Don't** copy Redwood so literally that Nuclii loses its own conversion paths or product explanation.
- **Don't** use mobile-hostile desktop assumptions: tiny tap targets, hover-only meaning, heavy autoplay media, or fixed controls that ignore safe areas.
- **Don't** use repeated tiny uppercase eyebrows, gradient text, decorative glows, or glassmorphism everywhere.
