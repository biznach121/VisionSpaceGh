/**
 * Demo mode. When on, the storefront serves an embedded mock catalogue (the
 * built-in `fashion` seed — the same data `bun dev` shows) so a Vercel deploy
 * renders a full, clickable store with NO backend. Perfect for a preview link
 * you send before a tenant signs up.
 *
 * It auto-disables the moment a real `cpk_live_…` / `cpk_test_…` key is set, so
 * pasting a live key flips the storefront to the real catalogue with zero code
 * changes. Enable it with `DEMO_MODE=1` (and leave the key unset / on
 * `mock-dev`). Set `DEMO_MODE=0` (or paste a real key) for the normal,
 * live-data storefront. The same rule is mirrored in `next.config.ts`.
 */
const publicKey = (process.env.NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY ?? "").trim();

const keyTargetsHostedCimplify =
  publicKey.startsWith("cpk_live_") || publicKey.startsWith("cpk_test_");

export const DEMO_MODE = process.env.DEMO_MODE === "1" && !keyTargetsHostedCimplify;
