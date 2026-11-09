import { NextResponse, connection } from "next/server";
import { deleteCredentials, readCredentials, requestToken, saveCredentials, MlError } from "@/lib/ml/client";
import type { MlStatus } from "@/lib/ml/sites";

/** Estado de la conexión. Nunca devuelve la clave secreta. */
export async function GET() {
  await connection();
  const c = await readCredentials();
  if (!c) return NextResponse.json({ configured: false, source: null, ok: false } satisfies MlStatus);
  try {
    await requestToken(c);
    return NextResponse.json({ configured: true, source: c.source, ok: true } satisfies MlStatus);
  } catch (e) {
    return NextResponse.json({
      configured: true,
      source: c.source,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    } satisfies MlStatus);
  }
}

/** Guarda App ID y clave secreta solo si Mercado Libre los acepta. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { clientId?: string; clientSecret?: string };
  const clientId = (body.clientId ?? "").trim();
  const clientSecret = (body.clientSecret ?? "").trim();
  if (!/^\d{5,25}$/.test(clientId)) {
    return NextResponse.json({ error: "El App ID son solo números. Cópialo de la página de tu app en Mercado Libre." }, { status: 400 });
  }
  if (clientSecret.length < 10) {
    return NextResponse.json({ error: "Falta la clave secreta (Secret Key)." }, { status: 400 });
  }
  try {
    await requestToken({ clientId, clientSecret });
  } catch (e) {
    const msg =
      e instanceof MlError ? e.message : `No se pudo conectar con Mercado Libre. Revisa tu internet. (${String(e)})`;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  await saveCredentials({ clientId, clientSecret });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await deleteCredentials();
  return NextResponse.json({ ok: true });
}
