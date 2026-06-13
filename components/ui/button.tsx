import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base — shared by every variant
  "inline-flex min-h-11 max-w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold leading-snug tracking-normal outline-none transition-[transform,box-shadow,border-color,background-color,opacity] duration-200 ease-out motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Black primary CTA — with glow pulse on hover
        default:
          "bg-[#0a0a0b] !text-[#ffffff] [&_svg]:!text-[#ffffff] shadow-[0_0_18px_rgba(91,140,255,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[#1c1c22] hover:shadow-[0_0_44px_rgba(91,140,255,0.48),0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] hover:[&_svg:last-child]:translate-x-0.5 hover:animate-[nuclii-btn-pulse_2s_ease-in-out_infinite]",

        // Dark-surface filled — secondary emphasis
        secondary:
          "border border-border/80 bg-secondary/60 text-secondary-foreground hover:border-primary/40 hover:bg-primary/8 hover:text-foreground hover:shadow-[0_4px_20px_rgba(91,140,255,0.1)]",

        // Transparent — used for secondary CTAs alongside a primary
        outline:
          "border border-border/80 bg-transparent text-foreground hover:border-primary/45 hover:bg-primary/8 hover:shadow-[0_4px_20px_rgba(91,140,255,0.1)] hover:[&_svg:last-child]:translate-x-0.5",

        // No border, no background — navigation / low-emphasis actions
        ghost:
          "text-foreground hover:bg-primary/10 hover:text-primary",

        // Inline link
        link: "min-h-0 rounded-none p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "min-h-9 px-4 py-2 text-xs",
        lg: "min-h-12 px-7 py-3",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
