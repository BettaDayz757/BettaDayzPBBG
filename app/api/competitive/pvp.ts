import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// PvP API with Supabase integration
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("battles").insert([body]);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ success: true, battle: data?.[0] });
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("battles").select("*").order("created_at", { ascending: false }).limit(10);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ battles: data });
}
