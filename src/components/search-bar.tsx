"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 180, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-full border border-cocoa/25 bg-ivory px-4 py-1.5 font-sans text-base text-espresso outline-none focus:border-terracotta"
            />
          </motion.form>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close search" : "Search"}
        className="ml-2 flex items-center text-espresso transition-colors hover:text-terracotta"
      >
        {open ? <X size={20} /> : <Search size={20} />}
      </button>
    </div>
  );
}
