import type { Metadata } from "next";
import { Watchlist } from "@/components/screens/watchlist";

export const metadata: Metadata = { title: "Seguimiento" };

export default function Page() {
  return <Watchlist />;
}
