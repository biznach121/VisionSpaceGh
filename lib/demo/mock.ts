import { createMockApp } from "@cimplify/sdk/mock";
import { createCimplifyClient, type CimplifyClient } from "@cimplify/sdk";
import { applyDemoCatalogue } from "./catalogue";

/**
 * Embedded demo backend. `createMockApp` returns a Hono app implementing the
 * full Cimplify API surface, seeded with the built-in `fashion` catalogue —
 * the exact same data `bun dev` serves via `cimplify-mock --seed fashion`. We
 * reuse one instance per server process (lazy singleton) so:
 *   • Server Components read it in-process (no network — works at build time too)
 *   • the `/api/demo` route handler serves the browser from the same app
 *
 * NOTE: server-only. `@cimplify/sdk/mock` pulls in node:crypto, so never import
 * this from a Client Component — only from RSC / route handlers (Node runtime).
 */
let _mock: ReturnType<typeof createMockApp> | null = null;

export function getMockApp() {
  if (!_mock) {
    _mock = createMockApp({ seed: "fashion" });
    // Swap the generic `fashion` catalogue for the demo eyewear line-up.
    // `createMockApp` ships no types for `deps`, so narrow it locally.
    const deps = _mock.deps as {
      registry: Parameters<typeof applyDemoCatalogue>[0];
      defaultBusinessId: string;
    };
    applyDemoCatalogue(deps.registry, deps.defaultBusinessId);
  }
  return _mock;
}

let _client: CimplifyClient | null = null;

/**
 * A CimplifyClient whose fetch is wired straight into the in-process mock app —
 * no HTTP, so it resolves during `next build` prerender and at runtime alike.
 */
export function getDemoClient(): CimplifyClient {
  if (_client) return _client;
  const demoFetch: typeof fetch = async (input, init) => {
    const req = input instanceof Request ? input : new Request(input, init);
    return getMockApp().app.fetch(req);
  };
  _client = createCimplifyClient({
    baseUrl: "http://demo.local",
    publicKey: "demo",
    suppressPublicKeyWarning: true,
    fetch: demoFetch,
  });
  return _client;
}
