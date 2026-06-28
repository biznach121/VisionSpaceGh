import { handleSessionRequest } from "@cimplify/sdk/server";
import { getCimplifyClientId, getOidcConfig } from "@/lib/auth-config";

export async function GET(req: Request): Promise<Response> {
  if (!getCimplifyClientId()) {
    return Response.json({ sub: null }, { headers: { "Cache-Control": "no-store" } });
  }

  return handleSessionRequest(req, getOidcConfig());
}
