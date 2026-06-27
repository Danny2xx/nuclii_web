// Custom nuclii icon set — a unique, consistent line language (rounded caps,
// 1.7 stroke) so the UI doesn't lean on stock icons. All accept a className.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 12h14.5" />
      <path d="m12.5 6 6.5 6-6.5 6" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m4.5 12.5 4.8 4.8L19.5 6.7" />
    </svg>
  );
}

function CopyIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect height="13" rx="3" width="13" x="8" y="8" />
      <path d="M4.5 15.5A2.5 2.5 0 0 1 3 13V6a3 3 0 0 1 3-3h7a2.5 2.5 0 0 1 2.5 1.5" />
    </svg>
  );
}

function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

function SpinnerIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3a9 9 0 1 0 9 9" opacity="0.95" />
    </svg>
  );
}

// A celebratory spark+check for the success state.
function SparkCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2.5c.45 3.4 2.6 5.55 6 6-3.4.45-5.55 2.6-6 6-.45-3.4-2.6-5.55-6-6 3.4-.45 5.55-2.6 6-6Z" />
      <path d="m18 18 1.4 1.4L22 16.5" />
    </svg>
  );
}

export { ArrowRightIcon, CheckIcon, CopyIcon, ShareIcon, SpinnerIcon, SparkCheckIcon };
