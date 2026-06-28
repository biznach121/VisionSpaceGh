/**
 * Demo eyewear catalogue.
 *
 * The SDK mock ships a generic `fashion` seed (Studio FRX hoodies/tees). For the
 * demo we replace that catalogue in-place with this brand's eyewear line-up:
 * frames across the three storefront categories (prescription, futuristic, and
 * blue-light), each with a frame-fit axis and the same campaign imagery used by
 * the home page's "Shop by category" section — so a preview demo stays visually
 * consistent end to end.
 *
 * Why overwrite a live registry instead of authoring a seed? `createMockApp`
 * only accepts a built-in seed *name*, so we seed `fashion` (which also wires the
 * business, sessions and demo orders) and then swap the catalogue stores here.
 *
 * NOTE — demo only. In a real tenant the storefront reads the live catalogue and
 * its variants straight from the Cimplify dashboard; this file is never loaded
 * (see `DEMO_MODE`). Flip to a live key and the same pages render real glasses.
 */

// Frozen timestamp so build-time prerender stays deterministic.
const ISO = "2026-01-01T00:00:00.000Z";

// Frame fit run for every product. Glasses ship in a few face widths rather than
// clothing sizes; the PDP renders these as a labelled "Fit" option list.
// Demo data — a real tenant defines fits/options per product on the dashboard.
const FITS = ["Narrow", "Regular", "Wide"] as const;

type ColorVariantSpec = {
  /** Swatch label — drives the PDP colour selector ("Black" / "Tortoise"). */
  color: string;
  /** Gallery for this colourway (one or more shots). */
  images: string[];
};

type ProductSpec = {
  slug: string;
  name: string;
  price: string;
  category: string;
  description: string;
  tags?: string[];
  isSignature?: boolean;
  isNew?: boolean;
  /** Single-colourway products: the frame's gallery. Omit when `variants` is set. */
  images?: string[];
  /** Multi-colourway products: each colour carries its own gallery. */
  variants?: ColorVariantSpec[];
};

// Real frame photography. One shot per frame; products pair their own shot with
// a sibling frame's shot so every PDP gallery shows two thumbnails (demo only —
// a real tenant uploads front/angle/detail shots per product on the dashboard).
const GREEN_HEX =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397348/exlwdxciti1fol6ncbxx.png";
const NAVY_SPORT =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397347/vpqc2def1pfo1j4lnxvn.png";
const SILVER_AVIATOR =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397346/aefp7ltn5oghf1owrye6.png";
const PINK_ROUND =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397347/n67tdrluvrxctlnefvaj.png";
const RED_CATEYE =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782397345/wbdvsp4wuqzphtya36ig.png";
const TORTOISE_CATEYE =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782455913/tjbbscvo91evpqgppxrf.png";
const CLEAR_SQUARE =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782455914/cv6qgi7xzhfi0ih0figg.png";
const GOLD_ROUND =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782455916/lpsmvmif3wf2r2wsr7jc.png";

const CATEGORIES: { slug: string; name: string; description: string }[] = [
  {
    slug: "prescription",
    name: "Prescription",
    description: "Single-vision, bifocal, and progressive lenses glazed to your exact prescription.",
  },
  {
    slug: "futuristic",
    name: "Futuristic",
    description: "Bold, forward silhouettes — wraps and shields built for the road ahead.",
  },
  {
    slug: "blue-light",
    name: "Blue Light",
    description: "Screen-day comfort that filters the glare, all day.",
  },
];

