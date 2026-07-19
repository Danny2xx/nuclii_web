// Bespoke "dimensional mini-object" marks.
// Language: a white front object + an accent drop layer offset down-right for
// depth, plus one small accent detail. `accent` defaults to the nuclii indigo
// but can be set per context (e.g. a partner role colour).

type MarkProps = { className?: string; accent?: string };

const ACCENT = "#6A6AF2";
const INK = "#0A0A0B";
const FRONT = "#FFFFFF";

function Mark({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 40 40"
    >
      {children}
    </svg>
  );
}

// ── discover set (home) ──────────────────────────────────────────

export function SearchMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <g stroke={accent} strokeLinecap="round" strokeWidth="3.4" transform="translate(1.8,2.4)">
        <circle cx="16.5" cy="16.5" r="9.5" />
        <path d="M23.6 23.6 30 30" />
      </g>
      <circle cx="16.5" cy="16.5" r="9.5" fill="rgba(255,255,255,0.06)" />
      <g stroke={FRONT} strokeLinecap="round" strokeWidth="3.4">
        <circle cx="16.5" cy="16.5" r="9.5" />
        <path d="M23.6 23.6 30 30" />
      </g>
      <path
        d="M16.5 11.5 17.7 15.3 21.5 16.5 17.7 17.7 16.5 21.5 15.3 17.7 11.5 16.5 15.3 15.3Z"
        fill={accent}
      />
    </Mark>
  );
}

export function MapMark({ className, accent = ACCENT }: MarkProps) {
  const pin =
    "M20 5C14.2 5 9.6 9.6 9.6 15.3 9.6 22 20 31.5 20 31.5S30.4 22 30.4 15.3C30.4 9.6 25.8 5 20 5Z";
  return (
    <Mark className={className}>
      <ellipse cx="20" cy="33.6" fill="rgba(255,255,255,0.13)" rx="7.5" ry="2.2" />
      <path d={pin} fill={accent} transform="translate(1.6,2)" />
      <path d={pin} fill={FRONT} />
      <circle cx="20" cy="15.6" fill={INK} r="3.5" />
    </Mark>
  );
}

export function SaveMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <rect fill="rgba(255,255,255,0.32)" height="21" rx="3.2" transform="rotate(8 21 20.5)" width="17" x="13.5" y="9.5" />
      <rect fill={accent} height="21" rx="3.2" width="17" x="11.1" y="13" />
      <rect fill={FRONT} height="21" rx="3.2" width="17" x="9.5" y="11" />
      <path d="M14.6 11 V19.6 L18 17.1 L21.4 19.6 V11Z" fill={accent} />
    </Mark>
  );
}

export function PublishMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <rect fill={accent} height="16" rx="3.4" transform="translate(1.6,2)" width="22" x="9" y="16" />
      <rect fill={FRONT} height="16" rx="3.4" width="22" x="9" y="16" />
      <path d="M20 5.5 26.4 14 H22.4 V21.5 H17.6 V14 H13.6Z" fill={accent} />
    </Mark>
  );
}

export function TicketMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <rect fill={accent} height="15" rx="3" transform="translate(1.6,2)" width="27" x="6.5" y="12.5" />
      <rect fill={FRONT} height="15" rx="3" width="27" x="6.5" y="12.5" />
      <circle cx="25.5" cy="12.5" fill={INK} r="1.9" />
      <circle cx="25.5" cy="27.5" fill={INK} r="1.9" />
      <line stroke={accent} strokeDasharray="1.5 2" strokeLinecap="round" strokeWidth="1.8" x1="25.5" x2="25.5" y1="15.5" y2="24.5" />
      <circle cx="14" cy="20" fill={accent} r="1.6" />
    </Mark>
  );
}

export function PrivacyMark({ className, accent = ACCENT }: MarkProps) {
  const shield = "M20 5 31 9 V18.5 C31 26.4 25.5 31.2 20 33.2 14.5 31.2 9 26.4 9 18.5 V9Z";
  return (
    <Mark className={className}>
      <path d={shield} fill={accent} transform="translate(1.6,2)" />
      <path d={shield} fill={FRONT} />
      <circle cx="20" cy="17.5" fill={accent} r="2.8" />
      <path d="M20 17.8 V23" stroke={accent} strokeLinecap="round" strokeWidth="2.6" />
    </Mark>
  );
}

