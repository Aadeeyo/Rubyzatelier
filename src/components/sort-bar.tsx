import Link from "next/link";
import { cn } from "@/lib/utils";

const SORTS: { value: "newest" | "price"; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price" },
];

export function SortBar({
  basePath,
  activeSort,
}: {
  basePath: string;
  activeSort?: "newest" | "price";
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {SORTS.map((s) => {
        const isActive = (activeSort ?? "newest") === s.value;
        return (
          <Link
            key={s.value}
            href={s.value === "newest" ? basePath : `${basePath}?sort=${s.value}`}
            className={cn(
              "rounded-full border px-5 py-2 font-sans text-base transition-colors",
              isActive
                ? "border-terracotta bg-terracotta/10 text-terracotta"
                : "border-cocoa/25 text-espresso/70 hover:border-terracotta hover:text-terracotta",
            )}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
