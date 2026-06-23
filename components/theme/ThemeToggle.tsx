"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { useIsClient } from "@/components/motion/use-is-client";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
}

function subscribeToTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("nuclii-theme", callback);
  return () => window.removeEventListener("nuclii-theme", callback);
}

function useTheme(): { theme: Theme; toggle: () => void } {
  const isClient = useIsClient();

  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => getTheme(),
    () => "dark" as Theme,
  );

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("nuclii-theme", next);
    } catch {}
    window.dispatchEvent(new Event("nuclii-theme"));
  }

  return { theme: isClient ? theme : "dark", toggle };
}

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <Button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
      onClick={toggle}
      size="icon"
      type="button"
      variant="ghost"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}

export { ThemeToggle, useTheme };
export type { Theme };
