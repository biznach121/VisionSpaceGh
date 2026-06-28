"use client";

import { useRouter } from "next/navigation";
import { CategoryGrid as SdkCategoryGrid } from "@cimplify/sdk/react";
import type { Category } from "@cimplify/sdk";

/**
 * Homepage category tiles — defers to the SDK's <CategoryGrid/> for layout
 * and accessibility, and routes selections to /categories/:slug.
 */
export function CategoryGrid({ categories }: { categories?: Category[] }) {
  const router = useRouter();
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-14">
      <h2 className="font-serif text-[28px] font-semibold m-0 mb-5">Browse the menu</h2>
      <SdkCategoryGrid
        categories={categories}
        onSelect={(c) => router.push(`/categories/${c.slug}`)}
        classNames={{
          item: "flex flex-col gap-1 p-6 bg-card border border-border rounded-2xl cursor-pointer text-left transition-all hover:border-primary hover:-translate-y-0.5",
          name: "font-serif text-lg font-semibold text-foreground",
          description: "text-xs text-muted-foreground",
          count: "text-xs text-muted-foreground mt-1",
        }}
      />
    </section>
  );
}
