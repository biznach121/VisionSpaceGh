# CLAUDE.md

This project was scaffolded from a Cimplify storefront template (`cimplify init`).

## Read these first

- **`AGENTS.md`** at the project root — the file ↔ `brand.X` field map for *this template's* industry, plus the architectural rules.
- **`.claude/skills/cimplify-storefront/SKILL.md`** — the playbook for common tasks (rebrand, add a section, wire a Server Action, deploy, eject a component). Invoke it whenever you're asked to change content, palette, copy, or routing.

## The two-line summary

1. **Edit `lib/brand.ts`** for any visible string.
2. **Edit `app/globals.css` `@theme` block** for any palette / radius / font change.

That covers ~95% of what merchants ask for. For anything else, follow the `cimplify-storefront` skill.

## Don't do

- Hardcode strings in pages or components.
- Enable `cacheComponents: true` in `next.config.ts` — we're on Cloudflare Workers, where `'use cache'` postponed state blows past CF's 128MB zlib limit. This template stays on Next 16's "Previous Model" (ISR): `export const revalidate` per page + `cacheOptions: { revalidate, tags }` on SDK reads.
- Add `'use cache'`, `cacheTag`, or `cacheLife` anywhere. Use the SDK's `cacheOptions` instead.
- Use `unstable_cache` — it's gone in Next 16. Use SDK `cacheOptions` or `fetch.next.{revalidate,tags}`.
- Run `bun test` (Bun's `vi` shim is incomplete) — use `bun run test:run`.
