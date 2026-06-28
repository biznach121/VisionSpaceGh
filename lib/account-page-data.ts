import "server-only";

import type { LinkData, Order } from "@cimplify/sdk";
import { getAuthenticatedServerClient, getSession } from "@/lib/auth-config";
import { brand } from "@/lib/brand";

export type AccountPortalSession = {
  sub: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  exp?: number;
  iat?: number;
};

export type AccountPageData = {
  session: AccountPortalSession | null;
  linkData: LinkData | null;
  orders: Order[];
  ordersError: string | null;
};

export async function getAccountPageData(): Promise<AccountPageData> {
  const session = await getSession();
  if (!session) return { session: null, linkData: null, orders: [], ordersError: null };

  const client = await getAuthenticatedServerClient();
  const businessId = await client.resolveBusinessId().catch(() => brand.mock.businessId);
  const [linkDataResult, ordersResult] = await Promise.all([
    client.link.getLinkData(),
    client.link.getOrders({ businessId, limit: 20 }),
  ]);

  const linkData = linkDataResult.ok ? linkDataResult.value : null;
  const orders = ordersResult.ok ? ordersResult.value : [];
  const errors = [
    linkDataResult.ok ? null : `Saved account details could not be loaded: ${linkDataResult.error.message}`,
    ordersResult.ok ? null : `Orders could not be loaded: ${ordersResult.error.message}`,
  ].filter(Boolean);

  return {
    session,
    linkData,
    orders,
    ordersError: errors.length ? errors.join(" ") : null,
  };
}
