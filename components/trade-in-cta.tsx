import Link from "next/link";
import { brand } from "@/lib/brand";

export function TradeInCta() {
  const t = brand.tradeIn;
  if (!t) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-foreground text-background rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] [background-image:linear-gradient(135deg,white_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary-foreground/70 mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold m-0 mb-4 -tracking-[0.025em] leading-[1.1]">
            {t.title}
          </h2>
          <p className="text-background/75 leading-relaxed mb-6">{t.body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={t.primaryCtaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t.primaryCtaLabel}
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={t.secondaryCtaHref}
              className="fill-btn group relative inline-flex items-center overflow-hidden rounded-md border border-background/25 px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:text-primary-foreground"
            >
              <span className="relative z-[1]">{t.secondaryCtaLabel}</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {t.steps.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl p-4 sm:p-5 bg-background/5 border border-background/10"
            >
              <p className="text-[10px] font-mono text-primary tabular-nums mb-3">{s.step}</p>
              <p className="text-[13px] sm:text-sm font-semibold mb-1.5 -tracking-[0.015em]">
                {s.title}
              </p>
              <p className="text-[11px] sm:text-xs text-background/65 leading-snug">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
