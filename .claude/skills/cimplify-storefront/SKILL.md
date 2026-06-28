---
name: cimplify-storefront
description: Build, customize, rebrand, or deploy a Cimplify-scaffolded storefront. Triggers when the user asks to create a storefront, rebrand a Cimplify template, change the palette, add a page, deploy to Cimplify, or works in a project containing `lib/brand.ts` and `next.config.ts`.
---

# Cimplify Storefront skill

You're working on a project scaffolded from `cimplify init`. The architecture is opinionated and the rebrand surface is intentionally small. Read `AGENTS.md` at the project root for the file ↔ brand-field map for *this template's* industry; this skill gives you the playbook that's the same across all eight.

## The contract — never break

1. **`lib/brand.ts` is the only place for content edits.** Every visible string reads from this file. If a string isn't in `brand`, *add a field* to the `Brand` interface — don't hardcode it in a page or component.
2. **`app/globals.css` `@theme { … }`** holds palette + radius + font references. To re-skin the entire site, edit only this block.
3. **Pages use ISR**, not Cache Components. Each page sets `export const revalidate = <seconds>` and reads from the SDK with `cacheOptions: { revalidate, tags }`. Don't add `'use cache'` / `cacheTag` / `cacheLife` — they require Node-specific runtime guarantees Cloudflare Workers doesn't provide, and their postponed state blows past CF's 128MB zlib limit.
4. **`cacheComponents` stays OFF** in `next.config.ts`. The deploy target is Cloudflare Workers via opennext.
5. **Client islands** (anything reading `useSearchParams`, `usePathname`, `useRouter`, `useState`) live behind `<Suspense>`.
6. **`bun run test:run` (vitest)** is the canonical test runner. `bun test` will show false failures because Bun's `vi` shim is incomplete.
7. **Cart, checkout, orders stay client.** They're session-bound. Don't try to SSR them.

## The brand-field schema (in `lib/brand.ts`)

```
identity:        name, shortName, microTag, description, schemaType, currency, locale
contact:         address, streetAddress, city, countryCode, phone, phoneTel, email, privacyEmail, hours
socials:         [{ label, href, icon }]   // icon ∈ instagram|x|tiktok|facebook|youtube|linkedin|whatsapp
header:          { nav: [{ label, href }] }
hero:            { badge, title, subtitle, primaryCtaLabel, secondaryCtaLabel?, secondaryCtaHref? }
optional:        trustItems[]?, brandStrip?, promo?, tradeIn?     // render conditionally
newsletter:      { eyebrow, title, body, placeholder, submitLabel, successLabel }
about:           { eyebrow, title, paragraphs[], sections[{ heading, body }] }
faq:             { eyebrow, title, sections[{ title, items[{ q, a }] }], contactPrompt, contactEmail }
terms,
privacy,
shipping,
returns,
accessibility:   { eyebrow, title, lastUpdated, sections[{ heading, body | { intro, bullets[] } }] }
account:         eyebrows + titles for /account, /login, /signup
contactPage:     { eyebrow, title, body, reasons[], directLines[{ label, value, href }] }
trackOrder:      { eyebrow, title, body }
footer:          { blurb, sitemap[{ title, links[] }], poweredBy? }
llms:            { summary }                           // opens /llms.txt
mock:            { seed, businessId }
```

## Playbook — common tasks

### Rebrand a storefront for a new merchant

1. Edit `lib/brand.ts`. Replace every field with the merchant's content. Use the brief / context the user gave you.
2. Edit `app/globals.css` `@theme { … }`. Change `--color-primary`, `--color-background`, `--color-foreground`, optionally `--radius`. Use OKLCH; if the brand only gave hex, convert.
3. (Optional) Swap fonts in `app/layout.tsx` — `next/font/google` import + the variable wired into the `<html>` className.
4. Set `.env.local`: `NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY` (optional: `NEXT_PUBLIC_SITE_URL`).

Don't touch any other file. If the rebrand needs content not in the schema, add the field to `Brand` first, populate it, then read it from the page.

### Add a new section / component

1. Build it as a Server Component in `components/` (or a client island in `*-client.tsx` if interactive).
2. Read merchant copy from `brand`. Add new fields to the `Brand` interface if needed.
3. Wrap interactive bits in `<Suspense fallback={…}>` so static chrome streams first.
4. Compose into the page.

