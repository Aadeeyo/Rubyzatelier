const VALUES = [
  { name: "Affordability", meaning: "Beautiful fashion should be accessible." },
  { name: "Femininity", meaning: "Fashion should celebrate womanhood." },
  { name: "Self-expression", meaning: "Style should reflect who you are." },
];

export function BrandValues() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
      <h2 className="text-center font-display text-3xl text-espresso sm:text-4xl">
        What we believe.
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {VALUES.map((value) => (
          <div key={value.name} className="rounded-xl bg-cream p-8 text-center">
            <h3 className="font-display text-xl text-terracotta">{value.name}</h3>
            <p className="mt-3 font-sans text-base text-espresso/70">{value.meaning}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
