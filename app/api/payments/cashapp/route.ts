// API Route: Cash App Pay integration
// /app/api/payments/cashapp/route.ts

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

    const { packageId, amount, description } = await request.json();

    if (!packageId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Package ID and valid amount are required' },
        { status: 400 }
      );
    }

    const result = await paymentProcessor.createCashAppPayment(
      auth.user.id,
      packageId,
      amount,
      description || 'BettaDayz Purchase'
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: result.paymentId,
      message: 'Cash App payment created successfully'
    });

  } catch (error) {
    console.error('Cash App payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create Cash App payment' },
      { status: 500 }
    );
  }
}

// Handle Cash App webhook
export async function PUT(request: NextRequest) {
  try {
    const event = await request.json();
    
    // Verify webhook signature (implement based on Cash App documentation)
    const signature = request.headers.get('x-cashapp-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    await paymentProcessor.handleCashAppWebhook(event);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Cash App webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}