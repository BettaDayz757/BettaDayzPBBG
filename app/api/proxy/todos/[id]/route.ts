import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/todos?id=eq.${params.id}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/todos?id=eq.${params.id}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
