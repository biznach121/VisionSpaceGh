"use client";

import { ProductGrid } from "@cimplify/sdk/react";
import type { Product } from "@cimplify/sdk";
import { StoreProductCard } from "@/components/store-product-card";

/**
 * Client island for the category listing. Receives server-fetched products
 * as props (serializable) and owns the `renderCard` function.
 */
export function ListingClient({ products }: { products: Product[] }) {
  return (
    <ProductGrid
      products={products}
      columns={{ sm: 1, md: 3, lg: 4, xl: 4 }}
      emptyMessage="No products in this category yet."
      renderCard={(p) => <StoreProductCard product={p} />}
    />
  );
}
