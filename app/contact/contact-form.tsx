"use client";

import { useState } from "react";

/**
 * Local-only contact form. On submit, fakes a successful response so the
 * template ships a usable interaction. Wire to a real handler (Server
 * Action posting to your CRM, support inbox, or Cimplify Support API)
 * before going to production.
 */
export function ContactForm({ reasons }: { reasons: string[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState(reasons[0] ?? "");

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
          ✓ Sent
        </p>
        <h2 className="font-serif text-2xl font-semibold mb-2">Thanks — we'll be in touch.</h2>
        <p className="text-muted-foreground">
          We respond within one business day. Check your spam folder if you don't see a
          reply by tomorrow.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
          What's it about?
        </label>
        <select
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
        >
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <Field label="Order number (optional)" name="order" />
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-y"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        Send message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
      />
    </div>
  );
}
