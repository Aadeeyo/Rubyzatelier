"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/newsletter";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await subscribeToNewsletter({ email });
      if (result.ok) {
        toast.success("You're on the list — welcome to Rubyzatelier.");
        setEmail("");
      } else {
        toast.error(result.error ?? "Could not subscribe.");
      }
    });
  };

  return (
    <section className="bg-charcoal py-20">
      <div className="mx-auto w-full max-w-xl px-5 text-center sm:px-8">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">Stay close.</h2>
        <p className="mt-3 font-sans text-lg text-cream/70">
          Be the first to discover new collections, styling inspiration, and
          exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-full border border-cream/25 bg-transparent px-5 py-3 font-sans text-cream placeholder:text-cream/40 focus:border-terracotta focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105 disabled:opacity-60"
          >
            {isPending ? "Joining…" : "Join the Community"}
          </button>
        </form>
      </div>
    </section>
  );
}
