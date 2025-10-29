// API Route: External Bitcoin transfer with fees
// /app/api/payments/btc-transfer/route.ts

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

    const { amountBTC, destinationAddress, feePercentage } = await request.json();

    if (!amountBTC || amountBTC <= 0) {
      return NextResponse.json(
        { error: 'Valid BTC amount is required' },
        { status: 400 }
      );
    }

    if (!destinationAddress) {
      return NextResponse.json(
        { error: 'Destination address is required' },
        { status: 400 }
      );
    }

    // Validate Bitcoin address format
    const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
    if (!btcAddressRegex.test(destinationAddress)) {
      return NextResponse.json(
        { error: 'Invalid Bitcoin address format' },
        { status: 400 }
      );
    }

    const result = await paymentProcessor.processExternalBTCTransfer({
      userId: auth.user.id,
      amountBTC,
      destinationAddress,
      feePercentage
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionHash: result.transactionHash,
      feeAmount: result.feeAmount,
      message: 'Bitcoin transfer initiated successfully'
    });

  } catch (error) {
    console.error('BTC transfer error:', error);
    return NextResponse.json(
      { error: 'Failed to process Bitcoin transfer' },
      { status: 500 }
    );
  }
}