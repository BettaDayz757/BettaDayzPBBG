import { NextResponse } from 'next/server'
import supabase from '../../../../lib/supabase/client'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Missing player id' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || error }, { status: 404 })
    }

    return NextResponse.json({ player: data }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
