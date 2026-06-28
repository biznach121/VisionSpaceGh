import type { Metadata } from "next";
import { AccountPortal } from "@/components/account-portal";
import { getAccountPageData } from "@/lib/account-page-data";
import { brand } from "@/lib/brand";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Orders — ${brand.name}`,
};

export default async function OrdersPage() {
  const account = await getAccountPageData();

  return (
    <AccountPortal
      {...account}
      section="orders"
      eyebrow="Account"
      title="Your orders"
      subtitle="Track frame orders, fulfilment status, and past receipts."
    />
  );
}
