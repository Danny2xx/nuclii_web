"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  PERSONAS,
  SEED_EVENTS,
  SEED_REQUESTS,
  personaById,
} from "@/lib/demo/world";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import type {
  BookingRequest,
  BookingRequestStatus,
  DemoEvent,
  DemoRole,
} from "@/lib/demo/types";

const STORAGE_KEY = "nuclii-demo-world-v1";

/**
 * Everything mutable in the sandbox. Seed data stays in lib/demo; this state
 * holds only the deltas a session creates, so "reset demo" is trivial and the
 * localStorage payload stays small.
 */
export type WorldState = {
  activePersonaId: string | null;
  /** local account created through the sign-up flow, if any */
  guest: { name: string; area: string; role: DemoRole; interests: string[] } | null;
  createdEvents: DemoEvent[];
  createdRequests: BookingRequest[];
  /** status changes applied to seeded requests */
  requestStatus: Record<string, BookingRequestStatus>;
  /** personaId -> eventIds they rsvp'd to during the session */
  rsvps: Record<string, string[]>;
  saved: Record<string, string[]>;
  /** personaId -> extra hats added via "become a host" etc. */
  addedHats: Record<string, DemoRole[]>;
  /** personaId -> upgraded plan tier id */
  planOverrides: Record<string, string>;
  readThreads: string[];
};

const INITIAL: WorldState = {
  activePersonaId: null,
  guest: null,
  createdEvents: [],
  createdRequests: [],
  requestStatus: {},
  // sofia arrives with a lived-in life: things she's going to and has saved
  rsvps: { sofia: ["rooftop-listening", "film-club-outdoor"], maya: ["jazz-in-the-crypt"] },
  saved: { sofia: ["ceramics-beginners", "block-party", "long-table-lunch"] },
  addedHats: {},
  planOverrides: {},
  readThreads: [],
};

export type Identity =
  | { kind: "persona"; persona: NonNullable<ReturnType<typeof personaById>> }
  | { kind: "guest"; guest: NonNullable<WorldState["guest"]> };

type Action =
  | { type: "hydrate"; state: WorldState }
  | { type: "sign-in"; personaId: string }
  | { type: "sign-up"; guest: NonNullable<WorldState["guest"]> }
  | { type: "sign-out" }
  | { type: "rsvp"; eventId: string }
  | { type: "un-rsvp"; eventId: string }
  | { type: "toggle-save"; eventId: string }
  | { type: "create-event"; event: DemoEvent; requests: BookingRequest[] }
  | { type: "set-request-status"; requestId: string; status: BookingRequestStatus }
  | { type: "add-hat"; personaId: string; role: DemoRole }
  | { type: "set-plan"; personaId: string; tierId: string }
  | { type: "read-thread"; threadId: string }
  | { type: "reset" };

const GUEST_ID = "you";

function activeId(state: WorldState) {
  return state.activePersonaId ?? GUEST_ID;
}

function reducer(state: WorldState, action: Action): WorldState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "sign-in":
      return { ...state, activePersonaId: action.personaId };
    case "sign-up":
      return { ...state, guest: action.guest, activePersonaId: GUEST_ID };
    case "sign-out":
      return { ...state, activePersonaId: null };
    case "rsvp": {
      const id = activeId(state);
      const mine = state.rsvps[id] ?? [];
      if (mine.includes(action.eventId)) return state;
      return { ...state, rsvps: { ...state.rsvps, [id]: [...mine, action.eventId] } };
    }
    case "un-rsvp": {
      const id = activeId(state);
      const mine = state.rsvps[id] ?? [];
      return {
        ...state,
        rsvps: { ...state.rsvps, [id]: mine.filter((e) => e !== action.eventId) },
      };
    }
    case "toggle-save": {
      const id = activeId(state);
      const mine = state.saved[id] ?? [];
      const next = mine.includes(action.eventId)
        ? mine.filter((e) => e !== action.eventId)
        : [...mine, action.eventId];
      return { ...state, saved: { ...state.saved, [id]: next } };
    }
    case "create-event":
      return {
        ...state,
        createdEvents: [action.event, ...state.createdEvents],
        createdRequests: [...state.createdRequests, ...action.requests],
      };
    case "set-request-status":
      return {
        ...state,
        requestStatus: { ...state.requestStatus, [action.requestId]: action.status },
        createdRequests: state.createdRequests.map((r) =>
          r.id === action.requestId ? { ...r, status: action.status } : r,
        ),
      };
    case "add-hat": {
      const existing = state.addedHats[action.personaId] ?? [];
      if (existing.includes(action.role)) return state;
      return {
        ...state,
        addedHats: { ...state.addedHats, [action.personaId]: [...existing, action.role] },
      };
    }
    case "set-plan":
      return {
        ...state,
        planOverrides: { ...state.planOverrides, [action.personaId]: action.tierId },
      };
    case "read-thread":
      return state.readThreads.includes(action.threadId)
        ? state
        : { ...state, readThreads: [...state.readThreads, action.threadId] };
    case "reset":
      return INITIAL;
  }
}

