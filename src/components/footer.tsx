import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex flex-col gap-3">
          <Logo className="items-start" />
          <p className="max-w-xs font-sans text-base text-sand/60">
            Tops, dresses and jeans for women and kids.
          </p>
        </div>

        <div className="flex flex-wrap gap-10 sm:gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-chrome">
              Shop
            </span>
            <Link href="/shop/women" className="text-sand/70 hover:text-coral">
              Women
            </Link>
            <Link href="/shop/kids" className="text-sand/70 hover:text-coral">
              Kids
            </Link>
            <Link href="/shop" className="text-sand/70 hover:text-coral">
              All Pieces
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-chrome">
              Rubyzatelier
            </span>
            <Link href="/about" className="text-sand/70 hover:text-coral">
              Our Story
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-chrome">
              Visit
            </span>
            <span className="text-sand/70">Ogijo, Ogun State</span>
            <a href="tel:09060229398" className="text-sand/70 hover:text-coral">
              09060229398
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-4 text-center font-sans text-sm text-sand/40 sm:px-8">
        © {new Date().getFullYear()} Rubyzatelier. All rights reserved.
      </div>
    </footer>
  );
}
