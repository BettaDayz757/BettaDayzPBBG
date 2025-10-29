// Enhanced In-App Purchase System
// Comprehensive IAP with packages, subscriptions, premium features, and BettaBuckZ integration

export interface PurchasePackage {
  id: string;
  name: string;
  description: string;
  type: 'one_time' | 'subscription' | 'bundle';
  category: 'currency' | 'premium' | 'boost' | 'cosmetic' | 'starter' | 'vip';
  price: {
    usd: number; // in cents
    eur: number; // in cents
    displayPrice: string; // formatted price
  };
  value: {
    bettaBuckZ?: number;
    gameMoney?: number;
    items?: PurchaseItem[];
    benefits?: PremiumBenefit[];
  };
  bonusPercentage?: number; // bonus BettaBuckZ %
  isPopular?: boolean;
  isBestValue?: boolean;
  isLimitedTime?: boolean;
  expiresAt?: Date;
  imageUrl?: string;
  tags: string[];
}

export interface PurchaseItem {
  itemId: string;
  quantity: number;
  type: 'boost' | 'cosmetic' | 'currency' | 'premium';
}

export interface PremiumBenefit {
  id: string;
  name: string;
  description: string;
  type: 'multiplier' | 'access' | 'discount' | 'exclusive';
  value?: number;
  duration?: number; // in days, 0 = permanent
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'premium' | 'ultimate';
  price: {
    monthly: number; // in cents
    quarterly: number; // in cents
    yearly: number; // in cents
  };
  benefits: PremiumBenefit[];
  savings: {
    quarterly: number; // percentage
    yearly: number; // percentage
  };
  popularPlan?: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  packageId?: string;
  subscriptionId?: string;
  type: 'package' | 'subscription' | 'renewal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number; // in cents
  currency: string;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  items: PurchaseItem[];
  purchasedAt: Date;
  processedAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionId: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  stripeSubscriptionId?: string;
  benefits: PremiumBenefit[];
  createdAt: Date;
  updatedAt: Date;
}

// Purchase Packages
export const PURCHASE_PACKAGES: PurchasePackage[] = [
  // Currency Packages
  {
    id: 'starter_bb_pack',
    name: 'Starter BettaBuckZ Pack',
    description: 'Perfect for getting started in BettaDayz',
    type: 'one_time',
    category: 'currency',
    price: { usd: 99, eur: 99, displayPrice: '$0.99' },
    value: { bettaBuckZ: 120 },
    bonusPercentage: 20,
    tags: ['starter', 'currency', 'bonus']
  },
  {
    id: 'basic_bb_pack',
    name: 'Basic BettaBuckZ Pack',
    description: 'Great value for casual players',
    type: 'one_time',
    category: 'currency',
    price: { usd: 499, eur: 499, displayPrice: '$4.99' },
    value: { bettaBuckZ: 650 },
    bonusPercentage: 30,
    tags: ['basic', 'currency', 'popular']
  },
  {
    id: 'mega_bb_pack',
    name: 'Mega BettaBuckZ Pack',
    description: 'Maximum value for serious players',
    type: 'one_time',
    category: 'currency',
    price: { usd: 1999, eur: 1999, displayPrice: '$19.99' },
    value: { bettaBuckZ: 3000 },
    bonusPercentage: 50,
    isBestValue: true,
    tags: ['mega', 'currency', 'best-value']
  },

  // Starter Packages
  {
    id: 'entrepreneur_starter',
    name: 'Entrepreneur Starter Pack',
    description: 'Everything you need to start your business empire',
    type: 'one_time',
    category: 'starter',
    price: { usd: 999, eur: 999, displayPrice: '$9.99' },
    value: {
      bettaBuckZ: 500,
      gameMoney: 50000,
      items: [
        { itemId: 'experience_boost_1h', quantity: 5, type: 'boost' },
        { itemId: 'money_boost_2h', quantity: 3, type: 'boost' },
        { itemId: 'business_suit_basic', quantity: 1, type: 'cosmetic' }
      ]
    },
    isPopular: true,
    tags: ['starter', 'business', 'bundle']
  },

  // Premium Packages
  {
    id: 'vip_monthly_package',
    name: 'VIP Monthly Package',
    description: 'Premium benefits and exclusive content',
    type: 'subscription',
    category: 'vip',
    price: { usd: 1499, eur: 1499, displayPrice: '$14.99/month' },
    value: {
      bettaBuckZ: 1000,
      benefits: [
        {
          id: 'exp_multiplier',
          name: 'Experience Multiplier',
          description: '+50% experience gain',
          type: 'multiplier',
          value: 1.5,
          duration: 30
        },
        {
          id: 'money_multiplier',
          name: 'Money Multiplier',
          description: '+30% money gain',
          type: 'multiplier',
          value: 1.3,
          duration: 30
        },
        {
          id: 'exclusive_access',
          name: 'Exclusive Content',
          description: 'Access to VIP-only areas and features',
          type: 'access',
          duration: 30
        }
      ]
    },
    tags: ['vip', 'subscription', 'premium']
  }
];

