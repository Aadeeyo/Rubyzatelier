import { getPublishedTestimonials } from "@/lib/testimonials";

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials(6);

  if (testimonials.length === 0) {
    return (
      <section className="bg-sand/30 py-20">
        <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl text-espresso sm:text-4xl">
            Loved by women like you.
          </h2>
          <p className="mt-6 text-2xl tracking-widest text-terracotta">★★★★★</p>
          <p className="mt-4 font-sans text-lg text-espresso/70">
            Customer stories are coming soon.
          </p>
          <p className="mt-1 font-sans text-lg text-espresso/70">
            Become one of the first women to experience Rubyzatelier.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-sand/30 py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <h2 className="text-center font-display text-3xl text-espresso sm:text-4xl">
          Loved by women like you.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-2xl border border-cocoa/15 bg-cream p-8 text-center"
            >
              {t.rating && (
                <p className="text-lg tracking-widest text-terracotta">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </p>
              )}
              <blockquote className="mt-4 flex-1 font-sans text-lg text-espresso/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex flex-col items-center gap-2">
                {t.photoUrl && (
                  <img
                    src={t.photoUrl}
                    alt={t.customerName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <span className="font-sans text-espresso">{t.customerName}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
