import type { Product } from "@cimplify/sdk";
import { StoreProductCard } from "./store-product-card";

/**
 * Product cards sitting together, separated by thicker grid lines at their
 * borders. The container draws the top/left lines; each card draws its
 * right/bottom, so every seam is one uniform 2px rule.
 */
export function BorderedProductGrid({
  products,
  limit = 4,
}: {
  products: Product[];
  limit?: number;
}) {
  const items = products.slice(0, limit);
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 border-l-2 border-t-2 border-foreground min-[420px]:grid-cols-2 md:grid-cols-4">
      {items.map((p) => (
        <StoreProductCard
          key={p.id}
          product={p}
          className="border-b-2 border-r-2 border-foreground"
        />
      ))}
    </div>
  );
}
