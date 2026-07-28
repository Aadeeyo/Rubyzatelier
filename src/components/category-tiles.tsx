"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const TILES = [
  { href: "/shop/women?category=DRESS", label: "Dresses", img: "/products/placeholder-3.svg" },
  { href: "/shop/women?category=TOP", label: "Tops", img: "/products/placeholder-5.svg" },
  { href: "/shop/women?category=JEANS", label: "Jeans", img: "/products/placeholder-7.svg" },
  { href: "/shop/kids", label: "Kids", img: "/products/placeholder-2.svg" },
];

export function CategoryTiles() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.href}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link href={tile.href} className="group relative block overflow-hidden rounded-xl">
              <div className="aspect-[3/4]">
                <img
                  src={tile.img}
                  alt={tile.label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-2xl text-sand">
                {tile.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
