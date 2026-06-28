import type { Metadata } from "next";
import { Suspense } from "react";
import { tags } from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { ShopClient } from "./shop-client";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Shop — ${brand.name}`,
  description: brand.description,
};

export const revalidate = 3600;

async function getShopData() {
  const client = getStoreClient();
  const [p, c] = await Promise.all([
    client.catalogue.getProducts(
      { limit: 500 },
      { cacheOptions: { revalidate: 3600, tags: [tags.products()] } },
    ),
    client.catalogue.getCategories({
      cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
    }),
  ]);
  return {
    products: p.ok ? p.value.items : [],
    categories: c.ok ? c.value : [],
  };
}

export default async function ShopPage() {
  const { products, categories } = await getShopData();
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
