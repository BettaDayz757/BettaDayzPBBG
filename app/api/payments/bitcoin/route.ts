// API Route: Bitcoin payment integration
// /app/api/payments/bitcoin/route.ts

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

    const { packageId, amountUsd } = await request.json();

    if (!packageId || !amountUsd || amountUsd <= 0) {
      return NextResponse.json(
        { error: 'Package ID and valid USD amount are required' },
        { status: 400 }
      );
    }

    const result = await paymentProcessor.createBitcoinPayment({
      userId: auth.user.id,
      purchaseId: packageId,
      amountUsd: amountUsd,
      cryptoType: 'bitcoin'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      walletAddress: result.walletAddress,
      amountBTC: result.amountBTC,
      expiresAt: result.expiresAt,
      message: 'Bitcoin payment created successfully'
    });

  } catch (error) {
    console.error('Bitcoin payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create Bitcoin payment' },
      { status: 500 }
    );
  }
}