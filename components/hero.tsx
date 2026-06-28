interface HeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export function Hero({ badge, title, subtitle }: HeroProps) {
  return (
    <section className="relative px-6 sm:px-8 py-20 text-center overflow-hidden bg-gradient-to-br from-foreground via-foreground to-primary text-background">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative max-w-3xl mx-auto">
        {badge && (
          <span className="inline-block mb-5 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary-foreground/90 text-[11px] font-semibold uppercase tracking-[0.16em] font-mono">
            {badge}
          </span>
        )}
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold m-0 -tracking-[0.03em] leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-background/80 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
