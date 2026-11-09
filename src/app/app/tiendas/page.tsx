import type { Metadata } from "next";
import { StoreRadar } from "@/components/screens/stores";

export const metadata: Metadata = { title: "Tiendas" };

export default function Page() {
  return <StoreRadar />;
}
