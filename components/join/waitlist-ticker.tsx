import { WaitlistCount } from "@/components/join/waitlist-count";
import { cn } from "@/lib/utils";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

const LINE_DOTS = [
  EXPERIENCE_ROLES.explorer.partnerAccent,
  EXPERIENCE_ROLES.host.partnerAccent,
  EXPERIENCE_ROLES.venue.partnerAccent,
  EXPERIENCE_ROLES.talent.partnerAccent,
] as const;

type WaitlistTickerProps = {
  className?: string;
  fallback?: number;
};

export function WaitlistTicker({ className, fallback = 700 }: WaitlistTickerProps) {
  return (
    <div
      className={cn(
        "nuclii-waitlist-ticker group relative inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-full border border-white/14 bg-black/45 px-3 py-1.5 text-[13px] font-medium lowercase tracking-[0.01em] text-white/74 ring-1 ring-black/25 backdrop-blur-sm transition duration-300 hover:border-white/26 hover:bg-white/[0.065]",
        className,
      )}
    >
      <span aria-hidden="true" className="nuclii-waitlist-ticker__sheen" />

      <span aria-hidden="true" className="relative z-10 flex items-center">
        {LINE_DOTS.map((color, index) => (
          <span
            className="relative size-3.5 rounded-full ring-2 ring-[#0b0c0e]"
            key={color}
            style={{
              backgroundColor: color,
              marginLeft: index === 0 ? 0 : "-0.4rem",
              zIndex: LINE_DOTS.length - index,
            }}
          />
        ))}
      </span>

      <span aria-hidden="true" className="relative z-10 flex size-2.5 items-center justify-center">
        <span
          className="absolute size-2.5 rounded-full opacity-35 motion-safe:animate-ping"
          style={{ backgroundColor: EXPERIENCE_ROLES.explorer.partnerAccent }}
        />
        <span
          className="relative size-1.5 rounded-full"
          style={{ backgroundColor: EXPERIENCE_ROLES.explorer.partnerAccent }}
        />
      </span>

      <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap">
        <WaitlistCount className="font-bold tabular-nums text-white" fallback={fallback} />
        <span>already in line</span>
      </span>
    </div>
  );
}
