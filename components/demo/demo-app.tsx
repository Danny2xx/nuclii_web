"use client";

import { useEffect } from "react";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { AppShell, useActiveHat } from "./app-shell";
import { DemoRouterProvider, useDemoRouter } from "./demo-router";
import { SignInScreen } from "./sign-in";
import { WorldProvider, useWorld } from "./world-store";
import { AttendeeHome, BrowseScreen, CategoryScreen, LibraryScreen } from "./screens/attendee";
import { EventDetailScreen } from "./screens/event-detail";
import { TicketScreen } from "./screens/ticket";
import { CreateEventFlow, HostDashboard } from "./screens/host";
import { InboxScreen } from "./screens/inbox";
import { SettingsScreen } from "./screens/settings";
import { TalentHome, VenueHome } from "./screens/supply";

function ScreenRenderer() {
  const { screen, go } = useDemoRouter();
  const { identity, dispatch } = useWorld();
  const { hats, activeHat, setActiveHat } = useActiveHat();

  const becomeHost = () => {
    if (identity?.kind === "persona") {
      dispatch({ type: "add-hat", personaId: identity.persona.id, role: "host" });
      setActiveHat("host");
      go({ name: "home" });
    }
  };

  let body: React.ReactNode;
  switch (screen.name) {
    case "home":
      body =
        activeHat === "explorer" ? (
          <AttendeeHome />
        ) : activeHat === "host" ? (
          <HostDashboard />
        ) : activeHat === "venue" ? (
          <VenueHome />
        ) : (
          <TalentHome />
        );
      break;
    case "browse":
      body = <BrowseScreen />;
      break;
    case "browse-category":
      body = <CategoryScreen category={screen.category} />;
      break;
    case "event":
      body = <EventDetailScreen id={screen.id} />;
      break;
    case "ticket":
      body = <TicketScreen id={screen.id} />;
      break;
    case "library":
      body = <LibraryScreen />;
      break;
    case "create":
      body = <CreateEventFlow />;
      break;
    case "inbox":
      body = <InboxScreen threadId={screen.threadId} />;
      break;
    case "settings":
    case "plans":
      body = <SettingsScreen activeHat={activeHat} onBecomeHost={becomeHost} />;
      break;
  }

  const screenKey =
    screen.name === "home"
      ? `home-${activeHat}`
      : screen.name === "event"
        ? `event-${screen.id}`
        : screen.name;

  return (
    <AppShell activeHat={activeHat} hats={hats} setActiveHat={setActiveHat}>
      <div key={screenKey} className="demo-screen-in">
        {body}
      </div>
    </AppShell>
  );
}

function Gate() {
  const { ready, identity } = useWorld();

  useEffect(() => {
    captureAnalyticsEvent(ANALYTICS_EVENTS.demoEntered, {});
  }, []);

  if (!ready) {
    // brief skeleton while localStorage hydrates — avoids SSR/client mismatch
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="sr-only">loading the sandbox</span>
        <span aria-hidden="true" className="size-2.5 animate-pulse rounded-full bg-foreground/40" />
      </div>
    );
  }

  if (!identity) return <SignInScreen />;
  return <ScreenRenderer />;
}

export function DemoApp() {
  return (
    <WorldProvider>
      <DemoRouterProvider>
        <div data-analytics-section="demo_app">
          <Gate />
        </div>
      </DemoRouterProvider>
    </WorldProvider>
  );
}
