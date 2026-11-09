import { NextResponse } from "next/server";
import { MlError } from "./client";
import { mlSite } from "./sites";
import type { CountryCode } from "@/lib/data/types";

/** Respuesta de error uniforme para las rutas de Mercado Libre. */
export function mlErrorResponse(e: unknown) {
  if (e instanceof MlError) return NextResponse.json({ error: e.message, status: e.status }, { status: e.status === 428 ? 428 : 502 });
  const msg = e instanceof Error ? e.message : String(e);
  return NextResponse.json(
    { error: `No se pudo conectar con Mercado Libre. Revisa tu conexión a internet. (${msg})`, status: 0 },
    { status: 502 },
  );
}

export function siteFromRequest(url: URL): string | null {
  return mlSite((url.searchParams.get("pais") ?? "CO") as CountryCode);
}

export function noSiteResponse() {
  return NextResponse.json({ error: "Mercado Libre no opera en este país.", status: 400 }, { status: 400 });
}
