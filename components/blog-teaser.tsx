"use client";

import Link from "next/link";
import { Fraunces } from "next/font/google";
import { useEffect, useRef } from "react";

// Stylish editorial serif for the journal blurb.
const serif = Fraunces({ subsets: ["latin"], weight: ["500"], style: ["normal"] });

const GLASSES =
  "https://res.cloudinary.com/dcc5ggnkc/image/upload/v1782412100/ruvttwyf2urjvkcsr78z.svg";

export function BlogTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const glassesRef = useRef<HTMLDivElement>(null);

  // Scroll-driven scale: the glasses grow as the section travels up the
  // viewport, so they swell into the dark footer as you scroll past the text.
  useEffect(() => {
    const section = sectionRef.current;
    const glasses = glassesRef.current;
    if (!section || !glasses) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      glasses.style.transform = `scale(${0.8 + p * 0.7})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-neutral-950">
      <div
        className="relative bg-secondary px-6 pb-[clamp(240px,34vw,460px)] pt-16 text-foreground sm:px-10 lg:px-16 lg:pt-24"
        style={{
          borderBottomLeftRadius: "50% 110px",
          borderBottomRightRadius: "50% 110px",
        }}
      >
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.5fr_0.8fr]">
          <p
            className={`m-0 max-w-xl text-3xl leading-[1.2] sm:text-4xl lg:text-[2.9rem] ${serif.className}`}
          >
            Trends, lens-care tips, and styling notes — straight from the
            Palmshades journal.
          </p>
          <div className="justify-self-start lg:justify-self-end">
            <Link
              href="/journal"
              className="group inline-flex items-center gap-5 rounded-full bg-neutral-950 py-4 pl-8 pr-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.22em]">
                Blog
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-white/25">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h16m0 0-6-6m6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <div ref={glassesRef} className="origin-bottom will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GLASSES} alt="" className="h-auto w-[clamp(260px,40vw,640px)]" />
        </div>
      </div>
    </section>
  );
}
