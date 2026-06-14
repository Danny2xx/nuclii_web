import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { SideNav } from "@/components/layout/SideNav";

type PageShellProps = {
  children: ReactNode;
};

function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Logo />
      <SideNav />
      <MobileNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export { PageShell };
