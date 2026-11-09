import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/pricing";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Planes" };

export default function Page() {
  return (
    <>
      <PageHeader title="Planes" description="Empieza gratis y cambia de plan cuando lo necesites." />
      <PricingTable mode="app" />
    </>
  );
}
