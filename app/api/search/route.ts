import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  const res = await fetch(
    `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`
  );
  const data = await res.json();

  const results = (data.shopping_results || []).slice(0, 8).map((item: any) => ({
    title: item.title,
    price: item.price,
    source: item.source,
    link: item.link,
    thumbnail: item.thumbnail,
    rating: item.rating,
    reviews: item.reviews,
  }));

  // Save to price history
  if (results.length > 0) {
    await supabase.from("price_history").insert(
      results.map((r: any) => ({
        product_name: query,
        price: r.price || "N/A",
        source: r.source || "Unknown",
      }))
    );
  }

  return NextResponse.json({ results });
}