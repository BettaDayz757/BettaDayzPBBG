import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// Life events API with Supabase integration
export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("life_events").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ events: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("life_events").insert([body]);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ success: true, event: data?.[0] });
}
