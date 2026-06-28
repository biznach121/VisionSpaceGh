import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./search-client";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Search — ${brand.name}`,
  description: `Search ${brand.name} — products, collections, categories.`,
};

export default function SearchPage() {
  return (
    <article className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
        Search
      </p>
      <h1 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-semibold mb-8 -tracking-[0.02em]">
        Find anything.
      </h1>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchClient />
      </Suspense>
    </article>
  );
}

function SearchSkeleton() {
  return (
    <div>
      <div className="h-12 w-full max-w-xl bg-muted rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
