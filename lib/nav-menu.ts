import "server-only";
import { tags, type Product } from "@cimplify/sdk/server";
import { getStoreClient } from "./store-client";
import { brand } from "./brand";

export interface NavMenuPreview {
  name: string;
  href: string;
  image: string;
}

export interface NavMenuItem {
  label: string;
  href: string;
  /** Present only for `/categories/<slug>` links — a few products to preview on hover. */
  preview?: NavMenuPreview[];
}

export interface CategoryMenuItem {
  label: string;
  slug: string;
  href: string;
  /** A few full products from this category, rendered as cards in the sidebar. */
  products: Product[];
}

const PREVIEW_LIMIT = 4;

/**
 * Builds the desktop nav with a per-category product preview for the hover
 * mega-menu. Category links resolve their slug to real products; non-category
 * links (Shop, Journal) pass through with no preview. ISR-cached so the root
 * layout can call it on every route cheaply.
 */
export async function getNavMenu(): Promise<NavMenuItem[]> {
  const client = getStoreClient();
  const catRes = await client.catalogue.getCategories({
    cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
  });
  const categories = catRes.ok ? catRes.value : [];
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return Promise.all(
    brand.header.nav.map(async (link): Promise<NavMenuItem> => {
      const slug = link.href.match(/^\/categories\/(.+)$/)?.[1];
      const category = slug ? bySlug.get(slug) : undefined;
      if (!category) return { label: link.label, href: link.href };

      const r = await client.catalogue.getCategoryProducts(category.id, undefined, {
        cacheOptions: {
          revalidate: 3600,
          tags: [tags.categoryProducts(category.id)],
        },
      });
      const items: Product[] = r.ok
        ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
        : [];

      const preview = items.slice(0, PREVIEW_LIMIT).map((p) => ({
        name: p.name,
        href: `/products/${p.slug ?? p.id}`,
        image: p.image_url ?? p.images?.[0] ?? brand.assets.logo,
      }));

      return { label: link.label, href: link.href, preview: preview.length ? preview : undefined };
    }),
  );
}

/**
 * Every category plus a few product shots each, for the navbar "Categories"
 * sidebar. ISR-cached so the root layout can call it on every route cheaply.
 */
export async function getCategoryMenu(): Promise<CategoryMenuItem[]> {
  const client = getStoreClient();
  const catRes = await client.catalogue.getCategories({
    cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
  });
  const categories = catRes.ok ? catRes.value : [];

  return Promise.all(
    categories.map(async (category): Promise<CategoryMenuItem> => {
      const r = await client.catalogue.getCategoryProducts(category.id, undefined, {
        cacheOptions: {
          revalidate: 3600,
          tags: [tags.categoryProducts(category.id)],
        },
      });
      const items: Product[] = r.ok
        ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
        : [];

      return {
        label: category.name,
        slug: category.slug,
        href: `/categories/${category.slug}`,
        products: items.slice(0, PREVIEW_LIMIT),
      };
    }),
  );
}
