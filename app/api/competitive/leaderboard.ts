import { NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";

// Leaderboard API with Supabase integration
export async function GET() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("leaderboards").select("*").order("score", { ascending: false }).limit(20);
  if (error) return NextResponse.json({ success: false, error });
  return NextResponse.json({ leaderboard: data });
}
