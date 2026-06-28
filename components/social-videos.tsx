"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const VIDEOS: string[] = [
  "https://res.cloudinary.com/dzykdnbvb/video/upload/v1782664186/stage4/visionspacegh/tiktok_0.mp4",
];

export function SocialVideos({ handle }: { handle: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [sound, setSound] = useState<number | null>(null);

  // Autoplay (muted) only while a card is on screen; pause the rest.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.5 },
    );
    videoRefs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  const toggleSound = (i: number) => {
    setSound((current) => {
      const next = current === i ? null : i;
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        v.muted = next !== idx;
        if (next === idx) {
          v.volume = 1;
          v.play().catch(() => {});
        }
      });
      return next;
    });
  };

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-vid]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.7;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Follow {handle}
            </p>
            <h2 className="m-0 text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
              Seen everywhere
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-[0.16em] underline underline-offset-8"
          >
            Shop the feed
          </Link>
        </div>

        <div className="relative">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((src, i) => (
              <div
                key={src}
                data-vid
                className="group relative aspect-[9/16] w-[70vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.5)] sm:w-[300px]"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
                <span className="absolute left-4 top-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 drop-shadow">
                  {handle}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSound(i)}
                  aria-label={sound === i ? "Mute video" : "Unmute video"}
                  aria-pressed={sound === i}
                  className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/65"
                >
                  <SoundIcon on={sound === i} />
                </button>
              </div>
            ))}
          </div>

          <CarouselButton direction="left" onClick={() => scroll(-1)} />
          <CarouselButton direction="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={[
        "fill-btn group absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/10 transition-colors duration-300 hover:text-primary-foreground md:flex",
        direction === "left" ? "left-2 lg:-left-5" : "right-2 lg:-right-5",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="relative z-[1] h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </>
      ) : (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
    </svg>
  );
}
