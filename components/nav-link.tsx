"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  transparent = false,
}: {
  href: string;
  children: React.ReactNode;
  transparent?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
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
      {children}
    </Link>
  );
}
