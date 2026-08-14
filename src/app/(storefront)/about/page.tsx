import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Twenty years of searching inspired one destination. The story of why Rubyzatelier exists — based in Ogijo, Ogun State.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <p className="font-sans text-sm uppercase tracking-[0.4em] text-terracotta">
        Our Story
      </p>
      <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
        Bringing elegant fashion closer to home.
      </h1>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-espresso">
          It Started With a Journey
        </h2>
        <div className="mt-4 space-y-3 font-sans text-lg leading-relaxed text-espresso/70">
          <p>For over 20 years, my family has called Ogijo home.</p>
          <p>
            Some of my earliest memories involve traveling in search of
            beautiful clothing.
          </p>
          <p>
            Finding unique, elegant, celebration-worthy fashion often meant
            leaving home.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-espresso">
          From Eko Idumota to Ikorodu
        </h2>
        <div className="mt-4 space-y-3 font-sans text-lg leading-relaxed text-espresso/70">
          <p>Our shopping trips began in Eko Idumota.</p>
          <p>Later, they extended to Ikorodu.</p>
          <p>
            As I got older, shopping increasingly shifted online and outside
            my immediate environment.
          </p>
          <p>Yet one thing remained unchanged.</p>
          <p>Beautiful fashion wasn&apos;t always accessible.</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-espresso">The Realization</h2>
        <div className="mt-4 space-y-3 font-sans text-lg leading-relaxed text-espresso/70">
          <p>The women around me were experiencing the same challenge.</p>
          <p>Friends.</p>
          <p>Colleagues.</p>
          <p>Women building careers.</p>
          <p>Women preparing for church.</p>
          <p>Women attending weddings.</p>
          <p>Women in relationships.</p>
          <p>
            Everyone was investing additional time and money just to find
            clothing that reflected who they were.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-espresso">
          Why Rubyzatelier Exists
        </h2>
        <div className="mt-4 space-y-3 font-sans text-lg leading-relaxed text-espresso/70">
          <p>
            Women outside major fashion hubs deserve affordable elegance
            without sacrificing time and money.
          </p>
          <p>
            Rubyzatelier exists to create clean, functional fashion for
            women moving between work, worship, relationships, and
            celebration.
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-xl bg-cream p-8">
        <h2 className="font-display text-2xl text-espresso">Our Vision</h2>
        <div className="mt-4 space-y-3 font-sans text-lg leading-relaxed text-espresso/70">
          <p>Today, we&apos;re serving women in communities like ours.</p>
          <p>
            Tomorrow, we aspire to become a fast-fashion manufacturing brand
            that makes elegant fashion more accessible across Nigeria.
          </p>
        </div>
      </section>
    </div>
  );
}
