import { cookies } from "next/headers";
import { createHash } from "node:crypto";

// Server-only helpers for the /events password gate. The password lives in the
// EVENTS_PASSWORD env var; the cookie stores a hash of it (not the password),
// so it can't be read from the client and can't be forged without the password.

export const EVENTS_COOKIE = "events_access";

export function expectedToken(): string | null {
  const password = process.env.EVENTS_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`nuclii-events:${password}`).digest("hex");
}

export async function isEventsUnlocked(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const current = (await cookies()).get(EVENTS_COOKIE)?.value;
  return current === token;
}
