import type { MetadataRoute } from "next";
import { type Product } from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/journal", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteUrl = await getSiteUrl();
  const client = getStoreClient();

  const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
    client.catalogue.getProducts({ limit: 500 }),
    client.catalogue.getCategories(),
    client.catalogue.getCollections(),
  ]);

  const products = productsRes.ok ? productsRes.value.items : [];
  const categories = categoriesRes.ok ? categoriesRes.value : [];
  const collections = collectionsRes.ok ? collectionsRes.value : [];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p: Product) => ({
    url: `${siteUrl}/products/${p.slug ?? p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...collectionEntries, ...productEntries];
}
