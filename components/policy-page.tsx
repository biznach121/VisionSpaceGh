import type { BrandPolicySection } from "@/lib/brand";

interface PolicyShape {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  sections: BrandPolicySection[];
}

/**
 * Shared layout for shipping / returns / accessibility / terms / privacy.
 * Reads a `{ eyebrow, title, lastUpdated, sections[] }` block from brand.
 */
export function PolicyPage({ policy }: { policy: PolicyShape }) {
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-16 prose prose-lg max-w-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2 not-prose">
        {policy.eyebrow}
      </p>
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold mb-2 -tracking-[0.02em]">
        {policy.title}
      </h1>
      {policy.lastUpdated && (
        <p className="text-sm text-muted-foreground not-prose mb-10">
          Last updated: {policy.lastUpdated}
        </p>
      )}
      <section className="space-y-5 leading-relaxed text-foreground/90">
        {policy.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-2xl font-semibold mt-0">{s.heading}</h2>
            {typeof s.body === "string" ? (
              <p>{s.body}</p>
            ) : (
              <>
                <p>{s.body.intro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {s.body.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </section>
    </article>
  );
}
