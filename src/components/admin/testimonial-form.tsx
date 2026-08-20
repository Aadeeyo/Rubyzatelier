"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createTestimonial,
  updateTestimonial,
  uploadTestimonialPhoto,
} from "@/app/admin/(dashboard)/testimonials/actions";
import type { TestimonialStatus } from "@/generated/prisma/enums";

export function TestimonialForm({
  mode,
  testimonialId,
  initial,
}: {
  mode: "create" | "edit";
  testimonialId?: string;
  initial?: {
    customerName: string;
    quote: string;
    rating: number | null;
    photoUrl: string;
    status: TestimonialStatus;
  };
}) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState(initial?.customerName ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [rating, setRating] = useState<string>(initial?.rating ? String(initial.rating) : "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [status, setStatus] = useState<TestimonialStatus>(initial?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadTestimonialPhoto(formData);
      if (!result.ok) {
        setUploadError(result.error);
        return;
      }
      setPhotoUrl(result.url);
    } catch {
      setUploadError("Could not upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input = {
      customerName,
      quote,
      rating: rating ? parseInt(rating, 10) : null,
      photoUrl: photoUrl || undefined,
      status,
    };

    try {
      if (mode === "create") {
        const result = await createTestimonial(input);
        if (!result.ok) {
          toast.error(result.error);
          setError(result.error);
          return;
        }
        toast.success(`Testimonial from ${customerName} created`);
        router.push(`/admin/testimonials/${result.id}`);
      } else if (testimonialId) {
        const result = await updateTestimonial(testimonialId, input);
        if (!result.ok) {
          toast.error(result.error);
          setError(result.error);
          return;
        }
        toast.success("Changes saved");
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "rounded-lg border border-cocoa/25 bg-ivory px-4 py-2 text-espresso outline-none focus:border-terracotta";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1 font-sans text-espresso/70">
        Customer name
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 font-sans text-espresso/70">
        Quote
        <textarea
          required
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className={inputClass}
        />
      </label>

      <div>
        <span className="font-sans text-espresso/70">Photo (optional)</span>
        <div className="mt-2 flex items-center gap-4">
          {photoUrl && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-cocoa/25 bg-cream">
              <img src={photoUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-cocoa/25 px-5 py-2 font-sans text-espresso/80 hover:border-terracotta hover:text-terracotta">
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {uploadError && <p className="mt-2 font-sans text-sm text-red-700">{uploadError}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Rating (optional)
          <select value={rating} onChange={(e) => setRating(e.target.value)} className={inputClass}>
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TestimonialStatus)}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      {error && <p className="font-sans text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Saving…" : mode === "create" ? "Create testimonial" : "Save changes"}
      </button>
    </form>
  );
}
