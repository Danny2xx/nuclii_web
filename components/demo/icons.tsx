import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Check,
  Compass,
  Home,
  Inbox,
  MapPin,
  Plus,
  Repeat,
  Search,
  Settings,
  Ticket,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type IconProps = { className?: string };

// same wrapper idiom as components/ui/icons.tsx — one stroke weight everywhere
function makeIcon(Icon: LucideIcon) {
  function DemoIcon({ className }: IconProps) {
    return (
      <Icon aria-hidden="true" className={className} focusable="false" strokeWidth={1.85} />
    );
  }
  return DemoIcon;
}

export const HomeIcon = makeIcon(Home);
export const CompassIcon = makeIcon(Compass);
export const TicketIcon = makeIcon(Ticket);
export const InboxIcon = makeIcon(Inbox);
export const SettingsIcon = makeIcon(Settings);
export const PlusIcon = makeIcon(Plus);
export const BookmarkIcon = makeIcon(Bookmark);
export const CalendarIcon = makeIcon(Calendar);
export const BellIcon = makeIcon(Bell);
export const SearchIcon = makeIcon(Search);
export const MapPinIcon = makeIcon(MapPin);
export const UsersIcon = makeIcon(Users);
export const SwitchIcon = makeIcon(Repeat);
export const BackIcon = makeIcon(ArrowLeft);
export const ForwardIcon = makeIcon(ArrowRight);
export const CheckIcon = makeIcon(Check);
export const CloseIcon = makeIcon(X);
