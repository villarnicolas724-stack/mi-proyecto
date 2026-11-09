import type { Metadata } from "next";
import { ProductFinder } from "@/components/screens/product-finder";

export const metadata: Metadata = { title: "Productos" };

export default function Page() {
  return <ProductFinder />;
}
