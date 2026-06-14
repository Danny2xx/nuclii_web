import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PhotoPlaceholderProps = {
  className?: string;
  src?: string;
  alt?: string;
};

function PhotoPlaceholder({ className, src, alt = "" }: PhotoPlaceholderProps) {
  if (src) {
    return (
      <div className={cn("nuclii-photo-placeholder", className)}>
        <Image alt={alt} className="size-full object-cover" fill src={src} />
      </div>
    );
  }

  return (
    <div className={cn("nuclii-photo-placeholder", className)}>
      <div className="nuclii-photo-placeholder__icon">
        <ImageIcon aria-hidden="true" className="size-8" />
      </div>
    </div>
  );
}

export { PhotoPlaceholder };
