import { brand } from "@/lib/brand";

const ICONS: Record<string, React.ReactNode> = {
  delivery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <path d="M3 7h12v8H3zM15 10h4l3 3v2h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="18" cy="17" r="1.5" />
    </svg>
  ),
  warranty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  verified: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <path d="M18 18a8 8 0 1 0-12 0" />
      <path d="M3 18h4v3H3zM17 18h4v3h-4z" strokeLinejoin="round" />
    </svg>
  ),
};

const FALLBACK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export function TrustBar() {
  const items = brand.trustItems;
  if (!items || items.length === 0) return null;
  return (
    <section className="border-y border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
        {items.map((it) => (
          <div key={it.label} className="flex items-start gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-sm bg-primary/10 text-primary shrink-0">
              {ICONS[it.iconKey] ?? FALLBACK_ICON}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-0.5">
                {it.label}
              </p>
              <p className="text-base font-semibold -tracking-[0.015em] mb-0.5">{it.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{it.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
