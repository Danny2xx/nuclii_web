// Bespoke partner-type glyphs — one line family (1.7px stroke, rounded caps),
// coloured by the parent via `currentColor`. Deliberately minimal, not lucide.

type GlyphProps = { className?: string };

const base = {
  "aria-hidden": true as const,
  fill: "none",
  focusable: false,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
  style: { display: "block" },
  viewBox: "0 0 24 24",
};

/** hosts — a person welcoming people into the moment. */
export function HostGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="7" r="2.5" />
      <path d="M4.5 20v-2.2a4.5 4.5 0 0 1 9 0V20" />
      <path d="m12.2 13.7 3.1-3.2 2-4.5" />
      <path d="m16.2 6.8 2.2-1.7" />
    </svg>
  );
}

/** venues — a recognisable façade with an open entrance. */
export function SpaceGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v11h14V9" />
      <path d="M9.5 20v-6.5h5V20" />
      <path d="M7.5 11.5h1M15.5 11.5h1" />
    </svg>
  );
}

/** talent & makers — a crafted skill being made visible and offered. */
export function TalentGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13.5 2.5c.3 2.5 1.2 3.4 3.7 3.7-2.5.3-3.4 1.2-3.7 3.7-.3-2.5-1.2-3.4-3.7-3.7 2.5-.3 3.4-1.2 3.7-3.7Z" />
      <path d="M3 16.4h3.2l1.8 2a4.5 4.5 0 0 0 3.4 1.6h4.1a4 4 0 0 0 3-1.4l2.7-3a1.7 1.7 0 0 0-2.5-2.3l-2.1 1.9" />
      <path d="M6.2 16.4h8.1a1.7 1.7 0 1 0 0-3.4h-4.1l-1.5-1.5" />
    </svg>
  );
}

// ── Feature glyphs (same line family) ───────────────────────────────

/** creation — a spark. */
export function CreateGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 4C12.5 9.5 14.5 11.5 20 12C14.5 12.5 12.5 14.5 12 20C11.5 14.5 9.5 12.5 4 12C9.5 11.5 11.5 9.5 12 4Z" />
    </svg>
  );
}

/** ticketing — a ticket stub. */
export function TicketGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="10" rx="2" width="18" x="3" y="7" />
      <path d="M15 7v10" strokeDasharray="1.5 2" />
    </svg>
  );
}

/** audience — two people. */
export function AudienceGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M15.6 14.8A4.4 4.4 0 0 1 20.5 18.8" />
    </svg>
  );
}

/** insights — a bar chart. */
export function ChartGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 20h16" />
      <path d="M7.5 20v-5" />
      <path d="M12 20v-9" />
      <path d="M16.5 20v-6.5" />
    </svg>
  );
}

/** visibility — an eye. */
export function EyeGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

/** bookings — a calendar with a check. */
export function BookingGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="15" rx="2" width="16" x="4" y="5.5" />
      <path d="M4 10h16" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

/** availability — a clock. */
export function ClockGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** collaborate — two linked rings. */
export function LinkGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9.2" cy="12" r="5" />
      <circle cx="14.8" cy="12" r="5" />
    </svg>
  );
}

/** showcase — a star. */
export function StarGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5l2.7 5.5 6 .9-4.35 4.25 1.03 6.03L12 17.3l-5.38 2.88 1.03-6.03L3.3 9.9l6-.9Z" />
    </svg>
  );
}

/** discovered — a magnifier. */
export function SearchGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M19.5 19.5l-4.2-4.2" />
    </svg>
  );
}

/** opportunities — a rising trend. */
export function RisingGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 16l5-5 3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

/** event management — a calendar. */
export function EventGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="15" rx="2" width="16" x="4" y="5.5" />
      <path d="M4 10h16" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M8 14h4" />
      <path d="M8 17h8" />
    </svg>
  );
}

/** ticketing & QR scans — a scan code. */
export function QrGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="6" rx="1" width="6" x="3.5" y="3.5" />
      <rect height="6" rx="1" width="6" x="14.5" y="3.5" />
      <rect height="6" rx="1" width="6" x="3.5" y="14.5" />
      <path d="M14.5 14.5h3v3M20.5 14.5v6M14.5 20.5h3" />
    </svg>
  );
}

/** in-app marketing — a megaphone. */
export function MegaphoneGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 10.5v3l12 4V6.5l-12 4Z" />
      <path d="M18.5 9a5 5 0 0 1 0 6" />
      <path d="M7.5 15v2.6a1.3 1.3 0 0 0 2.6 0v-1.8" />
    </svg>
  );
}

/** capacity & amenities — a set of spaces. */
export function CapacityGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="7" rx="1.4" width="7" x="4" y="4" />
      <rect height="7" rx="1.4" width="7" x="13" y="4" />
      <rect height="7" rx="1.4" width="7" x="4" y="13" />
      <rect height="7" rx="1.4" width="7" x="13" y="13" />
    </svg>
  );
}

/** digital portfolio — a gallery frame. */
export function PortfolioGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} {...base}>
      <rect height="12" rx="2" width="14" x="3.5" y="6.5" />
      <circle cx="7.6" cy="10.6" r="1.3" />
      <path d="M4 16l3.6-3.4 2.6 2.5 3-3.2 4 3.6" />
      <path d="M7 4.5h11.5a2 2 0 0 1 2 2V17" />
    </svg>
  );
}
