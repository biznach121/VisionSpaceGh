import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About — ${brand.name}`,
  description: brand.description,
};

export default function AboutPage() {
  const a = brand.about;
  // Title supports a single \n for a hard line break.
  const titleParts = a.title.split("\n");
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2">
        {a.eyebrow}
      </p>
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold mb-6 -tracking-[0.025em] leading-tight">
        {titleParts.map((line, i) => (
          <span key={i}>
            {line}
            {i < titleParts.length - 1 && <br />}
          </span>
        ))}
      </h1>
      <div className="prose prose-lg max-w-none space-y-5 text-foreground/90 leading-relaxed">
        {a.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {a.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-2xl font-semibold mt-10 mb-3 -tracking-[0.02em]">
              {s.heading}
            </h2>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
