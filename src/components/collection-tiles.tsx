"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTION_COPY, COLLECTIONS_ORDER } from "@/lib/collections";

export function CollectionTiles() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIONS_ORDER.map((collection, i) => {
          const copy = COLLECTION_COPY[collection];
          return (
            <motion.div
              key={collection}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/shop/${copy.slug}`}
                className="group relative block overflow-hidden rounded-xl bg-cream"
              >
                <div className="aspect-[3/4]">
                  <img
                    src={copy.image}
                    alt={copy.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <span className="font-display text-2xl text-ivory">{copy.label}</span>
                  <p className="mt-1 font-sans text-sm text-ivory/80">{copy.description}</p>
                  <span className="mt-2 inline-block font-sans text-sm font-semibold text-ivory underline decoration-terracotta underline-offset-4">
                    Shop the Edit
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
