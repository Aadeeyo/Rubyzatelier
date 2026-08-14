"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProductCore, addVariant, uploadImage } from "@/app/admin/(dashboard)/products/actions";
import type { Collection, ProductStatus } from "@/generated/prisma/enums";

const COLLECTION_OPTIONS: { value: Collection; label: string }[] = [
  { value: "OFFICE", label: "Office Edit" },
  { value: "SUNDAY", label: "Sunday Edit" },
  { value: "DATE", label: "Date Edit" },
  { value: "CELEBRATION", label: "Celebration Edit" },
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
    collection: Collection;
    basePrice: number;
    imageUrl: string;
    status: ProductStatus;
    isFeatured: boolean;
  };
  existingVariants?: { id: string; size: string; color: string | null; sku: string; quantity: number }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [collection, setCollection] = useState<Collection>(initial?.collection ?? "OFFICE");
  const [basePrice, setBasePrice] = useState(
    initial ? (initial.basePrice / 100).toString() : "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? PLACEHOLDER_IMAGES[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Archived is system-set (auto-archive on 0 stock), not admin-selectable -
  // an archived product's editable status defaults to Available, since the
  // auto-archive logic will re-derive the real state from stock anyway.
  const [status, setStatus] = useState<"DRAFT" | "AVAILABLE">(
    initial?.status === "DRAFT" ? "DRAFT" : "AVAILABLE",
  );
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [variants, setVariants] = useState<VariantRow[]>(
    mode === "create"
      ? [{ size: "", color: "", sku: "", priceOverride: "", quantity: "0" }]
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isArchived = mode === "edit" && initial?.status === "ARCHIVED";

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

    if (mode === "create") {
      const incomplete = variants.some((v) => !v.size || !v.sku);
      if (incomplete) {
        const message = "Every variant needs a size and SKU.";
        toast.error(message);
        setError(message);
        return;
      }
    }

    setSaving(true);
    setError(null);

    const core = {
      name,
      description,
      collection,
      basePrice: Math.round(parseFloat(basePrice || "0") * 100),
      imageUrl,
      status,
      isFeatured,
    };

    try {
      if (mode === "create") {
        const parsedVariants = variants.map((v) => ({
          size: v.size,
          color: v.color || undefined,
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
          if (!row.size || !row.sku) continue;
          const variantResult = await addVariant(productId, {
            size: row.size,
            color: row.color || undefined,
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

  const inputClass =
    "rounded-lg border border-cocoa/25 bg-ivory px-4 py-2 text-espresso outline-none focus:border-terracotta";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isArchived && (
        <p className="rounded-lg bg-cocoa/10 px-4 py-3 font-sans text-sm text-espresso/70">
          This product is <strong className="text-espresso">archived</strong> — it ran out of
          stock and was automatically hidden from the storefront. Add stock
          to a variant below and it will become available again
          automatically.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Base price (₦)
          <input
            required
            type="number"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Collection
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value as Collection)}
            className={inputClass}
          >
            {COLLECTION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 font-sans text-espresso/70">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "AVAILABLE")}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="AVAILABLE">Available</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 font-sans text-espresso/70">
        Description
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </label>

      <div>
        <span className="font-sans text-espresso/70">Image</span>

        <div className="mt-2 flex items-center gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-cocoa/25 bg-cream">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <label className="cursor-pointer rounded-full border border-cocoa/25 px-5 py-2 font-sans text-espresso/80 hover:border-terracotta hover:text-terracotta">
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
        {uploadError && <p className="mt-2 font-sans text-sm text-red-700">{uploadError}</p>}

        <p className="mt-4 font-sans text-sm text-espresso/50">Or pick a placeholder</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {PLACEHOLDER_IMAGES.map((img) => (
            <button
              type="button"
              key={img}
              onClick={() => setImageUrl(img)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                imageUrl === img ? "border-terracotta" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 font-sans text-espresso/70">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured on homepage
      </label>

      {existingVariants.length > 0 && (
        <div>
          <span className="font-sans text-espresso/70">Existing variants</span>
          <div className="mt-2 overflow-hidden rounded-lg border border-cocoa/15">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-cocoa/15 text-cocoa">
                  <th className="px-3 py-2 text-left">Size</th>
                  <th className="px-3 py-2 text-left">Color</th>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {existingVariants.map((v) => (
                  <tr key={v.id} className="border-b border-cocoa/10 last:border-0">
                    <td className="px-3 py-2 text-espresso/80">{v.size}</td>
                    <td className="px-3 py-2 text-espresso/80">{v.color ?? "—"}</td>
                    <td className="px-3 py-2 text-espresso/80">{v.sku}</td>
                    <td className="px-3 py-2 text-espresso/80">{v.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-espresso/70">
            {mode === "create" ? "Variants" : "Add new variants"}
          </span>
          <button
            type="button"
            onClick={addVariantRow}
            className="font-sans text-sm text-cocoa hover:text-terracotta"
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
                className={inputClass}
              />
              <input
                placeholder="Color (optional)"
                value={row.color}
                onChange={(e) => updateRow(i, { color: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="SKU"
                value={row.sku}
                onChange={(e) => updateRow(i, { sku: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Price override (₦)"
                value={row.priceOverride}
                onChange={(e) => updateRow(i, { priceOverride: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Qty"
                type="number"
                value={row.quantity}
                onChange={(e) => updateRow(i, { quantity: e.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="font-sans text-sm text-espresso/40 hover:text-terracotta"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="font-sans text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
      </button>
    </form>
  );
}
