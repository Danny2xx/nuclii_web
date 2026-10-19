"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// True when the visitor wants less motion: the OS setting, or the site's
// accessibility panel set to reduced/off.
export function useLessMotion() {
  const reduce = useReducedMotion();
  const [panelSaysLess, setPanelSaysLess] = useState(false);

  useEffect(() => {
    const sync = () => setPanelSaysLess((document.documentElement.dataset.a11yMotion ?? "full") !== "full");
    sync();
    window.addEventListener("nuclii-accessibility-preferences-change", sync);
    return () => window.removeEventListener("nuclii-accessibility-preferences-change", sync);
  }, []);

  return Boolean(reduce) || panelSaysLess;
}
