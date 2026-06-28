"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * A floating glasses button pinned to the bottom-right. It nudges (a quick
 * wiggle) every few seconds to draw the eye, and slides away once the footer
 * scrolls into view so it never overlaps the footer content.
 */
export function StickyGlasses() {
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      // Trigger a touch before the footer's top edge reaches the viewport.
      { rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      href="/shop"
      aria-label="Shop the frames"
      className={[
        "fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full",
        "border border-foreground/10 bg-foreground text-background shadow-lg",
        "transition-all duration-300 ease-out hover:scale-105",
        atFooter ? "pointer-events-none translate-y-24 opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <GlassesIcon className="animate-glasses-wiggle" />
    </Link>
  );
}

function GlassesIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="14" r="3.4" />
      <circle cx="18" cy="14" r="3.4" />
      <path d="M9.4 13.4c.9-1 4.3-1 5.2 0" />
      <path d="M2.6 12.5 4.4 8.8a2 2 0 0 1 1.8-1.1" />
      <path d="M21.4 12.5 19.6 8.8a2 2 0 0 0-1.8-1.1" />
    </svg>
  );
}
