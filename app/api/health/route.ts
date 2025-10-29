import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BettaDayz PBBG API',
    version: '2.0.0',
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'development'
  })
}
