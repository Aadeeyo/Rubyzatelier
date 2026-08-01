import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Rubyzatelier is based in Ogijo, Ogun State, dressing women and kids across Ogijo, Itaoluwo, Lukosi and beyond.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-sans text-sm uppercase tracking-[0.4em] text-coral">
        Our Story
      </p>
      <h1 className="mt-3 font-display text-4xl text-sand sm:text-5xl">
        Má rìn hò hò
      </h1>
      <p className="mt-6 font-sans text-xl leading-relaxed text-sand/70">
        Rubyzatelier curates tops, dresses and jeans for women and kids —
        wardrobe staples and standout pieces sourced from the styles our
        customers love, alongside our own hand-dyed Adire finds for anyone
        after something no one else is wearing.
      </p>
      <p className="mt-4 font-sans text-xl leading-relaxed text-sand/70">
        We dress women and their little ones in pieces built to be worn
        loudly, comfortably, and proudly. We help you keep your wardrobe
        properly curated based on your preference — Má rìn hò hò.
      </p>
      <p className="mt-4 font-sans text-xl leading-relaxed text-sand/70">
        Based in Ogijo, Ogun State, we&apos;re proud to dress customers across
        Ogijo, Itaoluwo, Lukosi and beyond.
      </p>
    </div>
  );
}
