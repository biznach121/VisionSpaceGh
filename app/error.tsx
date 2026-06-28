"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary. Next.js calls this whenever a thrown error escapes
 * a Server Component without being caught by a closer `error.tsx`.
 *
 * Wire `reportError` (Sentry, Datadog, etc.) here so production failures
 * surface — silently recovering hides real bugs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: replace with your error reporter
    // eslint-disable-next-line no-console
    console.error("Storefront error:", error);
  }, [error]);

  return (
    <section className="max-w-2xl mx-auto px-6 sm:px-8 py-20 text-center">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-primary mb-3">
        Something broke
      </p>
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4 -tracking-[0.025em]">
        That wasn&apos;t supposed to happen.
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        We&apos;ve been notified. Refresh the page, or head back home — most
        of the time the second try just works.
      </p>
      {error.digest && (
        <p className="text-xs font-mono text-muted-foreground mb-6">
          Reference:{" "}
          <code className="text-foreground">{error.digest}</code>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
