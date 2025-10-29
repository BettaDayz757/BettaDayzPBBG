// Domain-Specific Features and Cross-Domain Integration
// SEO optimization, deployment configurations, and enhanced dual-domain functionality

import { DomainManager, DomainConfig } from './DomainManager';

export interface DomainFeature {
  id: string;
  name: string;
  description: string;
  domains: ('bettadayz.shop' | 'bettadayz.store')[];
  isEnabled: boolean;
  configuration: Record<string, any>;
}

export interface CrossDomainIntegration {
  userId: string;
  shopProfile: ShopUserProfile;
  storeProfile: StoreUserProfile;
  linkedAt: Date;
  syncSettings: {
    shareCurrency: boolean;
    shareProgress: boolean;
    shareAchievements: boolean;
    shareInventory: boolean;
  };
}

export interface ShopUserProfile {
  preferredCategories: string[];
  purchaseHistory: ShopPurchase[];
  wishlist: string[];
  loyaltyPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface StoreUserProfile {
  gameLevel: number;
  bettaBuckZ: number;
  achievements: string[];
  playTime: number;
  favoriteGameModes: string[];
  guildId?: string;
}

export interface ShopPurchase {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  purchasedAt: Date;
}

export interface SEOConfiguration {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  socialMedia: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: 'summary' | 'summary_large_image';
  };
  structuredData: Record<string, any>;
}

export interface DeploymentConfiguration {
  domain: string;
  environment: 'development' | 'staging' | 'production';
  platform: 'vercel' | 'netlify' | 'cloudflare' | 'aws';
  buildCommand: string;
  outputDirectory: string;
  environmentVariables: Record<string, string>;
  customHeaders: Record<string, string>;
  redirects: DomainRedirect[];
}

export interface DomainRedirect {
  source: string;
  destination: string;
  permanent: boolean;
  statusCode: number;
}

// Domain-specific features configuration
export const DOMAIN_FEATURES: DomainFeature[] = [
  // Shop-specific features
  {
    id: 'product_catalog',
    name: 'Product Catalog',
    description: 'Browse and purchase physical and digital products',
    domains: ['bettadayz.shop'],
    isEnabled: true,
    configuration: {
      categoriesEnabled: true,
      filtersEnabled: true,
      searchEnabled: true,
      wishlistEnabled: true,
      compareEnabled: true
    }
  },
  {
    id: 'shopping_cart',
    name: 'Shopping Cart',
    description: 'Add items to cart and checkout',
    domains: ['bettadayz.shop'],
    isEnabled: true,
    configuration: {
      guestCheckout: true,
      savedCarts: true,
      quickBuy: true,
      bulkDiscount: true
    }
  },
  {
    id: 'order_management',
    name: 'Order Management',
    description: 'Track orders and manage shipping',
    domains: ['bettadayz.shop'],
    isEnabled: true,
    configuration: {
      orderTracking: true,
      emailNotifications: true,
      returnManagement: true,
      shipmentTracking: true
    }
  },
  {
    id: 'loyalty_program',
    name: 'Loyalty Program',
    description: 'Earn points and unlock benefits',
    domains: ['bettadayz.shop'],
    isEnabled: true,
    configuration: {
      pointsPerDollar: 10,
      tierBenefits: true,
      exclusiveDeals: true,
      birthdayRewards: true
    }
  },

  // Store-specific features
  {
    id: 'game_progression',
    name: 'Game Progression',
    description: 'Level up, gain experience, and unlock content',
    domains: ['bettadayz.store'],
    isEnabled: true,
    configuration: {
      levelCap: 100,
      skillTrees: true,
      prestigeSystem: true,
      multipleCharacters: true
    }
  },
  {
    id: 'virtual_economy',
    name: 'Virtual Economy',
    description: 'Earn and spend in-game currency',
    domains: ['bettadayz.store'],
    isEnabled: true,
    configuration: {
      dailyRewards: true,
      economyBalancing: true,
      inflationControl: true,
      marketDynamics: true
    }
  },
  {
    id: 'guild_system',
    name: 'Guild System',
    description: 'Join guilds and participate in group activities',
    domains: ['bettadayz.store'],
    isEnabled: true,
    configuration: {
      maxGuildSize: 50,
      guildWars: true,
      guildTournaments: true,
      guildPerks: true
    }
  },
  {
    id: 'pvp_battles',
    name: 'PvP Battles',
    description: 'Compete against other players',
    domains: ['bettadayz.store'],
    isEnabled: true,
    configuration: {
      rankedMatches: true,
      casualMatches: true,
      tournaments: true,
      seasonalRanks: true
    }
  },

  // Cross-domain features
  {
    id: 'unified_profile',
    name: 'Unified Profile',
    description: 'Single profile across both domains',
    domains: ['bettadayz.shop', 'bettadayz.store'],
    isEnabled: true,
    configuration: {
      crossDomainLogin: true,
      sharedWallet: true,
      unifiedNotifications: true,
      syncedPreferences: true
    }
  },
  {
    id: 'cross_domain_rewards',
    name: 'Cross-Domain Rewards',
    description: 'Earn rewards in one domain, use in another',
    domains: ['bettadayz.shop', 'bettadayz.store'],
    isEnabled: true,
    configuration: {
      loyaltyPointsToGame: true,
      gameRewardsToShop: true,
      achievementBonuses: true,
      exclusiveContent: true
    }
  }
];

