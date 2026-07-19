"use client";

import { PHOTO_CREDITS, NO_ATTRIBUTION_COUNT } from "@/lib/demo/credits";
import { useDemoRouter } from "../demo-router";
import { BackIcon } from "../icons";

export function CreditsScreen() {
  const { back } = useDemoRouter();

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={back}
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BackIcon className="size-4" />
        settings
      </button>

      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        photo credits
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-sm leading-6 text-muted-foreground">
        the sandbox uses licensed stock photography as placeholder event imagery. the photos
        below are creative commons and are credited to their makers; {NO_ATTRIBUTION_COUNT} further
        portraits and photos are via unsplash and randomuser and need no attribution.
      </p>

      <ul className="mt-6 divide-y divide-white/6 overflow-hidden rounded-2xl bg-card">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold lowercase text-foreground">{c.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {c.creator} · {c.license}
              </p>
            </div>
            {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/85 transition-colors duration-150 hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                source
              </a>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        creative commons licences: cc by / by-sa require credit (given above); we crop and tone
        images, which the by-sa share-alike terms permit. no-derivatives (nd) photography is not
        used. final launch imagery will be original or fully cleared.
      </p>
    </div>
  );
}
