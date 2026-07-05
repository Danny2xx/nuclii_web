import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  LoaderCircle,
  Share2,
  type LucideIcon,
} from "lucide-react";

type IconProps = { className?: string };

function makeIcon(Icon: LucideIcon) {
  function NucliiIcon({ className }: IconProps) {
    return (
      <Icon
        aria-hidden="true"
        className={className}
        focusable="false"
        strokeWidth={1.85}
      />
    );
  }

  return NucliiIcon;
}

const ArrowRightIcon = makeIcon(ArrowRight);
const CheckIcon = makeIcon(Check);
const CopyIcon = makeIcon(Copy);
const ShareIcon = makeIcon(Share2);
const SpinnerIcon = makeIcon(LoaderCircle);
const SparkCheckIcon = makeIcon(BadgeCheck);

export { ArrowRightIcon, CheckIcon, CopyIcon, ShareIcon, SpinnerIcon, SparkCheckIcon };
