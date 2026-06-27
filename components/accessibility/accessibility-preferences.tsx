"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// Custom display/contrast mark — a recognizable yet distinct a11y trigger.
function A11yIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

type MotionPreference = "full" | "reduced" | "off";
type TextPreference = "default" | "large" | "xl";

type AccessibilityPreferences = {
  motion: MotionPreference;
  text: TextPreference;
  contrast: boolean;
  mediaPaused: boolean;
  underlineLinks: boolean;
  enhancedFocus: boolean;
};

type AccessibilityPreferencesControlProps = {
  placement?: "desktop" | "mobile";
};

const STORAGE_KEY = "nuclii-accessibility-preferences";
const CHANGE_EVENT = "nuclii-accessibility-preferences-change";

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  motion: "full",
  text: "default",
  contrast: false,
  mediaPaused: false,
  underlineLinks: false,
  enhancedFocus: false,
};

const motionOptions: { label: string; value: MotionPreference }[] = [
  { label: "Full", value: "full" },
  { label: "Reduced", value: "reduced" },
  { label: "Off", value: "off" },
];

const textOptions: { label: string; value: TextPreference }[] = [
  { label: "Default", value: "default" },
  { label: "Large", value: "large" },
  { label: "XL", value: "xl" },
];

function readPreferences() {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(stored) as Partial<AccessibilityPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      motion: isMotionPreference(parsed.motion) ? parsed.motion : DEFAULT_PREFERENCES.motion,
      text: isTextPreference(parsed.text) ? parsed.text : DEFAULT_PREFERENCES.text,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function isMotionPreference(value: unknown): value is MotionPreference {
  return value === "full" || value === "reduced" || value === "off";
}

function isTextPreference(value: unknown): value is TextPreference {
  return value === "default" || value === "large" || value === "xl";
}

function applyPreferences(preferences: AccessibilityPreferences) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.a11yMotion = preferences.motion;
  root.dataset.a11yText = preferences.text;
  root.dataset.a11yContrast = preferences.contrast ? "high" : "default";
  root.dataset.a11yMedia = preferences.mediaPaused ? "paused" : "active";
  root.dataset.a11yLinks = preferences.underlineLinks ? "underlined" : "default";
  root.dataset.a11yFocus = preferences.enhancedFocus ? "enhanced" : "default";

  document.querySelectorAll("video").forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;

    if (preferences.mediaPaused || preferences.motion === "off") {
      video.pause();
      video.dataset.a11yPaused = "true";
      return;
    }

    delete video.dataset.a11yPaused;
  });
}

function savePreferences(preferences: AccessibilityPreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: preferences }));
}

