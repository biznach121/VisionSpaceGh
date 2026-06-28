import type { Metadata } from "next";
import Link from "next/link";
import { tags, type Product } from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Sitemap — ${brand.name}`,
  description: "A human-readable index of every page on this site.",
};

export const revalidate = 3600;

interface SitemapData {
  products: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
}

async function getSitemap(): Promise<SitemapData> {
  const client = getStoreClient();
  const [pRes, cRes, colRes] = await Promise.all([
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
  return {
    products: (pRes.ok ? pRes.value.items : []).map((p: Product) => ({
      slug: p.slug ?? p.id,
      name: p.name,
    })),
    categories: (cRes.ok ? cRes.value : []).map((c) => ({ slug: c.slug, name: c.name })),
    collections: (colRes.ok ? colRes.value : []).map((c) => ({ slug: c.slug, name: c.name })),
  };
}

const STATIC_LINKS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Browse",
    links: [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/search", label: "Search" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Account" },
      { href: "/account/orders", label: "Orders" },
      { href: "/account/addresses", label: "Addresses" },
      { href: "/account/settings", label: "Settings" },
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/track-order", label: "Track an order" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Machine-readable",
    links: [
      { href: "/sitemap.xml", label: "sitemap.xml (search engines)" },
      { href: "/llms.txt", label: "llms.txt (LLM agents)" },
      { href: "/robots.txt", label: "robots.txt" },
      { href: "/opensearch.xml", label: "opensearch.xml (browser search)" },
    ],
  },
];

export default async function SitemapHtmlPage() {
  const { products, categories, collections } = await getSitemap();

  return (
    <article className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
        Sitemap
      </p>
      <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-semibold mb-2 -tracking-[0.02em]">
        Every page, in one place.
      </h1>
      <p className="text-muted-foreground mb-12">
        For search engines, see <Link href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</Link>.
        For LLM agents, see <Link href="/llms.txt" className="text-primary hover:underline">/llms.txt</Link>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {STATIC_LINKS.map((s) => (
          <Section key={s.title} title={s.title}>
            {s.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </Section>
        ))}
        {categories.length > 0 && (
          <Section title="Categories">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </Section>
        )}
        {collections.length > 0 && (
          <Section title="Collections">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </Section>
        )}
        {products.length > 0 && (
          <Section title={`Products (${products.length})`}>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/shop?product=${encodeURIComponent(p.slug)}`} className="hover:text-primary transition-colors">
                  {p.name}
                </Link>
              </li>
            ))}
          </Section>
        )}
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-[12px] uppercase tracking-[0.12em] text-foreground mb-3">
        {title}
      </p>
      <ul className="space-y-2 m-0 p-0 list-none text-sm text-muted-foreground">
        {children}
      </ul>
    </div>
  );
}
