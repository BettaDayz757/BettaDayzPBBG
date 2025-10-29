// Enhanced Store System for BettaDayz PBBG
// Comprehensive marketplace, user shops, auctions, and trading

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  subCategory?: string;
  price: {
    bettaBuckZ?: number;
    gameMoney?: number;
    realMoney?: number; // in cents
  };
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  type: 'consumable' | 'equipment' | 'cosmetic' | 'boost' | 'premium' | 'collectible';
  stackable: boolean;
  maxStack?: number;
  requirements?: {
    level?: number;
    achievement?: string;
    tier?: string;
  };
  effects?: ItemEffect[];
  imageUrl?: string;
  tags: string[];
  isLimited?: boolean;
  limitedQuantity?: number;
  expiresAt?: Date;
  createdBy?: string; // For user-created items
  sellable: boolean;
  tradeable: boolean;
}

export interface ItemEffect {
  type: 'stat_boost' | 'experience_multiplier' | 'money_multiplier' | 'cosmetic' | 'unlock';
  value: number;
  duration?: number; // in minutes
  target?: string;
}

export enum StoreCategory {
  BOOSTS = 'boosts',
  COSMETICS = 'cosmetics',
  EQUIPMENT = 'equipment',
  PREMIUM = 'premium',
  CONSUMABLES = 'consumables',
  COLLECTIBLES = 'collectibles',
  VEHICLES = 'vehicles',
  PROPERTIES = 'properties',
  BUSINESS_UPGRADES = 'business_upgrades',
  DECORATIONS = 'decorations'
}

