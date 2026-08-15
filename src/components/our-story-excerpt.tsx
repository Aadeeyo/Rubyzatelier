import Link from "next/link";

export function OurStoryExcerpt() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8">
      <h2 className="font-display text-3xl text-espresso sm:text-4xl">
        Twenty years of searching inspired one destination.
      </h2>
      <div className="mt-6 space-y-3 font-sans text-lg text-espresso/70">
        <p>For years, finding elegant, celebration-worthy fashion meant leaving home.</p>
        <p>Rubyzatelier exists to change that.</p>
      </div>
      <Link
        href="/about"
        className="mt-8 inline-block font-sans text-lg font-semibold text-terracotta hover:underline"
      >
        Read Our Story →
      </Link>
    </section>
  );
}