// Subscription Plans
export const SUBSCRIPTION_PLANS: Subscription[] = [
  {
    id: 'basic_premium',
    name: 'Basic Premium',
    description: 'Essential premium features for casual players',
    tier: 'basic',
    price: {
      monthly: 499, // $4.99
      quarterly: 1299, // $12.99 (13% savings)
      yearly: 4799 // $47.99 (20% savings)
    },
    benefits: [
      {
        id: 'daily_bonus',
        name: 'Daily BettaBuckZ Bonus',
        description: '+50 BettaBuckZ daily login bonus',
        type: 'multiplier',
        value: 50
      },
      {
        id: 'exp_boost',
        name: 'Experience Boost',
        description: '+25% experience gain',
        type: 'multiplier',
        value: 1.25
      }
    ],
    savings: { quarterly: 13, yearly: 20 }
  },
  {
    id: 'premium_plus',
    name: 'Premium Plus',
    description: 'Enhanced features for dedicated players',
    tier: 'premium',
    price: {
      monthly: 999, // $9.99
      quarterly: 2599, // $25.99 (13% savings)
      yearly: 9599 // $95.99 (20% savings)
    },
    benefits: [
      {
        id: 'daily_bonus_plus',
        name: 'Daily BettaBuckZ Bonus+',
        description: '+100 BettaBuckZ daily login bonus',
        type: 'multiplier',
        value: 100
      },
      {
        id: 'exp_boost_plus',
        name: 'Experience Boost+',
        description: '+50% experience gain',
        type: 'multiplier',
        value: 1.5
      },
      {
        id: 'money_boost',
        name: 'Money Boost',
        description: '+30% money gain',
        type: 'multiplier',
        value: 1.3
      },
      {
        id: 'premium_store_discount',
        name: 'Store Discount',
        description: '15% discount on all store purchases',
        type: 'discount',
        value: 15
      }
    ],
    savings: { quarterly: 13, yearly: 20 },
    popularPlan: true
  },
  {
    id: 'ultimate_vip',
    name: 'Ultimate VIP',
    description: 'Maximum benefits for the most dedicated players',
    tier: 'ultimate',
    price: {
      monthly: 1999, // $19.99
      quarterly: 5199, // $51.99 (13% savings)
      yearly: 19199 // $191.99 (20% savings)
    },
    benefits: [
      {
        id: 'daily_bonus_ultimate',
        name: 'Ultimate Daily Bonus',
        description: '+200 BettaBuckZ daily login bonus',
        type: 'multiplier',
        value: 200
      },
      {
        id: 'exp_boost_ultimate',
        name: 'Ultimate Experience Boost',
        description: '+100% experience gain',
        type: 'multiplier',
        value: 2.0
      },
      {
        id: 'money_boost_ultimate',
        name: 'Ultimate Money Boost',
        description: '+50% money gain',
        type: 'multiplier',
        value: 1.5
      },
      {
        id: 'ultimate_store_discount',
        name: 'Ultimate Store Discount',
        description: '25% discount on all store purchases',
        type: 'discount',
        value: 25
      },
      {
        id: 'exclusive_vip_access',
        name: 'Exclusive VIP Access',
        description: 'Access to VIP-only content and features',
        type: 'exclusive'
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: 'Priority customer support',
        type: 'exclusive'
      }
    ],
    savings: { quarterly: 13, yearly: 20 }
  }
];

export class EnhancedIAPManager {
  private static instance: EnhancedIAPManager;
  
  private constructor() {}

  public static getInstance(): EnhancedIAPManager {
    if (!EnhancedIAPManager.instance) {
      EnhancedIAPManager.instance = new EnhancedIAPManager();
    }
    return EnhancedIAPManager.instance;
  }

  // Package Management
  public async getPurchasePackages(category?: string): Promise<PurchasePackage[]> {
    let packages = PURCHASE_PACKAGES;
    
    if (category) {
      packages = packages.filter(pkg => pkg.category === category);
    }
    
    return packages.sort((a, b) => a.price.usd - b.price.usd);
  }

  public async getSubscriptionPlans(): Promise<Subscription[]> {
    return SUBSCRIPTION_PLANS;
  }

