// Enhanced Payment Processing System
// Integrates Cash App Pay, Bitcoin, and Stripe with fee management

import Stripe from 'stripe';
import { supabaseHelper } from '../supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  metadata: Record<string, any>;
}

export interface CryptoPaymentRequest {
  userId: string;
  purchaseId: string;
  amountUsd: number;
  cryptoType: 'bitcoin' | 'cashapp';
  walletAddress?: string;
}

export interface BTCTransferRequest {
  userId: string;
  amountBTC: number;
  destinationAddress: string;
  feePercentage?: number;
}

export class EnhancedPaymentProcessor {
  private static instance: EnhancedPaymentProcessor;
  
  // Cash App Pay configuration
  private readonly CASHAPP_CLIENT_ID = process.env.CASHAPP_CLIENT_ID!;
  private readonly CASHAPP_SECRET = process.env.CASHAPP_SECRET!;
  
  // Bitcoin configuration
  private readonly BTC_WALLET_ADDRESS = process.env.BTC_WALLET_ADDRESS!;
  private readonly BTC_API_KEY = process.env.BTC_API_KEY!;
  
  // Fee structure
  private readonly EXTERNAL_BTC_FEE_PERCENTAGE = 2.5; // 2.5% fee for external BTC transfers
  private readonly CASHAPP_FEE_PERCENTAGE = 1.5; // 1.5% fee for Cash App transactions

  private constructor() {}

  public static getInstance(): EnhancedPaymentProcessor {
    if (!EnhancedPaymentProcessor.instance) {
      EnhancedPaymentProcessor.instance = new EnhancedPaymentProcessor();
    }
    return EnhancedPaymentProcessor.instance;
  }

