"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { LogOut, Trash2 } from "lucide-react";
import { CountrySelect } from "@/components/app/app-shell";
import { Segmented } from "@/components/ui/chips";
import { Button, ButtonLink, Card, CardHeader, Input, Label, PageHeader } from "@/components/ui/primitives";
import {
  applyTheme,
  guideStore,
  planStore,
  sessionStore,
  usePlan,
  useSession,
  useTheme,
  watchStore,
  type ThemeChoice,
} from "@/lib/state/stores";

export function Settings() {
  const router = useRouter();
  const session = useSession();
  const plan = usePlan();
  const theme = useTheme();
  const [confirm, setConfirm] = useState("");

  function deleteAccount() {
    // Con backend: borra la cuenta en Supabase (cascada de datos) y cancela la suscripción en Stripe.
    sessionStore.set(null);
    watchStore.set([]);
    guideStore.set({});
    planStore.set("gratis");
    router.push("/");
  }

  return (
    <>
      <PageHeader title="Ajustes" description="Tu país, tu cuenta y tu plan." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Preferencias" />
          <div className="space-y-5 p-5 pt-4">
            <CountrySelect id="pais-ajustes" />
            <Segmented<ThemeChoice>
              label="Apariencia"
              value={theme}
              onChange={applyTheme}
              options={[
                { value: "system", label: "Sistema" },
                { value: "light", label: "Claro" },
                { value: "dark", label: "Oscuro" },
              ]}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Cuenta" subtitle={session ? session.email : "Estás usando la demo como invitado."} />
          <div className="space-y-4 p-5 pt-4">
            {session ? (
              <>
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={session.name}
                    onChange={(e) => sessionStore.set({ ...session, name: e.target.value })}
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    sessionStore.set(null);
                    router.push("/");
                  }}
                >
                  <LogOut size={16} aria-hidden /> Cerrar sesión
                </Button>
              </>
            ) : (
              <ButtonLink href="/ingresar">Crear cuenta o ingresar</ButtonLink>
            )}
            <div className="rounded-xl bg-surface-2 p-3 text-sm text-text-2">
              Plan actual: <strong className="text-text capitalize">{plan}</strong>.{" "}
              <Link href="/app/planes" className="font-semibold text-primary-ink hover:underline">
                Cambiar de plan
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border-danger/40">
        <CardHeader
          title="Borrar cuenta"
          subtitle="Se borran tu perfil, tus productos seguidos, tus alertas y tu progreso. Si tienes plan de pago, se cancela. No se puede deshacer."
        />
        <div className="flex flex-col gap-3 p-5 pt-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="confirmar">Escribe BORRAR para confirmar</Label>
            <Input id="confirmar" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
          </div>
          <Button variant="danger" disabled={confirm !== "BORRAR"} onClick={deleteAccount}>
            <Trash2 size={16} aria-hidden /> Borrar mi cuenta
          </Button>
        </div>
      </Card>
    </>
  );
}
