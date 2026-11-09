import type { Metadata } from "next";
import { Guide } from "@/components/screens/guide";

export const metadata: Metadata = { title: "Guía y recursos" };

export default function Page() {
  return <Guide />;
}
