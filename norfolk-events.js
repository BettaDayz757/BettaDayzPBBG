import { locations } from './game-constants';

export const NorfolkEvents = {
  COMMUNITY: [
    {
      id: 'norfolk_state',
      title: 'Norfolk State University Partnership',
      description: 'Opportunity to mentor students and recruit talent from NSU',
      requirements: { level: 3, reputation: 20 },
      rewards: {
        reputation: 15,
        skills: { leadership: 2, networking: 2 },
        connections: ['NSU Business Department', 'Student Entrepreneurs']
      }
    },
    {
      id: 'oceanview_festival',
      title: 'Ocean View Beach Festival',
      description: 'Showcase your business at the annual beachfront festival',
      requirements: { level: 2, money: 2000 },
      rewards: {
        money: 5000,
        reputation: 10,
        skills: { marketing: 2 }
      }
    },
    {
      id: 'berkley_initiative',
      title: 'Berkley Community Initiative',
      description: 'Lead a community development project in Berkley',
      requirements: { level: 4, reputation: 30 },
      rewards: {
        reputation: 25,
        skills: { leadership: 3, networking: 2 },
        propertyDiscount: 0.15
      }
    }
  ],

  BUSINESS: [
    {
      id: 'military_contract',
      title: 'Military Base Contract',
      description: 'Opportunity to service the Norfolk Naval Base',
      requirements: { level: 5, reputation: 40, money: 10000 },
      rewards: {
        money: 25000,
        reputation: 20,
        contractDuration: '1 year'
      }
    },
    {
      id: 'waterfront_development',
      title: 'Waterfront Development Project',
      description: 'Participate in Norfolk\'s waterfront renovation',
      requirements: { level: 6, money: 50000 },
      rewards: {
        propertyAccess: 'Premium Waterfront',
        reputation: 30,
        skills: { business: 3, networking: 2 }
      }
    }
  ],

  SEASONAL: [
    {
      id: 'harborfest',
      title: 'Norfolk Harborfest',
      description: 'Largest maritime festival on the East Coast',
      requirements: { level: 2 },
      rewards: {
        money: 8000,
        reputation: 15,
        skills: { marketing: 2, networking: 1 }
      }
    },
    {
      id: 'holiday_market',
      title: 'MacArthur Center Holiday Market',
      description: 'Premium retail opportunity during holiday season',
      requirements: { level: 3, money: 5000 },
      rewards: {
        money: 15000,
        reputation: 12,
        seasonalBonus: 'Holiday Sales Boost'
      }
    }
  ],

  CHALLENGES: [
    {
      id: 'flood_adaptation',
      title: 'Flood Adaptation Initiative',
      description: 'Develop solutions for Norfolk\'s flooding challenges',
      requirements: { level: 4, reputation: 25 },
      rewards: {
        money: 20000,
        reputation: 35,
        skills: { innovation: 3, community: 2 }
      }
    },
    {
      id: 'youth_employment',
      title: 'Youth Employment Program',
      description: 'Create job opportunities for local youth',
      requirements: { level: 3, businesses: 2 },
      rewards: {
        reputation: 20,
        skills: { leadership: 2, management: 2 },
        taxIncentive: 0.1
      }
    }
  ]
};

export const NEIGHBORHOODS = {
  GHENT: {
    events: ['art_walk', 'food_festival', 'boutique_showcase'],
    businessTypes: ['art_gallery', 'restaurant', 'boutique'],
    propertyValues: { retail: 12000, office: 15000 }
  },
  DOWNTOWN: {
    events: ['first_fridays', 'restaurant_week', 'business_expo'],
    businessTypes: ['office', 'restaurant', 'entertainment'],
    propertyValues: { retail: 18000, office: 25000 }
  },
  MILITARY_CIRCLE: {
    events: ['trade_show', 'tech_meetup', 'business_network'],
    businessTypes: ['retail', 'service', 'technology'],
    propertyValues: { retail: 8000, office: 10000 }
  },
  PARK_PLACE: {
    events: ['community_market', 'street_fair', 'local_showcase'],
    businessTypes: ['retail', 'service', 'food'],
    propertyValues: { retail: 6000, office: 7500 }
  }
};

