// Game constants for BettaDayz PBBG
export const locations = {
  MILITARY_CIRCLE: { 
    name: 'Military Circle', 
    cost: 5000, 
    traffic: 'Medium',
    description: 'Growing commercial area with steady foot traffic'
  },
  DOWNTOWN: { 
    name: 'Downtown Norfolk', 
    cost: 15000, 
    traffic: 'High',
    description: 'Prime business district with high visibility'
  },
  GHENT: { 
    name: 'Ghent District', 
    cost: 12000, 
    traffic: 'High',
    description: 'Trendy arts district with affluent clientele'
  },
  OCEANVIEW: { 
    name: 'Ocean View', 
    cost: 8000, 
    traffic: 'Medium',
    description: 'Beachfront location with seasonal tourism'
  },
  BERKLEY: { 
    name: 'Berkley', 
    cost: 4000, 
    traffic: 'Growing',
    description: 'Up-and-coming neighborhood with development potential'
  },
  PARK_PLACE: {
    name: 'Park Place',
    cost: 6000,
    traffic: 'Medium',
    description: 'Residential area with local community focus'
  }
};

export const businessTypes = {
  TECH: 'Technology',
  RETAIL: 'Retail',
  FOOD: 'Restaurant',
  REAL_ESTATE: 'Real Estate',
  ENTERTAINMENT: 'Entertainment',
  SERVICE: 'Service',
  MANUFACTURING: 'Manufacturing'
};

export const skillTypes = {
  LEADERSHIP: 'leadership',
  MARKETING: 'marketing',
  FINANCE: 'finance',
  NETWORKING: 'networking',
  INNOVATION: 'innovation',
  MANAGEMENT: 'management',
  COMMUNITY: 'community',
  BUSINESS: 'business'
};

export const gameConfig = {
  STARTING_MONEY: 10000,
  MAX_REPUTATION: 100,
  LEVEL_UP_THRESHOLD: 1000,
  MAX_BUSINESSES: 10
};