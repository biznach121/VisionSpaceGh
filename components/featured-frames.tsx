"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart, useCartDrawer } from "@cimplify/sdk/react";
import type { Product } from "@cimplify/sdk";
import { brand } from "@/lib/brand";

// Deterministic currency formatting (server === client) — matches StoreProductCard.
const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "GH₵",
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};
const CURRENCY_SYMBOL = CURRENCY_SYMBOLS[brand.currency] ?? `${brand.currency} `;

function formatPrice(amount: string | number | undefined) {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value)) return typeof amount === "string" ? amount : "";
  return `${CURRENCY_SYMBOL}${value.toFixed(2)}`;
}

function frameImage(product: Product) {
  return product.image_url ?? product.images?.[0] ?? brand.assets.logo;
}

export function FeaturedFrames({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Live "coverflow" fan: each card rotates + drops based on its distance from
  // the track centre, so the centred card is upright and neighbours fan out.
  // Updated on scroll, so it stays smooth while the arrows glide the track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      track.querySelectorAll<HTMLElement>("[data-fan]").forEach((card) => {
        const r = card.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / (rect.width / 2);
        const c = Math.max(-1.4, Math.min(1.4, d));
        card.style.setProperty("--fan-r", `${c * 9}deg`);
        card.style.setProperty("--fan-y", `${Math.abs(c) * 26}px`);
        card.style.zIndex = String(100 - Math.round(Math.abs(c) * 20));
      });

      const bar = progressRef.current;
      if (bar) {
        const max = track.scrollWidth - track.clientWidth;
        const p = max > 0 ? track.scrollLeft / max : 0;
        const thumb = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
        bar.style.setProperty("--progress", String(p));
        bar.style.setProperty("--thumb", `${Math.min(100, thumb * 100)}%`);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [products.length]);

  const nudge = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-fan]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.6;
    track.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mb-8 text-center sm:mb-12">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="m-0 text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
          {title}
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[12vw] py-14 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-fan
            className="fan-card w-[80vw] shrink-0 snap-center sm:w-80"
          >
            <FrameCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Previous"
          className="fill-btn group relative flex h-12 w-28 items-center justify-center overflow-hidden rounded-full bg-secondary text-foreground transition-colors duration-300 hover:text-primary-foreground sm:w-32"
        >
          <Arrow direction="left" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Next"
          className="fill-btn group relative flex h-12 w-28 items-center justify-center overflow-hidden rounded-full bg-secondary text-foreground transition-colors duration-300 hover:text-primary-foreground sm:w-32"
        >
          <Arrow direction="right" />
        </button>
      </div>
      <div
        ref={progressRef}
        className="mx-auto mt-8 h-[3px] w-full max-w-sm overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-foreground"
          style={{
            width: "var(--thumb, 28%)",
            marginLeft: "calc(var(--progress, 0) * (100% - var(--thumb, 28%)))",
          }}
        />
      </div>
    </section>
  );
}

function FrameCard({ product }: { product: Product }) {
  const slug = product.slug || product.id;
  const href = `/products/${encodeURIComponent(slug)}`;
  const image = frameImage(product);

  const { addItem } = useCart();
  const { open } = useCartDrawer();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status === "adding") return;
    setStatus("adding");
    try {
      await addItem(product, 1);
      setStatus("added");
      open();
      setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <article className="frame-card group relative overflow-hidden rounded-2xl bg-white text-card-foreground shadow-[0_10px_30px_-18px_rgba(40,38,22,0.3)] ring-1 ring-black/[0.06] transition-shadow duration-500">
      <span className="absolute right-4 top-4 z-[4] font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {brand.name}
      </span>

      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 20rem, 80vw"
          className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-95 sm:p-5"
        />
      </div>

      <div className="flex items-end justify-between gap-3 px-5 pb-6 pt-1">
        <div className="min-w-0">
          <h3 className="m-0 truncate text-lg font-medium leading-snug transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-3 flex h-6 items-center gap-1.5">
            <span className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-foreground px-1 text-[11px] font-medium group-hover:inline-flex">
              1
            </span>
            {[0, 1, 2].map((di) => (
              <span
                key={di}
                className={[
                  "h-1.5 w-1.5 rounded-full group-hover:hidden",
                  di === 0 ? "bg-foreground" : "bg-foreground/25",
                ].join(" ")}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <p className="m-0 shrink-0 text-lg text-muted-foreground transition-colors group-hover:text-primary">
          {formatPrice(product.default_price)}
        </p>
      </div>

      {/* Whole-card navigation overlay (sits under the add button). */}
      <Link href={href} aria-label={product.name} className="absolute inset-0 z-10" />

      {/* Add-to-cart — mirrors the PALMSHADES tag in the opposite corner. */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        title="Add to cart"
        disabled={status === "adding"}
        className="absolute left-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-foreground bg-white/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground hover:text-white disabled:opacity-70"
      >
        {status === "added" ? <CheckIcon /> : <PlusIcon />}
      </button>
    </article>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`relative z-[1] h-5 w-5 transition-transform duration-300 ${
        direction === "left" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M20 12H4m0 0 6-6m-6 6 6 6" />
      ) : (
        <path d="M4 12h16m0 0-6-6m6 6-6 6" />
      )}
    </svg>
  );
}
