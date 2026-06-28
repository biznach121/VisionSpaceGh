import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  tags,
  type Collection,
  type Product,
} from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { ListingClient } from "./listing-client";
import { brand } from "@/lib/brand";

// See app/products/[slug]/page.tsx for the rationale on generateStaticParams.
export async function generateStaticParams() {
  const r = await getStoreClient().catalogue.getCollections();
  if (!r.ok || r.value.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return r.value.map((c) => ({ slug: c.slug ?? c.id }));
}

export const revalidate = 3600;

interface CollectionData {
  collection: Collection;
  products: Product[];
}

type CollectionResult =
  | { ok: true; data: CollectionData }
  | { ok: false; code: string };

async function getCollection(slug: string): Promise<CollectionResult> {
  const client = getStoreClient();
  const colRes = await client.catalogue.getCollectionBySlug(slug, {
    cacheOptions: { revalidate: 3600, tags: [tags.collections()] },
  });
  if (!colRes.ok) return { ok: false, code: colRes.error.code };

  const r = await client.catalogue.getCollectionProducts(colRes.value.id, undefined, {
    cacheOptions: {
      revalidate: 3600,
      tags: [
        tags.collection(colRes.value.id),
        tags.collectionProducts(colRes.value.id),
      ],
    },
  });
  const products = r.ok
    ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
    : [];
  return { ok: true, data: { collection: colRes.value, products } };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCollection(slug);
  if (!result.ok) return {};
  const data = result.data;
  return {
    title: `${data.collection.name} — ${brand.name}`,
    description: data.collection.description ?? undefined,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCollection(slug);
  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();
    return <CollectionSkeleton />;
  }
  const { collection, products } = result.data;
  return (
    <>
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-14">
          <nav className="text-[12px] font-mono text-background/60 mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-background transition-colors">Home</Link>
            <span>/</span>
            <span className="text-background/90">Collections</span>
            <span>/</span>
            <span className="text-background/90">{collection.name}</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold m-0 -tracking-[0.025em]">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-3 max-w-2xl text-base text-background/75">
              {collection.description}
            </p>
          )}
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-background/60 tabular-nums">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <ListingClient products={products} />
        {products.length === 0 && (
          <p className="text-center mt-8">
            <Link href="/shop" className="text-primary font-semibold hover:underline">
              ← Browse all products
            </Link>
          </p>
        )}
      </section>
    </>
  );
}

function CollectionSkeleton() {
  return (
    <>
      <section className="bg-foreground py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-3 w-32 bg-background/20 rounded mb-3 animate-pulse" />
          <div className="h-12 w-72 bg-background/20 rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    </>
  );
}
