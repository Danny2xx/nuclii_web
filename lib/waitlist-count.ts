// A simple persistent waitlist counter: an optional configured import plus one
// increment per real signup, stored in a KV store (Vercel KV / Upstash Redis
// REST — both speak the same REST API). It defaults to zero so the public count
// never implies traction that has not been recorded.

const configuredBaseCount = Number.parseInt(process.env.WAITLIST_BASE_COUNT ?? "0", 10);
const BASE_COUNT = Number.isFinite(configuredBaseCount) ? configuredBaseCount : 0;
const KEY = "waitlist:signups";

function kvConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function kvCommand(command: string): Promise<number | null> {
  const cfg = kvConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/${command}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    const raw = data.result;
    const value = typeof raw === "string" ? Number.parseInt(raw, 10) : Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/** Total shown to visitors: base seed + real signups so far. */
export async function getWaitlistCount(): Promise<number> {
  const signups = await kvCommand(`get/${KEY}`);
  return BASE_COUNT + (signups ?? 0);
}

/** Add one on a genuinely new signup. Fire-and-forget; never throws. */
export async function incrementWaitlistCount(): Promise<void> {
  await kvCommand(`incr/${KEY}`);
}

export { BASE_COUNT };
