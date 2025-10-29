// BettaBuckZ Currency System
// Custom in-game currency with exchange rates, earning mechanisms, and premium features

export interface BettaBuckZTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'transfer' | 'exchange' | 'purchase';
  amount: number;
  source: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface BettaBuckZWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  bonusMultiplier: number;
  lastUpdated: Date;
}

export interface ExchangeRate {
  currency: string;
  rate: number; // BettaBuckZ per unit
  lastUpdated: Date;
}

export interface EarningSource {
  id: string;
  name: string;
  description: string;
  baseAmount: number;
  cooldown: number; // in minutes
  requirements?: {
    level?: number;
    achievement?: string;
    tier?: string;
  };
}

export const EARNING_SOURCES: EarningSource[] = [
  {
    id: 'daily_login',
    name: 'Daily Login Bonus',
    description: 'Login each day to earn BettaBuckZ',
    baseAmount: 10,
    cooldown: 1440 // 24 hours
  },
  {
    id: 'business_profit',
    name: 'Business Profits',
    description: 'Earn from your business operations',
    baseAmount: 5,
    cooldown: 60 // 1 hour
  },
  {
    id: 'achievement_unlock',
    name: 'Achievement Rewards',
    description: 'Complete achievements for bonus BettaBuckZ',
    baseAmount: 25,
    cooldown: 0
  },
  {
    id: 'tournament_participation',
    name: 'Tournament Participation',
    description: 'Participate in tournaments',
    baseAmount: 15,
    cooldown: 0
  },
  {
    id: 'community_events',
    name: 'Community Events',
    description: 'Participate in special community events',
    baseAmount: 30,
    cooldown: 0
  },
  {
    id: 'referral_bonus',
    name: 'Referral Bonus',
    description: 'Invite friends to earn BettaBuckZ',
    baseAmount: 100,
    cooldown: 0
  }
];

export const EXCHANGE_RATES: Record<string, ExchangeRate> = {
  USD: {
    currency: 'USD',
    rate: 100, // 100 BettaBuckZ = $1 USD
    lastUpdated: new Date()
  },
  EUR: {
    currency: 'EUR',
    rate: 110, // 110 BettaBuckZ = €1 EUR
    lastUpdated: new Date()
  },
  GAME_MONEY: {
    currency: 'GAME_MONEY',
    rate: 0.1, // 1 BettaBuckZ = $10 game money
    lastUpdated: new Date()
  }
};

export const TIER_BENEFITS = {
  Bronze: { multiplier: 1.0, maxDailyEarn: 100 },
  Silver: { multiplier: 1.2, maxDailyEarn: 200 },
  Gold: { multiplier: 1.5, maxDailyEarn: 300 },
  Platinum: { multiplier: 2.0, maxDailyEarn: 500 },
  Diamond: { multiplier: 2.5, maxDailyEarn: 750 }
};

export class BettaBuckZManager {
  private static instance: BettaBuckZManager;
  
  private constructor() {}

  public static getInstance(): BettaBuckZManager {
    if (!BettaBuckZManager.instance) {
      BettaBuckZManager.instance = new BettaBuckZManager();
    }
    return BettaBuckZManager.instance;
  }

  // Get user's BettaBuckZ wallet
  public async getWallet(userId: string): Promise<BettaBuckZWallet | null> {
    try {
      // Implementation would fetch from database
      // For now, return default wallet
      return {
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        tier: 'Bronze',
        bonusMultiplier: 1.0,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching wallet:', error);
      return null;
    }
  }

  // Award BettaBuckZ to user
  public async awardBettaBuckZ(
    userId: string, 
    amount: number, 
    source: string, 
    description: string
  ): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) return false;

      // Apply tier multiplier
      const tierBenefit = TIER_BENEFITS[wallet.tier];
      const finalAmount = Math.floor(amount * tierBenefit.multiplier);

      // Create transaction record
      const transaction: BettaBuckZTransaction = {
        id: this.generateTransactionId(),
        userId,
        type: 'earn',
        amount: finalAmount,
        source,
        description,
        timestamp: new Date()
      };

      // Update wallet balance
      wallet.balance += finalAmount;
      wallet.totalEarned += finalAmount;
      wallet.lastUpdated = new Date();

      // Check for tier upgrade
      await this.checkTierUpgrade(wallet);

      // Save to database (implementation needed)
      await this.saveTransaction(transaction);
      await this.saveWallet(wallet);

