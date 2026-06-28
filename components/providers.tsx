"use client";

import { useMemo, type ReactNode } from "react";
import { createCimplifyClient } from "@cimplify/sdk";
import { CimplifyProvider, CartDrawerProvider } from "@cimplify/sdk/react";
import { SilentAuthBootstrap } from "@/components/auth-controls";

// Same-origin client — every request goes through the Next.js rewrite in
// next.config.ts, so no CORS preflight ever hits the browser.
export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8787";
    const publicKey = process.env.NEXT_PUBLIC_CIMPLIFY_PUBLIC_KEY ?? "mock-dev";
    return createCimplifyClient({
      baseUrl,
      publicKey,
      suppressPublicKeyWarning: true,
    });
  }, []);

  return (
    <CimplifyProvider client={client}>
      <CartDrawerProvider>
        <SilentAuthBootstrap />
        {children}
      </CartDrawerProvider>
    </CimplifyProvider>
  );
}