export const generateEvent = (playerLevel, location) => {
  const availableEvents = [...NorfolkEvents.COMMUNITY, ...NorfolkEvents.BUSINESS]
    .filter(event => event.requirements.level <= playerLevel);
  
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
};

// Export norfolk neighborhoods for business dashboard
export const norfolkNeighborhoods = NEIGHBORHOODS;

// Export norfolk events for business dashboard
export const norfolkEvents = NorfolkEvents;

// Seasonal modifiers for business operations
export const seasonalModifiers = {
  spring: { tourism: 1.2, retail: 1.1, food: 1.0, service: 1.0 },
  summer: { tourism: 1.5, retail: 1.2, food: 1.3, service: 1.1 },
  fall: { tourism: 1.1, retail: 1.0, food: 1.1, service: 1.0 },
  winter: { tourism: 0.8, retail: 1.3, food: 0.9, service: 1.0 }
};

// Community organizations in Norfolk
export const communityOrganizations = [
  {
    name: "Norfolk Chamber of Commerce",
    benefits: { networking: 0.15, reputation: 0.1 },
    cost: 500,
    requirements: { reputation: 50 }
  },
  {
    name: "Downtown Norfolk Council",
    benefits: { footTraffic: 0.2, events: 0.25 },
    cost: 300,
    requirements: { location: "DOWNTOWN" }
  },
  {
    name: "Ghent Business Association",
    benefits: { communitySupport: 0.3, marketing: 0.15 },
    cost: 250,
    requirements: { location: "GHENT" }
  }
];

// Norfolk-specific challenges
export const norfolkChallenges = [
  {
    id: "hurricane_season",
    name: "Hurricane Season Preparation",
    description: "Prepare your business for potential hurricane impacts",
    season: "summer",
    severity: "high",
    duration: 90,
    impact: {
      revenue: -0.15,
      expenses: 0.1,
      customerBase: -0.1
    },
    responses: {
      mitigation: { cost: 2000, effectiveness: 0.8 },
      adaptation: { cost: 1000, effectiveness: 0.6 },
      strategies: [
        { name: "Emergency Supplies", cost: 500, effectiveness: 0.4 },
        { name: "Insurance Coverage", cost: 800, effectiveness: 0.7 }
      ]
    }
  },
  {
    id: "military_deployment",
    name: "Military Deployment Cycle",
    description: "Naval base deployment affects local customer base",
    season: "all",
    severity: "medium",
    duration: 180,
    impact: {
      revenue: -0.1,
      customerBase: -0.15
    },
    responses: {
      mitigation: { cost: 1500, effectiveness: 0.7 },
      adaptation: { cost: 800, effectiveness: 0.5 },
      strategies: [
        { name: "Military Discounts", cost: 200, effectiveness: 0.6 },
        { name: "Family Services", cost: 600, effectiveness: 0.8 }
      ]
    }
  }
];

// Get current season based on date
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
};

// Get available events based on filters
export const getAvailableEvents = (filters = {}) => {
  const allEvents = [...NorfolkEvents.COMMUNITY, ...NorfolkEvents.BUSINESS];
  
  return allEvents.filter(event => {
    if (filters.level && event.requirements.level > filters.level) return false;
    if (filters.location && event.location && event.location !== filters.location) return false;
    if (filters.businessType && event.businessTypes && !event.businessTypes.includes(filters.businessType)) return false;
    return true;
  });
};

// Calculate event impact on business
export const calculateEventImpact = (event, business) => {
  const baseImpact = event.rewards || {};
  const locationMultiplier = business.location === event.location ? 1.2 : 1.0;
  const seasonMultiplier = seasonalModifiers[getCurrentSeason()][business.type] || 1.0;
  
  return {
    revenue: (baseImpact.revenue || 0) * locationMultiplier * seasonMultiplier,
    reputation: baseImpact.reputation || 0,
    customerBase: (baseImpact.customerBase || 0) * locationMultiplier
  };
};