import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: `${brand.returns.title} — ${brand.name}`,
};

export default function ReturnsPage() {
  return <PolicyPage policy={brand.returns} />;
}
