// Domain Configuration System for BettaDayz PBBG
// Handles routing and features based on domain (.shop vs .store)

export interface DomainConfig {
  domain: string;
  purpose: string;
  features: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accent: string;
    branding: string;
  };
  routes: {
    primary: string;
    secondary: string[];
  };
}

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'bettadayz.shop': {
    domain: 'bettadayz.shop',
    purpose: 'E-commerce & Game Store',
    features: [
      'marketplace',
      'in-app-purchases',
      'user-shops',
      'auctions',
      'premium-store',
      'bettabuckz-exchange',
      'trading'
    ],
    theme: {
      primaryColor: '#10b981', // emerald-500
      secondaryColor: '#065f46', // emerald-800
      accent: '#fbbf24', // amber-400
      branding: 'commerce'
    },
    routes: {
      primary: '/store',
      secondary: ['/marketplace', '/shop', '/trade', '/premium', '/exchange']
    }
  },
  'bettadayz.store': {
    domain: 'bettadayz.store',
    purpose: 'Main Game & Community Hub',
    features: [
      'game-world',
      'character-management',
      'guilds',
      'tournaments',
      'leaderboards',
      'social-features',
      'achievements',
      'events'
    ],
    theme: {
      primaryColor: '#3b82f6', // blue-500
      secondaryColor: '#1e40af', // blue-800
      accent: '#f59e0b', // amber-500
      branding: 'gaming'
    },
    routes: {
      primary: '/game',
      secondary: ['/character', '/guilds', '/tournaments', '/social', '/events']
    }
  }
};

export class DomainManager {
  private static instance: DomainManager;
  private currentDomain: string;
  private config: DomainConfig;

  private constructor() {
    this.currentDomain = this.detectDomain();
    this.config = this.loadConfig();
  }

  public static getInstance(): DomainManager {
    if (!DomainManager.instance) {
      DomainManager.instance = new DomainManager();
    }
    return DomainManager.instance;
  }

  private detectDomain(): string {
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    }
    return process.env.NEXT_PUBLIC_DOMAIN || 'bettadayz.store';
  }

  private loadConfig(): DomainConfig {
    const config = DOMAIN_CONFIGS[this.currentDomain];
    if (!config) {
      // Fallback to .store domain if domain not found
      return DOMAIN_CONFIGS['bettadayz.store'];
    }
    return config;
  }

  public getCurrentDomain(): string {
    return this.currentDomain;
  }

  public getConfig(): DomainConfig {
    return this.config;
  }

  public hasFeature(feature: string): boolean {
    return this.config.features.includes(feature);
  }

  public isShopDomain(): boolean {
    return this.currentDomain === 'bettadayz.shop';
  }

  public isStoreDomain(): boolean {
    return this.currentDomain === 'bettadayz.store';
  }

  public getTheme() {
    return this.config.theme;
  }

  public getCrossDomainUrl(targetDomain: 'shop' | 'store', path: string = ''): string {
    const baseUrl = targetDomain === 'shop' ? 'https://bettadayz.shop' : 'https://bettadayz.store';
    return `${baseUrl}${path}`;
  }

  public getFeatures(): string[] {
    return this.config.features;
  }

  public getPrimaryRoute(): string {
    return this.config.routes.primary;
  }

  public getSecondaryRoutes(): string[] {
    return this.config.routes.secondary;
  }
}