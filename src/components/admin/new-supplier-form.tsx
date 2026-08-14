"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSupplier } from "@/app/admin/(dashboard)/suppliers/actions";

export function NewSupplierForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createSupplier(form);
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`${form.name} added`);
    setOpen(false);
    setForm({ name: "", contactName: "", email: "", phone: "", address: "", notes: "" });
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-terracotta px-6 py-2 font-sans text-lg text-ivory hover:scale-105"
      >
        + New supplier
      </button>
    );
  }

  const inputClass =
    "rounded-lg border border-cocoa/25 bg-ivory px-3 py-2 text-espresso outline-none focus:border-terracotta";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-cocoa/15 bg-cream p-6"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Supplier name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Contact name"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className={`col-span-2 ${inputClass}`}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-terracotta px-6 py-2 font-sans text-ivory hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save supplier"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-espresso/50 hover:text-terracotta"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
