import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Streams the organization JSON-LD script tag in async so it doesn't block
 * the rest of the layout shell. `getSiteUrl` reads request headers, and
 * any await on dynamic data inside `RootLayout` makes Next 16 mark the
 * whole route as blocking.
 */
export async function OrganizationJsonLd(): Promise<React.ReactElement> {
  const siteUrl = await getSiteUrl();
  const ld = {
    "@context": "https://schema.org",
    "@type": brand.schemaType,
    name: brand.name,
    url: siteUrl,
    description: brand.description,
    email: brand.contact.email,
    telephone: brand.contact.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.contact.streetAddress,
      addressLocality: brand.contact.city,
      addressCountry: brand.contact.countryCode,
    },
    sameAs: brand.socials.map((s) => s.href),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
