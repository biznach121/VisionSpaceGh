import { DEMO_MODE } from "@/lib/demo/flags";

// The mock uses node:crypto + Hono — keep it on the Node runtime, and never
// statically optimize (it's a live backend, not a cached page).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Browser entry point for the embedded demo backend. `next.config.ts` rewrites
 * the SDK's same-origin calls (`/api/v1/*`, `/v1/link/*`, `/elements/*`,
 * `/img/*`) here — but only in demo mode — and we replay them against the
 * in-process mock app. In real mode these rewrites don't exist and this route
 * is never hit (the guard below 404s it for safety).
 */
async function handle(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  if (!DEMO_MODE) return new Response("Not found", { status: 404 });

  const { getMockApp } = await import("@/lib/demo/mock");
  const { path } = await ctx.params;
  const search = new URL(req.url).search;
  // Rewrites map e.g. /api/v1/products -> /api/demo/api/v1/products, so `path`
  // is ["api","v1","products"]; rebuild the path the mock app expects.
  const mockUrl = `http://demo.local/${path.join("/")}${search}`;

  const mockReq = new Request(mockUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
  });

  return getMockApp().app.fetch(mockReq);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
export const HEAD = handle;
