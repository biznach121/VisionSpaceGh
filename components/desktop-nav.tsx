"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { NavMenuItem } from "@/lib/nav-menu";

/**
 * Desktop primary nav. Category links with a product preview open a hover
 * mega-menu showing a few shots from that category; everything else is a plain
 * link. The panel sits inside each item's wrapper (with a padding "bridge") so
 * the mouse can travel from link to panel without the menu closing.
 */
export function DesktopNav({
  items,
  transparent = false,
}: {
  items: NavMenuItem[];
  transparent?: boolean;
}) {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);

  return (
    <nav className="hidden items-center justify-start gap-5 md:flex lg:gap-7">
      {items.map((item) => {
        const active = pathname === item.href;
        const hasMenu = Boolean(item.preview?.length);
        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => setOpenHref(hasMenu ? item.href : null)}
            onMouseLeave={() => setOpenHref(null)}
            onFocus={() => setOpenHref(hasMenu ? item.href : null)}
          >
            <Link
              href={item.href}
              aria-haspopup={hasMenu || undefined}
              aria-expanded={hasMenu ? openHref === item.href : undefined}
              className={[
                "text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                transparent
                  ? active
                    ? "text-white"
                    : "text-white/76 hover:text-white"
                  : active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </Link>

            {hasMenu && openHref === item.href ? (
              // pt-4 bridges the gap between the link and the visible panel so
              // hover persists while the cursor crosses into the menu.
              <div className="absolute left-0 top-full z-40 pt-4">
                <div className="w-[min(92vw,560px)] border border-border bg-background text-foreground shadow-xl">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </span>
                    <Link
                      href={item.href}
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4 hover:text-primary"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="flex gap-3 p-4">
                    {item.preview!.map((p) => (
                      <Link key={p.href} href={p.href} className="group block w-[130px] shrink-0">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="130px"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                        <span className="mt-2 block truncate text-[11px] font-semibold uppercase tracking-[0.06em]">
                          {p.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
