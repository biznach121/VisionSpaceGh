"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductSheet, useProduct, useCart } from "@cimplify/sdk/react";

/**
 * URL-driven product modal. Reads `?product=<slug>` and renders the SDK's
 * `<ProductSheet/>` — vertical layout with image-on-top, then header, then
 * the variant/add-on/composite/bundle customizer. Closing the modal clears
 * the search param. Deep-linkable and survives reloads.
 */
export function ProductModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const slug = searchParams?.get("product") ?? null;

  const { product } = useProduct(slug ?? "", { enabled: Boolean(slug) });
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!slug) return null;

  function close() {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("product");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={close}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-auto bg-card sm:rounded-3xl rounded-t-3xl shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-card border border-border text-sm cursor-pointer transition-colors hover:bg-muted"
        >
          ✕
        </button>
        {product ? (
          <ProductSheet
            product={product}
            onClose={close}
            onAddToCart={async (p, qty, options) => {
              await addItem(p, qty, options);
              close();
            }}
            renderImage={({ src, alt, className }) => (
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={900}
                className={className}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                priority
              />
            )}
            classNames={{
              root: "p-6 sm:p-8 gap-4",
              image: "rounded-2xl overflow-hidden -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-2",
              header: "flex items-baseline justify-between gap-4",
              name: "font-serif text-2xl font-semibold m-0",
              price: "text-lg font-semibold text-primary",
              description: "text-sm text-muted-foreground leading-relaxed",
              customizer: "pt-2",
            }}
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        )}
      </div>
    </div>
  );
}
