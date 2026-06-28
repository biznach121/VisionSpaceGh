"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signInSilent, startSignIn } from "@cimplify/sdk";
import {
  CimplifySignInButton,
  useCimplifyClient,
  useCimplifySession,
} from "@cimplify/sdk/react";
import { brand } from "@/lib/brand";

export type AuthConfig = {
  clientId: string;
  issuer?: string;
  authUrl?: string;
  redirectUri?: string;
};

type BrowserProcess = {
  env?: Record<string, string | undefined>;
};

export function installPublicAuthConfig(config: AuthConfig | null) {
  if (typeof window === "undefined" || !config?.clientId || !config.redirectUri) return;

  const globalWithProcess = globalThis as typeof globalThis & {
    process?: BrowserProcess;
  };
  const processLike = globalWithProcess.process ?? {};
  processLike.env = { ...(processLike.env ?? {}) };
  processLike.env.NEXT_PUBLIC_CIMPLIFY_CLIENT_ID = config.clientId;
  processLike.env.NEXT_PUBLIC_CIMPLIFY_REDIRECT_URI = config.redirectUri;
  if (config.issuer) processLike.env.NEXT_PUBLIC_CIMPLIFY_ISSUER = config.issuer;
  if (config.authUrl) processLike.env.NEXT_PUBLIC_CIMPLIFY_AUTH_URL = config.authUrl;
  globalWithProcess.process = processLike;
}

type AuthControlProps = {
  transparent?: boolean;
  mobile?: boolean;
};

