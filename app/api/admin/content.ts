import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// Admin content management API with Supabase integration
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("content").insert([body]);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ success: true, content: data?.[0] });
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("content").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ content: data });
}
