import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: `${brand.shipping.title} — ${brand.name}`,
  description: brand.shipping.sections[0]?.body
    ? typeof brand.shipping.sections[0].body === "string"
      ? brand.shipping.sections[0].body
      : brand.shipping.sections[0].body.intro
    : undefined,
};

export default function ShippingPage() {
  return <PolicyPage policy={brand.shipping} />;
}
