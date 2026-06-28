"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";

export function Newsletter() {
  const n = brand.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-neutral-950 px-6 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 border-y border-white/18 py-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
            {n.eyebrow}
          </p>
          <h2 className="m-0 mb-4 text-[2.4rem] font-semibold uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
            {n.title}
          </h2>
          <p className="max-w-lg leading-relaxed text-white/68">{n.body}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={n.placeholder}
            disabled={submitted}
            className="min-h-12 flex-1 border border-white/25 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitted}
            className="fill-btn group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition-colors duration-300 hover:text-primary-foreground disabled:opacity-50"
          >
            <span className="relative z-[1]">{submitted ? n.successLabel : n.submitLabel}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