  // Stripe Payment Intent Creation
  public async createStripePaymentIntent(
    amount: number, // in cents
    currency: string,
    paymentMethods: string[],
    metadata: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: paymentMethods,
        metadata,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        }
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentMethod: 'stripe',
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Cash App Pay Integration
  public async createCashAppPayment(
    userId: string,
    purchaseId: string,
    amountUsd: number,
    description: string
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Calculate Cash App fee
      const feeAmount = Math.round(amountUsd * (this.CASHAPP_FEE_PERCENTAGE / 100));
      const totalAmount = amountUsd + feeAmount;

      // Create Cash App payment request
      const cashAppPayment = await this.createCashAppPaymentRequest({
        amount: totalAmount,
        currency: 'USD',
        description,
        metadata: {
          userId,
          purchaseId,
          originalAmount: amountUsd,
          feeAmount
        }
      });

      if (!cashAppPayment.success) {
        return { success: false, error: cashAppPayment.error };
      }

      // Store payment in database
      await supabaseHelper.createPurchase({
        user_id: userId,
        package_id: purchaseId,
        type: 'package',
        status: 'pending',
        amount_cents: totalAmount,
        currency: 'usd',
        payment_method: 'cashapp',
        payment_provider: 'cashapp',
        external_payment_id: cashAppPayment.paymentId,
        metadata: {
          feeAmount,
          originalAmount: amountUsd
        }
      });

      return {
        success: true,
        paymentId: cashAppPayment.paymentId
      };
    } catch (error) {
      console.error('Error creating Cash App payment:', error);
      return { success: false, error: 'Failed to create Cash App payment' };
    }
  }

  // Bitcoin Payment Integration
  public async createBitcoinPayment(request: CryptoPaymentRequest): Promise<{
    success: boolean;
    walletAddress?: string;
    amountBTC?: number;
    expiresAt?: Date;
    error?: string;
  }> {
    try {
      // Get current BTC exchange rate
      const exchangeRate = await this.getBTCExchangeRate();
      if (!exchangeRate) {
        return { success: false, error: 'Failed to get BTC exchange rate' };
      }

      const amountBTC = request.amountUsd / exchangeRate;
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Generate unique wallet address for this payment
      const walletAddress = await this.generateBTCWalletAddress(request.purchaseId);
      if (!walletAddress) {
        return { success: false, error: 'Failed to generate wallet address' };
      }

      // Store crypto payment in database
      await supabaseHelper.createCryptoPayment({
        user_id: request.userId,
        purchase_id: request.purchaseId,
        crypto_type: 'bitcoin',
        wallet_address: walletAddress,
        amount_crypto: amountBTC,
        amount_usd_cents: request.amountUsd,
        exchange_rate: exchangeRate,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      });

      // Start monitoring for payment
      this.monitorBTCPayment(request.purchaseId, walletAddress, amountBTC);

      return {
        success: true,
        walletAddress,
        amountBTC,
        expiresAt
      };
    } catch (error) {
      console.error('Error creating Bitcoin payment:', error);
      return { success: false, error: 'Failed to create Bitcoin payment' };
    }
  }

  // External BTC Transfer with Fees
  public async processExternalBTCTransfer(request: BTCTransferRequest): Promise<{
    success: boolean;
    transactionHash?: string;
    feeAmount?: number;
    error?: string;
  }> {
    try {
      const feePercentage = request.feePercentage || this.EXTERNAL_BTC_FEE_PERCENTAGE;
      const feeAmount = request.amountBTC * (feePercentage / 100);
      const netAmount = request.amountBTC - feeAmount;

      // Validate user has sufficient BTC balance
      const userBTCBalance = await this.getUserBTCBalance(request.userId);
      if (userBTCBalance < request.amountBTC) {
        return { success: false, error: 'Insufficient BTC balance' };
      }

      // Create transfer fee record
      const transferFee = await supabaseHelper.client
        .from('btc_transfer_fees')
        .insert({
          user_id: request.userId,
          amount_btc: request.amountBTC,
          fee_percentage: feePercentage,
          fee_btc: feeAmount,
          destination_address: request.destinationAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (transferFee.error) {
        throw transferFee.error;
      }

      // Execute BTC transfer
      const transactionResult = await this.executeBTCTransfer(
        request.destinationAddress,
        netAmount
      );

      if (!transactionResult.success) {
        // Update transfer status to failed
        await supabaseHelper.client
          .from('btc_transfer_fees')
          .update({ status: 'failed' })
          .eq('id', transferFee.data.id);

        return { success: false, error: transactionResult.error };
      }

      // Update transfer with transaction hash
      await supabaseHelper.client
        .from('btc_transfer_fees')
        .update({
          status: 'completed',
          transaction_hash: transactionResult.transactionHash
        })
        .eq('id', transferFee.data.id);

      // Deduct BTC from user balance
      await this.updateUserBTCBalance(request.userId, -request.amountBTC);

      return {
        success: true,
        transactionHash: transactionResult.transactionHash,
        feeAmount
      };
    } catch (error) {
      console.error('Error processing external BTC transfer:', error);
      return { success: false, error: 'Failed to process BTC transfer' };
    }
  }

  // Payment Confirmation Handlers
  public async confirmStripePayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const purchaseId = paymentIntent.metadata.purchaseId;
        if (purchaseId) {
          await supabaseHelper.updatePurchaseStatus(purchaseId, 'completed');
          await this.processPurchaseRewards(purchaseId);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error confirming Stripe payment:', error);
      return false;
    }
  }

  public async confirmCashAppPayment(paymentId: string): Promise<boolean> {
    try {
      const paymentStatus = await this.getCashAppPaymentStatus(paymentId);
      
      if (paymentStatus === 'completed') {
        // Find purchase by external payment ID
        const { data: purchases } = await supabaseHelper.client
          .from('purchases')
          .select('*')
          .eq('external_payment_id', paymentId)
          .eq('status', 'pending');

        if (purchases && purchases.length > 0) {
          const purchase = purchases[0];
          await supabaseHelper.updatePurchaseStatus(purchase.id, 'completed');
          await this.processPurchaseRewards(purchase.id);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error confirming Cash App payment:', error);
      return false;
    }
  }

  // Bitcoin Payment Monitoring
  private async monitorBTCPayment(purchaseId: string, walletAddress: string, expectedAmount: number): Promise<void> {
    const checkPayment = async () => {
      try {
        const transactions = await this.getBTCTransactions(walletAddress);
        
        for (const tx of transactions) {
          if (tx.confirmations >= 3 && tx.amount >= expectedAmount) {
            // Payment confirmed
            await supabaseHelper.updateCryptoPaymentStatus(
              purchaseId,
              'confirmed',
              tx.confirmations,
              tx.hash
            );
            
            await this.processPurchaseRewards(purchaseId);
            return;
          } else if (tx.confirmations > 0) {
            // Payment confirming
            await supabaseHelper.updateCryptoPaymentStatus(
              purchaseId,
              'confirming',
              tx.confirmations,
              tx.hash
            );
          }
        }
        
        // Continue monitoring if not confirmed
        setTimeout(checkPayment, 60000); // Check every minute
      } catch (error) {
        console.error('Error monitoring BTC payment:', error);
        setTimeout(checkPayment, 300000); // Retry in 5 minutes on error
      }
    };

    // Start monitoring
    setTimeout(checkPayment, 60000); // Initial check after 1 minute
  }

  // Helper Methods
  private async createCashAppPaymentRequest(request: any): Promise<{
    success: boolean;
    paymentId?: string;
    error?: string;
  }> {
    try {
      // Mock Cash App API call - replace with actual implementation
      const response = await fetch('https://api.cash.app/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.CASHAPP_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        return { success: false, error: 'Cash App API error' };
      }

      const data = await response.json();
      return {
        success: true,
        paymentId: data.id
      };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  private async getCashAppPaymentStatus(paymentId: string): Promise<string> {
    try {
      // Mock implementation - replace with actual Cash App API
      const response = await fetch(`https://api.cash.app/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.CASHAPP_SECRET}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.status;
      }
      
      return 'pending';
    } catch (error) {
      console.error('Error getting Cash App payment status:', error);
      return 'pending';
    }
  }

  private async getBTCExchangeRate(): Promise<number | null> {
    try {
      const response = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC');
      const data = await response.json();
      return parseFloat(data.data.rates.USD);
    } catch (error) {
      console.error('Error getting BTC exchange rate:', error);
      return null;
    }
  }

  private async generateBTCWalletAddress(purchaseId: string): Promise<string | null> {
    try {
      // Mock implementation - replace with actual BTC wallet generation
      // This would typically involve creating a new address in your BTC wallet
      return `bc1q${purchaseId.replace(/-/g, '').substring(0, 39)}`;
    } catch (error) {
      console.error('Error generating BTC wallet address:', error);
      return null;
    }
  }

  private async getBTCTransactions(address: string): Promise<any[]> {
    try {
      // Mock implementation - replace with actual blockchain API
      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full`);
      const data = await response.json();
      return data.txs || [];
    } catch (error) {
      console.error('Error getting BTC transactions:', error);
      return [];
    }
  }

  private async executeBTCTransfer(address: string, amount: number): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      // Mock implementation - replace with actual BTC transfer
      // This would involve creating and broadcasting a BTC transaction
      return {
        success: true,
        transactionHash: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return { success: false, error: 'Transfer failed' };
    }
  }

  private async getUserBTCBalance(userId: string): Promise<number> {
    try {
      // Mock implementation - get user's BTC balance from your system
      return 0.1; // Default 0.1 BTC
    } catch (error) {
      console.error('Error getting user BTC balance:', error);
      return 0;
    }
  }

  private async updateUserBTCBalance(userId: string, change: number): Promise<void> {
    try {
      // Mock implementation - update user's BTC balance
      console.log(`Updating BTC balance for user ${userId} by ${change}`);
    } catch (error) {
      console.error('Error updating user BTC balance:', error);
    }
  }

  private async processPurchaseRewards(purchaseId: string): Promise<void> {
    try {
      // Get purchase details
      const { data: purchase } = await supabaseHelper.client
        .from('purchases')
        .select(`
          *,
          purchase_packages (*)
        `)
        .eq('id', purchaseId)
        .single();

      if (!purchase) return;

      // Process rewards based on package
      if (purchase.purchase_packages) {
        const packageValue = purchase.purchase_packages.value;
        
        // Award BettaBuckZ
        if (packageValue.bettaBuckZ) {
          await supabaseHelper.processBettaBuckZTransaction(
            purchase.user_id,
            'purchase',
            packageValue.bettaBuckZ * 100, // Convert to smallest unit
            'iap_purchase',
            `Purchased ${purchase.purchase_packages.name}`,
            purchaseId
          );
        }

        // Award items
        if (packageValue.items && packageValue.items.length > 0) {
          for (const item of packageValue.items) {
            await supabaseHelper.client
              .from('user_inventory')
              .upsert({
                user_id: purchase.user_id,
                item_id: item.itemId,
                quantity: item.quantity
              });
          }
        }

        // Award achievement progress
        await supabaseHelper.awardAchievementProgress(
          purchase.user_id,
          'ach_002', // First Purchase achievement
          1
        );
      }
    } catch (error) {
      console.error('Error processing purchase rewards:', error);
    }
  }

  // Webhooks
  public async handleStripeWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.confirmStripePayment(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  public async handleCashAppWebhook(event: any): Promise<void> {
    if (event.type === 'payment.completed') {
      await this.confirmCashAppPayment(event.data.id);
    }
  }
}

export const paymentProcessor = EnhancedPaymentProcessor.getInstance();