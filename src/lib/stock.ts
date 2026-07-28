export function variantAvailableQuantity(
  variant: { inventory: { quantity: number } | null },
): number {
  return variant.inventory?.quantity ?? 0;
}

export function productTotalStock(product: {
  variants: { inventory: { quantity: number } | null }[];
}): number {
  return product.variants.reduce(
    (sum, v) => sum + variantAvailableQuantity(v),
    0,
  );
}
