/**
 * Ambient types for `@cimplify/sdk/mock`.
 *
 * The 0.70.x SDK ships the `/mock` subpath as JS only (its `types` entry points
 * at a `.d.ts` that isn't published), so TypeScript can't resolve it. We declare
 * the slice we use: `createMockApp({ seed })`, returning a Hono app whose
 * `.fetch(Request)` drives the in-process backend. See `lib/demo/mock.ts`.
 */
declare module "@cimplify/sdk/mock" {
  /** Built-in seed names bundled with the mock (string form in 0.70.x). */
  type MockSeed =
    | "default"
    | "empty"
    | "restaurant"
    | "retail"
    | "services"
    | "grocery"
    | "fashion"
    | "pharmacy"
    | "auto"
    | (string & {});

  interface CreateMockAppOptions {
    seed?: MockSeed;
    cors?: string | string[] | false;
  }

  interface MockApp {
    app: { fetch(request: Request): Response | Promise<Response> };
    deps: unknown;
    request(path: string, init?: RequestInit): Promise<Response>;
  }

  export function createMockApp(options?: CreateMockAppOptions): MockApp;
}
