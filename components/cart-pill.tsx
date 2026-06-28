"use client";

import { useCartDrawer } from "@cimplify/sdk/react";
import { useCartCount } from "@/lib/cart";

/**
 * Cart pill — dynamic island. Reads the live cart count via the SDK and
 * opens the side cart drawer on click (instead of navigating to /cart).
 * Wrap in `<Suspense fallback={<CartPillSkeleton/>}>` so the cached
 * header chrome streams without blocking on the cart fetch.
 */
export function CartPill() {
  const { count } = useCartCount();
  const { open } = useCartDrawer();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative grid h-11 w-11 place-items-center text-current transition-opacity hover:opacity-75 cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 8.5h11l-.8 11H7.3l-.8-11Z" />
        <path d="M9 8.5a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 ? (
        <span className="absolute right-0 top-0 z-10 grid h-5 min-w-5 place-items-center border border-current/20 bg-background px-1 text-[10px] font-bold leading-none text-foreground shadow-sm">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CartPillSkeleton() {
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 place-items-center text-current opacity-70"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 8.5h11l-.8 11H7.3l-.8-11Z" />
        <path d="M9 8.5a3 3 0 0 1 6 0" />
      </svg>
    </span>
  );
}
