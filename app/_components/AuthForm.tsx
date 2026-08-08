"use client";

import { useActionState } from "react";
import { signIn, signUp } from "../_actions/auth";

export function AuthForm({ mode, next }: { mode: "signin" | "signup"; next?: string }) {
  const action = mode === "signup" ? signUp : signIn;
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {mode === "signup" && (
        <div>
          <label className="label mb-1.5 block" htmlFor="displayName">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            minLength={2}
            autoComplete="nickname"
            className="input"
            placeholder="How you'll show up"
          />
        </div>
      )}

      <div>
        <label className="label mb-1.5 block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="label mb-1.5 block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="input"
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
        />
      </div>

      {state?.error && (
        <p
          className="border border-accent-dim bg-surface px-3 py-2 text-sm"
          style={{ color: "var(--color-accent)" }}
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-accent mt-1 py-3" disabled={pending}>
        {pending ? "…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