function AccessibilityPreferencesControl({
  placement = "desktop",
}: AccessibilityPreferencesControlProps) {
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const mobile = placement === "mobile";

  useEffect(() => {
    const id = window.setTimeout(() => {
      const nextPreferences = readPreferences();
      setPreferences(nextPreferences);
      applyPreferences(nextPreferences);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const syncPreferences = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      const nextPreferences = detail ?? readPreferences();
      setPreferences(nextPreferences);
      applyPreferences(nextPreferences);
    };

    const syncStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncPreferences(event);
    };

    window.addEventListener(CHANGE_EVENT, syncPreferences);
    window.addEventListener("storage", syncStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, syncPreferences);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  useEffect(() => {
    if (!open || mobile) return;

    const handlePointer = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobile, open]);

  const activeCount = useMemo(
    () =>
      [
        preferences.motion !== "full",
        preferences.text !== "default",
        preferences.contrast,
        preferences.mediaPaused,
        preferences.underlineLinks,
        preferences.enhancedFocus,
      ].filter(Boolean).length,
    [preferences],
  );

  const updatePreferences = (next: Partial<AccessibilityPreferences>) => {
    const nextPreferences = { ...preferences, ...next };
    setPreferences(nextPreferences);
    applyPreferences(nextPreferences);
    savePreferences(nextPreferences);
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    applyPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  };

  if (mobile) {
    return (
      <section className="mt-6 border-t border-black/12 pt-5" aria-labelledby={`${panelId}-mobile-title`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold lowercase text-black" id={`${panelId}-mobile-title`}>
              accessibility
            </h2>
            <p className="mt-1 text-xs font-medium lowercase leading-5 text-black/55">
              adjust motion, text, contrast and focus.
            </p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-black/15 text-black">
            <A11yIcon className="size-5" />
          </span>
        </div>
        <PreferencesPanel
          activeCount={activeCount}
          compact
          onReset={resetPreferences}
          onUpdate={updatePreferences}
          preferences={preferences}
        />
      </section>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label="Open accessibility preferences"
        className={cn(
          "relative inline-grid size-10 place-items-center rounded-xl border border-white/25 text-white/70 mix-blend-difference transition hover:border-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "border-white text-white",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <A11yIcon className="size-5" />
        {activeCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-white text-[10px] font-bold text-black"
          >
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            aria-label="Accessibility preferences"
            aria-modal="false"
            className="absolute right-0 top-[calc(100%+0.7rem)] z-[90] w-[min(18rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-white/12 bg-[#101012]/95 p-3.5 text-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            exit={{ opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.12 } }}
            id={panelId}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            role="dialog"
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-extrabold lowercase">accessibility</h2>
                <p className="mt-0.5 text-[11px] leading-4 text-white/55">
                  how the site moves, reads and responds.
                </p>
              </div>
              <button
                aria-label="Close accessibility preferences"
                className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <PreferencesPanel
              activeCount={activeCount}
              onReset={resetPreferences}
              onUpdate={updatePreferences}
              preferences={preferences}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PreferencesPanel({
  activeCount,
  compact = false,
  onReset,
  onUpdate,
  preferences,
}: {
  activeCount: number;
  compact?: boolean;
  onReset: () => void;
  onUpdate: (next: Partial<AccessibilityPreferences>) => void;
  preferences: AccessibilityPreferences;
}) {
  return (
    <div className={cn("space-y-3", compact ? "text-black" : "text-white")}>
      <PreferenceGroup label="motion">
        <SegmentedControl
          contrast={compact ? "light" : "dark"}
          onChange={(value) => onUpdate({ motion: value as MotionPreference })}
          options={motionOptions}
          value={preferences.motion}
        />
      </PreferenceGroup>

      <PreferenceGroup label="text size">
        <SegmentedControl
          contrast={compact ? "light" : "dark"}
          onChange={(value) => onUpdate({ text: value as TextPreference })}
          options={textOptions}
          value={preferences.text}
        />
      </PreferenceGroup>

      <div className="grid">
        <ToggleRow
          checked={preferences.contrast}
          contrast={compact ? "light" : "dark"}
          label="high contrast"
          onChange={(checked) => onUpdate({ contrast: checked })}
        />
        <ToggleRow
          checked={preferences.mediaPaused}
          contrast={compact ? "light" : "dark"}
          label="pause background media"
          onChange={(checked) => onUpdate({ mediaPaused: checked })}
        />
        <ToggleRow
          checked={preferences.underlineLinks}
          contrast={compact ? "light" : "dark"}
          label="underline links"
          onChange={(checked) => onUpdate({ underlineLinks: checked })}
        />
        <ToggleRow
          checked={preferences.enhancedFocus}
          contrast={compact ? "light" : "dark"}
          label="enhanced keyboard focus"
          onChange={(checked) => onUpdate({ enhancedFocus: checked })}
        />
      </div>

      <button
        className={cn(
          "mt-1 min-h-8 w-full rounded-lg border px-3 text-xs font-semibold lowercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
          compact
            ? "border-black/14 text-black/65 hover:border-black/35 hover:text-black"
            : "border-white/14 text-white/60 hover:border-white/35 hover:text-white",
        )}
        disabled={activeCount === 0}
        onClick={onReset}
        type="button"
      >
        reset
      </button>
    </div>
  );
}

function PreferenceGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[13px] font-bold lowercase opacity-70">{label}</p>
      {children}
    </div>
  );
}

function SegmentedControl({
  contrast,
  onChange,
  options,
  value,
}: {
  contrast: "dark" | "light";
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  const groupId = useId();

  return (
    <div
      className={cn(
        "grid grid-cols-3 rounded-lg border p-0.5",
        contrast === "light" ? "border-black/14 bg-black/[0.03]" : "border-white/14 bg-white/[0.04]",
      )}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            aria-pressed={active}
            className={cn(
              "relative min-h-7 rounded-[7px] px-2 text-[11px] font-bold lowercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              contrast === "light"
                ? active
                  ? "text-white"
                  : "text-black/58 hover:text-black"
                : active
                  ? "text-black"
                  : "text-white/58 hover:text-white",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {active && (
              <motion.span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-[7px]",
                  contrast === "light" ? "bg-black" : "bg-white",
                )}
                layoutId={`${groupId}-segmented-active`}
                transition={{ type: "spring", stiffness: 480, damping: 34 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({
  checked,
  contrast,
  label,
  onChange,
}: {
  checked: boolean;
  contrast: "dark" | "light";
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-9 cursor-pointer items-center justify-between gap-4 rounded-lg px-1.5 text-[13px] font-semibold lowercase transition",
        contrast === "light" ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white",
      )}
    >
      <span>{label}</span>
      <input
        checked={checked}
        className="sr-only"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition",
          contrast === "light" ? "border-black/20 bg-black/10" : "border-white/20 bg-black/40",
          checked && (contrast === "light" ? "bg-black" : "bg-white"),
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-3.5 rounded-full bg-white transition",
            checked && "translate-x-4",
            checked && contrast === "dark" && "bg-black",
          )}
        />
      </span>
    </label>
  );
}

export { AccessibilityPreferencesControl };