### Wire a Server Action that mutates data

```ts
"use server";
import { getServerClient, revalidateProducts } from "@cimplify/sdk/server";

export async function createProduct(input: ProductInput) {
  await getServerClient().catalogue.createProduct(input);
  revalidateProducts();
}
```

After every mutation, call the matching `revalidate*` helper from `@cimplify/sdk/server`: `revalidateProducts`, `revalidateProduct(id)`, `revalidateCategories`, `revalidateCategory(id)`, `revalidateCollections`, `revalidateCollection(id)`, `revalidateBusiness`. These fire eviction events the central tag-cache worker picks up — it drops R2 entries and purges Cloudflare's edge.

### Add a Server Component data fetch (ISR)

```ts
import { getServerClient, tags } from "@cimplify/sdk/server";

export const revalidate = 3600; // page-level baseline

async function getProducts() {
  const r = await getServerClient().catalogue.getProducts({
    limit: 24,
    cacheOptions: { revalidate: 3600, tags: [tags.products()] },
  });
  if (!r.ok) {
    // Soft-render on transient errors so the page degrades gracefully
    // instead of hard-failing with React #419. Only call notFound() on
    // genuine 404 from origin.
    if (r.error.code === "NOT_FOUND") notFound();
    return [];
  }
  return r.value.items;
}
```

For `[slug]` routes, add `generateStaticParams` with a placeholder fallback so the page is statically prerenderable even with no upstream data yet:

```ts
export async function generateStaticParams() {
  return [{ slug: "__placeholder__" }];
}
```

### Eject an SDK component for deeper customization

Try `classNames`, `renderImage`, `renderLink`, slot props first. If those run out:

```bash
cimplify list
cimplify add product-card --dir src/components/cimplify
```

Once ejected, the file is yours. Hooks/types still come from `@cimplify/sdk`.

### Deploy

```bash
cimplify login
cimplify projects create my-store
cimplify link <project-id>
cimplify env push
cimplify deploy --prod
cimplify logs --follow
cimplify domains add my-store.com
```

## Pitfalls — explicit ❌ list

- ❌ Hardcoding any visible string in a page or component. Always `brand.X`.
- ❌ Adding `'use cache'`, `cacheTag`, `cacheLife`, or enabling `cacheComponents: true`. We deploy to Cloudflare Workers; postponed state exceeds the 128MB zlib limit. Use `cacheOptions` on SDK reads + `export const revalidate` per page.
- ❌ Using `unstable_cache` — removed in Next 16. Use SDK `cacheOptions` instead.
- ❌ Bypassing `getServerClient()` and calling `createCimplifyClient` directly in a Server Component — loses per-request memoization.
- ❌ Mutating data without calling the matching `revalidate*` helper.
- ❌ Calling `notFound()` on transient SDK errors — causes React #419 mid-stream. Check the `Result.error.code === "NOT_FOUND"` first; otherwise soft-render a skeleton.
- ❌ Adding an `app/error.tsx` handler that calls `reset()` without logging — silently swallowed errors hide bugs.
- ❌ Running `bun test` and reporting failures. Use `bun run test:run` (vitest).
- ❌ Editing the per-template `AGENTS.md` to remove notes about TODOs (contact form, newsletter fake submits) — they're real.

## Where things live

| Need | Look here |
|---|---|
| Which page reads which `brand.X` field | `AGENTS.md` at project root |
| Architectural rules | `AGENTS.md` at project root + this skill |
| Running locally | `bun dev` (boots mock + Next together) |
| Switching mock seed | edit `dev:mock` in `package.json` |
| Full SDK reference | `cimplify.dev/sdk/optimization`, `cimplify.dev/sdk/server` |

## What to do when the user asks something out-of-scope

If the user asks for something the template doesn't support out of the box:

1. **Check first** — is there an SDK component or hook that does it? `@cimplify/sdk/react` has 50+ components, 30+ hooks. Search `node_modules/@cimplify/sdk/dist/react.d.mts` if needed.
2. **Compose from existing parts** before authoring new ones.
3. **If genuinely missing** — build the new component, hoist its strings into `brand.ts`, document in `AGENTS.md`.

Don't introduce competing patterns (a new caching strategy, a new auth flow, a new theming system). The template's opinions are intentional.
