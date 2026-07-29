import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Revalidates every storefront page whose content depends on product,
 * inventory, or publish-state changes. /shop/[department] is a separate
 * dynamic route, not a child of /shop, so it needs its own explicit path -
 * revalidatePath("/shop") does not cascade to it.
 */
export function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/shop/women");
  revalidatePath("/shop/kids");
}
