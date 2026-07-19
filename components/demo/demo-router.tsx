"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * In-app navigation is client state, not URLs: the sandbox has one entry door
 * (/demo) and a localStorage world, so internal screens stay off the address
 * bar by design.
 */
export type Screen =
  | { name: "home" }
  | { name: "browse" }
  | { name: "browse-category"; category: string }
  | { name: "event"; id: string }
  | { name: "ticket"; id: string }
  | { name: "library" }
  | { name: "create" }
  | { name: "inbox"; threadId?: string }
  | { name: "settings" }
  | { name: "credits" }
  | { name: "plans"; role?: string };

type RouterApi = {
  screen: Screen;
  go: (screen: Screen) => void;
  back: () => void;
};

const RouterContext = createContext<RouterApi | null>(null);

export function DemoRouterProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: "home" }]);

  const api = useMemo<RouterApi>(
    () => ({
      screen: stack[stack.length - 1],
      go: (screen) =>
        setStack((prev) => {
          // navigating to a root screen resets the stack — matches tab-nav expectations
          const rootNames = ["home", "browse", "library", "inbox", "settings", "create"];
          if (rootNames.includes(screen.name)) return [screen];
          return [...prev, screen];
        }),
      back: () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    }),
    [stack],
  );

  return <RouterContext.Provider value={api}>{children}</RouterContext.Provider>;
}

export function useDemoRouter(): RouterApi {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useDemoRouter must be used inside <DemoRouterProvider>");
  return ctx;
}
