import type { CSSProperties } from "react";

// The button shape: a sharp-cornered rectangle with a notch cut
// into each end, like a ticket. Notches are in em, so they scale with the
// button's text size. Pair the style with `ticketPillClassName`.
const notches = ["0", "100%"].map(
  (x) => `radial-gradient(circle 0.42em at ${x} 50%, transparent 98%, #000 100%)`,
);

export const ticketPillStyle: CSSProperties = {
  maskImage: notches.join(", "),
  maskComposite: "intersect",
  WebkitMaskImage: notches.join(", "),
  WebkitMaskComposite: "source-in",
};

export const ticketPillClassName = "rounded-none";
