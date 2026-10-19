// Pins on the home "start close, branch out" globe. No globe photo folder was
// supplied, so each pin reuses the supplied category photo closest in meaning;
// swap `image` to change one.

export type GlobePinIcon = "near" | "uni" | "building" | "circles" | "societies" | "interests";

// Photo centre as a % of the globe box, and which side its ticket chip sits on.
type PinPlacement = { x: number; y: number; chip: "left" | "right" | "top" };

export type GlobePin = {
  id: string;
  label: string;
  icon: GlobePinIcon;
  image: string;
  imageAlt: string;
  desktop: PinPlacement;
  // phones show a wider, cropped globe, so pins sit closer to the middle
  mobile: PinPlacement;
};

export const globePins: readonly GlobePin[] = [
  {
    id: "near",
    label: "near you",
    icon: "near",
    image: "/images/categories/outside.jpg",
    imageAlt: "A crowd at an outdoor day party",
    desktop: { x: 15, y: 35, chip: "top" },
    mobile: { x: 26, y: 37, chip: "right" },
  },
  {
    id: "uni",
    label: "your uni",
    icon: "uni",
    image: "/images/categories/on-campus.jpg",
    imageAlt: "An art stall set up on campus grass",
    desktop: { x: 27, y: 20, chip: "left" },
    mobile: { x: 31, y: 21, chip: "top" },
  },
  {
    id: "building",
    label: "your building",
    icon: "building",
    image: "/images/categories/im-just-open.jpg",
    imageAlt: "Friends making pizzas in a shared kitchen",
    desktop: { x: 50, y: 9, chip: "top" },
    mobile: { x: 50, y: 8, chip: "top" },
  },
  {
    id: "circles",
    label: "your circles",
    icon: "circles",
    image: "/images/categories/lowkey-low-effort.jpg",
    imageAlt: "Friends hanging out together at home",
    desktop: { x: 45, y: 37, chip: "right" },
    mobile: { x: 50, y: 49, chip: "top" },
  },
  {
    id: "societies",
    label: "societies",
    icon: "societies",
    image: "/images/categories/something-different.jpg",
    imageAlt: "A group sitting in a circle for a picnic in the park",
    desktop: { x: 73, y: 20, chip: "right" },
    mobile: { x: 69, y: 21, chip: "top" },
  },
  {
    id: "interests",
    label: "your interests",
    icon: "interests",
    image: "/images/categories/for-creatives.jpg",
    imageAlt: "Someone steaming a shirt on a subway platform",
    desktop: { x: 85, y: 35, chip: "top" },
    mobile: { x: 74, y: 37, chip: "left" },
  },
];
