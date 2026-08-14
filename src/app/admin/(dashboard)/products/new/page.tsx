import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">New Product</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
