import Link from "next/link";
import Image from "next/image";
import type { Category } from "@cimplify/sdk";

interface CategoryTilesProps {
  categories: Category[];
}

const ICONS: Record<string, React.ReactNode> = {
  phones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  laptops: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" />
    </svg>
  ),
  audio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <rect x="2" y="14" width="5" height="6" rx="1.5" />
      <rect x="17" y="14" width="5" height="6" rx="1.5" />
    </svg>
  ),
  accessories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
      <rect x="2" y="6" width="14" height="10" rx="2" />
      <path d="M16 12h4l2 2v0l-2 2h-4" />
    </svg>
  ),
  gaming: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
      <path d="M5 7h14a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-1l-2-3H8l-2 3H5a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z" />
      <line x1="9" y1="11" x2="9" y2="13" strokeLinecap="round" />
      <line x1="8" y1="12" x2="10" y2="12" strokeLinecap="round" />
      <circle cx="15" cy="11" r="0.75" fill="currentColor" />
      <circle cx="17" cy="13" r="0.75" fill="currentColor" />
    </svg>
  ),
};

export function CategoryTiles({ categories }: CategoryTilesProps) {
  if (categories.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2">
            Shop the catalogue
          </p>
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold -tracking-[0.025em]">
            Pick your category.
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap hidden sm:inline-flex items-center gap-1"
        >
          See everything
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 hover:border-primary hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between mb-12">
              <div className="grid place-items-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                {ICONS[c.slug] ?? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-base font-semibold mb-1 -tracking-[0.015em]">{c.name}</p>
            {c.product_count != null && (
              <p className="text-xs text-muted-foreground">
                {c.product_count} {c.product_count === 1 ? "product" : "products"}
              </p>
            )}
            <span className="absolute right-4 bottom-4 grid place-items-center w-7 h-7 rounded-full bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
