import { NextResponse } from "next/server";

/**
 * UCP (Universal Commerce Protocol) manifest discovery endpoint.
 *
 * Agents — Claude, ChatGPT, Gemini, MCP clients — probe
 * `https://<your-domain>/.well-known/ucp` to learn what commerce
 * capabilities your storefront supports. We resolve the business's
 * UCP handle from the public key (via the storefront API), then forward
 * to Cimplify for the canonical manifest. Edge-cached for an hour
 * because capabilities change rarely.
 */
const UCP_API_BASE = "https://api.cimplify.io";
const STOREFRONT_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://storefronts.cimplify.io"
    : "http://127.0.0.1:8787";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json(
      {
        error: "NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY not set",
        remediation:
          "Set NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY in .env.local (and your deployment env).",
      },
      { status: 500 },
    );
  }

  try {
    // Step 1 — resolve the business handle from the public key.
    const businessResp = await fetch(`${STOREFRONT_API_BASE}/api/v1/business`, {
      headers: { "X-API-Key": publicKey, "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!businessResp.ok) {
      return NextResponse.json(
        { error: `Failed to resolve business: ${businessResp.status}` },
        { status: businessResp.status },
      );
    }

    const businessJson = await businessResp.json();
    const handle: string | undefined = businessJson?.data?.handle;
    if (!handle) {
      return NextResponse.json(
        { error: "Business has no handle configured" },
        { status: 500 },
      );
    }

    // Step 2 — fetch the canonical UCP manifest.
    const manifestResp = await fetch(
      `${UCP_API_BASE}/ucp/v1/${handle}/manifest`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      },
    );

    if (!manifestResp.ok) {
      return NextResponse.json(
        { error: `Upstream UCP manifest fetch failed: ${manifestResp.status}` },
        { status: manifestResp.status },
      );
    }

    const manifest = await manifestResp.json();
    return NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch UCP manifest",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
