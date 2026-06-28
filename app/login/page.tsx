import type { Metadata } from "next";
import { AuthPagePanel } from "@/components/auth-controls";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Sign in — ${brand.name}`,
  description: brand.account.loginSubtitle,
};

export default function LoginPage() {
  return (
    <AuthPagePanel
      eyebrow={brand.account.loginEyebrow}
      title={brand.account.loginTitle}
      subtitle={brand.account.loginSubtitle}
    />
  );
}
