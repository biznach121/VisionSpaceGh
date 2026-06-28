import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { tags, type Collection, type Product } from "@cimplify/sdk/server";
import { getStoreClient } from "@/lib/store-client";
import { BlogTeaser } from "@/components/blog-teaser";
import { BorderedProductGrid } from "@/components/bordered-product-grid";
import { FeaturedFrames } from "@/components/featured-frames";
// import { FloatingGlasses } from "@/components/floating-glasses";
import { HeroCarousel } from "@/components/hero-carousel";
import { SocialVideos } from "@/components/social-videos";
import { TrustBar } from "@/components/trust-bar";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: brand.hero.title,
  description: brand.description,
};

export const revalidate = 3600;

interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}

async function getHomeData() {
  const client = getStoreClient();
  const [colRes, productsRes] = await Promise.all([
    client.catalogue.getCollections({
      cacheOptions: { revalidate: 3600, tags: [tags.collections()] },
    }),
    client.catalogue.getProducts(
      { limit: 12 },
      { cacheOptions: { revalidate: 3600, tags: [tags.products()] } },
    ),
  ]);
  const collections = colRes.ok ? colRes.value : [];
  const allProducts = productsRes.ok ? productsRes.value.items : [];

  const collectionsWithProducts: CollectionWithProducts[] = await Promise.all(
    collections.slice(0, 3).map(async (col) => {
      const r = await client.catalogue.getCollectionProducts(
        col.id,
        undefined,
        {
          cacheOptions: {
            revalidate: 3600,
            tags: [tags.collectionProducts(col.id)],
          },
        },
      );
      const items = r.ok
        ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
        : [];
      return { collection: col, products: items };
    }),
  );

  return {
    collections: collectionsWithProducts.filter(
      (x) =>
        x.products.length > 0 &&
        // Hide the "New Frames 2026" strip — keep Best Sellers on the home page.
        x.collection.slug !== "summer-2026" &&
        !/drop\s*0*4/i.test(x.collection.name) &&
        !/drop-0*4/i.test(x.collection.slug ?? ""),
    ),
    featured: allProducts.slice(0, 4),
    newArrivals: allProducts.slice(4, 12),
  };
}

