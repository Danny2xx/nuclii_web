"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EVENTS_COOKIE, expectedToken } from "./gate";

export type UnlockState = { error?: string };

export async function unlockEvents(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = process.env.EVENTS_PASSWORD;
  if (!password) {
    return { error: "events access isn't set up yet — check back soon." };
  }

  const input = String(formData.get("password") ?? "").trim();
  if (!input || input !== password) {
    return { error: "that password didn't work." };
  }

  const token = expectedToken();
  if (token) {
    (await cookies()).set(EVENTS_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/events",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  redirect("/events");
}
