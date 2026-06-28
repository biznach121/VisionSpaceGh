import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";

const FOOTER_LOGO = brand.assets.footerLogo;

const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M18 2h3l-7.5 8.6L22 22h-6.6l-5-6.5L4 22H1l8-9.2L1.4 2H8l4.6 6 5.4-6z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M16 3v3.5a4.5 4.5 0 0 0 4.5 4.5V14a7.5 7.5 0 0 1-4.5-1.5V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M14 9V7a1 1 0 0 1 1-1h2V3h-3a4 4 0 0 0-4 4v2H8v3h2v9h3v-9h2.5l.5-3H13z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M22.5 6.5a2.6 2.6 0 0 0-1.8-1.8C19 4.2 12 4.2 12 4.2s-7 0-8.7.5A2.6 2.6 0 0 0 1.5 6.5C1 8.2 1 12 1 12s0 3.8.5 5.5a2.6 2.6 0 0 0 1.8 1.8C5 19.8 12 19.8 12 19.8s7 0 8.7-.5a2.6 2.6 0 0 0 1.8-1.8c.5-1.7.5-5.5.5-5.5s0-3.8-.5-5.5zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M4 4h4v16H4zM6 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 8h4v2.5h.1c.6-1.1 2-2.5 4-2.5 4 0 4.9 2.6 4.9 6V20h-4v-5c0-1.5-.5-3-2.3-3-1.7 0-2.5 1.3-2.5 3v5h-4z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2zm5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.5-.6a8.4 8.4 0 0 1-3.7-3.4c-.7-1-1-1.8-1-2.5 0-.7.4-1.1.6-1.3.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .3 0 .4l-.3.4-.3.3c-.1.1-.2.2-.1.4.2.4.7 1.1 1.4 1.8.9.8 1.7 1.1 1.9 1.2.2.1.3.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.4.7c.2.1.3.2.4.3.1.2.1.6 0 1z" />
    </svg>
  ),
};

const FALLBACK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="w-5 h-5">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export async function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-neutral-950 text-white/72 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src={FOOTER_LOGO}
                alt={brand.name}
                width={120}
                height={120}
                className="h-auto w-[108px] object-contain"
              />
            </div>
            <p className="leading-relaxed mb-4 max-w-sm">{brand.footer.blurb}</p>
            <address className="not-italic space-y-1">
              <p className="m-0">{brand.contact.address}</p>
              <p className="m-0">
                <a
                  href={`tel:${brand.contact.phoneTel}`}
                  className="hover:text-white transition-colors"
                >
                  {brand.contact.phone}
                </a>
              </p>
              <p className="m-0">
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {brand.contact.email}
                </a>
              </p>
              <p className="m-0 text-xs">{brand.contact.hours}</p>
            </address>
            <div className="flex items-center gap-3 mt-5">
              {brand.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 border border-white/20 hover:bg-white hover:text-black transition-colors"
                >
                  {(s.icon && ICONS[s.icon]) ?? FALLBACK_ICON}
                </a>
              ))}
            </div>
          </div>
          {brand.footer.sitemap.map((section) => (
            <nav key={section.title} aria-labelledby={`footer-${section.title}`}>
              <p
                id={`footer-${section.title}`}
                className="text-white font-mono mb-3 text-[11px] uppercase tracking-[0.16em]"
              >
                {section.title}
              </p>
              <ul className="space-y-2 m-0 p-0 list-none">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col items-start justify-between gap-3 text-xs sm:flex-row sm:items-center">
          <p className="m-0">© {year} {brand.name}. All rights reserved.</p>
          {brand.footer.poweredBy && (
            <p className="m-0 inline-flex items-center gap-1.5">
              <span className="opacity-70">Powered by</span>
              <a
                href={brand.footer.poweredBy.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={brand.footer.poweredBy.label}
                className="inline-flex items-center gap-1 text-white hover:opacity-75 transition-opacity"
              >
                <span className="font-semibold tracking-tight">{brand.footer.poweredBy.label}</span>
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden
                  className="w-3 h-3 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 9L9 3M9 3H4M9 3v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
