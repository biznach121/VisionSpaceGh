"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, useCartDrawer, type CardVariant } from "@cimplify/sdk/react";
import type { Product } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

// Deterministic currency formatting (server === client) so SSR/CSR don't
// disagree. The SDK <Price> resolves currency from a client-only context,
// which renders "$" on the server and "GH₵" after hydration — a mismatch.
const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "GH₵",
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};
const CURRENCY_SYMBOL = CURRENCY_SYMBOLS[brand.currency] ?? `${brand.currency} `;

function formatPrice(amount: string | number) {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value)) return typeof amount === "string" ? amount : "";
  return `${CURRENCY_SYMBOL}${value.toFixed(2)}`;
}

interface Props {
  product: Product;
  /** Kept for call-site compatibility; this storefront uses one fashion card. */
  variant?: CardVariant;
  /** Extra classes for the card shell — used to draw the bordered grid. */
  className?: string;
  /** Called after a successful add-to-cart (e.g. to close a host drawer). */
  onAdded?: () => void;
}

const FALLBACK_IMAGE = brand.assets.logo;

export function StoreProductCard({ product, className, onAdded }: Props) {
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const images = getProductImages(product);
  const imageUrl = images[0] ?? FALLBACK_IMAGE;
  const hoverImageUrl = images[1];
  const outOfStock = product.inventory_status?.in_stock === false || product.is_active === false;

  const { addItem } = useCart();
  const { open } = useCartDrawer();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  async function handleAdd(e: React.MouseEvent) {
    // The button overlays the card's <Link>; stop the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    if (status === "adding") return;
    setStatus("adding");
    try {
      await addItem(product, 1);
      setStatus("added");
      open();
      onAdded?.();
      setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <article className={["relative bg-card text-card-foreground", className ?? ""].join(" ")}>
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 420px) 50vw, 100vw"
            className={[
              "object-cover transition-all duration-700 ease-out",
              outOfStock ? "grayscale" : "group-hover:scale-[1.035]",
            ].join(" ")}
          />
          {hoverImageUrl && !outOfStock ? (
            <Image
              src={hoverImageUrl}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 420px) 50vw, 100vw"
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-100"
            />
          ) : null}
          {outOfStock ? (
            <div className="absolute inset-0 grid place-items-center bg-white/72 text-center backdrop-blur-[1px]">
              <span className="border border-foreground bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Out of stock
              </span>
            </div>
          ) : null}
        </div>
        <div className="grid gap-1.5 px-3 py-3">
          <h3 className="m-0 text-sm font-semibold uppercase leading-tight tracking-[0.06em]">
            {product.name}
          </h3>
          <p className="m-0 text-sm text-muted-foreground">
            {formatPrice(product.default_price)}
          </p>
        </div>
      </Link>

      {!outOfStock ? (
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          title="Add to cart"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-foreground bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background disabled:opacity-70"
          disabled={status === "adding"}
        >
          {status === "added" ? <CheckIcon /> : <PlusIcon />}
        </button>
      ) : null}
    </article>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function getProductImages(product: Product) {
  return Array.from(
    new Set(
      [product.image_url, ...(product.images ?? [])]
        .map((image) => image?.trim())
        .filter((image): image is string => Boolean(image)),
    ),
  );
}
