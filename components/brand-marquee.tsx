"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";

/**
 * "Brands we carry" strip. Pulls each designer's actual logo from a logo CDN
 * (by domain) and falls back to a styled wordmark if the logo can't be fetched.
 */
export function BrandMarquee() {
  const strip = brand.brandStrip;
  if (!strip || strip.brands.length === 0) return null;
  return (
    <section className="overflow-hidden border-y border-border bg-background py-8 sm:py-10">
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {strip.headline}
      </p>
      <div className="flex flex-wrap items-center justify-around gap-x-10 gap-y-6 px-6 sm:gap-x-14">
        {strip.brands.map((b) => (
          <LogoItem key={b.name} name={b.name} domain={b.domain} />
        ))}
      </div>
    </section>
  );
}

function LogoItem({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-[clamp(1.1rem,1.8vw,1.6rem)] font-semibold -tracking-[0.025em] text-muted-foreground opacity-70 transition-colors hover:text-foreground hover:opacity-100">
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      title={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-7 w-auto max-w-[150px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-9"
    />
  );
}
