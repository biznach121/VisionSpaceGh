import Link from "next/link";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="max-w-2xl mx-auto px-6 sm:px-8 py-20 text-center">
      <h1 className="text-3xl mt-0 mb-3 font-bold -tracking-[0.025em]">
        Order confirmed.
      </h1>
      <p className="text-muted-foreground">
        Order <code className="font-mono text-foreground">{id}</code> — you&apos;ll
        get an SMS with tracking within 30 minutes.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm transition-colors hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </p>
    </section>
  );
}
