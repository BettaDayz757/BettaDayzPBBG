// Norfolk-specific events and opportunities for the business simulation

export const norfolkNeighborhoods = {
  DOWNTOWN: {
    name: 'Downtown Norfolk',
    description: 'The heart of Norfolk with high foot traffic and business opportunities',
    businessMultiplier: 1.3,
    rentMultiplier: 1.5,
    demographics: {
      youngProfessionals: 0.4,
      families: 0.2,
      students: 0.2,
      seniors: 0.2
    },
    keyFeatures: ['MacArthur Center', 'Waterside District', 'Norfolk Scope', 'Business District']
  },
  GHENT: {
    name: 'Ghent District',
    description: 'Historic arts and culture district with upscale dining and shopping',
    businessMultiplier: 1.2,
    rentMultiplier: 1.3,
    demographics: {
      youngProfessionals: 0.5,
      families: 0.3,
      students: 0.1,
      seniors: 0.1
    },
    keyFeatures: ['Colley Avenue', 'Historic Homes', 'Art Galleries', 'Boutique Shopping']
  },
  OCEANVIEW: {
    name: 'Ocean View',
    description: 'Beachfront community with growing residential and commercial development',
    businessMultiplier: 1.1,
    rentMultiplier: 0.9,
    demographics: {
      youngProfessionals: 0.3,
      families: 0.4,
      students: 0.1,
      seniors: 0.2
    },
    keyFeatures: ['Beach Access', 'Ocean View Beach Park', 'Growing Development', 'Family-Friendly']
  },
  MILITARY_CIRCLE: {
    name: 'Military Circle',
    description: 'Major shopping and commercial hub with excellent transportation access',
    businessMultiplier: 1.15,
    rentMultiplier: 1.0,
    demographics: {
      youngProfessionals: 0.3,
      families: 0.4,
      students: 0.2,
      seniors: 0.1
    },
    keyFeatures: ['Military Circle Mall', 'Transportation Hub', 'Diverse Community', 'Shopping Center']
  },
  BERKLEY: {
    name: 'Berkley',
    description: 'Up-and-coming neighborhood with affordable opportunities',
    businessMultiplier: 0.9,
    rentMultiplier: 0.7,
    demographics: {
      youngProfessionals: 0.2,
      families: 0.5,
      students: 0.2,
      seniors: 0.1
    },
    keyFeatures: ['Affordable Housing', 'Community Development', 'Growing Arts Scene', 'Diverse Population']
  }
};

export const norfolkEvents = {
  HARBORFEST: {
    name: 'Norfolk Harborfest',
    description: 'Annual waterfront festival celebrating maritime heritage',
    duration: 3, // days
    season: 'summer',
    businessImpact: {
      FOOD: 2.5,
      ENTERTAINMENT: 2.0,
      RETAIL: 1.8,
      TECH: 1.1,
      REAL_ESTATE: 1.0
    },
    locations: ['DOWNTOWN', 'WATERSIDE'],
    requirements: {
      minReputation: 10,
      vendorFee: 2500
    },
    rewards: {
      revenue: 15000,
      reputation: 25,
      customerBase: 500
    }
  },
  AZALEA_FESTIVAL: {
    name: 'Norfolk Azalea Festival',
    description: 'Spring celebration featuring garden tours and cultural events',
    duration: 7,
    season: 'spring',
    businessImpact: {
      ENTERTAINMENT: 1.8,
      FOOD: 1.6,
      RETAIL: 1.5,
      REAL_ESTATE: 1.2,
      TECH: 1.0
    },
    locations: ['GHENT', 'DOWNTOWN'],
    requirements: {
      minReputation: 15,
      sponsorshipFee: 5000
    },
    rewards: {
      revenue: 12000,
      reputation: 20,
      customerBase: 300
    }
  },
  NAVAL_BASE_CONTRACT: {
    name: 'Naval Base Service Contract',
    description: 'Opportunity to provide services to Norfolk Naval Base personnel',
    duration: 30, // days
    season: 'year-round',
    businessImpact: {
      TECH: 2.0,
      FOOD: 1.8,
      RETAIL: 1.5,
      ENTERTAINMENT: 1.3,
      REAL_ESTATE: 1.1
    },
    locations: ['ALL'],
    requirements: {
      minReputation: 30,
      securityClearance: true,
      contractBond: 10000
    },
    rewards: {
      revenue: 25000,
      reputation: 35,
      customerBase: 1000,
      monthlyRevenue: 5000
    }
  },
  NSU_PARTNERSHIP: {
    name: 'Norfolk State University Partnership',
    description: 'Collaborate with NSU on student services and campus initiatives',
    duration: 90,
    season: 'academic',
    businessImpact: {
      TECH: 1.8,
      FOOD: 2.0,
      ENTERTAINMENT: 1.7,
      RETAIL: 1.4,
      REAL_ESTATE: 1.2
    },
    locations: ['ALL'],
    requirements: {
      minReputation: 20,
      educationalFocus: true,
      partnershipFee: 7500
    },
    rewards: {
      revenue: 18000,
      reputation: 30,
      customerBase: 800,
      skillBonus: { marketing: 2, networking: 3 }
    }
  },
  WATERSIDE_DEVELOPMENT: {
    name: 'Waterside District Development',
    description: 'Participate in the ongoing development of the Waterside entertainment district',
    duration: 180,
    season: 'year-round',
    businessImpact: {
      ENTERTAINMENT: 2.2,
      FOOD: 2.0,
      RETAIL: 1.8,
      REAL_ESTATE: 2.5,
      TECH: 1.3
    },
    locations: ['DOWNTOWN'],
    requirements: {
      minReputation: 40,
      investmentCapital: 25000,
      businessPlan: true
    },
    rewards: {
      revenue: 50000,
      reputation: 50,
      customerBase: 1500,
      monthlyRevenue: 8000,
      propertyValue: 15000
    }
  }
};

