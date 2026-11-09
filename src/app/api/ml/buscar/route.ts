import { NextResponse, type NextRequest } from "next/server";
import { mlErrorResponse, noSiteResponse, siteFromRequest } from "@/lib/ml/http";
import { searchItems } from "@/lib/ml/queries";

export async function GET(request: NextRequest) {
  const site = siteFromRequest(request.nextUrl);
  if (!site) return noSiteResponse();
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ error: "Escribe al menos 2 letras." }, { status: 400 });
  try {
    return NextResponse.json({ products: await searchItems(site, q) });
  } catch (e) {
    return mlErrorResponse(e);
  }
}
