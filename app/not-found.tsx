import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Page not found — ${brand.name}`,
  description: "We couldn't find that page.",
};

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-6 sm:px-8 py-20 text-center">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-3">
        404
      </p>
      <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-4 -tracking-[0.03em]">
        Page not found.
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        The URL you followed might be old, a typo, or pointing at a product
        that&apos;s no longer in stock. Try the menu or head back home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Browse the shop
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
