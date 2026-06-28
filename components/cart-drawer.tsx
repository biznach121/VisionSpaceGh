"use client";

import { useRouter } from "next/navigation";
import { CartDrawer as SdkCartDrawer } from "@cimplify/sdk/react";

/**
 * Side-drawer cart. Auto-opens when an item is added (via
 * `<CartDrawerProvider>` in `providers.tsx`). The header's cart pill
 * also calls `useCartDrawer().open()` to reveal it on click.
 */
export function CartDrawer() {
  const router = useRouter();
  return (
    <SdkCartDrawer
      className="all-eyes-cart-surface"
      onCheckout={() => router.push("/checkout")}
    />
  );
}
