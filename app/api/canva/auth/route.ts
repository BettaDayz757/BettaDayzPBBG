// app/api/canva/auth/route.ts
// Canva OAuth Authorization Endpoint

import { NextResponse } from 'next/server';
import { createCanvaClient } from '@/lib/canva/client';

export async function GET() {
  try {
    const canvaClient = createCanvaClient();
    
    // Generate state for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in session/cookie for validation on callback
    const response = NextResponse.redirect(canvaClient.getAuthorizationUrl(state));
    response.cookies.set('canva_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });
    
    return response;
  } catch (error) {
    console.error('Canva auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Canva authorization' },
      { status: 500 }
    );
  }
}
