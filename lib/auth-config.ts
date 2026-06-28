import { headers } from "next/headers";
import {
  getAccessTokenFromCookieHeader,
  getServerClient,
  getSessionFromCookieHeader,
  type CimplifyClient,
  type CimplifySession,
  type OidcConfig,
} from "@cimplify/sdk/server";

export function getCimplifyClientId() {
  return (
    process.env.CIMPLIFY_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID?.trim() ||
    ""
  );
}

export function getCimplifyAuthUrl() {
  return (
    process.env.CIMPLIFY_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_CIMPLIFY_AUTH_URL?.trim() ||
    undefined
  );
}

export function getCimplifyIssuer() {
  return (
    process.env.CIMPLIFY_ISSUER?.trim() ||
    process.env.NEXT_PUBLIC_CIMPLIFY_ISSUER?.trim() ||
    undefined
  );
}

export function getCimplifyRedirectUri(requestUrl?: string) {
  const configured =
    process.env.CIMPLIFY_REDIRECT_URI?.trim() ||
    process.env.NEXT_PUBLIC_CIMPLIFY_REDIRECT_URI?.trim();
  if (configured) return configured;
  if (requestUrl) return new URL("/auth/callback", requestUrl).toString();
  return undefined;
}

export function getOidcConfig(): OidcConfig {
  return {
    clientId: getCimplifyClientId(),
    issuer: getCimplifyIssuer(),
    authUrl: getCimplifyAuthUrl(),
  };
}

export async function getSession(): Promise<CimplifySession | null> {
  const clientId = getCimplifyClientId();
  if (!clientId) return null;
  const cookieHeader = (await headers()).get("cookie");
  return getSessionFromCookieHeader(getOidcConfig(), cookieHeader);
}

export async function getAuthenticatedServerClient(): Promise<CimplifyClient> {
  const cookieHeader = (await headers()).get("cookie");
  const accessToken =
    getCimplifyClientId() && cookieHeader
      ? getAccessTokenFromCookieHeader(getOidcConfig(), cookieHeader) ?? undefined
      : undefined;

  return getServerClient({ accessToken });
}
