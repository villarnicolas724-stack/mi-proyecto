import type { Metadata } from "next";
import { MyProductsScreen } from "@/components/screens/my-products";

export const metadata: Metadata = { title: "Mis productos" };

export default function Page() {
  return <MyProductsScreen />;
}
