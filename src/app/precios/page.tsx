import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/pricing";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = { title: "Precios" };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-text">Precios</h1>
        <p className="mx-auto mt-2 mb-10 max-w-xl text-center text-text-2">
          Empieza gratis, sin tarjeta. Cambia o cancela cuando quieras.
        </p>
        <PricingTable mode="public" />
      </main>
      <SiteFooter />
    </>
  );
}
