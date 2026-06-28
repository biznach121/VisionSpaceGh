import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Journal - ${brand.name}`,
  description: brand.journal.paragraphs.join(" "),
};

const frames = [
  {
    code: "001",
    kicker: "Origin",
    title: "Started in Accra.",
    body: brand.journal.paragraphs[0],
  },
  {
    code: "002",
    kicker: "Signal",
    title: "Designed around your face.",
    body: brand.journal.paragraphs[1],
  },
  {
    code: "003",
    kicker: "Clarity",
    title: "Glazed to your script.",
    body: brand.journal.paragraphs[2],
  },
];

const imageAt = (index: number) =>
  brand.assets.campaign[index % brand.assets.campaign.length] ?? brand.assets.hero;

export default function JournalPage() {
  const journal = brand.journal;
  const titleParts = journal.title.split("\n");

  return (
    <main className="journal-storyboard overflow-hidden bg-background text-foreground">
      <section className="journal-hero relative min-h-[calc(100svh-4rem)] border-b border-border">
        <div className="absolute inset-0">
          <Image
            src={brand.assets.hero}
            alt={`${brand.name} campaign`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="journal-hero-shade absolute inset-0" />
          <div className="journal-scan absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 content-end gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:py-14">
          <div>
            <p className="journal-mono mb-5 text-[11px] uppercase tracking-[0.18em] text-primary">
              {journal.eyebrow} / ACCRA transmission
            </p>
            <h1 className="max-w-5xl text-[clamp(3.3rem,12vw,10.5rem)] font-black uppercase leading-[0.78] tracking-normal text-white">
              {titleParts.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="journal-status-panel border border-white/35 bg-black/55 p-4 text-white backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="journal-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                Live index
              </span>
              <span className="journal-pulse h-2.5 w-2.5 bg-primary" />
            </div>
            <div className="grid gap-3">
              {["Gaze", "Pressure", "Rise"].map((item, index) => (
                <div key={item} className="grid grid-cols-[4rem_1fr] items-center gap-3">
                  <span className="journal-mono text-[10px] text-white/55">
                    0{index + 1}
                  </span>
                  <span className="h-px bg-white/30">
                    <span
                      className="journal-meter block h-px bg-primary"
                      style={{ animationDelay: `${index * 420}ms` }}
                    />
                  </span>
                  <span className="journal-mono col-start-2 text-[11px] uppercase tracking-[0.16em] text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="journal-ticker journal-mono flex whitespace-nowrap py-3 text-[11px] uppercase tracking-[0.18em]">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group} className="journal-ticker-track flex gap-8 px-4">
              {["Made in Ghana", "Made to be seen", "Glazed to your script", "Fitted to your face", "Palmshades"].map(
                (item) => (
                  <span key={`${group}-${item}`}>{item}</span>
                ),
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[18rem_1fr] lg:py-20">
        <aside className="journal-mono top-24 hidden h-fit text-[11px] uppercase tracking-[0.16em] text-muted-foreground lg:sticky lg:block">
          <div className="grid gap-5 border-l border-border pl-5">
            <span>Storyboard</span>
            <span>Three frames</span>
            <span>One origin</span>
          </div>
        </aside>

        <div className="grid gap-8">
          {frames.map((frame, index) => (
            <section
              key={frame.code}
              className="journal-frame group grid min-h-[34rem] grid-cols-1 overflow-hidden border border-border bg-background lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
            >
              <div className="relative min-h-[22rem] overflow-hidden bg-black lg:min-h-full">
                <Image
                  src={imageAt(index)}
                  alt={`${brand.name} ${frame.kicker} frame`}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="journal-frame-image object-cover"
                />
                <div className="journal-grid absolute inset-0" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <span className="journal-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                    Frame {frame.code}
                  </span>
                  <span className="journal-crosshair h-12 w-12 border border-white/45" />
                </div>
              </div>

              <div className="relative flex min-h-[24rem] flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">
                <div className="journal-frame-line absolute left-0 top-0 h-full w-px bg-border" />
                <div>
                  <p className="journal-mono mb-4 text-[11px] uppercase tracking-[0.16em] text-primary">
                    {frame.kicker}
                  </p>
                  <h2 className="max-w-2xl text-[clamp(2rem,4vw,4.5rem)] font-black uppercase leading-[0.88] tracking-normal">
                    {frame.title}
                  </h2>
                </div>
                <p className="max-w-2xl text-lg leading-relaxed text-foreground/78">
                  {frame.body}
                </p>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="journal-proof relative border-y border-border bg-[#f3f3f0] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)]">
          <div>
            <p className="journal-mono mb-4 text-[11px] uppercase tracking-[0.18em] text-primary">
              Field proof
            </p>
            <h2 className="max-w-5xl text-[clamp(3rem,10vw,8.5rem)] font-black uppercase leading-[0.82] tracking-normal">
              Fitted to your face. Glazed to your script. Built to last.
            </h2>
          </div>
          <div className="grid gap-4">
            <p className="text-lg leading-relaxed text-foreground/72">
              Every frame is chosen for how it sits and how it lasts, then glazed to your
              prescription — made in Ghana, made to be seen.
            </p>
            <Link
              href="/shop"
              className="journal-mono inline-flex w-fit border border-foreground px-5 py-3 text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background"
            >
              Shop the frames
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-5 py-14 sm:px-8 lg:grid-cols-5">
        {[imageAt(2), imageAt(3), imageAt(4), ...brand.assets.summer2026.slice(0, 2)].map(
          (image, index) => (
            <figure
              key={`${image}-${index}`}
              className="journal-film-frame relative min-h-[18rem] overflow-hidden border border-border bg-muted lg:min-h-[26rem]"
            >
              <Image
                src={image}
                alt={`${brand.name} visual field ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 20vw, 100vw"
                className="object-cover"
              />
            </figure>
          ),
        )}
      </section>
    </main>
  );
}
