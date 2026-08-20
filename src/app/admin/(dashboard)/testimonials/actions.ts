"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { isSupportedImageType, uploadProductImage } from "@/lib/storage";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadTestimonialPhoto(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided." };
  }
  if (!isSupportedImageType(file.type)) {
    return { ok: false as const, error: "Please upload a JPG, PNG, WEBP, GIF or SVG image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false as const, error: "Image must be under 5MB." };
  }

  try {
    const buffer = await file.arrayBuffer();
    const url = await uploadProductImage(buffer, file.type);
    return { ok: true as const, url };
  } catch (err) {
    console.error("Testimonial photo upload failed:", err);
    return { ok: false as const, error: "Could not upload photo. Please try again." };
  }
}

const testimonialSchema = z.object({
  customerName: z.string().min(2),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).nullable(),
  photoUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export async function createTestimonial(input: TestimonialInput) {
  await requireAdminSession();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid testimonial details.") };
  }
  const data = parsed.data;

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: data.customerName,
        quote: data.quote,
        rating: data.rating,
        photoUrl: data.photoUrl || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/testimonials");
    revalidateStorefront();
    return { ok: true as const, id: testimonial.id };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not create testimonial.") };
  }
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await requireAdminSession();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid testimonial details.") };
  }
  const data = parsed.data;

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        customerName: data.customerName,
        quote: data.quote,
        rating: data.rating,
        photoUrl: data.photoUrl || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath(`/admin/testimonials/${id}`);
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not save changes.") };
  }
}

export async function deleteTestimonial(id: string) {
  await requireAdminSession();
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not delete testimonial.") };
  }
}
