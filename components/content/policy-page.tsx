import type { ReactNode } from "react";

import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PolicySection = {
  title: string;
  body?: string;
  items?: string[];
};

type PolicyPageProps = {
  badge: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
  children?: ReactNode;
};

function PolicyPage({
  badge,
  title,
  description,
  lastUpdated,
  sections,
  children,
}: PolicyPageProps) {
  return (
    <main className="nuclii-page">
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(91,140,255,0.16),transparent_34rem)]" />
        <div className="nuclii-container relative max-w-4xl">
          <Badge>{badge}</Badge>
          <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/10 p-5">
            <p className="text-sm font-semibold text-primary">
              Draft content
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Last updated: {lastUpdated}. This page is placeholder content for
              the pre-launch website and should be reviewed before public launch.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-32">
        <div className="nuclii-container max-w-4xl space-y-5">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.body && (
                    <p className="text-base leading-8 text-muted-foreground">
                      {section.body}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                      {section.items.map((item) => (
                        <li className="flex gap-3" key={item}>
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          ))}
          {children}
        </div>
      </section>
    </main>
  );
}

export { PolicyPage };
export type { PolicySection };