type WorldApi = {
  state: WorldState;
  ready: boolean;
  dispatch: (action: Action) => void;
  /** seed + session-created events, with live `going` counts applied */
  allEvents: DemoEvent[];
  eventById: (id: string) => DemoEvent | undefined;
  /** seeded + created requests with session status overrides applied */
  allRequests: BookingRequest[];
  requestsFor: (targetId: string) => BookingRequest[];
  /** eventIds the active identity is going to */
  myRsvps: string[];
  mySaved: string[];
  activePersona: (typeof PERSONAS)[number] | null;
  /** null = signed out; guest identities come from the sign-up flow */
  identity: Identity | null;
  /** hats for the active identity, including session-added ones */
  hatsOf: (personaId: string) => DemoRole[];
};

const WorldContext = createContext<WorldApi | null>(null);

export function WorldProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, INITIAL);
  const [ready, markReady] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) rawDispatch({ type: "hydrate", state: { ...INITIAL, ...JSON.parse(stored) } });
    } catch {
      // corrupt storage — start fresh
    }
    markReady();
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/unavailable — sandbox still works for the session
    }
  }, [state, ready]);

  const dispatch = useCallback((action: Action) => {
    rawDispatch(action);
    switch (action.type) {
      case "sign-in":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoPersonaSelected, { persona: action.personaId });
        break;
      case "sign-up":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoSignupCompleted, { role: action.guest.role });
        break;
      case "create-event":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoEventCreated, {
          category: action.event.category,
          requests_sent: action.requests.length,
        });
        break;
      case "rsvp":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoRsvped, { event_id: action.eventId });
        break;
      case "set-request-status":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoRequestAnswered, { status: action.status });
        break;
      case "set-plan":
        captureAnalyticsEvent(ANALYTICS_EVENTS.demoPlanUpgraded, { tier: action.tierId });
        break;
    }
  }, []);

  const api = useMemo<WorldApi>(() => {
    const sessionRsvpCount = (eventId: string) =>
      Object.values(state.rsvps).filter((ids) => ids.includes(eventId)).length;

    const withLiveCounts = (e: DemoEvent): DemoEvent => ({
      ...e,
      going: e.going + sessionRsvpCount(e.id),
    });

    const allEvents = [...state.createdEvents, ...SEED_EVENTS].map(withLiveCounts);

    const allRequests: BookingRequest[] = [
      ...state.createdRequests,
      ...SEED_REQUESTS.map((r) =>
        state.requestStatus[r.id] ? { ...r, status: state.requestStatus[r.id] } : r,
      ),
    ];

    const id = activeId(state);
    const activePersona =
      state.activePersonaId && state.activePersonaId !== GUEST_ID
        ? (personaById(state.activePersonaId) ?? null)
        : null;

    const identity: Identity | null = activePersona
      ? { kind: "persona", persona: activePersona }
      : state.activePersonaId === GUEST_ID && state.guest
        ? { kind: "guest", guest: state.guest }
        : null;

    return {
      state,
      ready,
      dispatch,
      allEvents,
      eventById: (eid) => allEvents.find((e) => e.id === eid),
      allRequests,
      requestsFor: (targetId) => allRequests.filter((r) => r.targetId === targetId),
      myRsvps: state.rsvps[id] ?? [],
      mySaved: state.saved[id] ?? [],
      activePersona,
      identity,
      hatsOf: (personaId) => {
        const base = personaById(personaId)?.hats ?? [];
        return [...base, ...(state.addedHats[personaId] ?? [])];
      },
    };
  }, [state, ready, dispatch]);

  return <WorldContext.Provider value={api}>{children}</WorldContext.Provider>;
}

export function useWorld(): WorldApi {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used inside <WorldProvider>");
  return ctx;
}
