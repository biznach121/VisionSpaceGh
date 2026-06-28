import { SITE_URL } from "./site.config";

/** Canonical absolute URL for this storefront. */
export async function getSiteUrl(): Promise<string> {
  return SITE_URL;
}
