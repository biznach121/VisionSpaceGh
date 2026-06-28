import { buildSignoutCookies } from "@cimplify/sdk/server";
import { getCimplifyClientId, getOidcConfig } from "@/lib/auth-config";

export async function POST(): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });

  if (getCimplifyClientId()) {
    for (const cookie of buildSignoutCookies(getOidcConfig())) {
      headers.append("Set-Cookie", cookie);
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