// Order matters: the homepage treats the first four as "featured" and the rest
// as "new arrivals", so lead with the hero pieces.
const PRODUCTS: ProductSpec[] = [
  {
    slug: "apex-geo",
    name: "Apex Geo",
    price: "920.00",
    category: "futuristic",
    description:
      "A faceted, geometric acetate frame in deep green — the statement piece of the futuristic line.",
    tags: ["futuristic", "geometric", "signature"],
    isSignature: true,
    images: [GREEN_HEX, SILVER_AVIATOR],
  },
  {
    slug: "aria-round",
    name: "Aria Round",
    price: "680.00",
    category: "prescription",
    description:
      "A soft, translucent round optical frame glazed to your prescription. Lightweight and balanced all day.",
    tags: ["prescription", "optical", "signature"],
    isSignature: true,
    images: [PINK_ROUND, TORTOISE_CATEYE],
  },
  {
    slug: "halo-screen",
    name: "Halo Screen Glasses",
    price: "540.00",
    category: "blue-light",
    description:
      "A clear, modern square frame that filters blue-light glare for long screen days without tinting the world.",
    tags: ["blue-light", "screen", "signature", "new"],
    isSignature: true,
    isNew: true,
    images: [CLEAR_SQUARE, GOLD_ROUND],
  },
  {
    slug: "nova-aviator",
    name: "Nova Aviator",
    price: "780.00",
    category: "futuristic",
    description:
      "A precision metal aviator with a slim brow bar — classic silhouette, forward finish.",
    tags: ["futuristic", "aviator", "new"],
    isNew: true,
    images: [SILVER_AVIATOR, GREEN_HEX],
  },
  {
    slug: "soleil-cat-eye",
    name: "Soleil Cat-Eye",
    price: "620.00",
    category: "prescription",
    description:
      "A glossy red cat-eye with a sharp upsweep — a bold optical frame glazed to your strength.",
    tags: ["prescription", "cat-eye", "new"],
    isNew: true,
    images: [RED_CATEYE, PINK_ROUND],
  },
  {
    slug: "vortex-sport",
    name: "Vortex Sport",
    price: "880.00",
    category: "futuristic",
    description:
      "A close-fit matte sport frame built to stay put and cut the glare — the everyday futuristic wrap.",
    tags: ["futuristic", "sport"],
    images: [NAVY_SPORT, GREEN_HEX],
  },
  {
    slug: "marlowe-cat-eye",
    name: "Marlowe Cat-Eye",
    price: "660.00",
    category: "prescription",
    description:
      "A warm tortoise cat-eye with a confident lift — a heritage optical shape, reworked.",
    tags: ["prescription", "cat-eye"],
    images: [TORTOISE_CATEYE, RED_CATEYE],
  },
  {
    slug: "lumen-gold",
    name: "Lumen Gold",
    price: "510.00",
    category: "blue-light",
    description:
      "A slim gold round frame for the desk-to-dusk routine — quiet confidence with blue-light filtering.",
    tags: ["blue-light", "screen", "new"],
    isNew: true,
    images: [GOLD_ROUND, CLEAR_SQUARE],
  },
];

// Home-page strips (max three render; empty ones are filtered out). Slugs are
// kept stable so existing `/collections/<slug>` links stay valid.
const COLLECTIONS: { slug: string; name: string; description: string; productSlugs: string[] }[] = [
  {
    slug: "summer-2026",
    name: "New Frames 2026",
    description: "The new season line-up — optical, futuristic, and blue-light frames.",
    productSlugs: ["apex-geo", "aria-round", "halo-screen", "nova-aviator"],
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "The frames everyone's reaching for.",
    productSlugs: ["aria-round", "soleil-cat-eye", "marlowe-cat-eye", "lumen-gold"],
  },
];

// Catalogue stores we own entirely. Wiped before re-seeding so no `fashion`
// artifact (Drop 04, size variants, FRX tags…) lingers and references dead ids.
const CATALOGUE_STORES = [
  "products",
  "categories",
  "collections",
  "variants",
  "variantAxes",
  "tags",
  "addOns",
  "productAddOns",
  "bundles",
  "composites",
  "knowledgeArticles",
  "taxonomies",
  "attributeDefs",
] as const;

type Store = {
  get: (id: string) => unknown;
  put: (id: string, value: unknown) => unknown;
  reset: () => void;
};
type Registry = Record<string, Store>;

/**
 * Replace the seeded catalogue with the demo eyewear line-up. Safe to call once
 * per mock-app instance, after `createMockApp({ seed: "fashion" })`.
 */
