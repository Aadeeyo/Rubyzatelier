import { prisma } from "@/lib/prisma";

export async function getPublishedTestimonials(take?: number) {
  return prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take,
  });
}
