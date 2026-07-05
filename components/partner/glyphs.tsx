import type { ReactNode } from "react";

type GlyphProps = { className?: string };

const base = {
  "aria-hidden": true as const,
  className: "",
  fill: "none",
  focusable: false,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.55,
  viewBox: "0 0 24 24",
};

function Svg({
  children,
  className,
}: GlyphProps & {
  children: ReactNode;
}) {
  return (
    <svg {...base} className={className}>
      {children}
    </svg>
  );
}

function SignalField() {
  return <path d="M5.2 7.6 12 3.8l6.8 3.8v8.8L12 20.2l-6.8-3.8Z" fill="currentColor" opacity="0.1" stroke="none" />;
}

function Node({ cx, cy, r = 1.25 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} fill="currentColor" opacity="0.86" r={r} stroke="none" />;
}

export function HostGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <SignalField />
      <circle cx="10" cy="8" r="2.35" />
      <path d="M5.8 18.2a4.2 4.2 0 0 1 8.4 0" />
      <path d="M14.7 11.2h3.8" />
      <path d="M16.6 9.3v3.8" />
      <path d="M17.9 15.8h1.9" />
    </Svg>
  );
}

export function SpaceGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <SignalField />
      <path d="M6.2 10.1 12 6.9l5.8 3.2" />
      <path d="M7.5 10.2v7.2h9v-7.2" />
      <path d="M10.2 17.4v-4.2h3.6v4.2" />
      <Node cx={12} cy={5.1} r={1} />
    </Svg>
  );
}

export function TalentGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <SignalField />
      <path d="M12 5.2c.45 2.9 1.9 4.35 4.8 4.8-2.9.45-4.35 1.9-4.8 4.8-.45-2.9-1.9-4.35-4.8-4.8 2.9-.45 4.35-1.9 4.8-4.8Z" />
      <path d="M7 18h10" />
      <path d="M9.2 20h5.6" />
    </Svg>
  );
}

export function CreateGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M5.5 7.2h13" />
      <rect height="12.3" rx="2.1" width="13" x="5.5" y="5.6" />
      <path d="M9.1 4.1v3" />
      <path d="M14.9 4.1v3" />
      <path d="M12 10.2v5.2" />
      <path d="M9.4 12.8h5.2" />
    </Svg>
  );
}

export function TicketGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M5.1 8.2h13.8a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.4v1.1a2 2 0 0 1-2 2H5.1a2 2 0 0 1-2-2v-1.1a2 2 0 0 0 0-3.4v-1.1a2 2 0 0 1 2-2Z" />
      <path d="M14.5 8.5v9" strokeDasharray="1.2 2" />
      <path d="M6.8 12.2h4.5" />
      <path d="M6.8 15h3" />
    </Svg>
  );
}

export function AudienceGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M7.2 15.8h9.6" opacity="0.8" />
      <path d="M12 8.1v7.7" opacity="0.8" />
      <Node cx={12} cy={7.4} r={2.25} />
      <Node cx={7.2} cy={16.4} r={2} />
      <Node cx={16.8} cy={16.4} r={2} />
    </Svg>
  );
}

export function ChartGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M4.4 18.2h15.2" />
      <path d="M6.2 15.9 10 12l3.1 2.7 5-6" />
      <Node cx={10} cy={12} r={0.9} />
      <Node cx={13.1} cy={14.7} r={0.9} />
      <Node cx={18.1} cy={8.7} r={0.9} />
    </Svg>
  );
}

export function EyeGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M3.2 12s3.4-5.2 8.8-5.2S20.8 12 20.8 12 17.4 17.2 12 17.2 3.2 12 3.2 12Z" fill="currentColor" opacity="0.1" />
      <circle cx="12" cy="12" r="2.55" />
      <Node cx={12} cy={12} r={0.85} />
    </Svg>
  );
}

export function BookingGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <rect height="13.8" rx="2.1" width="13.8" x="5.1" y="5.5" />
      <path d="M5.1 10h13.8" />
      <path d="M8.7 4v3" />
      <path d="M15.3 4v3" />
      <path d="m8.8 14.5 2.1 2 4.3-4.6" />
    </Svg>
  );
}

export function ClockGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" fill="currentColor" opacity="0.1" r="7.5" />
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 7.8v4.5l3 1.8" />
    </Svg>
  );
}

export function LinkGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M8 12h8" />
      <circle cx="7.2" cy="12" fill="currentColor" opacity="0.1" r="4.2" />
      <circle cx="16.8" cy="12" fill="currentColor" opacity="0.1" r="4.2" />
      <circle cx="7.2" cy="12" r="4.2" />
      <circle cx="16.8" cy="12" r="4.2" />
    </Svg>
  );
}

