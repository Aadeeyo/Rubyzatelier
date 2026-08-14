import type { ProductStatus } from "@/generated/prisma/enums";

// A product auto-archives the moment its total stock hits 0, and comes back
// automatically as soon as it's restocked. Drafts are never touched either
// way - an intentionally unpublished product with 0 stock stays a draft, and
// giving it stock doesn't silently publish it.
export function nextStatusAfterStockChange(
  currentStatus: ProductStatus,
  totalStock: number,
): ProductStatus | null {
  if (currentStatus === "AVAILABLE" && totalStock === 0) return "ARCHIVED";
  if (currentStatus === "ARCHIVED" && totalStock > 0) return "AVAILABLE";
  return null;
}
