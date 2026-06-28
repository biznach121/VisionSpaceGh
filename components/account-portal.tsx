"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { startSignIn } from "@cimplify/sdk";
import type { CustomerAddress, CustomerMobileMoney, LinkData, Order } from "@cimplify/sdk";
import {
  AccountContent,
  AccountHero,
  AccountIdentityStrip,
  AccountNav,
  AccountOrdersPage,
  AccountShell,
  AccountSidebar,
  AccountSignedOutPrompt,
  Button,
  CheckIcon,
  ContextCard,
  DashboardIcon20,
  EmptyState,
  ErrorState,
  IdentityOfframp,
  OrderList,
  OrdersIcon20,
  PackageIcon,
  Section,
  SectionMore,
  SignOutIcon,
  Skeleton,
  Status,
  useCimplifyClient,
  type ContextRow,
  type NavItem,
  type OrderRowData,
  type OrderRowStatus,
} from "@cimplify/sdk/react";
import { useAuthConfig } from "@/components/auth-controls";
import type { AccountPortalSession } from "@/lib/account-page-data";
import { brand } from "@/lib/brand";

type AccountSection = "overview" | "orders" | "addresses" | "settings";

type AccountPortalProps = {
  session: AccountPortalSession | null;
  linkData?: LinkData | null;
  orders?: Order[];
  ordersError?: string | null;
  section?: AccountSection;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

const ACCOUNT_NAV: NavItem[] = [
  { label: "Overview", href: "/account", icon: <DashboardIcon20 /> },
  { label: "Orders", href: "/account/orders", icon: <OrdersIcon20 /> },
  { label: "Addresses", href: "/account/addresses", icon: <CheckIcon /> },
  { label: "Settings", href: "/account/settings", icon: <SignOutIcon /> },
];

export function AccountPortal({
  session,
  linkData = null,
  orders: initialOrders = [],
  ordersError = null,
  section = "overview",
  eyebrow = brand.account.accountEyebrow,
  title = brand.account.accountTitle,
  subtitle = "Manage your profile, orders, and saved checkout details.",
}: AccountPortalProps) {
  const pathname = usePathname();
  const { client } = useCimplifyClient();
  const { config: authConfig, loading: authConfigLoading } = useAuthConfig();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [dataError, setDataError] = useState<string | null>(ordersError);

  useEffect(() => {
    setOrders(initialOrders);
    setDataError(ordersError);
  }, [initialOrders, ordersError]);

  const activeHref = section === "overview" ? "/account" : pathname;
  const profile = useMemo(() => getAccountProfile(session, linkData), [session, linkData]);
  const orderRows = useMemo(() => orders.map(toOrderRow), [orders]);

  async function handleSignOut() {
    await fetch("/auth/signout", { method: "POST", credentials: "include" }).catch(() => undefined);
    await client.link.logout().catch(() => undefined);
    client.clearSession();
    window.location.assign("/");
  }

  if (!session) {
    if (authConfigLoading) {
      return (
        <div className="all-eyes-account-app">
          <div className="all-eyes-account-loading">
            <Skeleton variant="block" className="h-72" />
          </div>
        </div>
      );
    }

    if (authConfig?.clientId && authConfig.redirectUri) {
      return (
        <AccountSignedOutPrompt
          clientId={authConfig.clientId}
          redirectUri={authConfig.redirectUri}
          eyebrow={brand.account.loginEyebrow}
          title={brand.account.loginTitle}
          description={brand.account.loginSubtitle}
          onSuccess={() => window.location.assign("/account")}
          className="all-eyes-account-app"
        />
      );
    }

    return (
      <div className="all-eyes-account-app">
        <ErrorState
          title="Account sign-in is not configured"
          message="Customer auth is missing for this environment."
        />
      </div>
    );
  }

  if (section === "orders") {
    return (
      <div className="all-eyes-account-app">
        {dataError ? <AccountNotice>{dataError}</AccountNotice> : null}
        <AccountOrdersPage
          customerName={profile.name}
          customerEmail={profile.email}
          customerId={profile.id}
          merchantName={brand.name}
          nav={ACCOUNT_NAV}
          activeHref="/account/orders"
          scopeNote={<AccountScopeNote />}
          title={title}
          description={subtitle}
          orders={orderRows}
          filterTabs={<OrderSummaryStrip orders={orders} />}
          emptyTitle="No orders yet"
          emptyDescription="Your Palmshades purchases will appear here after checkout."
          emptyAction={<AccountLinkButton href="/shop">Shop new arrivals</AccountLinkButton>}
        />
      </div>
    );
  }

  if (section === "addresses") {
    return (
      <AccountChrome
        activeHref="/account/addresses"
        profile={profile}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      >
        {dataError ? <AccountNotice>{dataError}</AccountNotice> : null}
        <Section
          title="Saved delivery"
          meta={`${profile.addressCount} saved`}
          action={<SectionMore href="/account/settings">Defaults</SectionMore>}
        >
          {linkData?.addresses.length ? (
            <div className="all-eyes-account-card-grid">
              {linkData.addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved address"
              description="Saved delivery addresses will appear here once they are attached to your Cimplify account."
              action={<AccountLinkButton href="/shop">Continue shopping</AccountLinkButton>}
            />
          )}
        </Section>
        <Section title="Account identity">
          <IdentityOfframp
            summary={{
              addresses: profile.addressCount,
              paymentMethods: profile.walletCount,
              shops: 1,
            }}
          />
        </Section>
      </AccountChrome>
    );
  }

  if (section === "settings") {
    const profileRows: ContextRow[] = [
      { label: "Name", value: displayableName(session.name) || "Not shared by Cimplify yet" },
      { label: "Email", value: profile.email || "Not shared by Cimplify yet" },
      { label: "Phone", value: profile.phone || "Not shared by Cimplify yet" },
      { label: "Customer ID", value: profile.id },
      { label: "Signed in", value: formatUnixDate(session.iat) },
    ];
    const checkoutRows: ContextRow[] = [
      {
        label: "Default address",
        value: linkData?.default_address ? formatAddress(linkData.default_address) : "No default address",
      },
      {
        label: "Default payment",
        value: linkData?.default_mobile_money
          ? formatMobileMoney(linkData.default_mobile_money)
          : "No default mobile money wallet",
      },
      {
        label: "Order updates",
        value: (
          <span className="inline-flex items-center gap-2">
            <Status
              status={{
                kind: linkData?.preferences.notify_on_order ? "completed" : "paused",
                label: linkData?.preferences.notify_on_order ? "Enabled" : "Not enabled",
              }}
            />
          </span>
        ),
      },
    ];

    return (
      <AccountChrome
        activeHref="/account/settings"
        profile={profile}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      >
        {dataError ? <AccountNotice>{dataError}</AccountNotice> : null}
        <div className="all-eyes-account-two-col">
          <Section title="Profile">
            <ContextCard rows={profileRows} />
            {(!displayableName(session.name) || !profile.email) && authConfig?.clientId && authConfig.redirectUri ? (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    void startSignIn({
                      clientId: authConfig.clientId,
                      redirectUri: authConfig.redirectUri!,
                      callbackUri: "/auth/callback",
                      issuer: authConfig.issuer,
                      authUrl: authConfig.authUrl,
                      returnTo: "/account/settings",
                      prompt: "consent",
                    });
                  }}
                >
                  Refresh profile sharing
                </Button>
              </div>
            ) : null}
          </Section>
          <Section title="Checkout defaults">
            <ContextCard rows={checkoutRows} />
          </Section>
        </div>
        <Section title="Security">
          <div className="all-eyes-account-session-card">
            <div>
              <h2>Current session</h2>
              <p>Sign out clears this storefront session and ends the Cimplify SSO session on this device.</p>
            </div>
            <Button type="button" variant="danger" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </Section>
      </AccountChrome>
    );
  }

  return (
    <AccountChrome
      activeHref="/account"
      profile={profile}
      eyebrow="Account"
      title={`Welcome back, ${firstName(profile.name)}`}
      subtitle="A clean command center for orders, checkout details, and Cimplify Link."
    >
      {dataError ? <AccountNotice>{dataError}</AccountNotice> : null}
      <OverviewCommandCenter
        profile={profile}
        linkData={linkData}
        orders={orders}
        orderRows={orderRows}
      />
    </AccountChrome>
  );
}

