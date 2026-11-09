// Protección con contraseña para uso personal.
// Si la variable de entorno APP_PASSWORD no existe (por ejemplo, en tu ordenador),
// la app queda abierta. Si existe (por ejemplo, en Vercel), pide la contraseña.

export const AUTH_COOKIE = "veta_acceso";

export function passwordEnabled(): boolean {
  return Boolean(process.env.APP_PASSWORD);
}

/** Valor de la cookie: un hash de la contraseña, nunca la contraseña en claro. */
export async function expectedToken(): Promise<string> {
  const data = new TextEncoder().encode(`veta:${process.env.APP_PASSWORD ?? ""}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparación en tiempo constante para no dar pistas sobre la contraseña. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