      return true;
    } catch (error) {
      console.error('Error awarding BettaBuckZ:', error);
      return false;
    }
  }

  // Spend BettaBuckZ
  public async spendBettaBuckZ(
    userId: string,
    amount: number,
    purpose: string,
    description: string
  ): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet || wallet.balance < amount) return false;

      const transaction: BettaBuckZTransaction = {
        id: this.generateTransactionId(),
        userId,
        type: 'spend',
        amount: -amount,
        source: purpose,
        description,
        timestamp: new Date()
      };

      wallet.balance -= amount;
      wallet.totalSpent += amount;
      wallet.lastUpdated = new Date();

      await this.saveTransaction(transaction);
      await this.saveWallet(wallet);

      return true;
    } catch (error) {
      console.error('Error spending BettaBuckZ:', error);
      return false;
    }
  }

  // Exchange BettaBuckZ for other currencies
  public async exchangeCurrency(
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Promise<{ success: boolean; convertedAmount?: number; fee?: number }> {
    try {
      const fromRate = EXCHANGE_RATES[fromCurrency];
      const toRate = EXCHANGE_RATES[toCurrency];
      
      if (!fromRate || !toRate) {
        return { success: false };
      }

      // Calculate conversion with 5% fee
      const baseConversion = (amount * fromRate.rate) / toRate.rate;
      const fee = baseConversion * 0.05;
      const finalAmount = baseConversion - fee;

      // Create exchange transaction
      const transaction: BettaBuckZTransaction = {
        id: this.generateTransactionId(),
        userId,
        type: 'exchange',
        amount: fromCurrency === 'BETTABUCKZ' ? -amount : finalAmount,
        source: 'currency_exchange',
        description: `Exchange ${amount} ${fromCurrency} to ${toCurrency}`,
        metadata: {
          fromCurrency,
          toCurrency,
          exchangeRate: fromRate.rate / toRate.rate,
          fee
        },
        timestamp: new Date()
      };

      await this.saveTransaction(transaction);

      return {
        success: true,
        convertedAmount: finalAmount,
        fee
      };
    } catch (error) {
      console.error('Error exchanging currency:', error);
      return { success: false };
    }
  }

  // Transfer BettaBuckZ between users
  public async transferBettaBuckZ(
    fromUserId: string,
    toUserId: string,
    amount: number,
    message?: string
  ): Promise<boolean> {
    try {
      const fromWallet = await this.getWallet(fromUserId);
      const toWallet = await this.getWallet(toUserId);

      if (!fromWallet || !toWallet || fromWallet.balance < amount) {
        return false;
      }

      // Transfer with 2% fee
      const fee = Math.floor(amount * 0.02);
      const transferAmount = amount - fee;

      // Deduct from sender
      await this.spendBettaBuckZ(fromUserId, amount, 'transfer', `Transfer to user ${toUserId}`);
      
      // Add to receiver
      await this.awardBettaBuckZ(toUserId, transferAmount, 'transfer', `Transfer from user ${fromUserId}`);

      return true;
    } catch (error) {
      console.error('Error transferring BettaBuckZ:', error);
      return false;
    }
  }

  // Calculate daily earning opportunities
  public async getDailyEarningOpportunities(userId: string): Promise<EarningSource[]> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return [];

    return EARNING_SOURCES.filter(source => {
      // Check if user meets requirements
      if (source.requirements) {
        // Add requirement checking logic here
      }
      return true;
    });
  }

  // Get transaction history
  public async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<BettaBuckZTransaction[]> {
    // Implementation would fetch from database
    return [];
  }

  // Private helper methods
  private generateTransactionId(): string {
    return `bb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async checkTierUpgrade(wallet: BettaBuckZWallet): Promise<void> {
    const tiers: Array<keyof typeof TIER_BENEFITS> = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
    const thresholds = [0, 1000, 5000, 15000, 50000]; // Total earned thresholds

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (wallet.totalEarned >= thresholds[i]) {
        if (wallet.tier !== tiers[i]) {
          wallet.tier = tiers[i];
          wallet.bonusMultiplier = TIER_BENEFITS[tiers[i]].multiplier;
          
          // Award tier upgrade bonus
          await this.awardBettaBuckZ(
            wallet.userId,
            thresholds[i] / 10,
            'tier_upgrade',
            `Tier upgraded to ${tiers[i]}`
          );
        }
        break;
      }
    }
  }

  private async saveTransaction(transaction: BettaBuckZTransaction): Promise<void> {
    // Implementation would save to database
    console.log('Saving transaction:', transaction);
  }

  private async saveWallet(wallet: BettaBuckZWallet): Promise<void> {
    // Implementation would save to database
    console.log('Saving wallet:', wallet);
  }

  // Static utility methods
  public static formatBettaBuckZ(amount: number): string {
    return `${amount.toLocaleString()} BB`;
  }

  public static getBettaBuckZIcon(): string {
    return '💎'; // Unicode diamond emoji as BettaBuckZ icon
  }
}