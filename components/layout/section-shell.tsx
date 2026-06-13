import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = ComponentPropsWithoutRef<"section"> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  containerClassName?: string;
  contentClassName?: string;
  children?: ReactNode;
};

function SectionShell({
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  contentClassName,
  children,
  ...props
}: SectionShellProps) {
  return (
    <section className={cn("nuclii-section", className)} {...props}>
      <div className={cn("nuclii-container", containerClassName)}>
        {(eyebrow || title || description) && (
          <div className={cn("mb-10 max-w-3xl", contentClassName)}>
            {eyebrow && <p className="nuclii-eyebrow mb-5">{eyebrow}</p>}
            {title && (
              <h2 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export { SectionShell };
