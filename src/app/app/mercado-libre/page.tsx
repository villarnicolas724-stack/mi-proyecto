import type { Metadata } from "next";
import { MercadoLibreScreen } from "@/components/screens/mercadolibre";

export const metadata: Metadata = { title: "Mercado Libre" };

export default function Page() {
  return <MercadoLibreScreen />;
}
