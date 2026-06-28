import { getServerClient, type ServerClientOptions } from "@cimplify/sdk/server";
import type { CimplifyClient } from "@cimplify/sdk";
import { DEMO_MODE } from "./demo/flags";
import { getDemoClient } from "./demo/mock";

/**
 * The server-side catalogue/business client for Server Components.
 *
 * In demo mode it returns the in-process embedded mock client (built-in
 * `fashion` seed); with a real key it returns the normal `getServerClient()`
 * (per-request memoized, forwards `cacheOptions` to ISR). Pages call this
 * exactly like `getServerClient` — same `CimplifyClient` surface — so flipping
 * modes needs no call-site change.
 *
 * Server-only: imports `./demo/mock` (node:crypto via `@cimplify/sdk/mock`).
 * Only ever imported from Server Components / route handlers, never a client
 * island, so the mock never reaches the browser bundle.
 */
export function getStoreClient(opts?: ServerClientOptions): CimplifyClient {
  return DEMO_MODE ? getDemoClient() : getServerClient(opts);
}