export const seasonalModifiers = {
  spring: {
    tourism: 1.2,
    construction: 1.3,
    retail: 1.1,
    events: ['AZALEA_FESTIVAL']
  },
  summer: {
    tourism: 1.5,
    entertainment: 1.4,
    food: 1.3,
    events: ['HARBORFEST']
  },
  fall: {
    education: 1.3,
    retail: 1.2,
    tech: 1.1,
    events: ['BACK_TO_SCHOOL']
  },
  winter: {
    indoor_entertainment: 1.2,
    retail: 0.9,
    construction: 0.8,
    events: ['HOLIDAY_MARKETS']
  }
};

export const communityOrganizations = {
  NORFOLK_CHAMBER: {
    name: 'Norfolk Chamber of Commerce',
    benefits: {
      networking: 2,
      reputation: 1,
      businessOpportunities: 3
    },
    membershipFee: 500,
    requirements: {
      minBusinessAge: 30, // days
      minRevenue: 5000
    }
  },
  DOWNTOWN_NORFOLK: {
    name: 'Downtown Norfolk Council',
    benefits: {
      marketing: 2,
      eventAccess: 3,
      reputation: 2
    },
    membershipFee: 750,
    requirements: {
      location: 'DOWNTOWN',
      minReputation: 15
    }
  },
  GHENT_BUSINESS: {
    name: 'Ghent Business Association',
    benefits: {
      customerBase: 200,
      reputation: 2,
      marketing: 1
    },
    membershipFee: 400,
    requirements: {
      location: 'GHENT',
      businessType: ['RETAIL', 'FOOD', 'ENTERTAINMENT']
    }
  }
};

export const norfolkChallenges = {
  HURRICANE_SEASON: {
    name: 'Hurricane Preparedness',
    description: 'Prepare your business for potential hurricane impacts',
    season: 'summer',
    impact: {
      revenue: -0.2,
      expenses: 1.3
    },
    duration: 7,
    mitigation: {
      insurance: { cost: 2000, effectiveness: 0.8 },
      backup_power: { cost: 5000, effectiveness: 0.6 },
      emergency_supplies: { cost: 1000, effectiveness: 0.4 }
    }
  },
  MILITARY_DEPLOYMENT: {
    name: 'Military Deployment Cycle',
    description: 'Adapt to changes in military personnel presence',
    frequency: 'quarterly',
    impact: {
      customerBase: -0.15,
      revenue: -0.1
    },
    duration: 30,
    adaptation: {
      civilian_marketing: { cost: 3000, effectiveness: 0.7 },
      online_services: { cost: 4000, effectiveness: 0.8 },
      flexible_staffing: { cost: 2000, effectiveness: 0.5 }
    }
  },
  GENTRIFICATION_PRESSURE: {
    name: 'Neighborhood Gentrification',
    description: 'Navigate changing neighborhood dynamics and rising costs',
    locations: ['GHENT', 'DOWNTOWN'],
    impact: {
      rent: 1.4,
      customerDemographics: 'shift_upscale'
    },
    duration: 365,
    strategies: {
      community_engagement: { cost: 1500, reputation: 5 },
      affordable_options: { cost: 2000, communitySupport: 10 },
      upscale_pivot: { cost: 8000, revenue: 1.3 }
    }
  }
};

export function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function getAvailableEvents(playerReputation, playerMoney, currentSeason, playerLocation) {
  return Object.entries(norfolkEvents).filter(([key, event]) => {
    // Check reputation requirement
    if (event.requirements.minReputation && playerReputation < event.requirements.minReputation) {
      return false;
    }
    
    // Check financial requirements
    const totalCost = (event.requirements.vendorFee || 0) + 
                     (event.requirements.sponsorshipFee || 0) + 
                     (event.requirements.contractBond || 0) + 
                     (event.requirements.partnershipFee || 0) + 
                     (event.requirements.investmentCapital || 0);
    
    if (totalCost > playerMoney) {
      return false;
    }
    
    // Check season requirement
    if (event.season !== 'year-round' && event.season !== 'academic' && event.season !== currentSeason) {
      return false;
    }
    
    // Check location requirement
    if (event.locations && !event.locations.includes('ALL') && !event.locations.includes(playerLocation)) {
      return false;
    }
    
    return true;
  }).map(([key, event]) => ({ id: key, ...event }));
}

export function calculateEventImpact(event, businessType, location) {
  const baseImpact = event.businessImpact[businessType] || 1.0;
  const locationBonus = event.locations.includes(location) ? 1.2 : 1.0;
  const neighborhoodMultiplier = norfolkNeighborhoods[location]?.businessMultiplier || 1.0;
  
  return {
    revenueMultiplier: baseImpact * locationBonus,
    reputationGain: event.rewards.reputation * neighborhoodMultiplier,
    customerBaseGain: event.rewards.customerBase * locationBonus,
    duration: event.duration
  };
}