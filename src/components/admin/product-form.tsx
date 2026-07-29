"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProductCore, addVariant, uploadImage } from "@/app/admin/(dashboard)/products/actions";
import type { ProductCategory } from "@/generated/prisma/enums";

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "TOP", label: "Top" },
  { value: "DRESS", label: "Dress" },
  { value: "JEANS", label: "Jeans" },
  { value: "TOP_BOTTOM", label: "Top + Bottom" },
];

const PLACEHOLDER_IMAGES = Array.from(
  { length: 8 },
  (_, i) => `/products/placeholder-${i + 1}.svg`,
);

interface VariantRow {
  id?: string;
  size: string;
  color: string;
  sku: string;
  priceOverride: string;
  quantity: string;
}

export function ProductForm({
  mode,
  productId,
  initial,
  existingVariants = [],
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: {
    name: string;
    slug: string;
    description: string;
    department: "WOMEN" | "KIDS";
    category: ProductCategory;
    basePrice: number;
    imageUrl: string;
    isPublished: boolean;
    isFeatured: boolean;
  };
  existingVariants?: { id: string; size: string; color: string; sku: string; quantity: number }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [department, setDepartment] = useState<"WOMEN" | "KIDS">(initial?.department ?? "WOMEN");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "TOP");
  const [basePrice, setBasePrice] = useState(
    initial ? (initial.basePrice / 100).toString() : "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? PLACEHOLDER_IMAGES[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [variants, setVariants] = useState<VariantRow[]>(
    mode === "create"
      ? [{ size: "", color: "", sku: "", priceOverride: "", quantity: "0" }]
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (!result.ok) {
        setUploadError(result.error);
        return;
      }
      setImageUrl(result.url);
    } catch {
      setUploadError("Could not upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function addVariantRow() {
    setVariants((v) => [...v, { size: "", color: "", sku: "", priceOverride: "", quantity: "0" }]);
  }

  function updateRow(i: number, patch: Partial<VariantRow>) {
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function removeRow(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const core = {
      name,
      description,
      department,
      category,
      basePrice: Math.round(parseFloat(basePrice || "0") * 100),
      imageUrl,
      isPublished,
      isFeatured,
    };

    try {
      if (mode === "create") {
        const parsedVariants = variants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          priceOverride: v.priceOverride ? Math.round(parseFloat(v.priceOverride) * 100) : null,
          quantity: parseInt(v.quantity || "0", 10),
        }));
        const result = await createProduct({ ...core, variants: parsedVariants });
        if (!result.ok) {
          toast.error(result.error);
          setError(result.error);
          return;
        }
        toast.success(`${name} created`);
        router.push(`/admin/products/${result.id}`);
      } else if (productId) {
        const coreResult = await updateProductCore(productId, core);
        if (!coreResult.ok) {
          toast.error(coreResult.error);
          setError(coreResult.error);
          return;
        }

        for (const row of variants) {
          if (!row.size || !row.color || !row.sku) continue;
          const variantResult = await addVariant(productId, {
            size: row.size,
            color: row.color,
            sku: row.sku,
            priceOverride: row.priceOverride ? Math.round(parseFloat(row.priceOverride) * 100) : null,
            quantity: parseInt(row.quantity || "0", 10),
          });
          if (!variantResult.ok) {
            toast.error(variantResult.error);
            setError(variantResult.error);
            return;
          }
        }

        toast.success("Changes saved");
        router.refresh();
        setVariants([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-sans text-sand/70">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-sand/70">
          Base price (₦)
          <input
            required
            type="number"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-sand/70">
          Department
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as "WOMEN" | "KIDS")}
            className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
          >
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 font-sans text-sand/70">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Description
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
        />
      </label>

      <div>
        <span className="font-sans text-sand/70">Image</span>

        <div className="mt-2 flex items-center gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/15 bg-ink-elevated">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <label className="cursor-pointer rounded-full border border-white/15 px-5 py-2 font-sans text-sand/80 hover:border-coral hover:text-coral">
            {uploading ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {uploadError && <p className="mt-2 font-sans text-sm text-coral">{uploadError}</p>}

        <p className="mt-4 font-sans text-sm text-sand/50">Or pick a placeholder</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {PLACEHOLDER_IMAGES.map((img) => (
            <button
              type="button"
              key={img}
              onClick={() => setImageUrl(img)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                imageUrl === img ? "border-coral" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 font-sans text-sand/70">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
        <label className="flex items-center gap-2 font-sans text-sand/70">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured on homepage
        </label>
      </div>

      {existingVariants.length > 0 && (
        <div>
          <span className="font-sans text-sand/70">Existing variants</span>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-white/10 text-chrome">
                  <th className="px-3 py-2 text-left">Size</th>
                  <th className="px-3 py-2 text-left">Color</th>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {existingVariants.map((v) => (
                  <tr key={v.id} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-2 text-sand/80">{v.size}</td>
                    <td className="px-3 py-2 text-sand/80">{v.color}</td>
                    <td className="px-3 py-2 text-sand/80">{v.sku}</td>
                    <td className="px-3 py-2 text-sand/80">{v.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sand/70">
            {mode === "create" ? "Variants" : "Add new variants"}
          </span>
          <button
            type="button"
            onClick={addVariantRow}
            className="font-sans text-sm text-chrome hover:text-coral"
          >
            + Add row
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {variants.map((row, i) => (
            <div key={i} className="grid grid-cols-6 gap-2">
              <input
                placeholder="Size"
                value={row.size}
                onChange={(e) => updateRow(i, { size: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <input
                placeholder="Color"
                value={row.color}
                onChange={(e) => updateRow(i, { color: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <input
                placeholder="SKU"
                value={row.sku}
                onChange={(e) => updateRow(i, { sku: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <input
                placeholder="Price override (₦)"
                value={row.priceOverride}
                onChange={(e) => updateRow(i, { priceOverride: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <input
                placeholder="Qty"
                type="number"
                value={row.quantity}
                onChange={(e) => updateRow(i, { quantity: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="font-sans text-sm text-sand/40 hover:text-coral"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="font-sans text-coral">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-coral px-8 py-3 font-sans text-lg text-sand transition-transform hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
      </button>
    </form>
  );
}