function AccountChrome({
  activeHref,
  profile,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  activeHref: string;
  profile: AccountProfile;
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="all-eyes-account-app">
      <AccountShell
        className="all-eyes-account-shell"
        sidebar={
          <AccountSidebar className="all-eyes-account-sidebar" scopeNote={<AccountScopeNote />}>
            <AccountIdentityStrip
              name={profile.name}
              email={profile.email}
              customerId={profile.id}
              className="all-eyes-account-identity"
            />
            <AccountNav items={ACCOUNT_NAV} activeHref={activeHref} />
          </AccountSidebar>
        }
      >
        <AccountContent className="all-eyes-account-content">
          <div className="all-eyes-account-mobile-nav">
            <AccountNav items={ACCOUNT_NAV} activeHref={activeHref} />
          </div>
          <AccountHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {children}
        </AccountContent>
      </AccountShell>
    </div>
  );
}

function AccountNotice({ children }: { children: ReactNode }) {
  return (
    <div className="all-eyes-account-notice">
      <ErrorState title="Account data notice" message={String(children)} />
    </div>
  );
}

function AccountScopeNote() {
  return (
    <span>
      Synced profile and order history for <strong>{brand.name}</strong>.
    </span>
  );
}

function AccountLinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="primary" size="sm">
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function OrderSummaryStrip({ orders }: { orders: Order[] }) {
  const active = orders.filter((order) => !["completed", "cancelled", "refunded"].includes(order.status)).length;
  const completed = orders.filter((order) => order.status === "completed").length;

  return (
    <div className="all-eyes-account-metrics">
      <Metric label="Total orders" value={orders.length} />
      <Metric label="Active" value={active} />
      <Metric label="Completed" value={completed} />
    </div>
  );
}

