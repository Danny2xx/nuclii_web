# DESIGN_SYSTEM.md

## Visual Direction

Nuclii should look clean, premium, animated, and trustworthy.

The website should feel like:

- a modern startup product
- a map-first real-world experience platform
- a serious infrastructure layer
- a clean pre-launch website
- energetic but not noisy

The active campaign identity is black / white / grayscale, with real media and
hard-edged contrast carrying the brand. Electric blue remains a reserved Nuclii
token, not the default campaign accent.

Avoid making the site too purple, green, neon-heavy, childish, or club/nightlife-focused.

---

## Colour Palette

### Primary

Black background:

`#0A0A0B`

Secondary dark background:

`#121316`

Surface card:

`#18191D`

Border subtle:

`#26282F`

Primary text:

`#FFFFFF`

Secondary text:

`#A1A1AA`

Reserved electric blue:

`#5B8CFF`

Deep blue:

`#0B1B3F`

Soft white background:

`#F8FAFC`

Muted text on light backgrounds:

`#475569`

---

## Colour Usage

Use black and charcoal for most backgrounds.

Use electric blue only when the page intentionally needs a product signal, such
as a future map, selected state, or app-preview detail. Do not use blue glows,
blue gradients, or blue hover borders as default decoration in the current
campaign branch.

Use white for:

- primary text
- light sections
- legal pages/content panels

Use grey for:

- secondary text
- borders
- muted descriptions

Purple may be used only as a subtle background glow if needed.

Avoid green except for success states.

---

## Typography

Active typography:

- Headings: Fredoka
- Body and UI: Plus Jakarta Sans

Typography style:

- large confident headlines
- readable body text
- short paragraphs
- clear CTA labels
- generous line height

Avoid long dense text blocks on marketing pages.

---

## Layout

Use:

- strong responsive grid systems
- generous whitespace
- max-width containers
- spare image-led sections
- editorial divider rhythms
- alternating dark/light sections where useful
- sticky navigation
- clear section hierarchy

Recommended container widths:

- main container: `max-w-7xl`
- text-heavy pages: `max-w-4xl`
- legal pages: `max-w-3xl` or `max-w-4xl`

Recommended section spacing:

- desktop: `py-24` to `py-32`
- tablet: `py-20`
- mobile: `py-14` to `py-16`

---

## Cards

Cards should feel premium, quiet, and purposeful.

Card style:

- rounded corners: usually `rounded-2xl`; reserve larger radii for rare brand panels
- background: dark surface or translucent black
- border: subtle grey border
- shadow: use sparingly, not on every card
- hover: slight lift or contrast shift, not glow as default

Use blur and glass sparingly:

- navbar
- floating UI cards
- hero overlays
- product preview panels

Avoid making every component glassy.

---

## Buttons

Primary button:

- white background on dark surfaces
- black text
- hard edges
- subtle hover lift

Secondary button:

- transparent or dark background
- subtle border
- white text
- stronger white/foreground hover contrast

CTA text examples:

- Join Early Access
- Become an Early Host
- Build With Us
- Get in Touch
- Request Investor Information

Button behaviour:

- clear focus ring
- accessible contrast
- no tiny text
- consistent sizing

---

## Navigation

Navigation:

- fixed logo at the left
- fixed right-side desktop navigation
- safe-area-aware mobile controls and drawer
- primary early-access CTA first in the mobile drawer

Main nav links:

- Home
- About Us
- Early Access
- Build With Us

CTA/footer-accessible routes:

- For Hosts
- Get in Touch

Footer links:

- For Hosts
- Get in Touch
- Investors
- Privacy Policy
- Terms of Use
- Cookie Policy
- Community Guidelines

Do not clutter navbar with legal, investor, host, or contact links. Keep those reachable through CTAs and footer navigation.

---

## Animation Style

Nuclii should be animation-esque, but still clean.

Use:

- smooth scroll reveals
- floating cards
- subtle media transitions
- image and section reveals
- modest hover lifts
- form step transitions
- device mockup parallax
- accordion transitions
- tab transitions

Avoid:

- aggressive bouncing
- constant spinning
- childish cartoon motion
- too many particle effects
- heavy 3D effects that slow the site

Motion should feel like a premium product site.

---

## Hero Visual System

Current hero system:

- dark photographic or video background
- black gradient overlay for legibility
- large lowercase display headline
- inline early-access form or clear CTA
- strong CTA

The waitlist CTA must be impossible to miss.

Do not overcrowd the hero with badges, statistics, fake traction, or decorative
app mockups that imply unfinished product features are live.

---

## Product Mockups

Use product mockups only when they are honest and useful.

Suggested mock screens:

- map discovery
- listing detail
- ticket wallet
- QR access
- host dashboard
- early access form

Mockups should be realistic but not overly detailed.

Do not show features that contradict the product strategy.

---

## Forms

Forms should be clean, premium, and short.

Form style:

- clear labels
- large input fields
- hard-edged or lightly rounded fields, matching the active campaign
- strong focus states
- helpful placeholder text
- short forms
- concise helper and error text

Important forms:

- Early Access form
- Build With Us application form
- Host application form
- Contact or investor enquiry routes, if collected directly

Early Access form must include:

- 16+ confirmation
- consent to receive updates

---

## Icons

Use clean line icons.

Recommended icon style:

- Lucide icons
- simple map pins
- ticket icons
- QR icons
- shield/privacy icons
- calendar icons
- user/group icons
- building/venue icons

Do not use cartoonish icons.

---

## Responsive Behaviour

Mobile is important.

Mobile requirements:

- navbar collapses cleanly
- CTA visible near top
- hero text remains readable
- phone mockups do not overcrowd
- cards stack properly
- forms are easy to complete
- footer is simple and readable

Avoid horizontal overflow.

---

## Accessibility

Minimum requirements:

- semantic HTML
- labelled form fields
- accessible button labels
- keyboard navigable menus
- focus states
- sufficient colour contrast
- alt text for meaningful images
- no motion that prevents usability

Respect reduced motion preferences where possible.

---

## SEO Basics

Each page should have:

- unique title
- meta description
- clear H1
- semantic heading order
- readable URLs

Suggested default title:

> Nuclii — Every event starts here

Suggested default description:

> Nuclii is a UK-based platform for discovering, hosting, booking, and managing real-world experiences.
