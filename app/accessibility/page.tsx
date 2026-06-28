import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: `${brand.accessibility.title} — ${brand.name}`,
};

export default function AccessibilityPage() {
  return <PolicyPage policy={brand.accessibility} />;
}
