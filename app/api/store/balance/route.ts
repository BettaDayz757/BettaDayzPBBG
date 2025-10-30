import { NextRequest, NextResponse } from 'next/server';

// Mock user balance storage (replace with actual database)
const userBalances = new Map<string, number>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const balance = userBalances.get(userId) || 0;

    return NextResponse.json({
      userId,
      balance,
      currency: 'BettaBuckz',
    });
  } catch (error) {
    console.error('Balance check error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve balance' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, type, reference } = await request.json();

    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const currentBalance = userBalances.get(userId) || 0;
    
    if (type === 'add') {
      userBalances.set(userId, currentBalance + amount);
    } else if (type === 'subtract') {
      if (currentBalance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }
      userBalances.set(userId, currentBalance - amount);
    }

    const newBalance = userBalances.get(userId) || 0;

    return NextResponse.json({
      success: true,
      userId,
      previousBalance: currentBalance,
      newBalance,
      transaction: {
        type,
        amount,
        reference,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Balance update error:', error);
    return NextResponse.json(
      { error: 'Failed to update balance' },
      { status: 500 }
    );
  }
}