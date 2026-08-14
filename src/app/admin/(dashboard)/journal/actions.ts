"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { isSupportedImageType, uploadProductImage } from "@/lib/storage";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadJournalImage(formData: FormData) {
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
    console.error("Journal image upload failed:", err);
    return { ok: false as const, error: "Could not upload image. Please try again." };
  }
}

const journalSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  featuredImageUrl: z.string().optional(),
  tags: z.array(z.string()),
  relatedCollection: z.enum(["OFFICE", "SUNDAY", "DATE", "CELEBRATION"]).nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type JournalInput = z.infer<typeof journalSchema>;

export async function createJournalEntry(input: JournalInput) {
  await requireAdminSession();
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid journal details.") };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.title);

  const existing = await prisma.journal.findUnique({ where: { slug } });
  if (existing) {
    return { ok: false as const, error: `An article titled "${data.title}" already exists.` };
  }

  try {
    const entry = await prisma.journal.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        featuredImageUrl: data.featuredImageUrl || null,
        tags: data.tags,
        relatedCollection: data.relatedCollection,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/journal");
    revalidateStorefront();
    return { ok: true as const, id: entry.id };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not create article.") };
  }
}

export async function updateJournalEntry(id: string, input: JournalInput) {
  await requireAdminSession();
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid journal details.") };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.title);

  const existing = await prisma.journal.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return { ok: false as const, error: `An article titled "${data.title}" already exists.` };
  }

  try {
    const current = await prisma.journal.findUniqueOrThrow({ where: { id } });
    await prisma.journal.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        featuredImageUrl: data.featuredImageUrl || null,
        tags: data.tags,
        relatedCollection: data.relatedCollection,
        status: data.status,
        // Only stamp publishedAt the first time an article goes live -
        // re-saving an already-published article shouldn't bump its date.
        publishedAt:
          data.status === "PUBLISHED"
            ? (current.publishedAt ?? new Date())
            : current.publishedAt,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath(`/admin/journal/${id}`);
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not save changes.") };
  }
}

export async function deleteJournalEntry(id: string) {
  await requireAdminSession();
  try {
    await prisma.journal.delete({ where: { id } });
    revalidatePath("/admin/journal");
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not delete article.") };
  }
}
