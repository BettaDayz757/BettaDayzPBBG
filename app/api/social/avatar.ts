import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// Avatar customization API with Supabase integration
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("avatars").upsert([body]);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ success: true, avatar: data });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("avatars").select("*").eq("userId", userId);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ avatar: data?.[0] });
}