export function applyDemoCatalogue(registry: Registry, businessId: string) {
  for (const name of CATALOGUE_STORES) registry[name]?.reset();

  const catIdBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const id = `cat_${c.slug}`;
    catIdBySlug.set(c.slug, id);
    registry.categories.put(id, {
      id,
      business_id: businessId,
      name: c.name,
      slug: c.slug,
      description: c.description,
      product_ids: [] as string[],
      display_order: 0,
      is_active: true,
      created_at: ISO,
      updated_at: ISO,
    });
  }

  for (const p of PRODUCTS) {
    const id = `prod_${p.slug}`;
    const catId = catIdBySlug.get(p.category);
    const hasColor = Boolean(p.variants?.length);

    // Colourways drive which front/angle gallery a variant shows. No colour axis →
    // one implicit colourway using the product's own [front, angle].
    const colourways = hasColor
      ? p.variants!.map((v) => ({ name: v.color, images: v.images }))
      : [{ name: null as string | null, images: p.images as string[] }];

    // Default gallery leads with the first colourway.
    const gallery: string[] = colourways[0].images;

    // ── Axes: optional Colour (display_order 0) + Fit ──
    const colorAxisId = `axis_${p.slug}_color`;
    const fitAxisId = `axis_${p.slug}_fit`;
    const colorValueId = (name: string) => `axv_${p.slug}_color_${name.toLowerCase()}`;
    const fitValueId = (fit: string) => `axv_${p.slug}_fit_${fit.toLowerCase()}`;

    if (hasColor) {
      registry.variantAxes.put(colorAxisId, {
        id: colorAxisId,
        business_id: businessId,
        product_id: id,
        name: "Colour",
        display_order: 0,
        affects_recipe: false,
        values: colourways.map((c, i) => ({
          id: colorValueId(c.name as string),
          business_id: businessId,
          axis_id: colorAxisId,
          name: c.name,
          display_order: i,
          created_at: ISO,
          updated_at: ISO,
        })),
        created_at: ISO,
        updated_at: ISO,
      });
    }

    registry.variantAxes.put(fitAxisId, {
      id: fitAxisId,
      business_id: businessId,
      product_id: id,
      name: "Fit",
      display_order: hasColor ? 1 : 0,
      affects_recipe: false,
      values: FITS.map((fit, i) => ({
        id: fitValueId(fit),
        business_id: businessId,
        axis_id: fitAxisId,
        name: fit,
        display_order: i,
        created_at: ISO,
        updated_at: ISO,
      })),
      created_at: ISO,
      updated_at: ISO,
    });

    // ── Variants: cartesian product of colourway × fit ──
    const variantIds: string[] = [];
    let first = true;
    for (const c of colourways) {
      for (const fit of FITS) {
        const colorPart = c.name ? `${c.name.toLowerCase()}-` : "";
        const variantId = `var_${p.slug}_${colorPart}${fit.toLowerCase()}`;
        const axisValueIds = c.name
          ? [colorValueId(c.name), fitValueId(fit)]
          : [fitValueId(fit)];
        registry.variants.put(variantId, {
          id: variantId,
          product_id: id,
          business_id: businessId,
          name: c.name ? `${c.name} · ${fit}` : fit,
          sku: `${p.slug.toUpperCase()}-${c.name ? `${c.name.toUpperCase()}-` : ""}${fit.toUpperCase()}`,
          price_adjustment: "0.00",
          component_multiplier: "1.00",
          is_default: first,
          is_active: true,
          axis_value_ids: axisValueIds,
          // Per-variant gallery — the PDP swaps these when a colourway is picked.
          images: c.images,
          created_at: ISO,
          updated_at: ISO,
        });
        variantIds.push(variantId);
        first = false;
      }
    }

    registry.products.put(id, {
      id,
      business_id: businessId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      product_type: "product",
      base_price: p.price,
      currency: "GHS",
      image: gallery[0],
      images: gallery,
      is_available: true,
      category_ids: catId ? [catId] : [],
      collection_ids: [] as string[],
      add_on_ids: [] as string[],
      variant_ids: variantIds,
      tags: p.tags ?? [],
      is_signature: p.isSignature ?? false,
      is_new: p.isNew ?? false,
      render_hint: "physical",
      created_at: ISO,
      updated_at: ISO,
    });

    if (catId) {
      const cat = registry.categories.get(catId) as { product_ids: string[] };
      cat.product_ids.push(id);
      registry.categories.put(catId, cat);
    }
  }

  for (const col of COLLECTIONS) {
    const id = `col_${col.slug}`;
    const productIds = col.productSlugs.map((s) => `prod_${s}`);
    registry.collections.put(id, {
      id,
      business_id: businessId,
      name: col.name,
      slug: col.slug,
      description: col.description,
      product_ids: productIds,
      is_active: true,
      created_at: ISO,
      updated_at: ISO,
    });
    for (const pid of productIds) {
      const product = registry.products.get(pid) as { collection_ids: string[] } | undefined;
      if (product) {
        product.collection_ids.push(id);
        registry.products.put(pid, product);
      }
    }
  }
}