export default async function HomePage() {
  const { collections, featured, newArrivals } = await getHomeData();
  const images = brand.assets.campaign;
  const fashion = brand.fashion;
  const imageAt = (index: number) => images[index % images.length];

  return (
    <>
      <div className="sticky top-0 z-0 h-svh overflow-hidden">
        <HeroCarousel
        eyebrow={fashion.season}
        title={brand.hero.title}
        body={brand.hero.subtitle}
        primaryCta={{ label: brand.hero.primaryCtaLabel, href: "/shop" }}
        secondaryCta={
          brand.hero.secondaryCtaLabel && brand.hero.secondaryCtaHref
            ? { label: brand.hero.secondaryCtaLabel, href: brand.hero.secondaryCtaHref }
            : undefined
        }
        slides={[
          {
            kind: "video",
            src: brand.assets.heroVideo,
            poster: brand.assets.hero,
            alt: brand.name,
          },
        ]}
        />
      </div>

      <div className="relative z-10 bg-background">
      <TrustBar />

      <section className="bg-background text-foreground">
        <div className="grid grid-cols-1 lg:min-h-[92vh] lg:grid-cols-2">
          <EditorialPanel
            image="https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397287/mypkwrjgq5etmjttwkzb.jpg"
            eyebrow="Sunglasses"
            title="Sunglasses"
            body="UV-ready sunglasses in classic and statement shapes, made for the first glance and the second look."
            href="/shop"
            cta="Discover the selection"
          />
          <EditorialPanel
            image="https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397287/nnudhxncil1iurojonlg.jpg"
            eyebrow="Designer glasses"
            title="Designer glasses"
            body="Designer frames from the names you know — fitted to your prescription in-store."
            href="/shop"
            cta="Discover the selection"
            dark
          />
        </div>
      </section>

      <FeaturedFrames
        eyebrow="The selection"
        title="Shop the frames"
        products={[...featured, ...newArrivals]}
      />

      {/* 3D model section temporarily hidden
      <FloatingGlasses />
      */}

      <CategoryHighlight section={fashion.categoryHighlight} />

      <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-foreground pb-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              New arrivals
            </p>
            <h2 className="m-0 text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
              Fresh from the studio
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold uppercase tracking-[0.16em] underline underline-offset-8">
            Browse all
          </Link>
        </div>
        <Suspense fallback={<GridSkeleton count={4} />}>
          <BorderedProductGrid products={[...featured, ...newArrivals]} limit={4} />
        </Suspense>
      </section>

      <FullBleedStory
        image={brand.assets.denimStory}
        eyebrow="Statement"
        title={fashion.denimTitle}
        body={fashion.denimBody}
        href="/shop"
      />

      <SeenBySection section={fashion.seenBy} />

      {collections.map(({ collection, products }) => (
        <section
          key={collection.id}
          className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
        >
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-foreground pb-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                The edit
              </p>
              <h2 className="m-0 text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
                {collection.name}
              </h2>
            </div>
            <Link
              href={`/collections/${collection.slug}`}
              className="text-sm font-semibold uppercase tracking-[0.16em] underline underline-offset-8"
            >
              Browse all
            </Link>
          </div>
          <Suspense fallback={<GridSkeleton count={4} />}>
            <BorderedProductGrid products={products} limit={4} />
          </Suspense>
        </section>
      ))}

      <section className="grid grid-cols-1 border-y border-border bg-[#f4efe8] lg:grid-cols-2">
        <div className="relative min-h-[420px] sm:min-h-[70vh]">
          <Image
            src={imageAt(5)}
            alt={`${brand.name} frame campaign`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:min-h-[60vh] sm:px-10 lg:px-16">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Full set
          </p>
          <h2 className="m-0 max-w-2xl text-5xl font-semibold uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
            {fashion.accessoriesTitle}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {fashion.accessoriesBody}
          </p>
          <div className="mt-8">
            <FashionLink href="/categories/prescription">Shop the range</FashionLink>
          </div>
        </div>
      </section>

      <SocialVideos handle={fashion.socialHandle} />

      <BlogTeaser />
      </div>
    </>
  );
}

function EditorialPanel({
  image,
  eyebrow,
  title,
  body,
  href,
  cta,
  dark = false,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  dark?: boolean;
}) {
  return (
    <article className={dark ? "bg-neutral-950 text-white" : "bg-[#f4efe8] text-foreground"}>
      <div className="relative min-h-[420px] overflow-hidden sm:min-h-[68vh]">
        <Image src={image} alt={`${title} campaign`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
        <p className={dark ? "mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-white/55" : "mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"}>
          {eyebrow}
        </p>
        <h2 className="m-0 text-[2.4rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className={dark ? "mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70" : "mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground"}>
          {body}
        </p>
        <Link href={href} className="mt-6 inline-block text-sm font-semibold uppercase tracking-[0.16em] underline underline-offset-8">
          {cta}
        </Link>
      </div>
    </article>
  );
}

function CategoryHighlight({
  section,
}: {
  section: {
    eyebrow: string;
    title: string;
    items: { slug: string; label: string; blurb: string; href: string; image: string }[];
  };
}) {
  const [lead, ...rest] = section.items;
  return (
    <section className="relative overflow-hidden bg-[#f4f1e8] text-foreground">
      {/* Static grid + olive colour sweeping through it (mask = the grid). */}
      <style>{`
        @keyframes seenby-color-sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @media (prefers-reduced-motion: reduce) { .seenby-sweep { animation: none !important; } }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(42,38,22,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(42,38,22,0.05) 1px, transparent 1px)," +
            "linear-gradient(to right, rgba(42,38,22,0.10) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(42,38,22,0.10) 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px, 176px 176px, 176px 176px",
        }}
      />
      <div
        aria-hidden="true"
        className="seenby-sweep pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 38%, rgba(83,75,41,0.7) 50%, transparent 62%)",
          backgroundSize: "220% 100%",
          WebkitMaskImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          maskImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          WebkitMaskSize: "44px 44px, 44px 44px",
          maskSize: "44px 44px, 44px 44px",
          animation: "seenby-color-sweep 6s linear infinite",
        }}
      />
      <div className="relative mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/50">
            {section.eyebrow}
          </p>
          <h2 className="m-0 max-w-3xl text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
            {section.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_3fr] lg:gap-4">
          {lead && <CategoryTile item={lead} className="min-h-[420px] lg:min-h-[680px]" priority />}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
            {rest.map((item) => (
              <CategoryTile key={item.slug} item={item} className="min-h-[300px] lg:min-h-[332px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  item,
  className,
  priority = false,
}: {
  item: { slug: string; label: string; blurb: string; href: string; image: string };
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative block overflow-hidden bg-neutral-900 ${className ?? ""}`}
    >
      <Image
        src={item.image}
        alt={`${item.label} glasses`}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
        <h3 className="m-0 text-2xl font-semibold uppercase leading-[0.95] tracking-normal text-white sm:text-3xl lg:text-4xl">
          {item.label}
        </h3>
        <p className="m-0 max-w-sm text-sm leading-relaxed text-white/70">{item.blurb}</p>
        <span className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-white underline underline-offset-8">
          Shop {item.label}
        </span>
      </div>
    </Link>
  );
}

function FullBleedStory({
  image,
  eyebrow,
  title,
  body,
  href,
}: {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-black text-white sm:min-h-[92vh]">
      <Image src={image} alt={`${title} campaign`} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative flex min-h-[78svh] flex-col justify-end px-6 py-12 sm:min-h-[92vh] sm:px-10 lg:px-16">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">
          {eyebrow}
        </p>
        <h2 className="m-0 max-w-4xl text-[3.5rem] font-semibold uppercase leading-[0.86] tracking-normal sm:text-8xl lg:text-9xl">
          {title}
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/78">{body}</p>
        <div className="mt-8">
          <FashionLink href={href}>Discover the selection</FashionLink>
        </div>
      </div>
    </section>
  );
}

function SeenBySection({
  section,
}: {
  section: {
    eyebrow: string;
    title: string;
    people: { role: string; name: string; image: string }[];
  };
}) {
  return (
    <section className="relative overflow-hidden bg-[#f4f1e8] px-4 py-16 text-foreground sm:px-6 sm:py-20 lg:px-10 lg:py-24">
      {/* Keyframes inline so they ship with the component (not subject to the
          CSS pipeline's class scanning). The grid stays put; only the colour
          band moves, so colour appears to flow through the fixed grid lines. */}
      <style>{`
        @keyframes seenby-color-sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @media (prefers-reduced-motion: reduce) { .seenby-sweep { animation: none !important; } }
      `}</style>
      {/* Static grid lines — faint minor + slightly stronger major. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(42,38,22,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(42,38,22,0.05) 1px, transparent 1px)," +
            "linear-gradient(to right, rgba(42,38,22,0.10) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(42,38,22,0.10) 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px, 176px 176px, 176px 176px",
        }}
      />
      {/* Olive colour band sweeping across, clipped to the grid lines (mask is
          the static grid) so the colour flows along the fixed grid. */}
      <div
        aria-hidden="true"
        className="seenby-sweep pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 38%, rgba(83,75,41,0.7) 50%, transparent 62%)",
          backgroundSize: "220% 100%",
          WebkitMaskImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          maskImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          WebkitMaskSize: "44px 44px, 44px 44px",
          maskSize: "44px 44px, 44px 44px",
          animation: "seenby-color-sweep 6s linear infinite",
        }}
      />
      <div className="relative mx-auto max-w-[1900px]">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 lg:mb-12">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/50">
            {section.eyebrow}
          </p>
          <h2 className="m-0 max-w-5xl text-[2.8rem] font-semibold uppercase leading-[0.9] tracking-normal sm:text-6xl lg:text-8xl">
            {section.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
          {section.people.map((person) => (
            <article
              key={person.name}
              className="group relative min-h-[560px] overflow-hidden bg-neutral-900 sm:min-h-[680px] md:min-h-[620px] lg:min-h-[760px]"
            >
              <Image
                src={person.image}
                alt={`${person.name} wearing ${brand.name}`}
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FashionLink({
  href,
  children,
  inverted = false,
}: {
  href: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  const base =
    "fill-btn group relative inline-flex min-h-11 w-full items-center justify-center overflow-hidden px-5 text-center text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:text-primary-foreground min-[420px]:w-auto";
  const variant = inverted
    ? "border border-current text-current"
    : "border border-white bg-white text-black";
  return (
    <Link href={href} className={`${base} ${variant}`}>
      <span className="relative z-[1]">{children}</span>
    </Link>
  );
}

function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse bg-muted" />
      ))}
    </div>
  );
}

