import { NextResponse, type NextRequest } from "next/server";
import { mlErrorResponse, noSiteResponse, siteFromRequest } from "@/lib/ml/http";
import { getTrends } from "@/lib/ml/queries";

export async function GET(request: NextRequest) {
  const site = siteFromRequest(request.nextUrl);
  if (!site) return noSiteResponse();
  try {
    return NextResponse.json({ trends: await getTrends(site) });
  } catch (e) {
    return mlErrorResponse(e);
  }
}
