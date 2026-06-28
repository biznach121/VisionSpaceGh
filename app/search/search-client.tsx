"use client";

import { SearchPage } from "@cimplify/sdk/react";
import { StoreProductCard } from "@/components/store-product-card";

export function SearchClient() {
  return <SearchPage renderCard={(product) => <StoreProductCard product={product} />} />;
}
