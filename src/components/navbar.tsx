"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { useCartStore, cartCount } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/shop/women", label: "Women" },
  { href: "/shop/kids", label: "Kids" },
  { href: "/shop", label: "All Pieces" },
  { href: "/about", label: "Our Story" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const count = cartCount(lines);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <button
          className="text-chrome-light sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo className="sm:items-start" />

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-lg tracking-wide text-sand/80 transition-colors hover:text-coral"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center text-chrome-light transition-colors hover:text-coral"
          aria-label="Cart"
        >
          <ShoppingBag size={22} />
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[0.65rem] font-semibold text-sand"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 sm:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 font-sans text-lg text-sand/80 hover:text-coral"
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
