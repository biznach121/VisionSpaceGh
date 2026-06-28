import type { Metadata } from "next";
import { AccountPortal } from "@/components/account-portal";
import { getAccountPageData } from "@/lib/account-page-data";
import { brand } from "@/lib/brand";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Settings — ${brand.name}`,
};

export default async function SettingsPage() {
  const account = await getAccountPageData();

  return (
    <AccountPortal
      {...account}
      section="settings"
      eyebrow="Account"
      title="Settings"
      subtitle="Manage Link preferences, sessions, and saved account behaviour."
    />
  );
}
