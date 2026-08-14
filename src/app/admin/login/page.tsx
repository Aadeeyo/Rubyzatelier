"use client";

import { useActionState } from "react";
import { Logo } from "@/components/logo";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, {
    error: null,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-5">
      <Logo tagline={false} />
      <p className="mt-2 font-sans text-sm uppercase tracking-[0.3em] text-cocoa">
        Admin
      </p>

      <form action={formAction} className="mt-10 flex w-full max-w-sm flex-col gap-4">
        <input
          required
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-lg border border-cocoa/25 bg-cream px-4 py-3 font-sans text-lg text-espresso outline-none focus:border-terracotta"
        />
        <input
          required
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-lg border border-cocoa/25 bg-cream px-4 py-3 font-sans text-lg text-espresso outline-none focus:border-terracotta"
        />

        {state?.error && (
          <p className="font-sans text-base text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