export function StarGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M12 4.1c.55 3.9 2.2 5.55 6.1 6.1-3.9.55-5.55 2.2-6.1 6.1-.55-3.9-2.2-5.55-6.1-6.1 3.9-.55 5.55-2.2 6.1-6.1Z" fill="currentColor" opacity="0.1" />
      <path d="M12 4.1c.55 3.9 2.2 5.55 6.1 6.1-3.9.55-5.55 2.2-6.1 6.1-.55-3.9-2.2-5.55-6.1-6.1 3.9-.55 5.55-2.2 6.1-6.1Z" />
      <path d="m17.2 17.1 1.45 1.45 2.7-3.15" />
    </Svg>
  );
}

export function SearchGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <circle cx="10.8" cy="10.8" fill="currentColor" opacity="0.1" r="5.8" />
      <circle cx="10.8" cy="10.8" r="5.8" />
      <path d="m15.2 15.2 4.1 4.1" />
      <Node cx={10.8} cy={10.8} r={0.9} />
    </Svg>
  );
}

export function RisingGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 17.4 9 12.9l3.5 3 6.8-8.1" />
      <path d="M15.5 7.8h3.8v3.8" />
      <Node cx={9} cy={12.9} r={0.9} />
      <Node cx={12.5} cy={15.9} r={0.9} />
    </Svg>
  );
}

export function EventGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <rect height="13.2" rx="2.1" width="13.8" x="5.1" y="5.8" />
      <path d="M5.1 10.1h13.8" />
      <path d="M8.8 4.2v3" />
      <path d="M15.2 4.2v3" />
      <path d="M8.7 13.4h2.2" />
      <path d="M13.2 13.4h2.2" />
      <path d="M8.7 16.2h5.9" />
    </Svg>
  );
}

export function QrGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <rect height="5" rx="1" width="5" x="4.5" y="4.5" />
      <rect height="5" rx="1" width="5" x="14.5" y="4.5" />
      <rect height="5" rx="1" width="5" x="4.5" y="14.5" />
      <path d="M14.7 14.7h2.8v2.8" />
      <path d="M20 14.7v5.3" />
      <path d="M14.7 20h2.8" />
    </Svg>
  );
}

export function MegaphoneGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M4.3 10.3v3.4l10.4 3.7V6.6Z" fill="currentColor" opacity="0.1" />
      <path d="M4.3 10.3v3.4l10.4 3.7V6.6Z" />
      <path d="M17.3 9.1a4.7 4.7 0 0 1 0 5.8" />
      <path d="M19.6 7.3a7.2 7.2 0 0 1 0 9.4" />
      <path d="M7.3 14.8v2.4a1.35 1.35 0 0 0 2.7 0v-1.4" />
    </Svg>
  );
}

export function CapacityGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <rect height="5.4" rx="1.15" width="5.4" x="4.6" y="4.6" />
      <rect height="5.4" rx="1.15" width="5.4" x="14" y="4.6" />
      <rect height="5.4" rx="1.15" width="5.4" x="4.6" y="14" />
      <rect height="5.4" rx="1.15" width="5.4" x="14" y="14" />
      <path d="M10 7.3h4" opacity="0.7" />
      <path d="M7.3 10v4" opacity="0.7" />
      <path d="M16.7 10v4" opacity="0.7" />
    </Svg>
  );
}

export function PortfolioGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <rect height="10.8" rx="2" width="12.4" x="4.4" y="7.2" />
      <path d="M7 5.4h11a1.8 1.8 0 0 1 1.8 1.8v8.7" />
      <Node cx={8.2} cy={10.8} r={0.9} />
      <path d="m5.5 16 3.2-2.9 2.5 2.25 2.6-2.7 2.5 2.25" />
    </Svg>
  );
}

export function AccessGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M5.2 9V5.2H9" />
      <path d="M15 5.2h3.8V9" />
      <path d="M18.8 15v3.8H15" />
      <path d="M9 18.8H5.2V15" />
      <circle cx="12" cy="12" fill="currentColor" opacity="0.1" r="3.9" />
      <Node cx={12} cy={12} r={1.25} />
    </Svg>
  );
}

export function PartnerGlyph({ className }: GlyphProps) {
  return (
    <Svg className={className}>
      <path d="M8.1 12h7.8" />
      <path d="M8.5 8.7h-1a3.3 3.3 0 0 0 0 6.6h1.7" />
      <path d="M15.5 15.3h1a3.3 3.3 0 0 0 0-6.6h-1.7" />
      <Node cx={8.1} cy={12} r={1} />
      <Node cx={15.9} cy={12} r={1} />
    </Svg>
  );
}
