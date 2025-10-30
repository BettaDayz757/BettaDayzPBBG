import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// Chat API with Supabase integration
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("chat_messages").insert([body]);
  // TODO: Add Supabase Realtime subscription for live updates
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ success: true, message: data?.[0] });
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: false }).limit(20);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ messages: data });
}
