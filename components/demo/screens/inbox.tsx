"use client";

import { useEffect } from "react";
import { SEED_THREADS, personaById } from "@/lib/demo/world";
import { cn } from "@/lib/utils";
import { useDemoRouter } from "../demo-router";
import { useWorld } from "../world-store";
import { GroupedList, InitialsAvatar } from "../primitives";
import { BackIcon } from "../icons";

export function InboxScreen({ threadId }: { threadId?: string }) {
  const { identity, state, dispatch } = useWorld();
  const { go, back } = useDemoRouter();

  const personaId = identity?.kind === "persona" ? identity.persona.id : null;
  const threads = personaId
    ? SEED_THREADS.filter((t) => t.betweenPersonaIds.includes(personaId))
    : [];

  const openThread = threadId ? threads.find((t) => t.id === threadId) : undefined;

  useEffect(() => {
    if (openThread && !state.readThreads.includes(openThread.id)) {
      dispatch({ type: "read-thread", threadId: openThread.id });
    }
  }, [openThread, state.readThreads, dispatch]);

  if (openThread && personaId) {
    const otherId = openThread.betweenPersonaIds.find((id) => id !== personaId)!;
    const other = personaById(otherId);
    return (
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={back}
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BackIcon className="size-4" />
          inbox
        </button>
        <div className="flex items-center gap-3">
          {other && (
            <InitialsAvatar
              name={other.name}
              hue={other.avatarHue}
              image={other.avatarImage}
              className="size-9"
            />
          )}
          <div>
            <h1 className="text-base font-bold text-foreground">{other?.name}</h1>
            <p className="text-xs text-muted-foreground">{openThread.subject}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {openThread.messages.map((message, i) => {
            const mine = message.fromPersonaId === personaId;
            return (
              <div key={i} className={cn("flex", mine && "justify-end")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                    mine
                      ? "rounded-br-md bg-[var(--demo-accent)]/22 text-foreground"
                      : "rounded-bl-md bg-card text-foreground/90",
                  )}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            placeholder="write a message…"
            className="h-11 flex-1 rounded-xl border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            send
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        inbox
      </h1>
      {threads.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          no conversations yet — message a host from any event page.
        </p>
      ) : (
        <GroupedList className="mt-6">
          {threads.map((thread) => {
            const otherId = thread.betweenPersonaIds.find((id) => id !== personaId)!;
            const other = personaById(otherId);
            const last = thread.messages[thread.messages.length - 1];
            const unread = !state.readThreads.includes(thread.id);
            return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => go({ name: "inbox", threadId: thread.id })}
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-white/4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  {other && (
                    <InitialsAvatar
                      name={other.name}
                      hue={other.avatarHue}
                      image={other.avatarImage}
                      className="size-10"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm text-foreground", unread ? "font-bold" : "font-semibold")}>
                        {other?.name}
                      </span>
                      {unread && (
                        <span aria-label="unread" className="size-2 shrink-0 rounded-full bg-[var(--demo-accent)]" />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {last.text}
                    </span>
                  </span>
                </button>
            );
          })}
        </GroupedList>
      )}
    </div>
  );
}
