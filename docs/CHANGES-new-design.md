# What changed on `new-design`

This document lists every change on the `new-design` branch since the repo was cloned, at commit `e3f0b86` ("Localize demo to Lagos, price in naira, frame as a simulation"), which is `origin/main`.

The work is a redesign of the **home page** plus site-wide polish: navigation, footer, metadata, icons and accessibility. It follows the current brand in `PRODUCT.md`:
- the line "more than memories."
- lime `#A3BF1C` as the accent
- Birmingham first
- sign-up as the primary action

Pages other than the home page are unchanged, apart from the shared nav, footer, icons and metadata.

To see the full diff:

```bash
git diff e3f0b86..new-design --stat
```

---

## 1. Home page: before and after

**Before** (`app/page.tsx` at `e3f0b86`):
1. Hero with the waitlist form
2. Demo doorway
3. Experience layers scroll
4. Feature pillars
5. Testimonials

**After:**

| # | Section | Background | Component |
|---|---|---|---|
| 1 | Hero: video carousel, "more than memories", explore / create | video | `app/page.tsx` + `hero-motion.tsx` |
| 2 | Concept: "From something happening downstairs to something happening across the city…" | light | `concept-section.tsx` |
| 3 | Globe: "start close, branch out." | light | `globe-section.tsx` |
| 4 | Explore sequence: "now make your own." (pinned) | light, fades to black | `explore-sequence.tsx` |
| 5 | Stack of four steps (01–04), each card sliding over the last | black | `StackedSlides` |
| 5.1 | 01 create: "simple where it should be. flexible where it matters." | black | `create-look-section.tsx` |
| 5.2 | 02 control: "decide who it's for." | black | `control-section.tsx` |
| 5.3 | 03 collaborate: "find the people who can pull it off." | black | `lineup-section.tsx` |
| 5.4 | 04 repeat: "your built-in circle." | black | `circle-section.tsx` |
| 6 | Memories: "the night doesn't end when it ends." | light | `app-teaser-section.tsx` |
| 7 | FAQ: "questions, answered." | light | `faq-section.tsx` |

The old home components (`demo-doorway`, `experience-layers-scroll`, `feature-pillars`, `testimonials`, `waitlist-form` and others) are **still in the repo, unused on the home page**. The `/demo` page still works but is no longer linked from the nav.

---

## 2. Section by section

### Hero
- **Background:** a full-screen video carousel of 8 clips from `public/videos/videos_web2/`, in this order: movie, party, matchday, football, pickup, runclub, large_group, study.
- **Copy:** the headline is "more than memories", followed by "Start with an idea. Find the people it's for. Fill the room. Then do it again."
- **Buttons:** **explore**, a white ticket going to `/events`, and **create**, a lime ticket with a dotted tear and arrow stub going to `/join`.
- **Removed:** the "this is nuclii" eyebrow and the bouncing green dot. The dot's CSS keyframes are still in `globals.css`, unused.
- **Motion control:** a play/pause control in the bottom-right corner.
- **Video carousel change:** `video-background-carousel.tsx` gained an optional `playing` prop, so the hero controls pausing, and resuming continues from the current frame.

### Concept (`concept-section.tsx`, `concept-content.ts`)
- **What it shows:** a light section with a slowly moving rail of category cards, plus rotating "modes".
- **Motion:** it has a play/pause control.

### Globe (`globe-section.tsx`, `globe-sphere.tsx`, `globe-content.ts`)
- **What it shows:** a canvas globe with photo pins that drop in one after another when it scrolls into view. The pins are near you, uni, building, circles, societies and interests.
- **Motion:** it has a play/pause control.

### Explore sequence (`explore-sequence.tsx`)
- **How it plays:** the section pins while you scroll. Tickets deal out of a phone, one lifts forward, they collapse back into the phone, and the page fades to black for the title "now make your own."
- **Reduced motion:** visitors who ask for reduced motion get the static `explore-section.tsx` instead.

### The four steps (01–04)
This replaces an earlier pinned "make" chapter (`make-chapter.tsx`, which is still in the repo and unused).

- **How they stack:** the steps use `components/motion/stacked-slides.tsx`. Each card fills the screen and sticks, and the next one slides over it with a rounded top edge, while the covered card dims.
- **Labels:** each step is numbered "01 create" through "04 repeat". There are no coloured underlines.

