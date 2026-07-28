"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo/40 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-rust/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative font-sans text-sm uppercase tracking-[0.5em] text-chrome"
      >
        Tops · Dresses · Jeans
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative mt-4 font-script text-gradient-chrome text-7xl leading-none sm:text-8xl md:text-9xl"
      >
        Rubyzatelier
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mt-2 font-sans text-2xl italic text-sand/80 sm:text-3xl"
      >
        Maa rin hoho
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative mt-6 max-w-xl font-sans text-lg text-sand/60"
      >
        Everyday and statement pieces for women and kids, hand-picked for
        style and quality — from wardrobe staples to one-of-a-kind tie-dye
        finds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Link
          href="/shop/women"
          className="rounded-full bg-coral px-8 py-3 font-sans text-lg text-sand transition-transform hover:scale-105"
        >
          Shop Women
        </Link>
        <Link
          href="/shop/kids"
          className="rounded-full border border-chrome/40 px-8 py-3 font-sans text-lg text-sand transition-colors hover:border-coral hover:text-coral"
        >
          Shop Kids
        </Link>
      </motion.div>
    </section>
  );
}
