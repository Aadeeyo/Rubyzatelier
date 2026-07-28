"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    await createSupplier(form);
    setSaving(false);
    setOpen(false);
    setForm({ name: "", contactName: "", email: "", phone: "", address: "", notes: "" });
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-coral px-6 py-2 font-sans text-lg text-sand hover:scale-105"
      >
        + New supplier
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-ink-soft p-6"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Supplier name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
        <input
          placeholder="Contact name"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="col-span-2 rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-coral px-6 py-2 font-sans text-sand hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save supplier"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-sand/50 hover:text-coral"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
