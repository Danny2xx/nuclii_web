// Demo icons in nuclii's bespoke "dimensional mark" language: a white front
// shape + an accent drop layer offset down-right, plus one small accent detail.
// Destinations and content use these marks; pure directional utility (back /
// close / chevrons) stays as thin line icons (see ./icons).
//
// Marks that already exist on the marketing site are re-exported from
// feature-marks; the three the app needs that don't exist yet (inbox, settings,
// bell) are authored here in the identical language.

import {
  BookingMark,
  ClockMark,
  CommunityMark,
  HostMark,
  MapMark,
  PublishMark,
  SaveMark,
  SearchMark,
  SpaceMark,
  TalentMark,
  TicketMark,
} from "@/components/home/feature-marks";

type MarkProps = { className?: string; accent?: string };

const ACCENT = "#6A6AF2";
const INK = "#0A0A0B";
const FRONT = "#FFFFFF";

function Mark({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 40 40">
      {children}
    </svg>
  );
}

export function InboxMark({ className, accent = ACCENT }: MarkProps) {
  const body = "M7 13h26a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z";
  return (
    <Mark className={className}>
      <path d={body} fill={accent} transform="translate(1.5,2)" />
      <path d={body} fill={FRONT} />
      <path
        d="M6.5 15.5 20 24 33.5 15.5"
        stroke={accent}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Mark>
  );
}

export function SettingsMark({ className, accent = ACCENT }: MarkProps) {
  const teeth = [0, 60, 120, 180, 240, 300];
  const gear = (fill: string) => (
    <g fill={fill}>
      {teeth.map((a) => (
        <rect key={a} x="18.4" y="4.6" width="3.2" height="6" rx="1.4" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="9.2" />
    </g>
  );
  return (
    <Mark className={className}>
      <g transform="translate(1.5,2)">{gear(accent)}</g>
      {gear(FRONT)}
      <circle cx="20" cy="20" r="3.4" fill={accent} />
      <circle cx="20" cy="20" r="1.5" fill={INK} />
    </Mark>
  );
}

export function BellMark({ className, accent = ACCENT }: MarkProps) {
  const bell = "M20 7c-5 0-8 3.4-8 8.4 0 5.6-2 7-2 8.6h20c0-1.6-2-3-2-8.6 0-5-3-8.4-8-8.4Z";
  return (
    <Mark className={className}>
      <path d={bell} fill={accent} transform="translate(1.5,2)" />
      <path d={bell} fill={FRONT} />
      <path d="M16.6 28.5a3.6 3.6 0 0 0 6.8 0Z" fill={accent} />
      <circle cx="20" cy="7" r="2.2" fill={accent} />
    </Mark>
  );
}

// Semantic aliases so screens read intent, not shape.
export {
  SpaceMark as HomeMark,
  SearchMark as BrowseMark,
  TicketMark as NightsMark,
  PublishMark as CreateMark,
  SaveMark as BookmarkMark,
  MapMark as PinMark,
  CommunityMark as GoingMark,
  BookingMark as CalendarMark,
  ClockMark,
  HostMark,
  SpaceMark as VenueMark,
  TalentMark,
};
