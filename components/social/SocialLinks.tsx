"use client";

import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaThreads, FaTiktok } from "react-icons/fa6";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { socialLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, IconType> = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  Threads: FaThreads,
  LinkedIn: FaLinkedinIn,
};

interface SocialLinksProps {
  className?: string;
  iconSize?: string;
  buttonSize?: string;
}

function SocialLinks({
  className,
  iconSize = "size-[1.05rem]",
  buttonSize = "size-9",
}: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="list">
      {socialLinks.map(({ label, href }) => {
        const Icon = iconMap[label];
        if (!Icon) return null;

        return (
          <TrackedAnchor
            key={label}
            analyticsEvent={ANALYTICS_EVENTS.socialLinkClicked}
            analyticsProperties={{
              label,
              location: "social_links",
            }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Nuclii on ${label}`}
            role="listitem"
            className={cn(
              "grid place-items-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              buttonSize,
            )}
          >
            <Icon aria-hidden="true" className={iconSize} />
          </TrackedAnchor>
        );
      })}
    </div>
  );
}

export { SocialLinks };
