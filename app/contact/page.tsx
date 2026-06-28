import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Contact — ${brand.name}`,
  description: brand.contactPage.body,
};

export default function ContactPage() {
  const c = brand.contactPage;
  return (
    <article className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
        {c.eyebrow}
      </p>
      <h1 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold mb-4 -tracking-[0.02em]">
        {c.title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">{c.body}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
        <ContactForm reasons={c.reasons} />
        <aside className="space-y-5 lg:pl-10 lg:border-l border-border">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
              Direct lines
            </p>
            <ul className="space-y-3 list-none p-0 m-0">
              {c.directLines.map((line) => (
                <li key={line.label}>
                  <p className="text-xs text-muted-foreground m-0">{line.label}</p>
                  <a
                    href={line.href}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {line.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
              Visit
            </p>
            <p className="text-foreground m-0">{brand.contact.address}</p>
            <p className="text-xs text-muted-foreground mt-1">{brand.contact.hours}</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
