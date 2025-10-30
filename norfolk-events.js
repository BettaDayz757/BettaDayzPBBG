// Norfolk events and activities

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
      id: 'hampton_university',
      title: 'Hampton University Business Collaboration',
      description: 'Partner with Hampton University on entrepreneurship programs',
      requirements: { level: 4, reputation: 30 },
      rewards: {
        reputation: 20,
        skills: { leadership: 3, innovation: 2 },
        connections: ['Hampton Business School', 'HBCU Alumni Network']
      }
    },
    {
      id: 'hbcu_job_fair',
      title: 'HBCU Career Fair',
      description: 'Recruit top talent from Norfolk State, Hampton, and VSU',
      requirements: { level: 3, businesses: 1 },
      rewards: {
        reputation: 12,
        skills: { networking: 2, management: 1 },
        employee_quality_boost: 0.2
      }
    },
    {
      id: 'black_business_expo',
      title: 'African American Business Expo',
      description: 'Showcase your business at Norfolk\'s premier Black business event',
      requirements: { level: 2, money: 1500 },
      rewards: {
        money: 4000,
        reputation: 18,
        skills: { marketing: 3, networking: 2 },
        connections: ['Black Chamber of Commerce', 'Local Entrepreneurs']
      }
    },
    {
      id: 'soul_food_festival',
      title: 'Norfolk Soul Food Festival',
      description: 'Celebrate African American culinary heritage',
      requirements: { level: 2, businessType: 'FOOD' },
      rewards: {
        money: 6000,
        reputation: 15,
        skills: { marketing: 2 },
        cultural_influence: 10
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
    },
    {
      id: 'church_street_revival',
      title: 'Church Street Business Revival',
      description: 'Help revitalize historic African American business corridor',
      requirements: { level: 5, reputation: 40, money: 15000 },
      rewards: {
        reputation: 35,
        skills: { leadership: 4, community: 3 },
        propertyDiscount: 0.2,
        historical_landmark: true
      }
    },
    {
      id: 'barbershop_chronicles',
      title: 'Barbershop Chronicles Community Event',
      description: 'Host community discussions at your barbershop',
      requirements: { level: 2, businessType: 'BARBERSHOP' },
      rewards: {
        reputation: 20,
        skills: { networking: 3, community: 2 },
        customer_loyalty: 0.15
      }
    },
    {
      id: 'minority_entrepreneurship',
      title: 'Minority Entrepreneurship Summit',
      description: 'Lead workshops on building generational wealth',
      requirements: { level: 6, reputation: 50 },
      rewards: {
        reputation: 30,
        skills: { leadership: 4, business: 3 },
        connections: ['Minority Business Development Agency', 'SBA']
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

export const generateEvent = (playerLevel) => {
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
  },
  {
    name: "Black Chamber of Commerce - Hampton Roads",
    benefits: { networking: 0.25, reputation: 0.2, minority_contracts: 0.3 },
    cost: 400,
    requirements: { reputation: 40 }
  },
  {
    name: "HBCU Alumni Association",
    benefits: { networking: 0.2, talent_recruitment: 0.25, mentorship: 0.15 },
    cost: 200,
    requirements: { education: 'HBCU' }
  },
  {
    name: "Norfolk State University Business Incubator",
    benefits: { innovation: 0.3, technology: 0.25, student_talent: 0.4 },
    cost: 350,
    requirements: { location: "NORFOLK_STATE_AREA", reputation: 30 }
  },
  {
    name: "Urban League of Hampton Roads",
    benefits: { community_impact: 0.3, reputation: 0.15, workforce_development: 0.2 },
    cost: 300,
    requirements: { reputation: 35 }
  },
  {
    name: "100 Black Men of America - Norfolk Chapter",
    benefits: { mentorship: 0.4, youth_development: 0.3, networking: 0.2 },
    cost: 450,
    requirements: { reputation: 60, level: 5 }
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

// Norfolk VA Historical Context
export const historicalLandmarks = {
  AFRICAN_AMERICAN_HERITAGE: [
    {
      name: "Historic Church Street",
      description: "Former center of Black business and culture in Norfolk",
      significance: "Black Wall Street of Hampton Roads",
      location: "DOWNTOWN",
      unlockLevel: 3
    },
    {
      name: "Norfolk State University Campus",
      description: "Founded in 1935, premier HBCU institution",
      significance: "Educational excellence and community leadership",
      location: "NORFOLK_STATE_AREA",
      unlockLevel: 1
    },
    {
      name: "Attucks Theatre",
      description: "Historic African American performing arts venue (1919)",
      significance: "Cultural landmark and entertainment hub",
      location: "DOWNTOWN",
      unlockLevel: 4
    },
    {
      name: "Berkley Historic District",
      description: "Historic African American neighborhood",
      significance: "Community resilience and cultural preservation",
      location: "BERKLEY",
      unlockLevel: 2
    }
  ],
  MILITARY_HERITAGE: [
    {
      name: "Naval Station Norfolk",
      description: "World's largest naval base",
      significance: "Major employer and economic driver",
      location: "MILITARY_CIRCLE",
      unlockLevel: 1
    }
  ]
};

// Cultural Icons and Influences
export const culturalIcons = [
  {
    name: "Pharrell Williams",
    influence: "Music, Fashion, Entertainment",
    norfolkConnection: "Virginia Beach/Norfolk native, global influence",
    inspiration: "Innovation and entrepreneurship"
  },
  {
    name: "Missy Elliott",
    influence: "Hip-hop, Music Production",
    norfolkConnection: "Portsmouth native, industry pioneer",
    inspiration: "Creative excellence and breaking barriers"
  },
  {
    name: "Timbaland",
    influence: "Music Production, Innovation",
    norfolkConnection: "Norfolk native, legendary producer",
    inspiration: "Technical mastery and business acumen"
  }
];

// Social interaction system (IMVU-inspired)
export const socialInteractions = {
  NETWORK: {
    name: "Network at Event",
    cooldown: 300,
    rewards: { connections: 1, reputation: 2 },
    energy_cost: 10
  },
  MENTOR: {
    name: "Mentor Young Entrepreneur",
    cooldown: 600,
    rewards: { reputation: 5, leadership_skill: 1 },
    energy_cost: 20
  },
  COLLABORATE: {
    name: "Business Collaboration",
    cooldown: 900,
    rewards: { money: 500, connections: 2, reputation: 3 },
    energy_cost: 15
  },
  COMMUNITY_SERVICE: {
    name: "Community Service",
    cooldown: 1200,
    rewards: { reputation: 10, community_skill: 2 },
    energy_cost: 25
  },
  HBCU_VISIT: {
    name: "Visit HBCU Campus",
    cooldown: 600,
    rewards: { connections: 3, innovation_skill: 1, student_access: true },
    energy_cost: 15
  }
};

// Crew/Gang territories (Torn.com-inspired)
export const territories = {
  DOWNTOWN: {
    name: "Downtown Norfolk",
    control_bonus: { income: 0.2, reputation: 0.15 },
    difficulty: "hard",
    requirements: { crew_size: 15, level: 8 }
  },
  MILITARY_CIRCLE: {
    name: "Military Circle",
    control_bonus: { income: 0.15, military_contracts: 0.3 },
    difficulty: "medium",
    requirements: { crew_size: 10, level: 5 }
  },
  BERKLEY: {
    name: "Berkley",
    control_bonus: { income: 0.12, community_support: 0.25 },
    difficulty: "easy",
    requirements: { crew_size: 5, level: 3 }
  },
  GHENT: {
    name: "Ghent",
    control_bonus: { income: 0.18, cultural_influence: 0.2 },
    difficulty: "medium",
    requirements: { crew_size: 12, level: 6 }
  }
};

// Life simulation events (BitLife-inspired)
export const lifeSimulationEvents = [
  {
    id: "hbcu_graduation",
    name: "HBCU Graduation",
    description: "Graduate from Norfolk State University with honors",
    age_requirement: 22,
    rewards: {
      education_level: "bachelors",
      reputation: 10,
      skills: { business: 2, networking: 2 },
      starting_money_bonus: 5000
    }
  },
  {
    id: "first_barbershop",
    name: "Open First Barbershop",
    description: "Follow in the footsteps of Norfolk's legendary barbers",
    age_requirement: 25,
    rewards: {
      business: "BARBERSHOP",
      reputation: 15,
      community_connections: 5
    }
  },
  {
    id: "community_leader",
    name: "Become Community Leader",
    description: "Recognized as a pillar of the Norfolk community",
    age_requirement: 35,
    requirements: { reputation: 75, businesses: 3 },
    rewards: {
      title: "Community Leader",
      reputation: 25,
      influence: 20
    }
  },
  {
    id: "legacy_builder",
    name: "Build Family Legacy",
    description: "Establish generational wealth and business empire",
    age_requirement: 50,
    requirements: { reputation: 90, net_worth: 1000000 },
    rewards: {
      title: "Legacy Builder",
      family_bonus: 0.3,
      historical_recognition: true
    }
  }
];