export function AuthControl({ transparent = false, mobile = false }: AuthControlProps) {
  const { session, loading } = useCimplifySession();
  const baseClasses = mobile
    ? "flex w-full items-center justify-center rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-[0.16em]"
    : "hidden items-center justify-center rounded-md p-2 transition-colors md:inline-flex";
  const tone = transparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted";
  const label = session?.name ? firstName(session.name) : session ? "Account" : "Sign in";

  if (loading) {
    const mutedTone = transparent ? "text-white/50" : "text-muted-foreground";
    if (mobile) {
      return <span className={`${baseClasses} ${mutedTone}`}>Account</span>;
    }
    return (
      <span className={`${baseClasses} ${mutedTone}`} aria-hidden="true">
        <UserIcon />
      </span>
    );
  }

  return (
    <Link href={session ? "/account" : "/login"} aria-label={label} className={`${baseClasses} ${tone}`}>
      {mobile ? label : <UserIcon />}
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function SilentAuthBootstrap() {
  const { session, loading, refresh } = useCimplifySession();
  const { config, loading: configLoading } = useAuthConfig();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (attempted || loading || configLoading || session || !config?.clientId || !config.redirectUri) {
      return;
    }

    let cancelled = false;
    setAttempted(true);

    async function boot() {
      const result = await signInSilent({
        clientId: config!.clientId,
        redirectUri: config!.redirectUri!,
        callbackUri: "/auth/callback",
        sessionUri: "/auth/session",
        issuer: config!.issuer,
        authUrl: config!.authUrl,
      });

      if (cancelled || !result.ok) return;

      if (result.reason === "already_signed_in") {
        await refresh();
        return;
      }

      window.location.reload();
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [attempted, config, configLoading, loading, refresh, session]);

  return null;
}

export function AuthPagePanel({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const { session, loading } = useCimplifySession();
  const { config, loading: configLoading } = useAuthConfig();
  const router = useRouter();
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !configLoading && session) {
      router.replace("/account");
    }
  }, [configLoading, loading, router, session]);

  return (
    <section className="all-eyes-auth-page">
      <div className="all-eyes-auth-visual" aria-hidden="true">
        <Image
          src={brand.assets.campaign[0] ?? brand.assets.hero}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
        />
        <div className="all-eyes-auth-visual-copy">
          <span>{brand.fashion.season}</span>
          <strong>Every detail stays ready for the next drop.</strong>
        </div>
      </div>

      <div className="all-eyes-auth-content">
        <div className="all-eyes-auth-heading">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{subtitle}</span>
        </div>

        <div className="all-eyes-auth-card">
          {loading || configLoading ? (
            <div className="all-eyes-auth-status">
              <span />
              <p>Checking your session...</p>
            </div>
          ) : session ? (
            <div className="all-eyes-auth-ready">
              <p>
                You are signed in{session.name ? ` as ${session.name}` : ""}.
              </p>
              <div>
                <Link href="/account">Open account</Link>
                <SignOutButton />
              </div>
            </div>
          ) : config?.clientId && config.redirectUri ? (
            <div className="all-eyes-auth-form">
              <div className="all-eyes-auth-form-head">
                <span>Cimplify Link</span>
                <p>Use one secure profile for saved delivery, checkout details, and order history.</p>
              </div>
              <CimplifySignInButton
                clientId={config.clientId}
                redirectUri={config.redirectUri}
                callbackUri="/auth/callback"
                issuer={config.issuer}
                authUrl={config.authUrl}
                returnTo="/account"
                variant="dark"
                label="Continue with Cimplify"
                fullWidth
                onSuccess={() => window.location.assign("/account")}
                onError={(error) => {
                  setSignInError(error.description || error.error);
                }}
              />
              {signInError ? (
                <p className="all-eyes-auth-error">
                  {signInError}
                </p>
              ) : null}
              <button
                type="button"
                className="all-eyes-auth-switch"
                onClick={() => {
                  void startSignIn({
                    clientId: config!.clientId,
                    redirectUri: config!.redirectUri!,
                    callbackUri: "/auth/callback",
                    issuer: config!.issuer,
                    authUrl: config!.authUrl,
                    returnTo: "/account",
                    prompt: "login",
                  });
                }}
              >
                Use a different account
              </button>
              <dl className="all-eyes-auth-benefits">
                <div>
                  <dt>Saved details</dt>
                  <dd>Checkout faster on every drop.</dd>
                </div>
                <div>
                  <dt>Order memory</dt>
                  <dd>Receipts and fulfilment in one place.</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="all-eyes-auth-form">
              <div className="all-eyes-auth-form-head">
                <span>Configuration needed</span>
                <p>Sign in is not configured for this environment yet.</p>
              </div>
              <Link className="all-eyes-auth-fallback-link" href="/account">
                Open account portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AccountAccess({
  children,
  title = "Sign in to view your account",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { session, loading } = useCimplifySession();
  const { config, loading: configLoading } = useAuthConfig();
  const pathname = usePathname();

  if (loading || configLoading) {
    return (
      <div className="border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  if (session) return <>{children}</>;

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Sign in with Cimplify to manage orders, addresses, checkout details, and settings.
          </p>
        </div>
        {config?.clientId && config.redirectUri ? (
          <CimplifySignInButton
            clientId={config.clientId}
            redirectUri={config.redirectUri}
            callbackUri="/auth/callback"
            issuer={config.issuer}
            authUrl={config.authUrl}
            returnTo={pathname}
            variant="dark"
            label="Sign in"
            onSuccess={() => window.location.reload()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Sign-in setup is missing.
          </p>
        )}
      </div>
    </div>
  );
}

export function CheckoutSignInPrompt() {
  const { session, loading } = useCimplifySession();
  const { config, loading: configLoading } = useAuthConfig();

  if (loading || configLoading || session || !config?.clientId || !config.redirectUri) return null;

  return (
    <aside className="mx-auto mt-8 max-w-5xl border border-border bg-card px-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Have an account?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in for saved details, or continue checkout as a guest.
          </p>
        </div>
        <CimplifySignInButton
          clientId={config.clientId}
          redirectUri={config.redirectUri}
          callbackUri="/auth/callback"
          issuer={config.issuer}
          authUrl={config.authUrl}
          returnTo="/checkout"
          variant="outline"
          label="Sign in"
          onSuccess={() => window.location.reload()}
        />
      </div>
    </aside>
  );
}

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const { client } = useCimplifyClient();

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          // Storefront cookies AND the Cimplify SSO session, so a later
          // "Continue with Cimplify" prompts fresh instead of re-authing.
          await fetch("/auth/signout", { method: "POST", credentials: "include" });
          await client.link.logout().catch(() => undefined);
          client.clearSession();
        } finally {
          window.location.reload();
        }
      }}
      className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60"
    >
      {busy ? "Signing out..." : "Sign out"}
    </button>
  );
}

export function useAuthConfig() {
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/auth/config", { credentials: "include" });
        const body = res.ok ? ((await res.json()) as AuthConfig) : null;
        installPublicAuthConfig(body);
        if (!cancelled) setConfig(body);
      } catch {
        if (!cancelled) setConfig(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading };
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Account";
}
