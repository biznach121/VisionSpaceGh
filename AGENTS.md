# AGENTS.md — Retail / electronics storefront template

If you are an AI agent (Claude, Cursor, Aider, devin, …) working on this storefront, **start here.**

## TL;DR for rebranding

1. **Edit `lib/brand.ts`** — every visible string lives here.
2. **Edit `app/globals.css`** — `@theme { … }` block for palette + radius + font references.
3. **Edit `.env.local`** — `NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY` (optional: `NEXT_PUBLIC_SITE_URL`).

## Aesthetic

- **Inter + JetBrains Mono** — clean modern sans, mono-spaced labels for spec-feel.
- **Cool navy + electric blue**: dark foreground, electric primary.
- **Sharp corners**: `0.5rem` — modern retail.
- **Section heroes** in dark with mono-spaced eyebrow labels.

## Page surface

```
app/
  page.tsx                       Multi-section home — split hero, trust bar, category tiles,
                                  promo banner, "Just dropped" grid, brand strip, collections,
                                  trade-in CTA, best sellers, newsletter
  shop/page.tsx                  SDK <CataloguePage/> with custom hero
  search/page.tsx                Search (SDK <SearchPage/>)
  collections/[slug]/page.tsx    Collection landing
  categories/[slug]/page.tsx     Category landing
  products/[slug]/page.tsx       Full product detail page (Product JSON-LD)

  cart/page.tsx                  SDK <CartPage/>
  checkout/page.tsx              SDK <CheckoutPage/>
  orders/[id]/page.tsx           Post-checkout confirmation

  account/page.tsx               <CimplifyAccount /> (iframe)
  account/orders/page.tsx        <CimplifyAccount section="orders" />
  account/addresses/page.tsx     <CimplifyAccount section="addresses" />
  account/settings/page.tsx      <CimplifyAccount section="settings" />
  login/page.tsx, signup/page.tsx  redirects → /account

  contact/page.tsx               Branded contact form
  track-order/page.tsx           Guest lookup → /orders/[id]

  about/page.tsx, faq/page.tsx   Brand pages
  shipping/page.tsx, returns/page.tsx, accessibility/page.tsx  Standalone policies
  terms/page.tsx, privacy/page.tsx

  sitemap-page/page.tsx          HTML sitemap
  sitemap.ts, robots.ts          XML sitemap, robots.txt
  llms.txt/route.ts              LLM-friendly site index
  opensearch.xml/route.ts        Browser search description
  error.tsx, not-found.tsx       Global boundaries
```

## File ↔ brand-field map

| File | Reads from `brand` |
|---|---|
| `app/layout.tsx` | identity, contact, socials, schemaType (Store JSON-LD) |
| `app/page.tsx` | `brand.hero`, `brand.trustItems`, `brand.brandStrip`, `brand.promo`, `brand.tradeIn`, `brand.newsletter` |
| `app/about/page.tsx` | `brand.about` |
| `app/faq/page.tsx` | `brand.faq` |
| `app/terms/page.tsx` | `brand.terms` |
| `app/privacy/page.tsx` | `brand.privacy` |
| `app/shipping/page.tsx` | `brand.shipping` (warranty + returns + same-day delivery copy) |
| `app/returns/page.tsx` | `brand.returns` |
| `app/accessibility/page.tsx` | `brand.accessibility` |
| `app/contact/page.tsx` | `brand.contactPage`, `brand.contact` |
| `app/track-order/page.tsx` | `brand.trackOrder` |
| `app/account/*/page.tsx` | `brand.account` (Cimplify Link iframe owns the UI) |
| `app/products/[slug]/page.tsx` | `brand.name`, `brand.currency` (Product JSON-LD: brand, offer, availability) |
| `app/llms.txt/route.ts` | `brand.llms`, contact, currency |
| `app/opensearch.xml/route.ts` | `brand.shortName`, `brand.name` |
| `components/header.tsx` | `brand.shortName`, `brand.microTag`, `brand.header.nav` |
| `components/footer.tsx` | `brand.footer`, `brand.contact`, `brand.socials` |
| `components/promo-banner.tsx` | `brand.promo` (renders nothing if absent) |
| `components/trade-in-cta.tsx` | `brand.tradeIn` (renders nothing if absent) |
| `components/brand-marquee.tsx` | `brand.brandStrip` |
| `components/trust-bar.tsx` | `brand.trustItems` |
| `components/newsletter.tsx` | `brand.newsletter` |

## Retail-specific notes

- Product detail is a **full `/products/[slug]` page** with image gallery, customizer, related products rail, and Product JSON-LD. Consideration purchases (phones, laptops, headphones) need real estate. Don't replace with a modal.
- Schema.org `@type` is `Store`.
- Optional sections render conditionally: set `brand.promo`, `brand.tradeIn`, `brand.trustItems`, or `brand.brandStrip` to `undefined` to hide them.
- `app/page.tsx` uses an Unsplash fallback hero (`HERO_FALLBACK_IMAGE`) — replace with the merchant's own product photography.

## Known TODOs

- Contact form + newsletter signup currently fake their submit. Wire `client.support.sendMessage(...)` for contact and a real list provider for newsletter.
- Trust-bar / brand-marquee imagery / wordmarks are placeholders — swap for the merchant's real partners.

## Mock seed

Wired to `--seed retail` (Currents Electronics). Edit `dev:mock` in `package.json` to preview another seed.

## Customizing SDK components

For anything beyond `lib/brand.ts` + `app/globals.css`, lean on the SDK's prebuilt components rather than reinvent. **Especially for product customization** (variants, add-ons, bundles, composites, services with scheduling) — the SDK already gets price math, axis matching, and cart payload contracts right. Default to ejecting and restyling:

```bash
cimplify add cart-drawer
cimplify add variant-selector
cimplify add product-page
```

Then edit the local copy. **Don't change the cart payload shape** unless you're also touching the SDK mock + backend lens. Full ejection rules and the customizer contract are in the SDK-level [`AGENTS.md`](../../AGENTS.md) → "Don't reinvent product customization".

## Quick start

```bash
bun install
bun dev
```

Open <http://localhost:3000>.