// ── roles ────────────────────────────────────────────────────────

export function HostMark({ className, accent = ACCENT }: MarkProps) {
  const body = "M8.6 31C8.6 24.2 27.4 24.2 27.4 31Z";
  return (
    <Mark className={className}>
      <g fill={accent} transform="translate(1.8,2)">
        <path d={body} />
        <circle cx="18" cy="13" r="4.8" />
      </g>
      <path d={body} fill={FRONT} />
      <circle cx="18" cy="13" fill={FRONT} r="4.8" />
      <path d="M28 6.5 29 9.4 31.9 10.4 29 11.4 28 14.3 27 11.4 24.1 10.4 27 9.4Z" fill={accent} />
    </Mark>
  );
}

export function SpaceMark({ className, accent = ACCENT }: MarkProps) {
  const house = "M9 17.5 20 9.5 31 17.5 V31 H9Z";
  return (
    <Mark className={className}>
      <path d={house} fill={accent} transform="translate(1.6,2)" />
      <path d={house} fill={FRONT} />
      <rect fill={accent} height="8" rx="1.4" width="6" x="17" y="23" />
      <rect fill={accent} height="3.4" rx="1" width="3.4" x="12" y="19.5" />
      <rect fill={accent} height="3.4" rx="1" width="3.4" x="24.6" y="19.5" />
    </Mark>
  );
}

export function TalentMark({ className, accent = ACCENT }: MarkProps) {
  const star = "M20 5.5C21 13.5 26.5 19 34.5 20 26.5 21 21 26.5 20 34.5 19 26.5 13.5 21 5.5 20 13.5 19 19 13.5 20 5.5Z";
  return (
    <Mark className={className}>
      <path d={star} fill={accent} transform="translate(1.6,2)" />
      <path d={star} fill={FRONT} />
      <circle cx="20" cy="20" fill={accent} r="2.6" />
    </Mark>
  );
}

// ── partner feature set ──────────────────────────────────────────

export function ScanMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <rect height="24" rx="5" stroke={accent} strokeWidth="3.2" transform="translate(1.6,2)" width="24" x="8" y="8" />
      <rect height="24" rx="5" stroke={FRONT} strokeWidth="3.2" width="24" x="8" y="8" />
      <g fill={accent}>
        <rect height="4.4" rx="1" width="4.4" x="14" y="14" />
        <rect height="4.4" rx="1" width="4.4" x="21.6" y="14" />
        <rect height="4.4" rx="1" width="4.4" x="14" y="21.6" />
        <rect height="4.4" rx="1" width="4.4" x="21.6" y="21.6" />
      </g>
    </Mark>
  );
}

export function MegaphoneMark({ className, accent = ACCENT }: MarkProps) {
  const horn = "M7 17 22 11 V29 L7 23Z";
  return (
    <Mark className={className}>
      <path d={horn} fill={accent} transform="translate(1.6,2)" />
      <path d={horn} fill={FRONT} />
      <rect fill={FRONT} height="7.5" rx="1.4" width="4.5" x="5" y="16.2" />
      <path d="M26 13.5C29 16 29 24 26 26.5" stroke={accent} strokeLinecap="round" strokeWidth="2.6" />
      <path d="M30 10.5C34 14 34 26 30 29.5" stroke={accent} strokeLinecap="round" strokeWidth="2.6" opacity="0.6" />
    </Mark>
  );
}

export function CommunityMark({ className, accent = ACCENT }: MarkProps) {
  const band = "M7 31C7 24.6 33 24.6 33 31Z";
  return (
    <Mark className={className}>
      <g fill={accent} transform="translate(1.6,2)">
        <path d={band} />
        <circle cx="20" cy="13.5" r="4.4" />
        <circle cx="11.5" cy="16" r="3.4" />
        <circle cx="28.5" cy="16" r="3.4" />
      </g>
      <path d={band} fill={FRONT} />
      <circle cx="11.5" cy="16" fill={FRONT} r="3.4" />
      <circle cx="28.5" cy="16" fill={FRONT} r="3.4" />
      <circle cx="20" cy="13.5" fill={FRONT} r="4.6" />
      <circle cx="20" cy="13.5" fill={accent} r="1.8" />
    </Mark>
  );
}

