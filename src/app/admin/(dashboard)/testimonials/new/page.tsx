import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">New Testimonial</h1>
      <div className="mt-8 max-w-4xl">
        <TestimonialForm mode="create" />
      </div>
    </div>
  );
}
