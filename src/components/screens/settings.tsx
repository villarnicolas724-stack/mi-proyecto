"use client";

import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { CountrySelect } from "@/components/app/app-shell";
import { Segmented } from "@/components/ui/chips";
import { Button, Card, CardHeader, Input, Label, PageHeader } from "@/components/ui/primitives";
import { applyTheme, guideStore, nameStore, useName, useTheme, watchStore, type ThemeChoice } from "@/lib/state/stores";

export function Settings() {
  const name = useName();
  const theme = useTheme();
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  function deleteData() {
    watchStore.set([]);
    guideStore.set({});
    nameStore.set("");
    setConfirm("");
    setDone(true);
  }

  return (
    <>
      <PageHeader title="Ajustes" description="Tu país, tu nombre y la apariencia de la app." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Preferencias" />
          <div className="space-y-5 p-5 pt-4">
            <CountrySelect id="pais-ajustes" />
            <div>
              <Label htmlFor="nombre">Tu nombre (para el saludo)</Label>
              <Input id="nombre" value={name} onChange={(e) => nameStore.set(e.target.value)} autoComplete="given-name" />
            </div>
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
          <CardHeader
            title="Acceso"
            subtitle="Si publicas la app en internet con una contraseña (APP_PASSWORD), aquí puedes cerrar la sesión de este dispositivo."
          />
          <div className="p-5 pt-4">
            <form action="/api/acceso/salir" method="post">
              <Button type="submit" variant="secondary">
                <LogOut size={16} aria-hidden /> Cerrar sesión en este dispositivo
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted">
              Tus productos seguidos y tu progreso se guardan en este navegador. En otro dispositivo empiezas de cero.
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border-danger/40">
        <CardHeader
          title="Borrar mis datos de este navegador"
          subtitle="Se borran tus productos seguidos, tus alertas y el progreso de la guía. No se puede deshacer."
        />
        <div className="flex flex-col gap-3 p-5 pt-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="confirmar">Escribe BORRAR para confirmar</Label>
            <Input id="confirmar" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
          </div>
          <Button variant="danger" disabled={confirm !== "BORRAR"} onClick={deleteData}>
            <Trash2 size={16} aria-hidden /> Borrar
          </Button>
        </div>
        {done ? (
          <p className="px-5 pb-5 text-sm font-medium text-success" role="status">
            Listo: tus datos se borraron.
          </p>
        ) : null}
      </Card>
    </>
  );
}
