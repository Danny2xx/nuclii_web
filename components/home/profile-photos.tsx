import Image from "next/image";

import { cn } from "@/lib/utils";

// Portraits from /public/images/profile-pic, framed for small circles. Each
// `focus` is where the face sits in the photo (x% y%); the photo is aligned
// and zoomed on that point so the face fills the circle.
export const profilePhotos = {
  asianWoman: { src: "/images/profile-pic/asian-woman.jpg", focus: "52% 28%", zoom: 2.4 },
  curlyWhiteMan: { src: "/images/profile-pic/curly-white-man.jpg", focus: "54% 46%", zoom: 2 },
  europeMan: { src: "/images/profile-pic/europe-man.jpg", focus: "44% 27%", zoom: 1.7 },
  manWhite: { src: "/images/profile-pic/man-white.jpg", focus: "50% 30%", zoom: 1.15 },
  man: { src: "/images/profile-pic/man.jpg", focus: "46% 22%", zoom: 1.25 },
  southAsianMan: { src: "/images/profile-pic/south-asian-man.jpg", focus: "48% 34%", zoom: 1.25 },
  whiteManVest: { src: "/images/profile-pic/white-man-vest.jpg", focus: "50% 25%", zoom: 1.35 },
  whiteMan: { src: "/images/profile-pic/white-man.jpg", focus: "43% 32%", zoom: 1.35 },
  whiteWoman: { src: "/images/profile-pic/white-woman.jpg", focus: "57% 32%", zoom: 1.9 },
  womanAsian: { src: "/images/profile-pic/woman-asian.jpg", focus: "50% 35%", zoom: 1.8 },
  womanWhite: { src: "/images/profile-pic/woman-white.jpg", focus: "57% 26%", zoom: 1.7 },
} as const;

export type ProfilePhoto = (typeof profilePhotos)[keyof typeof profilePhotos];

// A decorative portrait that fills its (round) parent.
export function ProfileImage({ photo, className }: { photo: ProfilePhoto; className?: string }) {
  return (
    <Image
      alt=""
      className={cn("object-cover", className)}
      fill
      sizes="8rem"
      src={photo.src}
      style={{ objectPosition: photo.focus, transform: `scale(${photo.zoom})`, transformOrigin: photo.focus }}
    />
  );
}
