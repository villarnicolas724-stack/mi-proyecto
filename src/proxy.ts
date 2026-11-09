import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, expectedToken, passwordEnabled, safeEqual } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (!passwordEnabled()) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value ?? "";
  if (token && safeEqual(token, await expectedToken())) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/acceso";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Todo menos la página de acceso, su API y los archivos estáticos.
  matcher: ["/((?!acceso|api/acceso|_next/static|_next/image|icon.svg|apple-icon.png|manifest.webmanifest|icon-192.png|icon-512.png|icon-maskable-512.png).*)"],
};
