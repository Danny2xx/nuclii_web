# Nuclii — UX, Engagement & Delight Analysis

_Last updated: 2026-06-24_

A deep, critical read of the Nuclii pre-launch site focused on one question:
**why would a visitor stay, participate, share, and come back?** Combines a
top-to-bottom review of the current site with external research (2026) on
scroll-driven engagement, micro-interaction delight, and waitlist conversion.

> Companion docs: `WEBSITE_OVERVIEW.md` (what's built), `DESIGN.md` (visual
> system), `PRODUCT.md` (strategy).

---

## 1. The honest top-to-bottom read

### What's genuinely strong (protect these)
- **Distinctive monochrome editorial system** — does *not* read as AI-generated,
  which is rare and valuable.
- **Neon rotating word** in the home hero — the best micro-delight on the site; a
  reason to look twice.
- **Sticky role-scroll** (`experience-layers-scroll`) — the one section with
  *earned, distinct* motion, and not coincidentally the most engaging moment.
  **This is proof of the "scroll reward" instinct working.**
- **Consistent voice** with real personality ("not a feed, not a flyer wall").

### Where it's quietly weak
1. **Motion is uniform.** Outside the sticky section, nearly every block enters with
   the *identical* fade-up (`Reveal`/`FadeIn` — Home uses 11, About 12). The brain
   habituates fast; by the fourth section there's no "reward," just sameness.
2. **It tells, it never shows.** The product is *map-first* — yet there is no map,
   no screenshot, no product glimpse anywhere. Visitors read about Nuclii but never
   see it.
3. **No proof of life.** Zero signals that it's real and moving — no count, no city,
   no founder face, no partner, no press. Pre-launch sites live or die on "is this
   actually happening?"
4. **The form is heavier than ideal** — name + email + role + 2 checkboxes (5 fields).
5. **No reason to return or share.** After signup the relationship ends; there's no
   loop.
6. **Delight left on the table** — `canvas-confetti` is installed but **unused**; the
   form success state is plain text; hovers are minimal outside buttons.
7. **Legal pages are a design generation behind** (cards / badges / Title Case).

---

## 2. What the research says (2026)

