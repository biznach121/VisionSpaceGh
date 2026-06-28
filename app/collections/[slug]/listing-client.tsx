"use client";

import { ProductGrid } from "@cimplify/sdk/react";
import type { Product } from "@cimplify/sdk";
import { StoreProductCard } from "@/components/store-product-card";

/**
 * Client island for the collection listing. Receives server-fetched
 * products as props (serializable) and owns the `renderCard` function
 * (which can't cross the server/client boundary).
 */
export function ListingClient({ products }: { products: Product[] }) {
  return (
    <ProductGrid
      products={products}
      columns={{ sm: 1, md: 3, lg: 4, xl: 4 }}
      emptyMessage="No products in this collection yet."
      renderCard={(p) => <StoreProductCard product={p} />}
    />
  );
}
