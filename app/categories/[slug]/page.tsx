import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  tags,
  type Category,
  type Product,
} from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { ListingClient } from "./listing-client";
import { brand } from "@/lib/brand";

// See app/products/[slug]/page.tsx for the rationale on generateStaticParams.
export async function generateStaticParams() {
  const r = await getStoreClient().catalogue.getCategories();
  if (!r.ok || r.value.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return r.value.map((c) => ({ slug: c.slug ?? c.id }));
}

export const revalidate = 3600;

interface CategoryData {
  category: Category;
  products: Product[];
}

type CategoryResult =
  | { ok: true; data: CategoryData }
  | { ok: false; code: string };

async function getCategory(slug: string): Promise<CategoryResult> {
  const client = getStoreClient();
  const catRes = await client.catalogue.getCategoryBySlug(slug, {
    cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
  });
  if (!catRes.ok) return { ok: false, code: catRes.error.code };

  const r = await client.catalogue.getCategoryProducts(catRes.value.id, undefined, {
    cacheOptions: {
      revalidate: 3600,
      tags: [
        tags.category(catRes.value.id),
        tags.categoryProducts(catRes.value.id),
      ],
    },
  });
  const products = r.ok
    ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
    : [];
  return { ok: true, data: { category: catRes.value, products } };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategory(slug);
  if (!result.ok) return {};
  const data = result.data;
  const description = cleanDescription(data.category.description);
  return {
    title: `${data.category.name} — ${brand.name}`,
    description: description || undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCategory(slug);
  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();
    return <CategorySkeleton />;
  }
  const { category, products } = result.data;
  const description = cleanDescription(category.description);
  const bannerImage = getCategoryBannerImage(category.slug ?? slug);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <Image
          src={bannerImage}
          alt={`${category.name} campaign banner`}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/88 via-black/62 to-black/18" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-foreground to-transparent" />
        <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-end px-6 py-10 sm:min-h-[500px] sm:px-8 sm:py-14 lg:min-h-[560px]">
          <nav className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[12px] text-background/68">
            <Link href="/" className="hover:text-background transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-background transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-background/92">{category.name}</span>
          </nav>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-background/64">
            {brand.name} category
          </p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(18rem,0.32fr)] lg:items-end">
            <div>
              <h1 className="m-0 max-w-4xl text-5xl font-semibold uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
                {category.name}
              </h1>
              {description && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/78 sm:text-lg">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 border-y border-background/28 py-4 text-background/78 lg:block lg:border-y-0 lg:border-l lg:py-0 lg:pl-6">
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-background/55">
                Current edit
              </span>
              <p className="m-0 font-mono text-sm uppercase tracking-[0.14em] tabular-nums lg:mt-3">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
          </div>
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

function cleanDescription(description?: string | null) {
  if (!description) return "";

  return decodeHtmlEntities(description)
    .replace(/<\/?p[^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function getCategoryBannerImage(slug: string) {
  const images = brand.assets.campaign;
  if (images.length === 0) return brand.assets.hero;

  const total = Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return images[total % images.length];
}

function CategorySkeleton() {
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