export function ShowcaseMark({ className, accent = ACCENT }: MarkProps) {
  const eye = "M5 20C10 12.5 30 12.5 35 20 30 27.5 10 27.5 5 20Z";
  return (
    <Mark className={className}>
      <path d={eye} fill={accent} transform="translate(1.4,1.8)" />
      <path d={eye} fill={FRONT} />
      <circle cx="20" cy="20" fill={accent} r="4.6" />
      <circle cx="20" cy="20" fill={INK} r="1.9" />
    </Mark>
  );
}

export function BookingMark({ className, accent = ACCENT }: MarkProps) {
  const cal = "M8 12.5h24a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-16a2 2 0 0 1 2-2Z";
  return (
    <Mark className={className}>
      <path d={cal} fill={accent} transform="translate(1.4,1.8)" />
      <path d={cal} fill={FRONT} />
      <rect fill={FRONT} height="6" rx="1.6" width="3.2" x="12" y="7.5" />
      <rect fill={FRONT} height="6" rx="1.6" width="3.2" x="24.8" y="7.5" />
      <path d="M14 24 18.2 28 26 20" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" fill="none" />
    </Mark>
  );
}

export function CapacityMark({ className, accent = ACCENT }: MarkProps) {
  const room = "M8 31 V17 A12 12 0 0 1 32 17 V31Z";
  return (
    <Mark className={className}>
      <path d={room} fill={accent} transform="translate(1.6,2)" />
      <path d={room} fill={FRONT} />
      <g fill={accent}>
        <circle cx="13.5" cy="25.5" r="2.3" />
        <circle cx="20" cy="25.5" r="2.3" />
        <circle cx="26.5" cy="25.5" r="2.3" />
      </g>
    </Mark>
  );
}

export function ClockMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <circle cx="20" cy="20" fill={accent} r="12" transform="translate(1.5,2)" />
      <circle cx="20" cy="20" fill={FRONT} r="12" />
      <path d="M20 13 V20 L25 22.5" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" fill="none" />
    </Mark>
  );
}

export function PortfolioMark({ className, accent = ACCENT }: MarkProps) {
  const frame = "M8 10.5h24a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z";
  return (
    <Mark className={className}>
      <path d={frame} fill={accent} transform="translate(1.5,2)" />
      <path d={frame} fill={FRONT} />
      <circle cx="14" cy="16.5" fill={accent} r="2.4" />
      <path d="M9 27 17 19.5 22 24 26 21 31 27Z" fill={accent} />
    </Mark>
  );
}

export function LinkMark({ className, accent = ACCENT }: MarkProps) {
  return (
    <Mark className={className}>
      <g transform="translate(1.6,2)">
        <circle cx="13" cy="20" fill={accent} r="6" />
        <circle cx="27" cy="20" fill={accent} r="6" />
      </g>
      <circle cx="13" cy="20" fill={FRONT} r="6" />
      <circle cx="27" cy="20" fill={FRONT} r="6" />
      <rect fill={accent} height="4.4" rx="2.2" width="16" x="12" y="17.8" />
    </Mark>
  );
}

export function LockMark({ className, accent = ACCENT }: MarkProps) {
  const bodyPath = "M11 18.5h18a1.6 1.6 0 0 1 1.6 1.6v9.4a1.6 1.6 0 0 1-1.6 1.6H11a1.6 1.6 0 0 1-1.6-1.6v-9.4A1.6 1.6 0 0 1 11 18.5Z";
  return (
    <Mark className={className}>
      <path d="M14 18.5V15a6 6 0 0 1 12 0v3.5" stroke={accent} strokeWidth="3" fill="none" transform="translate(1.4,1.8)" />
      <path d="M14 18.5V15a6 6 0 0 1 12 0v3.5" stroke={FRONT} strokeWidth="3" fill="none" />
      <path d={bodyPath} fill={accent} transform="translate(1.4,1.8)" />
      <path d={bodyPath} fill={FRONT} />
      <circle cx="20" cy="23.5" fill={accent} r="2.4" />
      <path d="M20 23.8V27.5" stroke={accent} strokeLinecap="round" strokeWidth="2.4" />
    </Mark>
  );
}
