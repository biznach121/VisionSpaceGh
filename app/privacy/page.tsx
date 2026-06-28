import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${brand.name}`,
  description: `How ${brand.name} collects, uses, and protects your personal data.`,
};

export default function PrivacyPage() {
  const p = brand.privacy;
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-16 prose prose-lg max-w-none">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2 not-prose">
        {p.eyebrow}
      </p>
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold mb-2 -tracking-[0.025em]">
        {p.title}
      </h1>
      <p className="text-sm text-muted-foreground not-prose mb-10">
        Last updated: {p.lastUpdated}
      </p>

      <section className="space-y-5 leading-relaxed text-foreground/90">
        {p.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-2xl font-semibold mt-0 -tracking-[0.02em]">{s.heading}</h2>
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
