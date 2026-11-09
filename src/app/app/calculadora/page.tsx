import type { Metadata } from "next";
import { CalculatorPage } from "@/components/screens/calculator-page";

export const metadata: Metadata = { title: "Calculadora" };

export default function Page() {
  return <CalculatorPage />;
}
