import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Full-width promo banner — reads brand.promo. Renders nothing if the
 * brand doesn't define a promo, so this component is safe to drop in
 * across templates that may or may not run a campaign.
 */
export function PromoBanner() {
  const promo = brand.promo;
  if (!promo) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-foreground text-primary-foreground p-8 sm:p-12 lg:p-16">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-background/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-foreground/30 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-background/15 border border-background/25 text-[11px] font-mono uppercase tracking-[0.16em]">
              <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
              {promo.badge}
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold m-0 mb-3 -tracking-[0.025em] leading-[1.1]">
              {promo.title}
            </h2>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed">{promo.body}</p>
          </div>
          <Link
            href={promo.ctaHref}
            className="fill-btn group relative inline-flex items-center overflow-hidden rounded-md bg-background px-5 py-3 text-foreground font-semibold text-sm transition-colors duration-300 hover:text-primary-foreground whitespace-nowrap"
          >
            <span className="relative z-[1] inline-flex items-center gap-2">
            {promo.ctaLabel}
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
