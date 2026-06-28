# alleyes

A Cimplify storefront for **ALL eyes** - Next.js 16 (App Router), React 19, Tailwind v4, and `@cimplify/sdk` 0.70.x. It uses the fashion mock seed locally and Cimplify customer auth for account, checkout, and saved customer details.

## Run

```bash
bun install
bun dev
```

Two things start in parallel:

- `cimplify-mock --seed fashion --quiet` - the Cimplify mock API on `http://127.0.0.1:8787`.
- `next dev` — this storefront on `http://localhost:3000`.

Open the storefront in your browser. Edit `lib/brand.ts` for visible copy and `app/globals.css` for theme tokens.

## Structure

```
app/
  layout.tsx              # root layout, fonts, providers, header/footer/modal
  page.tsx                # home
  shop/page.tsx           # full catalogue (SDK <CataloguePage/>)
  collections/[slug]/     # collection landing
  categories/[slug]/      # category landing
  cart/page.tsx           # SDK <CartPage/>
  checkout/page.tsx       # SDK <CheckoutPage/> with customer auth config bootstrap
  orders/[id]/page.tsx    # post-checkout thank-you
  account/page.tsx        # Cimplify customer account portal
  auth/*                  # customer OAuth callback/session/signout routes
  about, faq, terms, privacy
  globals.css             # Tailwind import + theme tokens
components/
  providers.tsx           # CimplifyProvider client wrapper
  header.tsx, footer.tsx, hero.tsx
  auth-controls.tsx       # customer sign-in/out controls
  store-product-card.tsx  # SDK <ProductCard/> wired to product pages
  product-modal.tsx       # ?product=<slug> deep-linkable modal
  collection-strip.tsx    # horizontal product strip
  category-grid.tsx       # SDK <CategoryGrid/> with router navigation
lib/
  auth-config.ts          # Cimplify auth env normalization
  cart.ts                 # useCartCount() for the header pill
  store-client.ts         # getStoreClient(): demo mock vs getServerClient()
  demo/flags.ts           # DEMO_MODE switch
  demo/mock.ts            # in-process fashion mock + demo client
app/
  api/demo/[...path]/route.ts  # browser entry to the in-process mock (demo only)
```

## Switch the seed

This storefront is wired to the `fashion` seed. To preview a different industry without re-scaffolding:

```bash
cimplify-mock --seed retail       # Currents Electronics
cimplify-mock --seed restaurant   # Mama's Kitchen
cimplify-mock --seed services     # Serene Spa
cimplify-mock --seed grocery      # FreshMart
```

For a fresh scaffold with another design altogether:

```bash
cimplify init my-store --template bakery     # warm food/pastry
cimplify init my-store --template restaurant # coming soon
cimplify init my-store --template services   # coming soon
cimplify init my-store --template grocery    # coming soon
```

## Demo mode (push to Vercel with no backend)

`bun dev` runs a local mock on `:8787`. That mock doesn't exist on Vercel, so a
plain deploy (without a live key) shows an empty/broken store. **Demo mode**
fixes this: it embeds the same `fashion` mock catalogue *inside the app* and
serves it in-process, so a Vercel deploy renders a full, clickable store —
product pages, cart, checkout — with **no backend and no key**.

It's a single switch:

```bash
# .env (Vercel env var or .env.local)
DEMO_MODE=1   # embedded mock — ships to Vercel, works with no backend
DEMO_MODE=0   # normal storefront — uses your real cpk_ key for live data
```

Pasting a real `cpk_live_*` / `cpk_test_*` key **auto-disables** demo mode even
if `DEMO_MODE=1`, so going live needs no code change. How it works:

- `lib/demo/flags.ts` — `DEMO_MODE = DEMO_MODE==="1" && no real cpk_ key`.
- `lib/store-client.ts` — `getStoreClient()` returns the in-process mock client
  in demo mode, else the normal `getServerClient()`. Server Components call this
  instead of `getServerClient` directly.
- `next.config.ts` — in demo mode, rewrites same-origin SDK calls (`/api/v1/*`,
  `/v1/link/*`, `/elements/*`, `/img/*`) to `app/api/demo/[...path]/route.ts`,
  which replays them against the in-process `fashion` mock. No request ever
  leaves Vercel.

> Demo mode's mock route runs on the Node runtime (`@cimplify/sdk/mock` uses
> `node:crypto`) — Vercel-native. Product images come from the allow-listed
> Cimplify CDN, so they render without a backend.

## Go live

```diff
# .env.local
- NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY=mock-dev
+ NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY=<your tenant key>
```

Setting a real `cpk_*` key turns demo mode off automatically (you can also set
`DEMO_MODE=0` explicitly).

Deploy with `cimplify deploy --prod` after linking the project. See [`cimplify` CLI docs](https://www.cimplify.dev/docs/cli). `next.config.ts` already whitelists the SDK image hosts under `images.remotePatterns`.

For customer auth in local/custom deployments, also set `NEXT_PUBLIC_CIMPLIFY_CLIENT_ID`, `NEXT_PUBLIC_CIMPLIFY_REDIRECT_URI`, and the matching server-side `CIMPLIFY_CLIENT_ID` / `CIMPLIFY_REDIRECT_URI` values. See `.env.example` for the complete shape.
