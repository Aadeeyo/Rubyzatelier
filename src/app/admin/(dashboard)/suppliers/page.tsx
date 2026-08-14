import { prisma } from "@/lib/prisma";
import { NewSupplierForm } from "@/components/admin/new-supplier-form";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-espresso">Suppliers</h1>
      </div>

      <div className="mt-6">
        <NewSupplierForm />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3 text-espresso">{s.name}</td>
                <td className="px-5 py-3 text-espresso/70">{s.contactName ?? "—"}</td>
                <td className="px-5 py-3 text-espresso/70">{s.email ?? "—"}</td>
                <td className="px-5 py-3 text-espresso/70">{s.phone ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No suppliers yet.</p>
        )}
      </div>
    </div>
  );
}
