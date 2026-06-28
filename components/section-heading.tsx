import Link from "next/link";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
}

export function SectionHeading({ eyebrow, title, description, link }: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div className="max-w-2xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-2">
          {eyebrow}
        </p>
        <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold m-0 -tracking-[0.025em]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap inline-flex items-center gap-1 self-start sm:self-auto"
        >
          {link.label}
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M3 6h7m0 0L7 3m3 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
