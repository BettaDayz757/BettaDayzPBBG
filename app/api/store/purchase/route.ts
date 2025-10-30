import { NextRequest, NextResponse } from 'next/server';
import { paymentProcessor } from '../../../../lib/payment-processor';

// BettaBuckz package definitions
const packages = {
  starter: { amount: 100, price: 5, bonus: 0 },
  basic: { amount: 500, price: 20, bonus: 50 },
  premium: { amount: 1000, price: 35, bonus: 150 },
  ultimate: { amount: 2500, price: 75, bonus: 500 },
  legendary: { amount: 5000, price: 125, bonus: 1250 },
};

export async function POST(request: NextRequest) {
  try {
    const { packageId, paymentMethod, userId } = await request.json();

    // Validate input
    if (!packageId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate package
    const packageInfo = packages[packageId as keyof typeof packages];
    if (!packageInfo) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Add external wallet fee for Bitcoin
    const basePrice = packageInfo.price;
    const totalPrice = paymentMethod === 'bitcoin' && !userId?.includes('cashapp') 
      ? basePrice + 2 
      : basePrice;

    // Generate unique purchase reference
    const reference = `BB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Process payment
    const paymentResult = await paymentProcessor.processPayment({
      amount: totalPrice,
      currency: 'USD',
      method: paymentMethod,
      reference,
      metadata: {
        packageId,
        bettaBuckzAmount: packageInfo.amount + packageInfo.bonus,
        userId: userId || 'anonymous',
      },
    });

    if (paymentResult.success) {
      // Store pending transaction in database (mock implementation)
      // In production, save to Supabase or your database
      console.log('Pending transaction:', {
        reference,
        packageId,
        totalPrice,
        paymentMethod,
        paymentId: paymentResult.paymentId,
        status: 'pending',
      });

      return NextResponse.json({
        success: true,
        reference,
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
        qrCode: paymentResult.qrCode,
        instructions: paymentResult.instructions,
        package: {
          ...packageInfo,
          totalPrice,
        },
      });
    } else {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment processing failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get available packages
  return NextResponse.json({
    packages,
    paymentMethods: ['cashapp', 'bitcoin'],
    fees: {
      cashapp: 0,
      bitcoin_external: 2, // $2 fee for external Bitcoin wallets
      bitcoin_cashapp: 0,   // No fee for Bitcoin via Cash App
    },
  });
}