**01 create** (`create-look-section.tsx`)
- **The phone:** the event page phone from `create-section.tsx` (Open Decks, Digbeth, Birmingham), shown without a phone frame.
- **Look buttons:** four ticket-shaped buttons, Photo-led, Poster, Minimal and Editorial, each with a live mini preview.
- **Behaviour:** the looks cycle on their own until the visitor hovers or clicks one, which also stops the cycle. There's a play/pause control.
- **The guest ticket:** it sits over the phone's corner and reprints in each look's colour.

**02 control** (`control-section.tsx`): audience rings
- **The rings:** five rings, Everyone → Birmingham → Your uni → Your society → Your building, around a "Sisters' Candle Night" ticket.
- **Controls:**
  - **"How far it reaches":** a single-choice set of buttons, one per ring.
  - **"Customise further":** toggles for **21+** and **Women only**.
- **Who lights up:** faces inside the reach stay bright; the rest dim.
- **Summary:** a line rewrites itself in plain English, for example "Only people in Birmingham can see it, and only women aged 21+."
- **Motion:** nothing moves on its own, so there's no play/pause control.

**03 collaborate** (`lineup-section.tsx`)
- **The setup:** an "open call" ticket, and a "Warehouse Rave" poster (Sat 10pm, Digbeth) with an empty line-up.
- **Sequence:** reply cards fly in from the sides and land in the line-up: The Courtyard (venue), Marco (DJ), Jess (photographer) and Maya (co-host). The poster's location updates, and it ends with a lime "ready to publish" stamp.
- **Playback:** it plays once when in view, with play/pause and replay.

**04 repeat** (`circle-section.tsx`)
- **The circle:** the event's group chat, "Late Night Activities", with 8 members drawn as a literal circle. On phones it's a row of faces.
- **Scroll-driven chat:** the card pins, and scroll position decides how many messages show. Scrolling faster brings them faster, and scrolling back rewinds.
- **Highlights:** the speaker lights up in blue, and the address reveal lands as a blue ticket stub.

### Memories (`app-teaser-section.tsx`)
- **Background:** light (`#F7F7FA`).
- **Tickets:** a fan of three **black** tickets with a thin white outline, each with a video clip that develops from an "admit one" face. Hovering or tapping brings one forward.
- **Rest of the section:** a friends-going line, a lime sign-up ticket and "coming soon to iOS & Android".

### FAQ (`faq-section.tsx`)
- **The dispenser:** a vertical roll of 11 **black** question tickets. Pulling one turns it lime and hands it across as a large white answer ticket, with previous and next. The "next ticket" button is black.
- **Phones:** the answer opens under the ticket.
- **New questions:** No. 06–11 were added. No. 07 reads "Yes. Nuclii is free to use right now and at launch."

---

## 3. Site-wide changes

### Navigation (`SideNav.tsx`, `MobileNav.tsx`, `lib/navigation.ts`, `lib/routes.ts`)
- **Top right:** "Log in" as a plain link, a lime **sign up** ticket, and the menu button. Over the home hero on desktop, the links **explore · for hosts · studio** also show inline.
- **"Log in" colour:** it's lime over dark sections and black over light ones, so it's readable on both. The bar detects what's behind it as you scroll.
- **Hidden items:** home, demo, motives and create are kept in the config with `hidden: true`.
- **New routes:**
  - `explore` goes to `/events`.
  - `create`, `login` and `signup` go to `/join` until those pages exist. Change them in `lib/routes.ts`.
- **TikTok link:** now `@wearenuclii`, to match Instagram and Threads.

### Footer (`Footer.tsx`, `stay-updated.tsx`)
- **Layout:** one large rounded card.
- **Top of the card:** a spray-painted lime nuclii lockup, `public/logo/nuclii-spray.webp`, generated from the logo files. It has grainy edges and a sideways smear.
- **Dashed "navigation" rule.**
- **Columns:**
  - **nuclii:** events · partner with us · nuclii **studio** (the Build With Us form) · get in touch.
  - **use cases:** students · organisers · offline communities · venues · talent & makers. All of them go to For Hosts for now.
  - **legal:** Privacy, Terms, Cookies and Community Guidelines, which open the existing drawers.
  - **get started:** a lime **try on web** ticket that goes to `/join`.
  - **stay updated!:** a mailing-list email field, with the social icons below it.
- **Bottom:** "© {year} Nuclii. All rights reserved."

