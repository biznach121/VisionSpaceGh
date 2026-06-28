import Link from "next/link";
import Image from "next/image";

interface FeatureHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  imageAlt: string;
  badge?: string;
}

/**
 * Apple-style split hero. Left: copy + CTAs. Right: large product image.
 * Stacks to image-on-top on mobile. Strings come from `brand.hero` at the
 * call site — this component is otherwise design-only.
 */
export function FeatureHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
  badge,
}: FeatureHeroProps) {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:40px_40px]" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          {badge && (
            <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary-foreground/95 text-[11px] font-mono uppercase tracking-[0.16em]">
              <span className="grid place-items-center w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {badge}
            </span>
          )}
          <p className="text-[12px] font-mono uppercase tracking-[0.2em] text-background/60 mb-3">
            {eyebrow}
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-bold m-0 mb-5 -tracking-[0.035em] leading-[1.02]">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-background/75 leading-relaxed max-w-xl">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-7">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {primaryCta.label}
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-background/25 text-background hover:bg-background/10 transition-colors text-sm font-medium"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-background/5 ring-1 ring-background/10">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
