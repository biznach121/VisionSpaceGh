import {
  getCimplifyAuthUrl,
  getCimplifyClientId,
  getCimplifyIssuer,
  getCimplifyRedirectUri,
} from "@/lib/auth-config";

export async function GET(req: Request): Promise<Response> {
  return Response.json(
    {
      clientId: getCimplifyClientId(),
      issuer: getCimplifyIssuer(),
      authUrl: getCimplifyAuthUrl(),
      redirectUri: getCimplifyRedirectUri(req.url),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
