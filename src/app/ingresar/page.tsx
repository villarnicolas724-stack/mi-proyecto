import type { Metadata } from "next";
import { SignIn } from "@/components/screens/sign-in";

export const metadata: Metadata = { title: "Crear cuenta o ingresar" };

export default function Page() {
  return <SignIn />;
}
