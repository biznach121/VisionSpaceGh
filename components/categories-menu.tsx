"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { StoreProductCard } from "./store-product-card";
import type { CategoryMenuItem } from "@/lib/nav-menu";

/**
 * Navbar "Categories" entry. Hovering the trigger slides a sidebar into view;
 * it lists the categories, and hovering one reveals that category's products as
 * full cards (with add-to-cart) beside the list, plus a "See all" link to the
 * category page. Closes when the cursor leaves both the trigger and the panel.
 */
export function CategoriesMenu({
  categories,
  transparent = false,
}: {
  categories: CategoryMenuItem[];
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(categories[0]?.slug ?? null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Portal target only exists after mount (avoids SSR document access).
  useEffect(() => setMounted(true), []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeNow = () => {
    cancelClose();
    setOpen(false);
  };
  // Small grace period so the cursor can travel from the trigger into the panel.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (categories.length === 0) return null;

  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0];

  return (
    <div className="hidden md:block" onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={openNow}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
          transparent ? "text-white/76 hover:text-white" : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        Categories
      </button>

      {/* Portaled to <body> so the header's `backdrop-filter` can't become the
          containing block for this `fixed` overlay (which would clip it to the
          header's height). Kept mounted so it animates both ways. */}
      {mounted
        ? createPortal(
            <div
              className={["fixed inset-0 z-[70]", open ? "" : "pointer-events-none"].join(" ")}
              aria-hidden={!open}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
        <div
          onClick={closeNow}
          onMouseEnter={scheduleClose}
          className={[
            "absolute inset-0 bg-foreground/30 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Categories"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={[
            "absolute left-0 top-0 flex h-full w-[min(96vw,980px)] flex-col bg-background text-foreground shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Categories
            </span>
            <button
              type="button"
              onClick={closeNow}
              aria-label="Close categories"
              className="grid h-10 w-10 -mr-2 place-items-center rounded-md text-foreground transition-colors hover:bg-muted"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_1fr]">
            {/* Category list */}
            <ul className="overflow-y-auto border-border lg:border-r">
              {categories.map((c) => {
                const isActive = c.slug === active.slug;
                return (
                  <li key={c.slug} className="border-b border-border">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveSlug(c.slug)}
                      onFocus={() => setActiveSlug(c.slug)}
                      onClick={() => setActiveSlug(c.slug)}
                      className={[
                        "flex w-full items-center justify-between gap-3 px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.1em] transition-colors",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <span>{c.label}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        {c.products.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Active category's products as full add-to-cart cards */}
            <div className="min-w-0 overflow-y-auto p-6">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h3 className="m-0 text-lg font-semibold uppercase tracking-[0.06em]">
                  {active.label}
                </h3>
                <Link
                  href={active.href}
                  onClick={closeNow}
                  className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4 hover:text-primary"
                >
                  See all →
                </Link>
              </div>

              {active.products.length ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {active.products.map((p) => (
                    <StoreProductCard
                      key={p.id}
                      product={p}
                      onAdded={closeNow}
                      className="border border-border"
                    />
                  ))}
                </div>
              ) : (
                <p className="m-0 text-sm text-muted-foreground">Nothing here yet.</p>
              )}
            </div>
          </div>
        </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
