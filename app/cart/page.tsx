"use client";

import { useRouter } from "next/navigation";
import { CartPage as SdkCartPage } from "@cimplify/sdk/react";

export default function CartPage() {
  const router = useRouter();
  return (
    <SdkCartPage
      className="all-eyes-cart-surface"
      onCheckout={() => router.push("/checkout")}
    />
  );
}
