import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { productTotalStock } from "@/lib/catalog";
import { COLLECTION_COPY } from "@/lib/collections";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  DRAFT: "bg-cocoa/10 text-espresso/60",
  ARCHIVED: "bg-red-100 text-red-800",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: { include: { inventory: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-espresso">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-terracotta px-6 py-2 font-sans text-lg text-ivory hover:scale-105"
        >
          + New product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Collection</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-espresso hover:text-terracotta">
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-espresso/70">{COLLECTION_COPY[p.collection].label}</td>
                <td className="px-5 py-3 text-espresso/70">{formatNaira(p.basePrice)}</td>
                <td className="px-5 py-3 text-espresso/70">{productTotalStock(p)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLES[p.status]}`}>
                    {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No products yet.</p>
        )}
      </div>
    </div>
  );
}
