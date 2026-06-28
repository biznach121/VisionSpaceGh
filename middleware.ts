import { NextResponse, type NextRequest } from "next/server";
import { handleTokenRefresh, type OidcConfig } from "@cimplify/sdk/server";

// Inline (not imported from lib/auth-config) so the Edge middleware runtime
// doesn't pull in `next/headers`, which isn't available here.
function oidcConfig(): OidcConfig | null {
  const clientId =
    process.env.CIMPLIFY_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID?.trim() ||
    "";
  if (!clientId) return null;
  return {
    clientId,
    issuer:
      process.env.CIMPLIFY_ISSUER?.trim() ||
      process.env.NEXT_PUBLIC_CIMPLIFY_ISSUER?.trim() ||
      undefined,
    authUrl:
      process.env.CIMPLIFY_AUTH_URL?.trim() ||
      process.env.NEXT_PUBLIC_CIMPLIFY_AUTH_URL?.trim() ||
      undefined,
  };
}

// Keeps the access token fresh before account pages render. Server Components
// can't write cookies, so this is the one place the rotated token can be both
// persisted (browser) and forwarded onto the current request (this render).
export async function middleware(request: NextRequest) {
  const cfg = oidcConfig();
  if (!cfg) return NextResponse.next();

  try {
    const { outcome, setCookies, cookies } = await handleTokenRefresh(request, cfg);
    if (outcome === "noop") return NextResponse.next();

    for (const { name, value } of cookies) {
      request.cookies.set(name, value);
    }
    const response = NextResponse.next({ request });
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/account/:path*", "/auth/session"],
};
