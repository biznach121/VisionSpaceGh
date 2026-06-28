"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckoutPage as SdkCheckoutPage } from "@cimplify/sdk/react";
import type { CimplifyCheckoutProps } from "@cimplify/sdk/react";
import { CheckoutSignInPrompt, useAuthConfig } from "@/components/auth-controls";

type StorefrontCheckoutProps = Partial<
  Omit<CimplifyCheckoutProps, "client" | "onError" | "onComplete">
>;

export default function CheckoutPage() {
  const router = useRouter();
  const { loading: authConfigLoading } = useAuthConfig();
  const checkoutProps = useMemo<StorefrontCheckoutProps>(
    () => ({
      orderTypes: ["delivery", "pickup"],
      defaultOrderType: "delivery",
      submitLabel: "Pay securely",
      appearance: {
        theme: "light",
        variables: {
          primaryColor: "#0f0f0f",
          borderRadius: "0.5rem",
        },
      },
    }),
    [],
  );

  if (authConfigLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
          Preparing secure checkout...
        </div>
      </div>
    );
  }

  return (
    <>
      <CheckoutSignInPrompt />
      <SdkCheckoutPage
        className="all-eyes-checkout-surface"
        checkoutProps={checkoutProps}
        onError={(error) => {
          console.error("[cimplify checkout]", error.code, error.message);
        }}
        onComplete={(result) => {
          if (result.success && result.order) {
            router.push(`/orders/${result.order.id}`);
          }
        }}
      />
    </>
  );
}
