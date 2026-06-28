"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Guest order tracker. Routes /orders/<id> with the entered id; the
 * post-checkout confirmation page already lives at /orders/[id] so this
 * just sends the visitor there. Replace the redirect with a real lookup
 * (e.g. Cimplify orders API + email-match guard) for production.
 */
export function TrackOrderForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        router.push(`/orders/${encodeURIComponent(orderId.trim())}`);
      }}
      className="space-y-4 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <label
          htmlFor="orderId"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
        >
          Order number
        </label>
        <input
          id="orderId"
          name="orderId"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="ord_abc123…"
          className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
        >
          Order email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        Track order
      </button>
    </form>
  );
}
