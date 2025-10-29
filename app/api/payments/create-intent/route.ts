// API Route: Payment processing endpoints
// /app/api/payments/create-intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';
import { paymentProcessor } from '@/lib/payments/EnhancedPaymentProcessor';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authManager.authenticateRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { amount, currency, paymentMethods, packageId, subscriptionId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const metadata = {
      userId: auth.user.id,
      packageId: packageId || null,
      subscriptionId: subscriptionId || null,
      timestamp: new Date().toISOString()
    };

    const paymentIntent = await paymentProcessor.createStripePaymentIntent(
      Math.round(amount * 100), // Convert to cents
      currency || 'usd',
      paymentMethods || ['card'],
      metadata
    );

    return NextResponse.json({
      success: true,
      paymentIntent
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}