  // Purchase Processing
  public async createPurchaseIntent(
    userId: string,
    packageId: string,
    paymentMethod: string = 'stripe'
  ): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
    try {
      const package_ = PURCHASE_PACKAGES.find(p => p.id === packageId);
      if (!package_) {
        return { success: false, error: 'Package not found' };
      }

      // Create Stripe Payment Intent
      const paymentIntent = await this.createStripePaymentIntent(
        package_.price.usd,
        'usd',
        {
          userId,
          packageId,
          type: 'package_purchase'
        }
      );

      if (!paymentIntent.success) {
        return { success: false, error: 'Failed to create payment intent' };
      }

      // Create purchase record
      const purchase: Purchase = {
        id: this.generatePurchaseId(),
        userId,
        packageId,
        type: 'package',
        status: 'pending',
        amount: package_.price.usd,
        currency: 'usd',
        paymentMethod,
        stripePaymentIntentId: paymentIntent.id,
        items: package_.value.items || [],
        purchasedAt: new Date()
      };

      await this.savePurchase(purchase);

      return {
        success: true,
        clientSecret: paymentIntent.clientSecret
      };
    } catch (error) {
      console.error('Error creating purchase intent:', error);
      return { success: false, error: 'Internal error' };
    }
  }

  public async processPurchaseCompletion(purchaseId: string): Promise<boolean> {
    try {
      const purchase = await this.getPurchase(purchaseId);
      if (!purchase || purchase.status !== 'pending') {
        return false;
      }

      // Update purchase status
      purchase.status = 'completed';
      purchase.processedAt = new Date();

      // Process the purchase rewards
      if (purchase.packageId) {
        const package_ = PURCHASE_PACKAGES.find(p => p.id === purchase.packageId);
        if (package_) {
          await this.grantPurchaseRewards(purchase.userId, package_);
        }
      }

      await this.savePurchase(purchase);
      return true;
    } catch (error) {
      console.error('Error processing purchase completion:', error);
      return false;
    }
  }

  // Subscription Management
  public async createSubscription(
    userId: string,
    subscriptionId: string,
    billingCycle: 'monthly' | 'quarterly' | 'yearly'
  ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      const plan = SUBSCRIPTION_PLANS.find(s => s.id === subscriptionId);
      if (!plan) {
        return { success: false, error: 'Subscription plan not found' };
      }

      const price = plan.price[billingCycle];
      
      // Create Stripe subscription
      const stripeSubscription = await this.createStripeSubscription(
        userId,
        price,
        billingCycle,
        {
          planId: subscriptionId,
          tier: plan.tier
        }
      );

      if (!stripeSubscription.success) {
        return { success: false, error: 'Failed to create subscription' };
      }

      // Create user subscription record
      const duration = billingCycle === 'monthly' ? 30 : billingCycle === 'quarterly' ? 90 : 365;
      const userSubscription: UserSubscription = {
        id: this.generateSubscriptionId(),
        userId,
        subscriptionId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        autoRenew: true,
        stripeSubscriptionId: stripeSubscription.id,
        benefits: plan.benefits,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveUserSubscription(userSubscription);

      return {
        success: true,
        subscriptionId: userSubscription.id
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: 'Internal error' };
    }
  }

  public async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    // Implementation would fetch from database
    return [];
  }

  public async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(subscriptionId);
      if (!subscription) return false;

      // Cancel Stripe subscription
      if (subscription.stripeSubscriptionId) {
        await this.cancelStripeSubscription(subscription.stripeSubscriptionId);
      }

      // Update subscription status
      subscription.status = 'cancelled';
      subscription.autoRenew = false;
      subscription.updatedAt = new Date();

      await this.saveUserSubscription(subscription);
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  // Private helper methods
  private async grantPurchaseRewards(userId: string, package_: PurchasePackage): Promise<void> {
    const bettaBuckZManager = await import('../currency/BettaBuckZManager');
    const manager = bettaBuckZManager.BettaBuckZManager.getInstance();

    // Grant BettaBuckZ
    if (package_.value.bettaBuckZ) {
      await manager.awardBettaBuckZ(
        userId,
        package_.value.bettaBuckZ,
        'iap_purchase',
        `Purchased ${package_.name}`
      );
    }

    // Grant items
    if (package_.value.items) {
      for (const item of package_.value.items) {
        // Implementation would add items to user inventory
        console.log(`Granting ${item.quantity}x ${item.itemId} to user ${userId}`);
      }
    }

    // Apply premium benefits
    if (package_.value.benefits) {
      for (const benefit of package_.value.benefits) {
        // Implementation would apply benefits to user
        console.log(`Applying benefit ${benefit.name} to user ${userId}`);
      }
    }
  }

  private async createStripePaymentIntent(
    amount: number,
    currency: string,
    metadata: any
  ): Promise<{ success: boolean; id?: string; clientSecret?: string }> {
    // Implementation would create Stripe Payment Intent
    return {
      success: true,
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret`
    };
  }

  private async createStripeSubscription(
    userId: string,
    amount: number,
    interval: string,
    metadata: any
  ): Promise<{ success: boolean; id?: string }> {
    // Implementation would create Stripe Subscription
    return {
      success: true,
      id: `sub_${Date.now()}`
    };
  }

  private async cancelStripeSubscription(subscriptionId: string): Promise<boolean> {
    // Implementation would cancel Stripe subscription
    return true;
  }

  private generatePurchaseId(): string {
    return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async savePurchase(purchase: Purchase): Promise<void> {
    // Implementation would save to database
    console.log('Saving purchase:', purchase);
  }

  private async saveUserSubscription(subscription: UserSubscription): Promise<void> {
    // Implementation would save to database
    console.log('Saving user subscription:', subscription);
  }

  private async getPurchase(purchaseId: string): Promise<Purchase | null> {
    // Implementation would fetch from database
    return null;
  }

  private async getUserSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    // Implementation would fetch from database
    return null;
  }

  // Static utility methods
  public static formatPrice(cents: number, currency: string = 'USD'): string {
    const amount = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  public static calculateSavings(regularPrice: number, discountedPrice: number): number {
    return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100);
  }
}