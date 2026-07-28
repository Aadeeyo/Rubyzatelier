import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { productTotalStock } from "@/lib/catalog";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: { include: { inventory: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-sand">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-coral px-6 py-2 font-sans text-lg text-sand hover:scale-105"
        >
          + New product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-ink-soft">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-chrome">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-sand hover:text-coral">
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sand/70">{p.department}</td>
                <td className="px-5 py-3 text-sand/70">{p.category}</td>
                <td className="px-5 py-3 text-sand/70">{formatNaira(p.basePrice)}</td>
                <td className="px-5 py-3 text-sand/70">{productTotalStock(p)}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      p.isPublished
                        ? "rounded-full bg-green-900/30 px-3 py-1 text-xs text-green-400"
                        : "rounded-full bg-white/5 px-3 py-1 text-xs text-sand/50"
                    }
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 font-sans text-sand/50">No products yet.</p>
        )}
      </div>
    </div>
  );
}
