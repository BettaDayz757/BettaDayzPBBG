// app/api/canva/callback/route.ts
// Canva OAuth Callback Handler

import { NextRequest, NextResponse } from 'next/server';
import { createCanvaClient } from '@/lib/canva/client';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?canva_error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard?canva_error=missing_parameters', request.url)
      );
    }

    // Validate state for CSRF protection
    const storedState = request.cookies.get('canva_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/dashboard?canva_error=invalid_state', request.url)
      );
    }

    // Exchange code for tokens
    const canvaClient = createCanvaClient();
    const tokenData = await canvaClient.exchangeCodeForToken(code);

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL('/dashboard?canva_error=not_authenticated', request.url)
      );
    }

    // Store credentials in Supabase
    const { error: dbError } = await supabase.from('canva_credentials').upsert(
      {
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(
          Date.now() + tokenData.expires_in * 1000
        ).toISOString(),
        is_active: true,
        last_refreshed_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    );

    if (dbError) {
      console.error('Failed to store Canva credentials:', dbError);
      return NextResponse.redirect(
        new URL('/dashboard?canva_error=storage_failed', request.url)
      );
    }

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL('/dashboard?canva_connected=true', request.url)
    );
    response.cookies.delete('canva_oauth_state');

    return response;
  } catch (error) {
    console.error('Canva callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?canva_error=callback_failed', request.url)
    );
  }
}
