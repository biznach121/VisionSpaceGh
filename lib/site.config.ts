/**
 * Canonical absolute URL. The platform overwrites this at build time with the
 * storefront's primary domain; the default only applies to local builds. It's
 * per-deploy config, not per-request, so it stays a static constant — keeping
 * the root layout prerenderable.
 */
export const SITE_URL = "https://example.com";