### Mailing list endpoint (`app/api/updates/route.ts`, new)
- **What it does:** adds an email to Resend contacts as opted in, and re-subscribes existing contacts.
- **What it doesn't do:** it's separate from `/api/waitlist`, so it has no role or age step, sends no early-access email and doesn't touch the waitlist count.
- **Analytics events (new):** `updates_signup_completed`, `updates_signup_failed` and `updates_signup_received`.
- **Environment variables:** needs `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` in Vercel. `RESEND_UPDATES_AUDIENCE_ID` is optional and keeps subscribers in their own list. Without the key, it reports success but saves nothing.

### Metadata and sharing (`app/layout.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`)
- **Title:** changed from "Nuclii - Every event starts here" to **"Nuclii · more than memories."**, with a new description.
- **Share tags:** Open Graph and X (Twitter) tags are added.
- **Share card:** generated by the site. It shows the lime logo, "more than memories." and "Launching in Birmingham" on black.

### Icons (`app/icon.png`, `app/favicon.ico`, `app/apple-icon.png`, `public/favicon/*`)
- **The icon:** the nuclii short logo.
- **Time of day:** the tab icon follows the visitor's local time, set in `Logo.tsx`:
  - **Morning (5–12):** black.
  - **Midday (12–18):** white.
  - **Night (18–5):** lime.
- **Outlines:** the black and white versions have a thin outline in the opposite colour, so they show on any tab.
- **Removed:** the old time-of-day dot icon, including its purple night variant.

### Shared building blocks (new)
- `components/ui/ticket-pill.ts`: the ticket shape, with sharp corners and side notches, used for buttons.
- `components/motion/motion-playback.tsx`: the shared play/pause button, and its state, which follows the visitor's motion preferences.
- `components/motion/motion-toggle-edge.ts`: lines the play/pause controls up with the nav edge.
- `components/motion/use-less-motion.ts`: one check for "reduce motion", covering the operating-system setting and the site's accessibility panel.
- `components/motion/stacked-slides.tsx`: the sticky stack used by 01–04.
- `components/motion/prewarm.tsx`: loads and decodes each section's images, and starts buffering its videos, about 1.5 screens before it arrives. This removed most of the first-scroll stutter.
- `components/home/profile-photos.tsx`: portrait photos framed for small circles.

### Accessibility
- **Reduced motion:** every section that moves on its own has a play/pause control and a reduced-motion version.
- **Stacked cards:** covered cards are dimmed, not hidden, so screen readers, keyboard focus and find-in-page reach every heading.
- **Announcements:** the FAQ, the control summary and the mailing-list errors use live regions so screen readers announce changes.

---

## 4. Assets

**Added**
- `public/videos/videos_web2/`: the 8 hero clips, about 35MB.
- `public/images/memories/`: 3 clips for the memories tickets.
- `public/images/categories/`, `explore-hover/`, `carousel-images/` and `profile-pic/`: section photography and portraits.
- `public/logo/nuclii-icon.png`, `nuclii-logo-full.png`, `nuclii-logo-full-black.png` and `nuclii-spray.webp`.
- `public/favicon/` (`morning.png`, `midday.png`, `night.png`), plus the app icons in `app/`.

**Deleted**
- `public/demo/*.jpg` (27 photos).
- `public/images/about-*.jpg`, `attendee.jpg`, `host.jpg`, `talent.jpg` and `venue.jpg`.
- `public/videos/pickup.mp4`, which moved into `videos_web2/`.

> ⚠️ **Known gap:** the For Hosts page (`/early-access`) still points at seven of the deleted images (`host`, `talent`, `venue`, `attendee` and three `about-*`), so they show as broken there.

---

## 5. Docs

- **`PRODUCT.md`:** rewritten as the current product truth: brand line, lime accent, Birmingham first, sign-up as the primary action.
- **`AGENTS.md`:** updated to match:
  - "more than memories."
  - lime `#A3BF1C` instead of the old electric blue
  - Birmingham first
  - sign-up as the primary action
  - the current nav
  - play/pause and reduced-motion rules

---

## 6. Open items

- **For Hosts page:** broken images (see the warning in section 4).
- **QR code:** the app QR was removed until the real code is supplied.
- **02 control:** needs photos of hijabi women for the "Sisters' Candle Night" example. The current faces are placeholders.
- **Unused files** kept as undo paths:
  - `make-chapter.tsx`
  - `collaborate-section.tsx`
  - `hosting-section.tsx`
  - `use-case-ticker.tsx`
  - the old home components
  - the hero-dot CSS
- **Stray lockfile:** a `package-lock.json` in the user's home folder makes Next.js guess the wrong workspace root locally. It's harmless on Vercel.
