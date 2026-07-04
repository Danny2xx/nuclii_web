import * as React from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = React.ComponentProps<"h1">;

function PageTitle({ className, ...props }: PageTitleProps) {
  return (
    <h1
      className={cn(
        "text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold lowercase leading-[0.98] tracking-[-0.03em] text-balance",
        className,
      )}
      {...props}
    />
  );
}

type SectionTitleProps = React.ComponentProps<"h2"> & {
  size?: "default" | "compact";
};

function SectionTitle({
  className,
  size = "default",
  ...props
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "font-extrabold lowercase tracking-[-0.03em] text-balance",
        size === "default"
          ? "text-3xl leading-tight sm:text-5xl"
          : "text-3xl leading-tight sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export { PageTitle, SectionTitle };
