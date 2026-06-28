"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { brand } from "@/lib/brand";

interface HeroSlide {
  kind: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
}

interface HeroCarouselProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  slides: HeroSlide[];
}

export function HeroCarousel({
  title,
  primaryCta,
  slides,
}: HeroCarouselProps) {
  const safeSlides = useMemo(() => slides.filter((slide) => slide.src), [slides]);
  const [active, setActive] = useState(0);
  // Videos always autoplay muted (browsers block autoplay with sound); the
  // floating button lets the visitor opt into audio via a user gesture.
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [safeSlides.length]);

  // Keep only the active video audible when sound is on; everything else muted.
  useEffect(() => {
    videoRefs.current.forEach((el, index) => {
      if (el) el.muted = muted || index !== active;
    });
  }, [muted, active, safeSlides.length]);

  const toggleMuted = () => {
    setMuted((previous) => {
      const next = !previous;
      const el = videoRefs.current[active];
      if (el) {
        el.muted = next;
        if (!next) {
          el.volume = 1;
          void el.play().catch(() => {});
        }
      }
      return next;
    });
  };

  if (safeSlides.length === 0) return null;

  const activeIsVideo = safeSlides[active]?.kind === "video";

  return (
    <section
      data-hero-carousel
      className="relative min-h-svh overflow-hidden bg-black text-white"
      aria-label={`${brand.name} campaign`}
    >
      <div className="absolute inset-0">
        {safeSlides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={`${slide.src}-${index}`}
              aria-hidden={!isActive}
              className={[
                "absolute inset-0 transition-opacity duration-1000",
                isActive ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              {slide.kind === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={slide.poster}
                >
                  <source src={slide.src} />
                </video>
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-black/28" />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/82 via-black/25 to-transparent" />
            </div>
          );
        })}
      </div>

      <FirstSlideOverlay wordmark={brand.microTag} tagline={title} cta={primaryCta} />

      {(activeIsVideo || safeSlides.length > 1) && (
        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-4 sm:right-8 lg:right-12">
          {activeIsVideo && (
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute hero video" : "Mute hero video"}
              aria-pressed={!muted}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MuteIcon muted={muted} />
            </button>
          )}
          {safeSlides.length > 1 && (
            <div className="flex items-center gap-2">
              {safeSlides.map((slide, index) => (
                <button
                  key={`${slide.src}-dot-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show campaign slide ${index + 1}`}
                  aria-current={index === active}
                  className={[
                    "h-1.5 transition-all",
                    index === active ? "w-10 bg-white" : "w-5 bg-white/45 hover:bg-white/75",
                  ].join(" ")}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MuteIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

function FirstSlideOverlay({
  wordmark,
  tagline,
  cta,
}: {
  wordmark: string;
  tagline: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="relative flex min-h-svh flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-14 lg:px-12">
      <h1 className="font-kontanter m-0 max-w-none whitespace-nowrap text-[2.75rem] leading-[0.95] tracking-normal text-white min-[380px]:text-[3.25rem] sm:text-[5.25rem] md:text-[7.5rem] lg:text-[10.5rem] xl:text-[12.75rem]">
        {wordmark}
      </h1>
      <div className="mt-8 flex flex-col gap-5 min-[520px]:flex-row min-[520px]:items-center sm:mt-12 sm:gap-8">
        <p className="m-0 text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-2xl sm:tracking-[0.24em]">
          {tagline}
        </p>
        <Link
          href={cta.href}
          className="fill-btn group relative inline-flex min-h-14 w-full items-center justify-center overflow-hidden bg-white px-5 text-center text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors duration-300 hover:text-primary-foreground min-[520px]:w-auto min-[520px]:min-w-[320px] sm:px-6 sm:text-base sm:tracking-[0.22em]"
        >
          <span className="relative z-[1] inline-flex items-center gap-4 sm:gap-6">
            {cta.label}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12h15" strokeLinecap="round" />
              <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
