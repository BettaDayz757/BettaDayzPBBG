/**
 * Enhanced Payment Processing System for BettaDayz PBBG
 * Supports Cash App, Bitcoin, Stripe, and webhook verification
 */

import { supabase } from '../supabase/client';
import Stripe from 'stripe';

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed',
  VERIFICATION_REQUIRED: 'verification_required',
  REFUNDED: 'refunded',
  EXPIRED: 'expired'
} as const;

export const PaymentMethods = {
  STRIPE: 'stripe',
  CASHAPP: 'cashapp',
  BITCOIN: 'bitcoin',
  CRYPTO: 'crypto'
} as const;

interface PaymentSessionData {
  id: string;
  user_id: string;
  item_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  metadata: string;
  created_at: string;
  expires_at: string;
  external_id?: string;
}

interface TransactionData {
  external_transaction_id?: string;
  amount_received?: number;
  [key: string]: unknown;
}

export class EnhancedPaymentProcessor {
  private stripe: Stripe;
  private supabase: typeof supabase;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    this.supabase = supabase;
  }

  /**
   * Generate payment session for different methods
   */
  async createPaymentSession(
    method: string, 
    amount: number, 
    userId: string, 
    itemId: string, 
    metadata: Record<string, any> = {}
  ) {
    try {
      const sessionData = {
        id: this.generateTransactionId(),
        user_id: userId,
        item_id: itemId,
        amount,
        currency: 'USD',
        method,
        status: PaymentStatus.PENDING,
        metadata: JSON.stringify(metadata),
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      };

      // Store in Supabase
      const { data, error } = await this.supabase
        .from('payment_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      switch (method) {
        case PaymentMethods.STRIPE:
          return await this.createStripeSession(data, amount, itemId);
        case PaymentMethods.CASHAPP:
          return await this.createCashAppInstructions(data, amount, userId);
        case PaymentMethods.BITCOIN:
          return await this.createBitcoinInstructions(data, amount);
        default:
          throw new Error(`Unsupported payment method: ${method}`);
      }
    } catch (error: any) {
      console.error('Payment session creation failed:', error);
      throw new Error(`Failed to create payment session: ${error.message}`);
    }
  }

  /**
   * Create Stripe checkout session
   */
  async createStripeSession(sessionData: PaymentSessionData, amount: number, itemId: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BettaDayz Item: ${itemId}`,
              description: 'In-game purchase for BettaDayz PBBG'
            },
            unit_amount: amount * 100 // Convert to cents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
        metadata: {
          payment_session_id: sessionData.id,
          user_id: sessionData.user_id,
          item_id: itemId
        }
      });

      // Update session with Stripe session ID
      await this.supabase
        .from('payment_sessions')
        .update({ 
          external_id: session.id,
          status: PaymentStatus.PROCESSING 
        })
        .eq('id', sessionData.id);

      return {
        sessionId: sessionData.id,
        url: session.url,
        instructions: 'Complete payment through Stripe checkout'
      };
    } catch (error: any) {
      await this.updatePaymentStatus(sessionData.id, PaymentStatus.FAILED, error.message);
      throw error;
    }
  }

  /**
   * Create Cash App payment instructions
   */
  async createCashAppInstructions(sessionData: PaymentSessionData, amount: number, userId: string) {
    const cashtag = process.env.CASHAPP_CASHTAG || '$BettaDayzGame';
    const reference = `BETTA-${sessionData.id.slice(-8)}`;

    return {
      sessionId: sessionData.id,
      cashtag,
      amount,
      reference,
      instructions: [
        `1. Open Cash App`,
        `2. Send $${amount} to ${cashtag}`,
        `3. Include reference: ${reference}`,
        `4. Take screenshot of successful payment`,
        `5. Upload screenshot for verification`
      ],
      verificationRequired: true
    };
  }

  /**
   * Create Bitcoin payment instructions
   */
  async createBitcoinInstructions(sessionData: PaymentSessionData, amount: number) {
    try {
      const btcPrice = await this.fetchBitcoinPrice();
      const btcAmount = (amount / btcPrice).toFixed(8);
      const address = process.env.BITCOIN_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

      return {
        sessionId: sessionData.id,
        address,
        amountUSD: amount,
        amountBTC: btcAmount,
        qrCode: `bitcoin:${address}?amount=${btcAmount}`,
        instructions: [
          `1. Send exactly ${btcAmount} BTC`,
          `2. To address: ${address}`,
          `3. Wait for 2+ confirmations`,
          `4. Payment will be verified automatically`
        ],
        estimatedConfirmationTime: '10-60 minutes'
      };
    } catch (error: any) {
      await this.updatePaymentStatus(sessionData.id, PaymentStatus.FAILED, error.message);
      throw error;
    }
  }

  /**
   * Verify payment based on method
   */
  async verifyPayment(sessionId: string, verificationData: Record<string, any> = {}) {
    try {
      const { data: session, error } = await this.supabase
        .from('payment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        throw new Error('Payment session not found');
      }

      if (session.status === PaymentStatus.COMPLETED) {
        return { status: 'already_completed', session };
      }

      if (new Date(session.expires_at) < new Date()) {
        await this.updatePaymentStatus(sessionId, PaymentStatus.EXPIRED);
        throw new Error('Payment session expired');
      }

      switch (session.method) {
        case PaymentMethods.STRIPE:
          return await this.verifyStripePayment(session, verificationData);
        case PaymentMethods.CASHAPP:
          return await this.verifyCashAppPayment(session, verificationData);
        case PaymentMethods.BITCOIN:
          return await this.verifyBitcoinPayment(session, verificationData);
        default:
          throw new Error(`Verification not supported for method: ${session.method}`);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleStripeWebhook(event: any) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const paymentSessionId = session.metadata.payment_session_id;
          
          if (paymentSessionId) {
            await this.completePayment(paymentSessionId, {
              external_transaction_id: session.payment_intent,
              amount_received: session.amount_total / 100
            });
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          const failedSessionId = failedPayment.metadata.payment_session_id;
          
          if (failedSessionId) {
            await this.updatePaymentStatus(failedSessionId, PaymentStatus.FAILED, 
              failedPayment.last_payment_error?.message || 'Payment failed');
          }
          break;
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }

  /**
   * Complete payment and update user inventory
   */
  async completePayment(sessionId: string, transactionData: TransactionData = {}) {
    try {
      const { data: session, error } = await this.supabase
        .from('payment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        throw new Error('Payment session not found');
      }

      // Update payment status
      await this.supabase
        .from('payment_sessions')
        .update({
          status: PaymentStatus.COMPLETED,
          completed_at: new Date().toISOString(),
          transaction_data: JSON.stringify(transactionData)
        })
        .eq('id', sessionId);

      // Add item to user inventory
      await this.supabase
        .from('inventory')
        .insert({
          user_id: session.user_id,
          item_id: session.item_id,
          item_type: 'purchase',
          quantity: 1,
          acquired_at: new Date().toISOString()
        });

      // Create purchase record
      await this.supabase
        .from('purchases')
        .insert({
          user_id: session.user_id,
          item_id: session.item_id,
          amount: session.amount,
          currency: session.currency,
          method: session.method,
          status: PaymentStatus.COMPLETED,
          transaction_id: transactionData.external_transaction_id || sessionId,
          completed_at: new Date().toISOString()
        });

      return { success: true, session };
    } catch (error) {
      console.error('Payment completion failed:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(sessionId: string, status: string, errorMessage: string | null = null) {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    await this.supabase
      .from('payment_sessions')
      .update(updateData)
      .eq('id', sessionId);
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId() {
    return `betta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Fetch current Bitcoin price
   */
  async fetchBitcoinPrice() {
    try {
      const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
      const data = await response.json();
      return parseFloat(data.data.rates.USD);
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
      return 50000; // Fallback price
    }
  }

  /**
   * Verify Bitcoin payment (simplified - implement with blockchain API)
   */
  async verifyBitcoinPayment(session: any, verificationData: any) {
    // This would integrate with blockchain APIs like BlockCypher, Blockchain.info, etc.
    // For now, return verification required
    return {
      status: PaymentStatus.VERIFICATION_REQUIRED,
      message: 'Bitcoin payment verification requires manual review'
    };
  }

  /**
   * Verify Cash App payment
   */
  async verifyCashAppPayment(session: any, verificationData: any) {
    // This would process uploaded screenshots and verify against Cash App API
    // For now, mark as requiring verification
    return {
      status: PaymentStatus.VERIFICATION_REQUIRED,
      message: 'Cash App payment requires manual verification'
    };
  }

  /**
   * Verify Stripe payment
   */
  async verifyStripePayment(session: any, verificationData: any) {
    // Check Stripe payment intent status
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(session.external_id);
      
      if (paymentIntent.status === 'succeeded') {
        await this.completePayment(session.id, {
          external_transaction_id: paymentIntent.id,
          amount_received: paymentIntent.amount / 100
        });
        return { status: PaymentStatus.COMPLETED };
      }
      
      return { 
        status: PaymentStatus.PROCESSING, 
        message: `Stripe payment status: ${paymentIntent.status}` 
      };
    } catch (error) {
      throw new Error(`Stripe verification failed: ${(error as any)?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: string, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  }
}

export default EnhancedPaymentProcessor;