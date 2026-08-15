"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-charcoal px-5 pt-10 text-center">
      <div className="pointer-events-none absolute inset-0 bg-deep-espresso/60">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-terracotta/25 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cocoa/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl"
      >
        Bringing elegant fashion closer to home.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative mt-6 max-w-xl font-sans text-lg text-cream/70"
      >
        Elegant, affordable fashion curated for work, worship, relationships,
        and every moment that matters.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="relative mt-3 font-sans text-lg font-semibold text-cream sm:text-xl"
      >
        Fashion that fits your life&apos;s moments.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Link
          href="/shop"
          className="rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105"
        >
          Explore the Collections
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-cream/40 px-8 py-3 font-sans text-lg text-cream transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Read Our Story
        </Link>
      </motion.div>
    </section>
  );
}
