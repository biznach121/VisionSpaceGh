"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import type { CategoryMenuItem } from "@/lib/nav-menu";
import { AuthControl } from "./auth-controls";

/**
 * Hamburger button + slide-in drawer for narrow viewports. Header hides
 * its inline nav links below `sm` and renders this in their place; the
 * cart pill stays in the header chrome.
 */
export function MobileNav({
  categories = [],
  transparent = false,
}: {
  categories?: CategoryMenuItem[];
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className={[
          "grid place-items-center w-11 h-11 -mr-2 transition-colors",
          transparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted",
        ].join(" ")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open ? (
        <nav
          id="mobile-nav-drawer"
          className="fixed inset-0 z-[80] flex min-h-dvh flex-col overflow-y-auto bg-background text-foreground md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid place-items-center w-11 h-11 -mr-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-1 flex-col gap-1 bg-background px-6 py-8">
            {brand.header.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {categories.length ? (
              <li className="mt-4">
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Categories
                </p>
                <ul className="flex flex-col gap-1">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <span>{c.label}</span>
                        <span className="text-xs text-muted-foreground">{c.products.length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
          <div className="mt-auto border-t border-border bg-background px-6 py-4">
            <AuthControl mobile />
          </div>
        </nav>
      ) : null}
    </>
  );
}
