"use client";

import { useCart } from "@cimplify/sdk/react";

/**
 * Reactive cart count for the header pill. Subscribes to the SDK cart
 * state — updates immediately on add / remove / quantity change.
 */
export function useCartCount(): { count: number } {
  const { itemCount } = useCart();
  return { count: itemCount };
}
