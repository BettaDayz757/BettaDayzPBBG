// API Route: Authentication endpoints
// /app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';

export async function POST(request: NextRequest) {
  try {
    const { email, password, domain } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authManager.loginUser(email, password, domain);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login successful'
    });

    // Set authentication cookies
    if (result.sessionToken && domain) {
      const cookies = authManager.createAuthCookies(result.sessionToken, domain);
      cookies.forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
      });
    }

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}