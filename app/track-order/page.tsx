import type { Metadata } from "next";
import { TrackOrderForm } from "./track-order-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Track an order — ${brand.name}`,
  description: brand.trackOrder.body,
};

export default function TrackOrderPage() {
  const t = brand.trackOrder;
  return (
    <article className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
        {t.eyebrow}
      </p>
      <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-semibold mb-4 -tracking-[0.02em]">
        {t.title}
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">{t.body}</p>
      <TrackOrderForm />
    </article>
  );
}
