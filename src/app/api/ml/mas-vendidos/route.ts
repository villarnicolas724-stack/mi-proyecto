import { NextResponse, type NextRequest } from "next/server";
import { mlErrorResponse, noSiteResponse, siteFromRequest } from "@/lib/ml/http";
import { getBestSellers } from "@/lib/ml/queries";

export async function GET(request: NextRequest) {
  const site = siteFromRequest(request.nextUrl);
  if (!site) return noSiteResponse();
  const category = request.nextUrl.searchParams.get("categoria");
  if (!category) return NextResponse.json({ error: "Elige una categoría." }, { status: 400 });
  try {
    return NextResponse.json({ products: await getBestSellers(site, category) });
  } catch (e) {
    return mlErrorResponse(e);
  }
}
