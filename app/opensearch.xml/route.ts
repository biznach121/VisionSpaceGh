import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

/**
 * OpenSearch description document — lets browsers add this site to the
 * address bar's search engine list. When users press Tab after typing the
 * domain, they get an inline search box that hits /search?q=...
 */
export async function GET(): Promise<Response> {
  const siteUrl = await getSiteUrl();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${escapeXml(brand.shortName)}</ShortName>
  <Description>Search ${escapeXml(brand.name)}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" method="get" template="${siteUrl}/search?q={searchTerms}" />
  <Url type="application/opensearchdescription+xml" rel="self" template="${siteUrl}/opensearch.xml" />
  <moz:SearchForm>${siteUrl}/search</moz:SearchForm>
</OpenSearchDescription>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
