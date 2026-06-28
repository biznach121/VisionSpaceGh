import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Find us",
  description: `Visit ${brand.name} — ${brand.contact.address}. Browse frames, get fitted, or drop off a prescription.`,
};

const mapQuery = encodeURIComponent(`${brand.name}, ${brand.contact.address}`);
const embedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

const labelClass =
  "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground";

export default function MapPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
      <header className="max-w-2xl">
        <p className={labelClass}>Visit us</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Find {brand.name}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Come in to browse frames in person, get fitted, or drop off a prescription for
          our team to glaze and fit into the frame of your choice.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden border border-border bg-card">
          <iframe
            title={`Map to ${brand.name}`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border-0 sm:h-[460px]"
          />
        </div>

        <aside className="flex flex-col gap-6">
          <dl className="grid gap-5">
            <div>
              <dt className={labelClass}>Address</dt>
              <dd className="mt-1 text-base">{brand.contact.address}</dd>
            </div>
            <div>
              <dt className={labelClass}>Opening hours</dt>
              <dd className="mt-1 text-base">{brand.contact.hours}</dd>
            </div>
            <div>
              <dt className={labelClass}>Phone</dt>
              <dd className="mt-1 text-base">
                <a href={`tel:${brand.contact.phoneTel}`} className="hover:underline">
                  {brand.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Email</dt>
              <dd className="mt-1 text-base">
                <a href={`mailto:${brand.contact.email}`} className="hover:underline">
                  {brand.contact.email}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-max items-center justify-center bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get directions
          </a>
        </aside>
      </div>
    </div>
  );
}
