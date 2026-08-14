import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const hashPassword = (password: string) => bcrypt.hash(password, 10);

async function main() {
  const adminEmail = "admin@rubyzatelier.com";
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: "Ruby",
        role: "OWNER",
        // Change this immediately after first login in any real deployment.
        passwordHash: await hashPassword("ChangeMe123!"),
      },
    });
    console.log(`Created admin user: ${adminEmail} / ChangeMe123!`);
  }

  let supplier = await prisma.supplier.findFirst({ where: { name: "Abeokuta Dye Works" } });
  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: "Abeokuta Dye Works",
        contactName: "Bunmi Adisa",
        email: "orders@abeokutadye.example",
        phone: "+234 803 000 0000",
        address: "Itoku Market, Abeokuta, Ogun State",
      },
    });
  }

  const products = [
    {
      name: "The Sterling Dress",
      description:
        "Designed for women who want effortless elegance from the office to after-work plans. The Sterling Dress combines comfort, structure, and femininity in one versatile piece.",
      collection: "OFFICE" as const,
      basePrice: 1200000,
      image: "/products/placeholder-1.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Ledger Blouse",
      description:
        "A tailored button-through blouse in a soft crepe finish — sharp enough for meetings, soft enough for the walk home.",
      collection: "OFFICE" as const,
      basePrice: 850000,
      image: "/products/placeholder-2.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Fellowship Dress",
      description:
        "A feminine midi dress with a modest neckline and gentle flare, designed for worship mornings and the fellowship after.",
      collection: "SUNDAY" as const,
      basePrice: 1350000,
      image: "/products/placeholder-3.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Grace Wrap Top",
      description:
        "A soft wrap top with a covered shoulder and delicate tie waist — polished, comfortable, and easy to move in all morning.",
      collection: "SUNDAY" as const,
      basePrice: 750000,
      image: "/products/placeholder-4.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Rendezvous Set",
      description:
        "A fitted top-and-skirt set in a fluid fabric that moves with you — effortless for coffee, dinner, or the conversation that runs long.",
      collection: "DATE" as const,
      basePrice: 1450000,
      image: "/products/placeholder-5.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Evening Jeans",
      description:
        "A high-waisted straight-leg jean with a subtle sheen — dressed up with heels, dressed down with flats.",
      collection: "DATE" as const,
      basePrice: 950000,
      image: "/products/placeholder-6.svg",
      sizes: ["28", "30", "32"],
    },
    {
      name: "The Ruby Bloom Dress",
      description:
        "A statement occasion dress with a fitted silhouette and a bold, blooming print — made for the moments worth dressing up for.",
      collection: "CELEBRATION" as const,
      basePrice: 1500000,
      image: "/products/placeholder-7.svg",
      sizes: ["Small", "Medium", "Large"],
    },
    {
      name: "The Toast Gown",
      description:
        "A floor-length column gown in a rich jewel tone, finished with a soft draped back — for weddings, galas, and everything worth celebrating.",
      collection: "CELEBRATION" as const,
      basePrice: 1500000,
      image: "/products/placeholder-8.svg",
      sizes: ["Small", "Medium", "Large"],
    },
  ];

  for (const [i, p] of products.entries()) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;

    const skuPrefix = p.name
      .replace(/^The\s+/i, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        collection: p.collection,
        basePrice: p.basePrice,
        status: "AVAILABLE",
        isFeatured: i < 4,
        images: { create: [{ url: p.image, position: 0 }] },
        variants: {
          create: p.sizes.map((size, sizeIndex) => ({
            size,
            sku: `${skuPrefix}-${size.slice(0, 2).toUpperCase()}-${sizeIndex}`,
            inventory: { create: { quantity: 12, reorderAt: 4 } },
          })),
        },
      },
    });
  }

  const journalEntries = [
    {
      title: "Why Elegant Fashion Shouldn't Require a Long Trip",
      slug: "why-elegant-fashion-shouldnt-require-a-long-trip",
      excerpt:
        "For a long time, finding beautiful clothing meant leaving home. Here's why we built Rubyzatelier to change that.",
      relatedCollection: null,
      content: `For as long as we can remember, finding elegant, celebration-worthy fashion has meant traveling — into the city, across town, sometimes further.

We started noticing that the women around us were facing the same challenge. Friends. Colleagues. Women building careers, preparing for church, attending weddings, in relationships — everyone was investing extra time and money just to find clothing that reflected who they were.

Rubyzatelier exists because we believe women outside major fashion hubs deserve affordable elegance without sacrificing time and money. Clean, functional, beautiful fashion — brought closer to home.`,
      tags: ["brand-story"],
    },
    {
      title: "How to Build a Work Wardrobe Without Overspending",
      slug: "how-to-build-a-work-wardrobe-without-overspending",
      excerpt:
        "A polished, professional wardrobe doesn't have to come with a designer price tag. Here's where to start.",
      relatedCollection: "OFFICE" as const,
      content: `Building a work wardrobe you love shouldn't mean buying everything at once — or spending everything you have.

Start with a few versatile pieces that layer easily: a tailored dress, a structured blouse, and one statement piece you can dress up or down. From there, build outward slowly, choosing pieces that mix and match rather than one-off outfits.

Our Office Edit was designed exactly for this — elegant workwear for ambitious women, priced so building a wardrobe you're proud of doesn't mean overspending to get there.`,
      tags: ["office-edit", "style-guide"],
    },
    {
      title: "What to Wear to Church This Sunday",
      slug: "what-to-wear-to-church-this-sunday",
      excerpt:
        "Soft, modest, and put-together — a few simple ideas for dressing for worship and the fellowship after.",
      relatedCollection: "SUNDAY" as const,
      content: `Sunday mornings call for something soft, modest, and easy to move in — from the service, into fellowship, and through whatever the rest of the day brings.

A midi dress with a covered shoulder is always a safe, elegant choice. If you prefer separates, a wrap top paired with a full skirt gives you the same grace with a little more flexibility.

Our Sunday Edit was designed for exactly this rhythm — feminine pieces made for worship and the fellowship that follows.`,
      tags: ["sunday-edit", "style-guide"],
    },
  ];

  for (const entry of journalEntries) {
    const existing = await prisma.journal.findUnique({ where: { slug: entry.slug } });
    if (existing) continue;

    await prisma.journal.create({
      data: {
        title: entry.title,
        slug: entry.slug,
        excerpt: entry.excerpt,
        content: entry.content,
        tags: entry.tags,
        relatedCollection: entry.relatedCollection,
        status: "PUBLISHED",
        publishedAt: new Date("2026-08-01T09:00:00.000Z"),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
