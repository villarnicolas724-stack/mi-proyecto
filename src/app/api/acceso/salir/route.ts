import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/acceso", request.url), 303);
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