function OverviewCommandCenter({
  profile,
  linkData,
  orders,
  orderRows,
}: {
  profile: AccountProfile;
  linkData: LinkData | null;
  orders: Order[];
  orderRows: OrderRowData[];
}) {
  const activeOrders = orders.filter((order) => !["completed", "cancelled", "refunded"].includes(order.status));
  const latestOrder = orderRows[0];
  const lifetimeSpend = orders.reduce((sum, order) => sum + parseMoney(order.total_price), 0);
  const readiness = getReadinessScore(profile, linkData, orders);
  const contextRows: ContextRow[] = [
    {
      label: "Default address",
      value: linkData?.default_address ? formatAddress(linkData.default_address) : "Add a default delivery address",
    },
    {
      label: "Payment wallet",
      value: linkData?.default_mobile_money
        ? formatMobileMoney(linkData.default_mobile_money)
        : "No default mobile money wallet",
    },
    {
      label: "Order updates",
      value: linkData?.preferences.notify_on_order ? "Enabled" : "Not enabled",
    },
  ];

  return (
    <div className="all-eyes-overview">
      <section className="all-eyes-overview-hero" aria-label="Account overview">
        <div className="all-eyes-overview-hero-main">
          <div className="all-eyes-overview-kicker">
            <span>Live account</span>
            <Status status={{ kind: linkData ? "completed" : "active", label: linkData ? "Link connected" : "Signed in" }} />
          </div>
          <h2>{latestOrder ? "Your account is already moving." : "Your account is ready for the next drop."}</h2>
          <p>
            {latestOrder
              ? `Latest activity: ${latestOrder.summary.toLowerCase()} ${latestOrder.meta.toLowerCase()}.`
              : "Checkout details, order history, and identity preferences live here."}
          </p>
          <div className="all-eyes-overview-actions">
            <AccountLinkButton href={latestOrder ? "/account/orders" : "/shop"}>
              {latestOrder ? "Track orders" : "Shop new arrivals"}
            </AccountLinkButton>
            <AccountLinkButton href="/account/settings">Manage checkout</AccountLinkButton>
          </div>
        </div>
        <div className="all-eyes-overview-readiness">
          <div>
            <span>Checkout readiness</span>
            <strong>{readiness.score}%</strong>
          </div>
          <div className="all-eyes-overview-meter" aria-hidden="true">
            <span style={{ width: `${readiness.score}%` }} />
          </div>
          <ul>
            {readiness.items.map((item) => (
              <li key={item.label} data-complete={item.complete || undefined}>
                <CheckIcon />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="all-eyes-overview-stats">
        <Metric label="Orders" value={orders.length} />
        <Metric label="Active" value={activeOrders.length} />
        <Metric label="Saved addresses" value={profile.addressCount} />
        <Metric label="Lifetime spend" value={formatCurrency(lifetimeSpend, brand.currency)} />
      </div>

      <div className="all-eyes-overview-grid">
        <Section
          title="Recent orders"
          action={orderRows.length ? <SectionMore href="/account/orders">View all</SectionMore> : null}
        >
          {orderRows.length ? (
            <OrderList orders={orderRows.slice(0, 3)} />
          ) : (
            <EmptyState
              glyph={<PackageIcon />}
              title="No orders yet"
              description="Your first Palmshades order will appear here with fulfilment and receipt details."
              action={<AccountLinkButton href="/shop">Browse the frames</AccountLinkButton>}
            />
          )}
        </Section>

        <Section title="Checkout profile">
          <ContextCard rows={contextRows} />
        </Section>
      </div>

      <Section title="Cimplify identity">
        <IdentityOfframp
          summary={{
            addresses: profile.addressCount,
            paymentMethods: profile.walletCount,
            shops: 1,
          }}
        />
      </Section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="all-eyes-account-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getReadinessScore(profile: AccountProfile, linkData: LinkData | null, orders: Order[]) {
  const items = [
    { label: "Signed in", complete: Boolean(profile.id) },
    { label: "Address saved", complete: profile.addressCount > 0 },
    { label: "Payment wallet", complete: profile.walletCount > 0 },
    { label: "Order updates", complete: Boolean(linkData?.preferences.notify_on_order) },
    { label: "Order history", complete: orders.length > 0 },
  ];
  const score = Math.round((items.filter((item) => item.complete).length / items.length) * 100);
  return { score, items };
}

function AddressCard({ address }: { address: CustomerAddress }) {
  const rows: ContextRow[] = [
    { label: "Address", value: formatAddress(address) || "No address details" },
    { label: "Phone", value: address.phone_for_delivery || "No delivery phone" },
  ];

  return (
    <Section
      title={address.label || "Delivery address"}
      meta={address.is_default ? <Status status={{ kind: "completed", label: "Default" }} /> : null}
      className="all-eyes-account-address-card"
    >
      <ContextCard rows={rows} />
    </Section>
  );
}

type AccountProfile = {
  name: string;
  email?: string;
  phone?: string;
  id?: string;
  addressCount: number;
  walletCount: number;
};

function getAccountProfile(session: AccountPortalSession | null, linkData: LinkData | null): AccountProfile {
  return {
    name:
      linkData?.customer.name ||
      displayableName(session?.name) ||
      session?.email ||
      session?.phoneNumber ||
      "Palmshades member",
    email: linkData?.customer.email || session?.email || undefined,
    phone: linkData?.customer.phone || session?.phoneNumber || undefined,
    id: linkData?.customer.id || session?.sub,
    addressCount: linkData?.addresses.length ?? 0,
    walletCount: linkData?.mobile_money.length ?? 0,
  };
}

function toOrderRow(order: Order): OrderRowData {
  const itemCount = order.total_quantity || order.items?.length || 0;
  return {
    id: order.user_friendly_id || order.id,
    href: `/orders/${order.id}`,
    summary: itemCount === 1 ? "1 item" : `${itemCount} items`,
    meta: `Placed ${formatShortDate(order.created_at)}`,
    status: toOrderStatus(order.status),
    total: formatCurrency(order.total_price, order.currency || brand.currency),
  };
}

function toOrderStatus(status: Order["status"]): OrderRowStatus {
  if (status === "cancelled" || status === "refunded") return { kind: "cancelled", label: "Cancelled" };
  if (status === "completed") return { kind: "completed", label: "Completed" };
  if (status === "delivered" || status === "served" || status === "picked_up") {
    return { kind: "delivered", label: "Delivered" };
  }
  if (status === "pending" || status === "created") return { kind: "active", label: "Placed" };
  return { kind: "preparing", label: humanize(status) };
}

function formatAddress(address: CustomerAddress) {
  return [address.street_address, address.apartment, address.city, address.region, address.country]
    .filter(Boolean)
    .join(", ");
}

function formatMobileMoney(wallet: CustomerMobileMoney) {
  return [humanize(wallet.provider), wallet.phone_number].filter(Boolean).join(" - ");
}

function formatCurrency(amount: number | string, currency: string) {
  const numeric = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat(brand.locale.replace("_", "-"), {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

function parseMoney(amount: number | string) {
  const numeric = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatShortDate(value?: string | null) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(brand.locale.replace("_", "-"), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatUnixDate(value?: number) {
  if (!value) return "This session";
  return formatShortDate(new Date(value * 1000).toISOString());
}

function displayableName(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 1 ? trimmed : null;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function humanize(value?: string | null) {
  if (!value) return "Updated";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