export interface UserShop {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  theme: string;
  isActive: boolean;
  reputation: number;
  totalSales: number;
  items: UserShopItem[];
  settings: {
    autoRestock: boolean;
    acceptTrades: boolean;
    allowNegotiation: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserShopItem {
  shopId: string;
  itemId: string;
  quantity: number;
  price: {
    bettaBuckZ?: number;
    gameMoney?: number;
  };
  isNegotiable: boolean;
  description?: string;
  listedAt: Date;
}

export interface Auction {
  id: string;
  sellerId: string;
  itemId: string;
  quantity: number;
  startingBid: number;
  currentBid: number;
  currentBidderId?: string;
  buyoutPrice?: number;
  currency: 'bettaBuckZ' | 'gameMoney';
  duration: number; // in hours
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  bids: AuctionBid[];
  watchers: string[]; // user IDs
  createdAt: Date;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export interface TradeOffer {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromItems: TradeItem[];
  toItems: TradeItem[];
  fromCurrency?: {
    bettaBuckZ?: number;
    gameMoney?: number;
  };
  toCurrency?: {
    bettaBuckZ?: number;
    gameMoney?: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  message?: string;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
}

export interface TradeItem {
  itemId: string;
  quantity: number;
}

export const STORE_ITEMS: StoreItem[] = [
  // Boosts
  {
    id: 'experience_boost_1h',
    name: '1-Hour Experience Boost',
    description: 'Double your experience gains for 1 hour',
    category: StoreCategory.BOOSTS,
    price: { bettaBuckZ: 25 },
    rarity: 'Common',
    type: 'boost',
    stackable: true,
    maxStack: 10,
    effects: [{ type: 'experience_multiplier', value: 2.0, duration: 60 }],
    tags: ['boost', 'experience', 'temporary'],
    sellable: false,
    tradeable: false
  },
  {
    id: 'money_boost_2h',
    name: '2-Hour Money Boost',
    description: 'Increase money gains by 50% for 2 hours',
    category: StoreCategory.BOOSTS,
    price: { bettaBuckZ: 40 },
    rarity: 'Uncommon',
    type: 'boost',
    stackable: true,
    maxStack: 5,
    effects: [{ type: 'money_multiplier', value: 1.5, duration: 120 }],
    tags: ['boost', 'money', 'temporary'],
    sellable: false,
    tradeable: false
  },
  
  // Cosmetics
  {
    id: 'golden_suit',
    name: 'Golden Business Suit',
    description: 'A luxurious golden suit that shows your success',
    category: StoreCategory.COSMETICS,
    price: { bettaBuckZ: 200 },
    rarity: 'Epic',
    type: 'cosmetic',
    stackable: false,
    effects: [{ type: 'cosmetic', value: 1 }],
    tags: ['cosmetic', 'clothing', 'luxury'],
    sellable: true,
    tradeable: true
  },
  
  // Premium Items
  {
    id: 'vip_membership_30d',
    name: '30-Day VIP Membership',
    description: 'Unlock exclusive features and bonuses for 30 days',
    category: StoreCategory.PREMIUM,
    price: { realMoney: 999 }, // $9.99
    rarity: 'Legendary',
    type: 'premium',
    stackable: false,
    effects: [
      { type: 'experience_multiplier', value: 1.5, duration: 43200 },
      { type: 'money_multiplier', value: 1.3, duration: 43200 }
    ],
    tags: ['premium', 'vip', 'membership'],
    sellable: false,
    tradeable: false
  },
  
  // Vehicles
  {
    id: 'luxury_sports_car',
    name: 'Luxury Sports Car',
    description: 'A high-end sports car that increases your status',
    category: StoreCategory.VEHICLES,
    price: { bettaBuckZ: 1500, gameMoney: 100000 },
    rarity: 'Legendary',
    type: 'equipment',
    stackable: false,
    requirements: { level: 25 },
    effects: [{ type: 'stat_boost', value: 10, target: 'reputation' }],
    tags: ['vehicle', 'luxury', 'status'],
    sellable: true,
    tradeable: true
  },
  
  // Collectibles
  {
    id: 'rare_trading_card_001',
    name: 'BettaDayz Trading Card #001',
    description: 'A rare collectible trading card',
    category: StoreCategory.COLLECTIBLES,
    price: { bettaBuckZ: 100 },
    rarity: 'Rare',
    type: 'collectible',
    stackable: true,
    maxStack: 1,
    isLimited: true,
    limitedQuantity: 1000,
    tags: ['collectible', 'card', 'limited'],
    sellable: true,
    tradeable: true
  }
];

export class EnhancedStoreManager {
  private static instance: EnhancedStoreManager;
  
  private constructor() {}

  public static getInstance(): EnhancedStoreManager {
    if (!EnhancedStoreManager.instance) {
      EnhancedStoreManager.instance = new EnhancedStoreManager();
    }
    return EnhancedStoreManager.instance;
  }

  // Store Management
  public async getStoreItems(category?: StoreCategory, filters?: any): Promise<StoreItem[]> {
    let items = STORE_ITEMS;
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    if (filters) {
      // Apply additional filters
      if (filters.rarity) {
        items = items.filter(item => item.rarity === filters.rarity);
      }
      if (filters.priceRange) {
        items = items.filter(item => {
          const price = item.price.bettaBuckZ || 0;
          return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });
      }
      if (filters.tags) {
        items = items.filter(item => 
          filters.tags.some((tag: string) => item.tags.includes(tag))
        );
      }
    }
    
    return items;
  }

  public async purchaseItem(
    userId: string, 
    itemId: string, 
    quantity: number = 1,
    currency: 'bettaBuckZ' | 'gameMoney' | 'realMoney' = 'bettaBuckZ'
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const item = STORE_ITEMS.find(i => i.id === itemId);
      if (!item) {
        return { success: false, message: 'Item not found' };
      }

      const price = item.price[currency];
      if (!price) {
        return { success: false, message: 'Item not available in this currency' };
      }

      const totalCost = price * quantity;

      // Check if user can afford the item
      // Implementation would check user's balance

      // Process purchase
      // Implementation would deduct currency and add item to inventory

      return { success: true, message: 'Purchase successful' };
    } catch (error) {
      console.error('Error purchasing item:', error);
      return { success: false, message: 'Purchase failed' };
    }
  }

  // User Shop Management
  public async createUserShop(ownerId: string, name: string, description: string): Promise<UserShop | null> {
    try {
      const shop: UserShop = {
        id: this.generateShopId(),
        ownerId,
        name,
        description,
        theme: 'default',
        isActive: true,
        reputation: 100,
        totalSales: 0,
        items: [],
        settings: {
          autoRestock: false,
          acceptTrades: true,
          allowNegotiation: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.saveUserShop(shop);
      return shop;
    } catch (error) {
      console.error('Error creating user shop:', error);
      return null;
    }
  }

  public async addItemToUserShop(
    shopId: string, 
    itemId: string, 
    quantity: number, 
    price: { bettaBuckZ?: number; gameMoney?: number }
  ): Promise<boolean> {
    try {
      const shopItem: UserShopItem = {
        shopId,
        itemId,
        quantity,
        price,
        isNegotiable: true,
        listedAt: new Date()
      };

      // Save to database
      return true;
    } catch (error) {
      console.error('Error adding item to user shop:', error);
      return false;
    }
  }

  // Auction System
  public async createAuction(
    sellerId: string,
    itemId: string,
    quantity: number,
    startingBid: number,
    duration: number,
    currency: 'bettaBuckZ' | 'gameMoney',
    buyoutPrice?: number
  ): Promise<Auction | null> {
    try {
      const auction: Auction = {
        id: this.generateAuctionId(),
        sellerId,
        itemId,
        quantity,
        startingBid,
        currentBid: startingBid,
        buyoutPrice,
        currency,
        duration,
        endTime: new Date(Date.now() + duration * 60 * 60 * 1000),
        status: 'active',
        bids: [],
        watchers: [],
        createdAt: new Date()
      };

      await this.saveAuction(auction);
      return auction;
    } catch (error) {
      console.error('Error creating auction:', error);
      return null;
    }
  }

  public async placeBid(auctionId: string, bidderId: string, amount: number): Promise<boolean> {
    try {
      const auction = await this.getAuction(auctionId);
      if (!auction || auction.status !== 'active') return false;

      if (amount <= auction.currentBid) return false;

      const bid: AuctionBid = {
        id: this.generateBidId(),
        auctionId,
        bidderId,
        amount,
        timestamp: new Date(),
        isWinning: true
      };

      // Mark previous winning bid as not winning
      auction.bids.forEach(b => b.isWinning = false);
      
      auction.bids.push(bid);
      auction.currentBid = amount;
      auction.currentBidderId = bidderId;

      await this.saveAuction(auction);
      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      return false;
    }
  }

  // Trading System
  public async createTradeOffer(
    fromUserId: string,
    toUserId: string,
    fromItems: TradeItem[],
    toItems: TradeItem[],
    fromCurrency?: { bettaBuckZ?: number; gameMoney?: number },
    toCurrency?: { bettaBuckZ?: number; gameMoney?: number },
    message?: string
  ): Promise<TradeOffer | null> {
    try {
      const trade: TradeOffer = {
        id: this.generateTradeId(),
        fromUserId,
        toUserId,
        fromItems,
        toItems,
        fromCurrency,
        toCurrency,
        status: 'pending',
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date()
      };

      await this.saveTradeOffer(trade);
      return trade;
    } catch (error) {
      console.error('Error creating trade offer:', error);
      return null;
    }
  }

  public async acceptTradeOffer(tradeId: string): Promise<boolean> {
    try {
      const trade = await this.getTradeOffer(tradeId);
      if (!trade || trade.status !== 'pending') return false;

      // Execute the trade
      trade.status = 'accepted';
      trade.acceptedAt = new Date();

      // Transfer items and currency between users
      // Implementation would handle the actual transfers

      trade.status = 'completed';
      await this.saveTradeOffer(trade);
      return true;
    } catch (error) {
      console.error('Error accepting trade offer:', error);
      return false;
    }
  }

  // Helper methods
  private generateShopId(): string {
    return `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAuctionId(): string {
    return `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBidId(): string {
    return `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTradeId(): string {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveUserShop(shop: UserShop): Promise<void> {
    // Implementation would save to database
    console.log('Saving user shop:', shop);
  }

  private async saveAuction(auction: Auction): Promise<void> {
    // Implementation would save to database
    console.log('Saving auction:', auction);
  }

  private async saveTradeOffer(trade: TradeOffer): Promise<void> {
    // Implementation would save to database
    console.log('Saving trade offer:', trade);
  }

  private async getAuction(auctionId: string): Promise<Auction | null> {
    // Implementation would fetch from database
    return null;
  }

  private async getTradeOffer(tradeId: string): Promise<TradeOffer | null> {
    // Implementation would fetch from database
    return null;
  }

  // Static utility methods
  public static getRarityColor(rarity: string): string {
    const colors = {
      Common: '#9CA3AF',
      Uncommon: '#10B981',
      Rare: '#3B82F6',
      Epic: '#8B5CF6',
      Legendary: '#F59E0B',
      Mythic: '#EF4444'
    };
    return colors[rarity as keyof typeof colors] || colors.Common;
  }

  public static getRarityIcon(rarity: string): string {
    const icons = {
      Common: '⚪',
      Uncommon: '🟢',
      Rare: '🔵',
      Epic: '🟣',
      Legendary: '🟡',
      Mythic: '🔴'
    };
    return icons[rarity as keyof typeof icons] || icons.Common;
  }
}