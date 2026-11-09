import { NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, passwordEnabled, safeEqual } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!passwordEnabled()) return NextResponse.redirect(new URL("/app", request.url), 303);

  if (!safeEqual(password, process.env.APP_PASSWORD ?? "")) {
    // Pequeña espera para frenar intentos repetidos.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.redirect(new URL("/acceso?error=1", request.url), 303);
  }

  const res = NextResponse.redirect(new URL("/app", request.url), 303);
  res.cookies.set(AUTH_COOKIE, await expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 días
  });
  return res;
}
