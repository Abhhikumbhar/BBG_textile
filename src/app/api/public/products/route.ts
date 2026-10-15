import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const featured = searchParams.get("featured") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const bestSeller = searchParams.get("bestSeller") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));

    const result = await getProducts({
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      featured,
      newArrival,
      bestSeller,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Public products API route error:", error);
    // Return safe empty pagination instead of 500 so UI never crashes
    return NextResponse.json({
      products: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });
  }
}
