// Cliente de la API oficial de Mercado Libre. Solo se usa en el servidor (tu ordenador):
// las credenciales nunca se envían al navegador.

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://api.mercadolibre.com";
const DIR = path.join(process.cwd(), ".veta");
const FILE = path.join(DIR, "mercadolibre.json");

interface Credentials {
  clientId: string;
  clientSecret: string;
}

export class MlError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

let token: { value: string; expiresAt: number; clientId: string } | null = null;

export async function readCredentials(): Promise<(Credentials & { source: "archivo" | "variables" }) | null> {
  if (process.env.ML_CLIENT_ID && process.env.ML_CLIENT_SECRET) {
    return { clientId: process.env.ML_CLIENT_ID, clientSecret: process.env.ML_CLIENT_SECRET, source: "variables" };
  }
  try {
    const data = JSON.parse(await readFile(FILE, "utf8")) as Credentials;
    if (data.clientId && data.clientSecret) return { ...data, source: "archivo" };
  } catch {
    // Aún no hay credenciales guardadas.
  }
  return null;
}

export async function saveCredentials(c: Credentials) {
  await mkdir(DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(c, null, 2), { encoding: "utf8", mode: 0o600 });
  token = null;
}

export async function deleteCredentials() {
  await rm(FILE, { force: true });
  token = null;
}

/** Pide un token de aplicación (válido unas 6 horas) y lo guarda en memoria. */
export async function requestToken(c: Credentials): Promise<string> {
  const res = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: c.clientId, client_secret: c.clientSecret }),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; message?: string };
  if (!res.ok || !body.access_token) {
    throw new MlError(
      res.status === 400 || res.status === 401
        ? "Mercado Libre no aceptó el App ID o la clave secreta. Revisa que estén bien copiados."
        : `Mercado Libre respondió con un error (${res.status}): ${body.message ?? "sin detalle"}`,
      res.status,
    );
  }
  token = { value: body.access_token, expiresAt: Date.now() + ((body.expires_in ?? 21600) - 300) * 1000, clientId: c.clientId };
  return token.value;
}

async function getToken(): Promise<string> {
  const c = await readCredentials();
  if (!c) throw new MlError("Conecta tu cuenta de desarrollador de Mercado Libre para ver datos reales.", 428);
  if (token && token.clientId === c.clientId && token.expiresAt > Date.now()) return token.value;
  return requestToken(c);
}

/** GET a la API con el token de la app. Reintenta una vez si el token caducó. */
export async function mlGet<T>(pathAndQuery: string, retry = true): Promise<T> {
  const res = await fetch(`${API}${pathAndQuery}`, {
    headers: { authorization: `Bearer ${await getToken()}`, accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 401 && retry) {
    token = null;
    return mlGet<T>(pathAndQuery, false);
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new MlError(
      res.status === 403
        ? "Mercado Libre no permite esta consulta con tu tipo de app o desde tu conexión (403)."
        : res.status === 404
          ? "Mercado Libre no encontró datos para esta consulta (404)."
          : `Mercado Libre respondió con un error (${res.status}): ${body.message ?? "sin detalle"}`,
      res.status,
    );
  }
  return (await res.json()) as T;
}
