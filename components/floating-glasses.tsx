"use client";

import dynamic from "next/dynamic";

// WebGL can't render on the server, so load the scene client-only.
const Scene = dynamic(() => import("./floating-glasses-scene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

export function FloatingGlasses() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px] text-center">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Up close
        </p>
        <h2 className="m-0 text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
          See every angle
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Move your cursor — the frame turns to follow.
        </p>
      </div>
      <div className="relative mx-auto mt-4 h-[clamp(360px,52vh,620px)] w-full max-w-[1100px]">
        <Scene />
      </div>
    </section>
  );
}
