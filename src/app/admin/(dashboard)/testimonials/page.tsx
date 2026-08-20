import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-espresso">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-full bg-terracotta px-6 py-2 font-sans text-lg text-ivory hover:scale-105"
        >
          + New testimonial
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Quote</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="text-espresso hover:text-terracotta"
                  >
                    {t.customerName}
                  </Link>
                </td>
                <td className="max-w-xs truncate px-5 py-3 text-espresso/70">{t.quote}</td>
                <td className="px-5 py-3 text-espresso/70">{t.rating ? `${t.rating}★` : "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      t.status === "PUBLISHED"
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                        : "rounded-full bg-cocoa/10 px-3 py-1 text-xs text-espresso/60"
                    }
                  >
                    {t.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testimonials.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
