import type { Metadata } from "next";
import { AccountPortal } from "@/components/account-portal";
import { getAccountPageData } from "@/lib/account-page-data";
import { brand } from "@/lib/brand";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Account — ${brand.name}`,
  description: brand.account.signupSubtitle,
};

export default async function AccountPage() {
  const account = await getAccountPageData();
  return <AccountPortal {...account} />;
}
