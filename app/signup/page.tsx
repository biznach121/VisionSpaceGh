import type { Metadata } from "next";
import { AuthPagePanel } from "@/components/auth-controls";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Create account — ${brand.name}`,
  description: brand.account.signupSubtitle,
};

export default function SignupPage() {
  return (
    <AuthPagePanel
      eyebrow={brand.account.signupEyebrow}
      title={brand.account.signupTitle}
      subtitle={brand.account.signupSubtitle}
    />
  );
}
