import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export function SummerCollection() {
  const images = brand.assets.summer2026;
  const section = brand.fashion.summer2026;
  const [cover, street, detail, extra] = images;

  if (!cover || !street || !detail) return null;

  return (
    <section className="overflow-hidden border-y border-neutral-950 bg-[#fbf6ef] text-neutral-950">
      <div className="mx-auto grid max-w-[1900px] grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative flex min-h-[520px] flex-col justify-between px-5 py-10 sm:px-8 sm:py-12 lg:min-h-[820px] lg:px-12 lg:py-14">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              {section.eyebrow}
            </p>
            <h2 className="m-0 mt-5 max-w-2xl text-[3.4rem] font-semibold uppercase leading-[0.84] tracking-normal sm:text-7xl lg:text-8xl xl:text-9xl">
              {section.title}
            </h2>
          </div>

          <div className="mt-8 max-w-md">
            <p className="m-0 text-base leading-relaxed text-neutral-700">
              {section.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <Link
                href={section.primaryCtaHref}
                className="inline-flex min-h-11 w-full items-center justify-center bg-neutral-950 px-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80 min-[420px]:w-auto"
              >
                {section.primaryCtaLabel}
              </Link>
              <Link
                href={section.secondaryCtaHref}
                className="inline-flex min-h-11 w-full items-center justify-center border border-neutral-950 px-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white min-[420px]:w-auto"
              >
                {section.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div
            className="pointer-events-none absolute -bottom-5 left-4 hidden font-kontanter text-[8rem] leading-none text-neutral-950/5 sm:block lg:text-[11rem]"
            aria-hidden="true"
          >
            {section.yearMark}
          </div>
        </div>

        <div className="relative bg-neutral-950 px-4 py-5 sm:px-6 sm:py-6 lg:min-h-[820px] lg:px-8 lg:py-8">
          <div className="hidden h-full grid-cols-[0.92fr_0.58fr_0.72fr] grid-rows-[0.68fr_0.32fr] gap-3 lg:grid">
            <SummerPoster
              image={cover}
              alt={`${brand.name} ${section.imageKicker} campaign cover`}
              className="col-span-1 row-span-2"
              label={`${section.lookLabel} 01`}
            />
            <SummerPoster
              image={street}
              alt={`${brand.name} ${section.imageKicker} eyewear look`}
              className="col-span-2"
              label={`${section.lookLabel} 02`}
            />
            {extra ? (
              <SummerPoster
                image={extra}
                alt={`${brand.name} ${section.imageKicker} look 04`}
                className="col-span-1"
                label={`${section.lookLabel} 04`}
              />
            ) : (
              <div className="relative overflow-hidden border border-white/12 bg-[#f4efe8] p-4 text-neutral-950">
                <p className="m-0 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  {section.signalEyebrow}
                </p>
                <p className="m-0 mt-4 text-3xl font-semibold uppercase leading-[0.92]">
                  {section.signalTitle}
                </p>
                <span className="absolute bottom-4 left-4 h-px w-20 bg-neutral-950" aria-hidden="true" />
              </div>
            )}
            <SummerPoster
              image={detail}
              alt={`${brand.name} ${section.imageKicker} detail look`}
              className="col-span-1"
              label={`${section.lookLabel} 03`}
            />
          </div>

          <div className="flex snap-x gap-3 overflow-x-auto pb-2 lg:hidden">
            {images.map((image, index) => (
              <div
                key={image}
                className="relative aspect-[3/4] min-w-[78vw] snap-center overflow-hidden border border-white/10 bg-neutral-900 sm:min-w-[44vw]"
              >
                <Image
                  src={image}
                  alt={`${brand.name} ${section.imageKicker} look ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 44vw, 78vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-black/55 p-4 text-white">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">
                    {section.lookLabel} {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                    {section.imageKicker}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 overflow-hidden lg:block">
            <p className="m-0 whitespace-nowrap font-kontanter text-[9rem] leading-none text-white/10">
              {section.imageKicker} {section.imageKicker} {section.imageKicker}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummerPoster({
  image,
  alt,
  label,
  className,
}: {
  image: string;
  alt: string;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`group relative m-0 overflow-hidden border border-white/12 bg-neutral-900 ${className ?? ""}`}>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 50vw, 80vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
      />
      <figcaption className="absolute left-4 top-4 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-950">
        {label}
      </figcaption>
    </figure>
  );
}
