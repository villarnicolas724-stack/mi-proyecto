import type { Metadata } from "next";
import { AdsLibrary } from "@/components/screens/ads-library";

export const metadata: Metadata = { title: "Anuncios" };

export default function Page() {
  return <AdsLibrary />;
}