// SEO Configurations for both domains
export const SEO_CONFIGURATIONS: Record<string, SEOConfiguration> = {
  'bettadayz.shop': {
    domain: 'bettadayz.shop',
    title: 'BettaDayz Shop - Premium Gaming Gear & Lifestyle Products',
    description: 'Discover premium gaming gear, lifestyle products, and exclusive merchandise at BettaDayz Shop. From high-performance gaming accessories to trendy apparel, find everything you need to elevate your gaming experience.',
    keywords: [
      'gaming gear',
      'gaming accessories',
      'premium products',
      'gaming merchandise',
      'lifestyle products',
      'gaming apparel',
      'esports gear',
      'gaming peripherals',
      'BettaDayz',
      'gaming lifestyle'
    ],
    canonicalUrl: 'https://bettadayz.shop',
    socialMedia: {
      ogTitle: 'BettaDayz Shop - Premium Gaming Gear & Lifestyle',
      ogDescription: 'Discover premium gaming gear and lifestyle products. Elevate your gaming experience with BettaDayz Shop.',
      ogImage: 'https://bettadayz.shop/og-image-shop.jpg',
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'BettaDayz Shop',
      'url': 'https://bettadayz.shop',
      'description': 'Premium gaming gear and lifestyle products',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://bettadayz.shop/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  },
  'bettadayz.store': {
    domain: 'bettadayz.store',
    title: 'BettaDayz Store - Immersive Business Strategy Game',
    description: 'Build your business empire in BettaDayz Store, the ultimate persistent browser-based business game. Manage companies, compete with players worldwide, join guilds, and climb the leaderboards in this engaging multiplayer experience.',
    keywords: [
      'business game',
      'strategy game',
      'browser game',
      'multiplayer game',
      'PBBG',
      'business simulation',
      'entrepreneurship game',
      'economic strategy',
      'online gaming',
      'persistent world',
      'BettaDayz'
    ],
    canonicalUrl: 'https://bettadayz.store',
    socialMedia: {
      ogTitle: 'BettaDayz Store - Build Your Business Empire',
      ogDescription: 'Build your business empire in this immersive multiplayer strategy game. Join thousands of players in BettaDayz Store.',
      ogImage: 'https://bettadayz.store/og-image-game.jpg',
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'BettaDayz Store',
      'url': 'https://bettadayz.store',
      'description': 'Immersive business strategy game',
      'applicationCategory': 'Game',
      'operatingSystem': 'Web Browser',
      'genre': 'Strategy, Business Simulation'
    }
  }
};

// Deployment configurations
export const DEPLOYMENT_CONFIGURATIONS: Record<string, DeploymentConfiguration> = {
  'bettadayz.shop': {
    domain: 'bettadayz.shop',
    environment: 'production',
    platform: 'vercel',
    buildCommand: 'npm run build:shop',
    outputDirectory: '.next',
    environmentVariables: {
      'NEXT_PUBLIC_DOMAIN': 'bettadayz.shop',
      'NEXT_PUBLIC_SITE_TYPE': 'shop',
      'NEXT_PUBLIC_API_URL': 'https://api.bettadayz.shop',
      'STRIPE_PUBLISHABLE_KEY': process.env.STRIPE_PUBLISHABLE_KEY || '',
      'SUPABASE_URL': process.env.SUPABASE_URL || '',
      'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || ''
    },
    customHeaders: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
    redirects: [
      {
        source: '/game',
        destination: 'https://bettadayz.store',
        permanent: false,
        statusCode: 302
      },
      {
        source: '/play',
        destination: 'https://bettadayz.store',
        permanent: false,
        statusCode: 302
      }
    ]
  },
  'bettadayz.store': {
    domain: 'bettadayz.store',
    environment: 'production',
    platform: 'vercel',
    buildCommand: 'npm run build:store',
    outputDirectory: '.next',
    environmentVariables: {
      'NEXT_PUBLIC_DOMAIN': 'bettadayz.store',
      'NEXT_PUBLIC_SITE_TYPE': 'store',
      'NEXT_PUBLIC_API_URL': 'https://api.bettadayz.store',
      'STRIPE_PUBLISHABLE_KEY': process.env.STRIPE_PUBLISHABLE_KEY || '',
      'SUPABASE_URL': process.env.SUPABASE_URL || '',
      'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || ''
    },
    customHeaders: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'public, max-age=31536000, immutable'
    },
    redirects: [
      {
        source: '/shop',
        destination: 'https://bettadayz.shop',
        permanent: false,
        statusCode: 302
      },
      {
        source: '/products',
        destination: 'https://bettadayz.shop/products',
        permanent: false,
        statusCode: 302
      }
    ]
  }
};

export class EnhancedDomainManager {
  private static instance: EnhancedDomainManager;
  private domainManager: DomainManager;

  private constructor() {
    this.domainManager = DomainManager.getInstance();
  }

  public static getInstance(): EnhancedDomainManager {
    if (!EnhancedDomainManager.instance) {
      EnhancedDomainManager.instance = new EnhancedDomainManager();
    }
    return EnhancedDomainManager.instance;
  }

  // Delegate basic domain operations to DomainManager
  public getCurrentDomain(): string {
    return this.domainManager.getCurrentDomain();
  }

  public getConfig(): DomainConfig {
    return this.domainManager.getConfig();
  }

  public hasFeature(feature: string): boolean {
    return this.domainManager.hasFeature(feature);
  }

  public isShopDomain(): boolean {
    return this.domainManager.isShopDomain();
  }

  public isStoreDomain(): boolean {
    return this.domainManager.isStoreDomain();
  }

  public getTheme() {
    return this.domainManager.getTheme();
  }

  public getCrossDomainUrl(targetDomain: 'shop' | 'store', path: string = ''): string {
    return this.domainManager.getCrossDomainUrl(targetDomain, path);
  }

  // Feature Management
  public getEnabledFeatures(domain: string): DomainFeature[] {
    return DOMAIN_FEATURES.filter(
      feature => feature.isEnabled && feature.domains.includes(domain as any)
    );
  }

  public isFeatureEnabled(featureId: string, domain: string): boolean {
    const feature = DOMAIN_FEATURES.find(f => f.id === featureId);
    return feature ? 
      feature.isEnabled && feature.domains.includes(domain as any) : 
      false;
  }

  public getFeatureConfiguration(featureId: string): Record<string, any> | null {
    const feature = DOMAIN_FEATURES.find(f => f.id === featureId);
    return feature ? feature.configuration : null;
  }

  // Cross-Domain Integration
  public async linkUserAccounts(
    userId: string,
    shopData: Partial<ShopUserProfile>,
    storeData: Partial<StoreUserProfile>
  ): Promise<CrossDomainIntegration> {
    const integration: CrossDomainIntegration = {
      userId,
      shopProfile: {
        preferredCategories: shopData.preferredCategories || [],
        purchaseHistory: shopData.purchaseHistory || [],
        wishlist: shopData.wishlist || [],
        loyaltyPoints: shopData.loyaltyPoints || 0,
        membershipTier: shopData.membershipTier || 'bronze'
      },
      storeProfile: {
        gameLevel: storeData.gameLevel || 1,
        bettaBuckZ: storeData.bettaBuckZ || 0,
        achievements: storeData.achievements || [],
        playTime: storeData.playTime || 0,
        favoriteGameModes: storeData.favoriteGameModes || [],
        guildId: storeData.guildId
      },
      linkedAt: new Date(),
      syncSettings: {
        shareCurrency: true,
        shareProgress: true,
        shareAchievements: true,
        shareInventory: false
      }
    };

    await this.saveCrossDomainIntegration(integration);
    return integration;
  }

  public async getCrossDomainIntegration(userId: string): Promise<CrossDomainIntegration | null> {
    // Implementation would fetch from database
    return null;
  }

  public async syncCrossDomainRewards(userId: string): Promise<void> {
    const integration = await this.getCrossDomainIntegration(userId);
    if (!integration) return;

    // Sync loyalty points to BettaBuckZ
    if (integration.syncSettings.shareCurrency) {
      const loyaltyToBB = Math.floor(integration.shopProfile.loyaltyPoints / 10);
      if (loyaltyToBB > 0) {
        // Add BettaBuckZ based on loyalty points
        await this.addBettaBuckZ(userId, loyaltyToBB, 'loyalty_conversion');
      }
    }

    // Sync achievements
    if (integration.syncSettings.shareAchievements) {
      await this.syncAchievements(userId, integration);
    }
  }

  // SEO Management
  public getSEOConfiguration(domain: string): SEOConfiguration | null {
    return SEO_CONFIGURATIONS[domain] || null;
  }

  public generateMetaTags(domain: string, page?: string): Record<string, string> {
    const config = this.getSEOConfiguration(domain);
    if (!config) return {};

    const baseTags = {
      'title': config.title,
      'description': config.description,
      'keywords': config.keywords.join(', '),
      'canonical': config.canonicalUrl,
      'og:title': config.socialMedia.ogTitle,
      'og:description': config.socialMedia.ogDescription,
      'og:image': config.socialMedia.ogImage,
      'og:url': config.canonicalUrl,
      'twitter:card': config.socialMedia.twitterCard,
      'twitter:title': config.socialMedia.ogTitle,
      'twitter:description': config.socialMedia.ogDescription,
      'twitter:image': config.socialMedia.ogImage
    };

    // Page-specific modifications
    if (page) {
      // Implementation would modify tags based on specific page
    }

    return baseTags;
  }

  public generateStructuredData(domain: string, page?: string): Record<string, any> {
    const config = this.getSEOConfiguration(domain);
    if (!config) return {};

    let structuredData = { ...config.structuredData };

    // Add page-specific structured data
    if (page) {
      // Implementation would add page-specific structured data
    }

    return structuredData;
  }

  // Deployment Management
  public getDeploymentConfiguration(domain: string): DeploymentConfiguration | null {
    return DEPLOYMENT_CONFIGURATIONS[domain] || null;
  }

  public generateVercelConfig(domain: string): Record<string, any> {
    const config = this.getDeploymentConfiguration(domain);
    if (!config) return {};

    return {
      version: 2,
      builds: [
        {
          src: 'next.config.js',
          use: '@vercel/next'
        }
      ],
      env: config.environmentVariables,
      headers: [
        {
          source: '/(.*)',
          headers: Object.entries(config.customHeaders).map(([key, value]) => ({
            key,
            value
          }))
        }
      ],
      redirects: config.redirects.map(redirect => ({
        source: redirect.source,
        destination: redirect.destination,
        permanent: redirect.permanent
      }))
    };
  }

  public generateNetlifyConfig(domain: string): Record<string, any> {
    const config = this.getDeploymentConfiguration(domain);
    if (!config) return {};

    return {
      build: {
        command: config.buildCommand,
        publish: config.outputDirectory,
        environment: config.environmentVariables
      },
      headers: [
        {
          for: '/*',
          values: config.customHeaders
        }
      ],
      redirects: config.redirects.map(redirect => ({
        from: redirect.source,
        to: redirect.destination,
        status: redirect.statusCode
      }))
    };
  }

  // Analytics and Performance
  public async trackCrossDomainNavigation(
    fromDomain: string,
    toDomain: string,
    userId?: string
  ): Promise<void> {
    // Implementation would track navigation between domains
    console.log(`Cross-domain navigation: ${fromDomain} -> ${toDomain}`, { userId });
  }

  public async getPerformanceMetrics(domain: string): Promise<Record<string, number>> {
    // Implementation would return performance metrics
    return {
      loadTime: 0,
      timeToInteractive: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0
    };
  }

  // Private helper methods
  private async saveCrossDomainIntegration(integration: CrossDomainIntegration): Promise<void> {
    // Implementation would save to database
    console.log('Saving cross-domain integration:', integration);
  }

  private async addBettaBuckZ(userId: string, amount: number, source: string): Promise<void> {
    // Implementation would add BettaBuckZ to user account
    console.log(`Adding ${amount} BettaBuckZ to user ${userId} from ${source}`);
  }

  private async syncAchievements(userId: string, integration: CrossDomainIntegration): Promise<void> {
    // Implementation would sync achievements between domains
    console.log('Syncing achievements for user:', userId);
  }
}