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
    console.log(`Created admin user: ${adminEmail} / adire2026`);
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
      name: "Indigo Wrap Dress",
      description:
        "A hand-dyed Adire wrap dress in deep indigo with a soft rust starburst pattern. Tailored waist, flowing skirt.",
      department: "WOMEN" as const,
      category: "DRESS" as const,
      basePrice: 4500000,
      image: "/products/placeholder-1.svg",
      variants: [
        { size: "S", color: "Indigo", sku: "IWD-S-IND" },
        { size: "M", color: "Indigo", sku: "IWD-M-IND" },
        { size: "L", color: "Indigo", sku: "IWD-L-IND" },
      ],
    },
    {
      name: "Coral Sunburst Top",
      description:
        "Lightweight cotton top with a coral and cream tie-dye burst, relaxed fit, perfect for warm days.",
      department: "WOMEN" as const,
      category: "TOP" as const,
      basePrice: 1800000,
      image: "/products/placeholder-2.svg",
      variants: [
        { size: "S", color: "Coral", sku: "CST-S-COR" },
        { size: "M", color: "Coral", sku: "CST-M-COR" },
        { size: "L", color: "Coral", sku: "CST-L-COR" },
      ],
    },
    {
      name: "Rust Adire Jeans",
      description:
        "Straight-leg denim overdyed with a rust and indigo Adire wash — no two pairs are alike.",
      department: "WOMEN" as const,
      category: "JEANS" as const,
      basePrice: 3200000,
      image: "/products/placeholder-4.svg",
      variants: [
        { size: "28", color: "Rust Wash", sku: "RAJ-28-RUS" },
        { size: "30", color: "Rust Wash", sku: "RAJ-30-RUS" },
        { size: "32", color: "Rust Wash", sku: "RAJ-32-RUS" },
      ],
    },
    {
      name: "Little Rin Dress",
      description:
        "A playful kids' Adire dress in soft indigo and cream, easy-care cotton, twirl-approved.",
      department: "KIDS" as const,
      category: "DRESS" as const,
      basePrice: 2200000,
      image: "/products/placeholder-3.svg",
      variants: [
        { size: "3-4Y", color: "Indigo Cream", sku: "LRD-34-IC" },
        { size: "5-6Y", color: "Indigo Cream", sku: "LRD-56-IC" },
        { size: "7-8Y", color: "Indigo Cream", sku: "LRD-78-IC" },
      ],
    },
    {
      name: "Mini Hoho Top",
      description: "Matching mini version of our signature tie-dye top, for the littlest trendsetters.",
      department: "KIDS" as const,
      category: "TOP" as const,
      basePrice: 1200000,
      image: "/products/placeholder-5.svg",
      variants: [
        { size: "2-3Y", color: "Sunset", sku: "MHT-23-SUN" },
        { size: "4-5Y", color: "Sunset", sku: "MHT-45-SUN" },
        { size: "6-7Y", color: "Sunset", sku: "MHT-67-SUN" },
      ],
    },
    {
      name: "Junior Adire Jeans",
      description: "Durable, soft-wash denim for kids with a subtle Adire overdye detail on the pockets.",
      department: "KIDS" as const,
      category: "JEANS" as const,
      basePrice: 1600000,
      image: "/products/placeholder-6.svg",
      variants: [
        { size: "4-5Y", color: "Indigo", sku: "JAJ-45-IND" },
        { size: "6-7Y", color: "Indigo", sku: "JAJ-67-IND" },
        { size: "8-9Y", color: "Indigo", sku: "JAJ-89-IND" },
      ],
    },
    {
      name: "Sand Coast Top",
      description: "Breezy sand and indigo tie-dye blouse with tie-front detail.",
      department: "WOMEN" as const,
      category: "TOP" as const,
      basePrice: 2100000,
      image: "/products/placeholder-7.svg",
      variants: [
        { size: "S", color: "Sand", sku: "SCT-S-SAN" },
        { size: "M", color: "Sand", sku: "SCT-M-SAN" },
      ],
    },
    {
      name: "Ruby Bloom Dress",
      description: "Statement occasion dress with a bold rust-and-indigo bloom pattern across a fitted silhouette.",
      department: "WOMEN" as const,
      category: "DRESS" as const,
      basePrice: 5600000,
      image: "/products/placeholder-8.svg",
      variants: [
        { size: "S", color: "Ruby Bloom", sku: "RBD-S-RB" },
        { size: "M", color: "Ruby Bloom", sku: "RBD-M-RB" },
        { size: "L", color: "Ruby Bloom", sku: "RBD-L-RB" },
      ],
    },
  ];

  for (const [i, p] of products.entries()) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        department: p.department,
        category: p.category,
        basePrice: p.basePrice,
        isPublished: true,
        isFeatured: i < 4,
        images: { create: [{ url: p.image, position: 0 }] },
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            inventory: { create: { quantity: 12, reorderAt: 4 } },
          })),
        },
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
