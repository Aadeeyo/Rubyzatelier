import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-cocoa/15 bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex flex-col gap-3">
          <Logo className="items-start" />
          <p className="max-w-xs font-sans text-base text-espresso/60">
            Affordable, elegant fashion for every moment — office, worship,
            dates, and celebration.
          </p>
        </div>

        <div className="flex flex-wrap gap-10 sm:gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-cocoa">
              Shop
            </span>
            <Link href="/shop/office" className="text-espresso/70 hover:text-terracotta">
              Office Edit
            </Link>
            <Link href="/shop/sunday" className="text-espresso/70 hover:text-terracotta">
              Sunday Edit
            </Link>
            <Link href="/shop/date" className="text-espresso/70 hover:text-terracotta">
              Date Edit
            </Link>
            <Link href="/shop/celebration" className="text-espresso/70 hover:text-terracotta">
              Celebration Edit
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-cocoa">
              Rubyzatelier
            </span>
            <Link href="/about" className="text-espresso/70 hover:text-terracotta">
              Our Story
            </Link>
            <Link href="/journal" className="text-espresso/70 hover:text-terracotta">
              Journal
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-cocoa">
              Support
            </span>
            <Link href="/support" className="text-espresso/70 hover:text-terracotta">
              Support
            </Link>
            <Link href="/contact" className="text-espresso/70 hover:text-terracotta">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm uppercase tracking-[0.2em] text-cocoa">
              Visit
            </span>
            <span className="text-espresso/70">Ogijo, Ogun State</span>
            <a href="tel:09060229398" className="text-espresso/70 hover:text-terracotta">
              09060229398
            </a>
            <span className="mt-1 text-sm text-espresso/50">
              Pickup available in Oriokuta, Ogijo
            </span>
            <span className="text-sm text-espresso/50">
              Delivering to Ogijo, Itaoluwo, Lukosi &amp; beyond
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-cocoa/10 px-5 py-4 text-center font-sans text-sm text-espresso/50 sm:px-8">
        © {new Date().getFullYear()} Rubyzatelier. All rights reserved.
      </div>
    </footer>
  );
}
