import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  const { data } = await supabase
    .from("price_history")
    .select("*")
    .ilike("product_name", `%${query}%`)
    .order("searched_at", { ascending: true })
    .limit(50);

  return NextResponse.json({ history: data || [] });
}