import type { Metadata } from "next";
import { AccountPortal } from "@/components/account-portal";
import { getAccountPageData } from "@/lib/account-page-data";
import { brand } from "@/lib/brand";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Addresses — ${brand.name}`,
};

export default async function AddressesPage() {
  const account = await getAccountPageData();

  return (
    <AccountPortal
      {...account}
      section="addresses"
      eyebrow="Account"
      title="Your addresses"
      subtitle="Keep delivery details ready for your next Palmshades order."
    />
  );
}
