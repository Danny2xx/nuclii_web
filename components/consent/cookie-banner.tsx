"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  COOKIE_CONSENT_EVENT,
  type CookieConsent,
  getStoredConsent,
  setConsent,
} from "@/lib/cookie-consent";

function CookieBanner() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getStoredConsent() === null);

    // Let the page settle before the banner eases in.
    const timer = window.setTimeout(sync, 700);
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
    };
  }, []);

  function choose(consent: CookieConsent) {
    setConsent(consent);
    setVisible(false);
  }

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 16 };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={shown}
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[35] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-start sm:px-6 sm:pb-6"
          exit={hidden}
          initial={hidden}
          role="region"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-md border border-white/15 bg-[#101114]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <p className="text-sm leading-6 text-white/75">
              we use cookies to understand how nuclii is used and make it
              better. essentials keep the site running; analytics are optional.{" "}
              <a
                className="font-semibold text-white underline-offset-4 hover:underline"
                href="/cookies"
              >
                cookie policy
              </a>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1 lowercase"
                onClick={() => choose("accepted")}
              >
                accept
              </Button>
              <Button
                className="flex-1 lowercase"
                onClick={() => choose("rejected")}
                variant="outline"
              >
                essentials only
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { CookieBanner };
