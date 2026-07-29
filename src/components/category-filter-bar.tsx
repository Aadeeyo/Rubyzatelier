import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/generated/prisma/enums";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "TOP", label: "Tops" },
  { value: "DRESS", label: "Dresses" },
  { value: "JEANS", label: "Jeans" },
  { value: "TOP_BOTTOM", label: "Top + Bottom" },
];

export function CategoryFilterBar({
  basePath,
  activeCategory,
}: {
  basePath: string;
  activeCategory?: ProductCategory;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href={basePath}
        className={cn(
          "rounded-full border px-5 py-2 font-sans text-base transition-colors",
          !activeCategory
            ? "border-coral bg-coral/10 text-coral"
            : "border-white/15 text-sand/70 hover:border-coral hover:text-coral",
        )}
      >
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.value}
          href={`${basePath}?category=${c.value}`}
          className={cn(
            "rounded-full border px-5 py-2 font-sans text-base transition-colors",
            activeCategory === c.value
              ? "border-coral bg-coral/10 text-coral"
              : "border-white/15 text-sand/70 hover:border-coral hover:text-coral",
          )}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
