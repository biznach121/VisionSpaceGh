import { handleOidcCallback, handleRedirectCallback } from "@cimplify/sdk/server";
import { getCimplifyClientId, getCimplifyRedirectUri, getOidcConfig } from "@/lib/auth-config";

export async function GET(req: Request): Promise<Response> {
  const clientId = getCimplifyClientId();
  const redirectUri = getCimplifyRedirectUri(req.url);

  if (!clientId || !redirectUri) {
    return Response.json({ error: "auth_not_configured" }, { status: 500 });
  }

  return handleRedirectCallback(req, {
    ...getOidcConfig(),
    clientId,
    redirectUri,
    defaultReturnTo: "/account",
  });
}

export async function POST(req: Request): Promise<Response> {
  const clientId = getCimplifyClientId();
  const redirectUri = getCimplifyRedirectUri(req.url);

  if (!clientId || !redirectUri) {
    return Response.json({ error: "auth_not_configured" }, { status: 500 });
  }

  return handleOidcCallback(req, {
    ...getOidcConfig(),
    clientId,
    redirectUri,
  });
}
