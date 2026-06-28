"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { DesktopNav } from "./desktop-nav";
import { CategoriesMenu } from "./categories-menu";
import { CartPill, CartPillSkeleton } from "./cart-pill";
import { MobileNav } from "./mobile-nav";
import { AuthControl } from "./auth-controls";
import { brand } from "@/lib/brand";
import type { NavMenuItem, CategoryMenuItem } from "@/lib/nav-menu";

const NAV_LOGO = brand.assets.logo;

export function Header({
  menu,
  categories,
}: {
  menu: NavMenuItem[];
  categories: CategoryMenuItem[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(!isHome);
  const transparent = isHome && !pastHero;

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }

    const update = () => {
      setPastHero(window.scrollY > 24);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  return (
    <header
      className={[
        isHome ? "fixed" : "sticky",
        "top-0 z-30 grid w-full grid-cols-[1fr_auto_1fr] items-center px-4 py-3 transition-colors duration-300 sm:px-8",
        transparent
          ? "border-transparent bg-transparent text-white"
          : "border-b border-border bg-background/95 text-foreground shadow-sm backdrop-blur-md",
      ].join(" ")}
    >
      <div className="flex items-center justify-start gap-5 lg:gap-7">
        <DesktopNav items={menu} transparent={transparent} />
        <CategoriesMenu categories={categories} transparent={transparent} />
        <div className="md:hidden">
          <MobileNav categories={categories} transparent={transparent} />
        </div>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center"
        aria-label={brand.name}
      >
        <Image
          src={NAV_LOGO}
          alt={brand.name}
          width={128}
          height={128}
          priority
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
        />
      </Link>

      <div className="flex items-center justify-end gap-3 sm:gap-4">
        <Link
          href="/map"
          aria-label="Find our store"
          className={[
            "hidden items-center justify-center rounded-md p-2 transition-colors md:inline-flex",
            transparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
        </Link>
        <AuthControl transparent={transparent} />
        <Suspense fallback={<CartPillSkeleton />}>
          <CartPill />
        </Suspense>
      </div>
    </header>
  );
}
