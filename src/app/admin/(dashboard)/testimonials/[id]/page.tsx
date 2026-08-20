import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">{testimonial.customerName}</h1>
      <div className="mt-8 max-w-4xl">
        <TestimonialForm
          mode="edit"
          testimonialId={testimonial.id}
          initial={{
            customerName: testimonial.customerName,
            quote: testimonial.quote,
            rating: testimonial.rating,
            photoUrl: testimonial.photoUrl ?? "",
            status: testimonial.status,
          }}
        />
      </div>
    </div>
  );
}
