import { tags, type Product } from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

async function buildLlmsTxt(SITE_URL: string): Promise<string> {
  const client = getStoreClient();
  const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
    client.catalogue.getProducts(
      { limit: 500 },
      { cacheOptions: { revalidate: 3600, tags: [tags.products()] } },
    ),
    client.catalogue.getCategories({
      cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
    }),
    client.catalogue.getCollections({
      cacheOptions: { revalidate: 3600, tags: [tags.collections()] },
    }),
  ]);

  const products: Product[] = productsRes.ok ? productsRes.value.items : [];
  const categories = categoriesRes.ok ? categoriesRes.value : [];
  const collections = collectionsRes.ok ? collectionsRes.value : [];

  const lines: string[] = [];
  lines.push(`# ${brand.name}`);
  lines.push("");
  lines.push(`> ${brand.llms.summary}`);
  lines.push("");
  lines.push("## Browse");
  lines.push(`- [Home](${SITE_URL}/)`);
  lines.push(`- [Shop](${SITE_URL}/shop): Full catalogue with filter and sort.`);

  if (categories.length > 0) {
    lines.push("");
    lines.push("## Categories");
    for (const c of categories) {
      lines.push(
        `- [${c.name}](${SITE_URL}/categories/${c.slug})${c.description ? `: ${c.description}` : ""}`,
      );
    }
  }

  if (collections.length > 0) {
    lines.push("");
    lines.push("## Collections");
    for (const c of collections) {
      lines.push(
        `- [${c.name}](${SITE_URL}/collections/${c.slug})${c.description ? `: ${c.description}` : ""}`,
      );
    }
  }

  if (products.length > 0) {
    lines.push("");
    lines.push("## Products");
    for (const p of products) {
      const slug = p.slug ?? p.id;
      const price = `${brand.currency} ${p.default_price}`;
      const desc = p.description ? ` — ${p.description.replace(/\s+/g, " ").slice(0, 200)}` : "";
      lines.push(`- [${p.name}](${SITE_URL}/products/${slug}) (${price})${desc}`);
    }
  }

  lines.push("");
  lines.push("## Information");
  lines.push(`- [Journal](${SITE_URL}/journal)`);
  lines.push(`- [About](${SITE_URL}/about)`);
  lines.push(`- [Support / FAQ](${SITE_URL}/faq)`);
  lines.push(`- [Terms of Service](${SITE_URL}/terms)`);
  lines.push(`- [Privacy Policy](${SITE_URL}/privacy)`);
  lines.push(`- [Sitemap (XML)](${SITE_URL}/sitemap.xml)`);
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${brand.contact.email}`);
  lines.push(`- Phone: ${brand.contact.phone}`);
  lines.push(`- Address: ${brand.contact.address}`);

  return lines.join("\n") + "\n";
}

/**
 * `/llms.txt` — machine-readable site index for LLMs (per llmstxt.org).
 * Lets coding agents and chat assistants find products, categories, and
 * support pages without scraping HTML. Plain Markdown so it streams cheaply
 * into context windows.
 */
export async function GET(): Promise<Response> {
  const body = await buildLlmsTxt(await getSiteUrl());
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
