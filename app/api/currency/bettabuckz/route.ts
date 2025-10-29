// API Route: BettaBuckZ currency management
// /app/api/currency/bettabuckz/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';
import { supabaseHelper } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await authManager.authenticateRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's BettaBuckZ balance and recent transactions
    const [balanceResult, transactionsResult] = await Promise.all([
      supabaseHelper.getUserProfile(auth.user.id),
      supabaseHelper.client
        .from('bettabuckz_transactions')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);

    const balance = balanceResult.profile?.betta_buckz || 0;
    const transactions = transactionsResult.data || [];

    return NextResponse.json({
      success: true,
      balance,
      transactions,
      formattedBalance: (balance / 100).toFixed(2) // Convert from smallest unit
    });

  } catch (error) {
    console.error('BettaBuckZ GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BettaBuckZ data' },
      { status: 500 }
    );
  }
}

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

    const { action, amount, toUserId, description } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'transfer':
        if (!toUserId || !amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Valid recipient and amount are required for transfers' },
            { status: 400 }
          );
        }

        // Check if recipient exists
        const recipientResult = await supabaseHelper.getUserProfile(toUserId);
        if (!recipientResult.success) {
          return NextResponse.json(
            { error: 'Recipient not found' },
            { status: 404 }
          );
        }

        // Process transfer (deduct from sender)
        const deductResult = await supabaseHelper.processBettaBuckZTransaction(
          auth.user.id,
          'transfer_out',
          -Math.round(amount * 100), // Convert to smallest unit and make negative
          'user_transfer',
          description || `Transfer to ${recipientResult.profile?.username}`,
          toUserId || undefined
        );

        if (!deductResult.success) {
          return NextResponse.json(
            { error: 'Insufficient balance or transfer failed' },
            { status: 400 }
          );
        }

        if (!deductResult.success) {
          throw new Error('Failed to deduct BettaBuckZ from sender');
        }

        // Add to recipient
        const addResult = await supabaseHelper.processBettaBuckZTransaction(
          toUserId,
          'transfer_in',
          Math.round(amount * 100), // Convert to smallest unit
          'user_transfer',
          description || `Transfer from ${auth.user.email}`,
          auth.user.id
        );

        if (!addResult.success) {
          // Rollback the deduction (add it back)
          await supabaseHelper.processBettaBuckZTransaction(
            auth.user.id,
            'transfer_rollback',
            Math.round(amount * 100),
            'user_transfer',
            'Rollback failed transfer',
            toUserId
          );
          throw new Error('Failed to add BettaBuckZ to recipient');
        }

        if (!addResult.success) {
          // Rollback sender transaction if recipient fails
          await supabaseHelper.processBettaBuckZTransaction(
            auth.user.id,
            'transfer_rollback',
            Math.round(amount * 100),
            'system_rollback',
            'Transfer rollback',
            null
          );

          return NextResponse.json(
            { error: 'Transfer failed during recipient processing' },
            { status: 500 }
          );
        }

        result = { success: true, message: 'Transfer completed successfully' };
        break;

      case 'purchase':
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Valid amount is required for purchases' },
            { status: 400 }
          );
        }

        result = await supabaseHelper.processBettaBuckZTransaction(
          auth.user.id,
          'purchase',
          -Math.round(amount * 100), // Convert to smallest unit and make negative
          'store_purchase',
          description || 'Store purchase',
          null
        );

        if (!result.success) {
          return NextResponse.json(
            { error: 'Insufficient balance for purchase' },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('BettaBuckZ POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process BettaBuckZ transaction' },
      { status: 500 }
    );
  }
}