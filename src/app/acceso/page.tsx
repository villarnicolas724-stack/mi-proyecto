import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { Button, Input, Label } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Acceso", robots: { index: false, follow: false } };

async function ErrorMessage({ searchParams }: { searchParams: PageProps<"/acceso">["searchParams"] }) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger" role="alert">
      Contraseña incorrecta. Inténtalo de nuevo.
    </p>
  );
}

export default function Page({ searchParams }: PageProps<"/acceso">) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form action="/api/acceso" method="post" className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h1 className="text-center text-xl font-extrabold text-text">Tu espacio privado</h1>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
          </div>
          <Suspense fallback={null}>
            <ErrorMessage searchParams={searchParams} />
          </Suspense>
          <Button type="submit" className="w-full" size="lg">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