### Scroll & motion
Scroll-triggered reveals that unfold content *step-by-step* increase curiosity and
deeper exploration. The **hook phase (first ~3 seconds / 0–15% of scroll) needs bold,
unexpected motion** to earn the scroll. It must be CSS/transform-based and respect
`prefers-reduced-motion`; JS scroll-jacking and heavy parallax hurt performance and
accessibility.
- [Lovable — scrolling patterns](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)
- [Figma — 2026 web design trends](https://www.figma.com/resource-library/web-design-trends/)
- [Maglr — scrollytelling examples](https://www.maglr.com/blog/best-scrollytelling-examples)

### Micro-interactions = the "reward"
Real, not vibes. Small feedback (color shifts, celebratory animations) **taps the
brain's reward system**, creating a sense of accomplishment that *prolongs dwell time
and lifts retention*. Canonical examples: **Duolingo's** completion celebrations
(daily return) and **Instagram's** burst-of-hearts like.
- [IxDF — micro-interactions in UX](https://ixdf.org/literature/article/micro-interactions-ux)
- [Medium / UX Times — the rise of micro-interactions](https://medium.com/design-bootcamp/the-rise-of-micro-interactions-enhancing-user-delight-c0dd1fdce08a)
- [go-globe — importance of micro-interactions](https://www.go-globe.com/the-importance-of-microinteractions/)

### Waitlist conversion (Nuclii is a pre-launch waitlist — this is *the* literature)
- **The headline is the highest-leverage element** — more than design or features.
  Spend disproportionate effort on one outcome-driven sentence.
- **Fewer fields = more signups** — each extra field cuts conversion ~5–15%;
  **email-first is the baseline.**
- **Social proof near the form lifts conversion ~40%** — but only show a counter once
  it's past ~500 (below that it signals "small").
- **Scarcity & positional mechanics work** — "you're #157 in line," limited early
  spots, tiered rewards trigger loss aversion.
- **Referral loops are the growth multiplier** — invite codes + visible queue
  position are exactly how **Robinhood** and **Monzo** built their waitlists. Best
  waitlist pages convert **15–40%** vs 2–5% for normal pages.
- [Waitlister — optimization guide](https://waitlister.me/growth-hub/guides/waitlist-landing-page-optimization-guide)
- [Flowjam — high-converting waitlist examples](https://www.flowjam.com/blog/waitlist-landing-page-examples-10-high-converting-pre-launch-designs-how-to-build-yours)
- [Viral Loops — build a waitlist](https://viral-loops.com/blog/how-to-build-a-waitlist/)
- [CraftUp — waitlist anatomy & benchmarks](https://craftuplearn.com/blog/waitlist-landing-page-anatomy-incentives-benchmarks)

---

## 3. The "scroll reward" instinct — validated, with one nuance

Scroll → new thing → small reward → dopamine is a real engagement loop ("variable
reward"). **But the reward must be *varied and earned*, not *more of the same*.** Ten
identical fade-ups is one reward seen ten times — the brain tunes it out. The win is
**each section revealing *differently*, in a way that fits what it reveals**: a counter
that ticks, a map that populates, images that parallax at a different rate, a stagger
that cascades. The sticky role-scroll already does this — which is *why it feels good*.
**Goal: more *distinct* moments, not more animation.**

---

## 4. Prioritized levers

### Tier 1 — highest impact on "stay & convert"
1. **Show the product** — a live/animated **map** or app mockup. Turns "tell" into
   "show," is inherently interactive (dwell time), and proves it's real. The #1 gap
   given a map-first product.
2. **Add a referral / queue loop** to the waitlist — "you're #142 — skip the line by
   inviting friends." The one change that makes people *participate and share* rather
   than sign up and leave. Biggest pre-launch growth multiplier.
3. **Add real proof of life** (honest signals only — the brand bans fake traction): a
   real signup counter once past ~500, "first in London," a founder face + one-line
   note, any real partner/press.

### Tier 2 — delight & dwell
4. **Diversify the motion** — give 2–3 sections their *own* reveal language (counter,
   map-fill, parallax, stagger) instead of the universal fade-up.
5. **Make the form success a moment** — use the already-installed `canvas-confetti`,
   and show queue position. Peak-end rule: the *ending* disproportionately shapes
   memory.
6. **Reduce form friction** — consider email-first, then collect role/details after
   signup (progressive). Keep the legally required 16+/consent, but they don't all
   need to be on step one.

### Tier 3 — polish & consistency
7. Rebuild the **legal pages** on the editorial system (drop cards/badges/Title Case).
8. **Founder / team presence** on About for trust.
9. Sharpen the **hero headline** (highest-leverage sentence) and test variants.

---

## 5. The caution (anti-slop)

Don't "Duolingo" everything. The brand is **premium, calm, modern** — over-animation
cheapens it and trips the AI-slop reflex (uniform fade-on-scroll is itself a tell). The
move is **a few high-craft, distinct moments** — a map that fills, a counter that
climbs, a confetti burst at the finish line — not motion on every element. Quality of
moments over quantity of motion. Every motion needs a `prefers-reduced-motion`
fallback (current components already respect this).

---

## 6. One-sentence diagnosis

The site is **beautifully built but quiet and one-directional** — it looks great and
says the right things, but never *shows the product*, never *proves it's alive*, and
never *gives people a reason to act or come back*. Fix those three and the craft
already in place will convert.

---

## 7. Earlier per-page critique (reference)

From the prior full-site pass (source + detector review; detector clean apart from
false positives in the email templates):

| Page | Score | Headline issue |
|---|---|---|
| Home | ~34/40 | No product/map preview; roles repeated; no proof band |
| About | ~33/40 | No founder/team face; role overlap with other pages |
| Early access | ~31/40 | No hero visual; no "what happens after you apply"; thin form reassurance |
| Legal (×4) | ~26/40 | Off-brand (cards/badges/Title Case); were dead-ends (now have a closing CTA) |

**Quick wins already shipped:** deleted dead `who-its-for-scroll.tsx`; added a
next-step CTA to the legal `PolicyPage`; reframed the home sticky-scroll to renamed
audiences (explorers / organisers / spaces / creatives) to stop duplicating the roles
section; fixed the legal drawer z-index clash with the nav.

---

## 8. Sources

- [Lovable — scrolling patterns](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)
- [Figma — 2026 web design trends](https://www.figma.com/resource-library/web-design-trends/)
- [Maglr — scrollytelling examples](https://www.maglr.com/blog/best-scrollytelling-examples)
- [IxDF — micro-interactions in UX](https://ixdf.org/literature/article/micro-interactions-ux)
- [Medium / UX Times — micro-interactions](https://medium.com/design-bootcamp/the-rise-of-micro-interactions-enhancing-user-delight-c0dd1fdce08a)
- [go-globe — micro-interactions](https://www.go-globe.com/the-importance-of-microinteractions/)
- [Waitlister — optimization guide](https://waitlister.me/growth-hub/guides/waitlist-landing-page-optimization-guide)
- [Flowjam — waitlist examples](https://www.flowjam.com/blog/waitlist-landing-page-examples-10-high-converting-pre-launch-designs-how-to-build-yours)
- [Viral Loops — build a waitlist](https://viral-loops.com/blog/how-to-build-a-waitlist/)
- [CraftUp — waitlist anatomy & benchmarks](https://craftuplearn.com/blog/waitlist-landing-page-anatomy-incentives-benchmarks)
