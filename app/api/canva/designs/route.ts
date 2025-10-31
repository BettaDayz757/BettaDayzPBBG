// app/api/canva/designs/route.ts
// List and manage Canva designs

import { NextRequest, NextResponse } from 'next/server';
import { createCanvaClient } from '@/lib/canva/client';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's Canva credentials
    const { data: credentials, error: credError } = await supabase
      .from('canva_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (credError || !credentials) {
      return NextResponse.json(
        { error: 'Canva not connected. Please connect your Canva account first.' },
        { status: 400 }
      );
    }

    // Check if token needs refresh
    const tokenExpiry = new Date(credentials.token_expires_at);
    const now = new Date();
    
    if (tokenExpiry <= now) {
      // Token expired, refresh it
      const canvaClient = createCanvaClient();
      const newTokens = await canvaClient.refreshAccessToken(credentials.refresh_token);
      
      // Update credentials in database
      await supabase.from('canva_credentials').update({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
        last_refreshed_at: new Date().toISOString(),
      }).eq('user_id', user.id);
      
      credentials.access_token = newTokens.access_token;
    }

    // List designs from Canva
    const canvaClient = createCanvaClient();
    canvaClient.setAccessToken(credentials.access_token);

    const designs = await canvaClient.listDesigns({
      limit: 50,
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error listing Canva designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs from Canva' },
      { status: 500 }
    );
  }
}
