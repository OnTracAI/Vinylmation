"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

export type AuthState = { error: string } | undefined;

/** Only allow relative paths, so `next` can't be used as an open redirect. */
function safeNext(value: unknown) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/collection";
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !email.includes("@")) return { error: "Enter a valid email address" };
  if (displayName.length < 2) return { error: "Pick a display name of at least 2 characters" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const existing = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
  if (existing) return { error: "That email is already registered" };

  const passwordHash = await hashPassword(password);
  const created = db
    .insert(users)
    .values({ email, displayName, passwordHash })
    .returning({ id: users.id })
    .get();

  await createSession(created.id);
  redirect(next);
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const user = db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .get();

  // Same message either way — don't reveal which emails are registered.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Email or password is incorrect" };
  }

  await createSession(user.id);
  redirect(next);
}

export async function signOut() {
  await destroySession();
  redirect("/");
}
