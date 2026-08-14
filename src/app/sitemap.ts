import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: {
      status: "AVAILABLE",
      variants: { some: { inventory: { quantity: { gt: 0 } } } },
    },
    select: { slug: true, updatedAt: true },
  });

  const journalEntries = await prisma.journal.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop/office`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/sunday`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/date`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop/celebration`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/support`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const journalPages: MetadataRoute.Sitemap = journalEntries.map((j) => ({
    url: `${SITE_URL}/journal/${j.slug}`,
    lastModified: j.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...journalPages];
}
