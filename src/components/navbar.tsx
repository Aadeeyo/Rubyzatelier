"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { useCartStore, cartCount } from "@/lib/cart-store";

const EDIT_LINKS = [
  { href: "/shop/office-edit", label: "Office Edit" },
  { href: "/shop/sunday-edit", label: "Sunday Edit" },
  { href: "/shop/date-edit", label: "Date Edit" },
  { href: "/shop/celebration-edit", label: "Celebration Edit" },
];

const INFO_LINKS = [
  { href: "/our-story", label: "Our Story" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const NAV_LINKS = [...EDIT_LINKS, ...INFO_LINKS];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const count = cartCount(lines);

  return (
    <header className="sticky top-0 z-30 border-b border-cocoa/15 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <button
          className="text-espresso sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo className="sm:items-start" tagline={false} />

        <nav className="ml-3 hidden items-center gap-6 sm:flex lg:gap-8">
          {EDIT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-lg tracking-wide text-espresso/75 transition-colors hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-5 w-px bg-cocoa/25" aria-hidden="true" />
          {INFO_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-lg tracking-wide text-espresso/75 transition-colors hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <SearchBar />
          <Link
            href="/cart"
            className="relative flex items-center text-espresso transition-colors hover:text-terracotta"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[0.65rem] font-semibold text-ivory"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cocoa/15 sm:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="py-2 font-sans text-lg text-espresso/80 hover:text-terracotta"
              >
                Search
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 font-sans text-lg text-espresso/80 hover:text-terracotta"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
