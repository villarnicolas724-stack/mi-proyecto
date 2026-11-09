"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Segmented } from "@/components/ui/chips";
import { Button, Input, Label } from "@/components/ui/primitives";
import { sessionStore } from "@/lib/state/stores";

export function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<"registro" | "ingreso">("registro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un email válido, por ejemplo nombre@correo.com.");
    if (password.length < 8) return setError("La contraseña necesita al menos 8 caracteres.");
    if (mode === "registro" && !name.trim()) return setError("Dinos cómo te llamas.");
    // Demostración: la sesión se guarda en este navegador. Con backend: Supabase Auth.
    sessionStore.set({ name: name.trim() || email.split("@")[0], email });
    router.push("/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center" aria-label="Volver a la página principal">
          <Logo />
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="mb-5 flex justify-center">
            <Segmented
              label="Tipo de acceso"
              hideLabel
              value={mode}
              onChange={(m) => {
                setMode(m);
                setError(null);
              }}
              options={[
                { value: "registro", label: "Crear cuenta" },
                { value: "ingreso", label: "Ingresar" },
              ]}
            />
          </div>
          <h1 className="text-center text-xl font-extrabold text-text">
            {mode === "registro" ? "Empieza gratis, sin tarjeta" : "Bienvenido de nuevo"}
          </h1>
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === "registro" ? (
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            ) : null}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "registro" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? (
              <p className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" size="lg">
              {mode === "registro" ? "Crear cuenta gratis" : "Ingresar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-2">
            ¿Solo quieres mirar?{" "}
            <Link href="/app" className="font-semibold text-primary-ink hover:underline">
              Entra a la demo como invitado
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Versión de demostración: la cuenta se guarda solo en este navegador.
        </p>
      </div>
    </div>
  );
}
