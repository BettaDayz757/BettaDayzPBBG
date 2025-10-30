// Game constants for BettaDayz PBBG - Norfolk VA Edition
// Inspired by IMVU, BitLife, and Torn.com gameplay mechanics
export const locations = {
  MILITARY_CIRCLE: { 
    name: 'Military Circle', 
    cost: 5000, 
    traffic: 'Medium',
    description: 'Growing commercial area with steady foot traffic near Naval Station Norfolk',
    culturalSignificance: 'Historic military community hub',
    demographics: { african_american: 45, military: 30, working_class: 60 }
  },
  DOWNTOWN: { 
    name: 'Downtown Norfolk', 
    cost: 15000, 
    traffic: 'High',
    description: 'Prime business district with high visibility and waterfront access',
    culturalSignificance: 'Historic Black Wall Street revival area',
    demographics: { african_american: 35, professional: 50, tourist: 40 }
  },
  GHENT: { 
    name: 'Ghent District', 
    cost: 12000, 
    traffic: 'High',
    description: 'Trendy arts district with affluent clientele and historic charm',
    culturalSignificance: 'Cultural melting pot with growing diversity',
    demographics: { african_american: 25, arts_community: 55, affluent: 60 }
  },
  OCEANVIEW: { 
    name: 'Ocean View', 
    cost: 8000, 
    traffic: 'Medium',
    description: 'Beachfront location with seasonal tourism and family atmosphere',
    culturalSignificance: 'Historic beach community with rich African American heritage',
    demographics: { african_american: 50, family_oriented: 65, seasonal: 45 }
  },
  BERKLEY: { 
    name: 'Berkley', 
    cost: 4000, 
    traffic: 'Growing',
    description: 'Up-and-coming neighborhood with development potential and strong community bonds',
    culturalSignificance: 'Historic African American neighborhood undergoing renaissance',
    demographics: { african_american: 70, working_class: 55, community_focused: 75 }
  },
  PARK_PLACE: {
    name: 'Park Place',
    cost: 6000,
    traffic: 'Medium',
    description: 'Residential area with local community focus and family businesses',
    culturalSignificance: 'Heart of African American business community',
    demographics: { african_american: 65, family_businesses: 60, residential: 70 }
  },
  CHURCHLAND: {
    name: 'Churchland',
    cost: 5500,
    traffic: 'Medium',
    description: 'Historic neighborhood with strong church and community ties',
    culturalSignificance: 'Center of African American spiritual and community life',
    demographics: { african_american: 60, church_community: 70, family_oriented: 65 }
  },
  NORFOLK_STATE_AREA: {
    name: 'Norfolk State University District',
    cost: 7000,
    traffic: 'High',
    description: 'Vibrant HBCU campus area with student energy and innovation',
    culturalSignificance: 'Premier HBCU campus and intellectual hub',
    demographics: { african_american: 85, students: 80, young_professionals: 50 }
  }
};

export const businessTypes = {
  TECH: 'Technology',
  RETAIL: 'Retail',
  FOOD: 'Restaurant',
  REAL_ESTATE: 'Real Estate',
  ENTERTAINMENT: 'Entertainment',
  SERVICE: 'Service',
  MANUFACTURING: 'Manufacturing',
  BARBERSHOP: 'Barbershop/Beauty Salon',
  SOUL_FOOD: 'Soul Food Restaurant',
  MUSIC_STUDIO: 'Music Studio',
  FASHION: 'Fashion/Streetwear',
  COMMUNITY_CENTER: 'Community Center',
  CULTURAL_ARTS: 'Cultural Arts Venue',
  CONSULTING: 'Business Consulting'
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
  MAX_BUSINESSES: 10,
  // BitLife-inspired life simulation
  STARTING_AGE: 18,
  MAX_AGE: 85,
  YEARS_PER_LEVEL: 2,
  // IMVU-inspired social features
  MAX_FRIENDS: 100,
  MAX_CREW_SIZE: 20,
  SOCIAL_INTERACTION_COOLDOWN: 300, // seconds
  // Torn.com-inspired competitive features
  MAX_CRIMES: 10,
  CRIME_COOLDOWN: 600,
  MAX_GANG_SIZE: 30,
  TERRITORY_CONTROL_BONUS: 0.15
};

// Character customization options (IMVU-style)
export const characterOptions = {
  skin_tones: ['light', 'medium_light', 'medium', 'medium_dark', 'dark', 'deep'],
  hairstyles: ['afro', 'locs', 'braids', 'waves', 'fade', 'twists', 'natural', 'buzz', 'cornrows'],
  facial_hair: ['clean', 'goatee', 'beard', 'mustache', 'full_beard'],
  style: ['streetwear', 'business', 'casual', 'athletic', 'cultural', 'formal'],
  accessories: ['chain', 'watch', 'glasses', 'hat', 'headwrap', 'earrings']
};

// Life events (BitLife-inspired)
export const lifeEvents = {
  EDUCATION: ['high_school', 'community_college', 'hbcu', 'trade_school', 'masters', 'phd'],
  RELATIONSHIPS: ['single', 'dating', 'engaged', 'married', 'divorced'],
  MAJOR_EVENTS: ['graduation', 'first_job', 'promotion', 'business_launch', 'community_award'],
  CHALLENGES: ['health_issue', 'legal_trouble', 'financial_crisis', 'family_emergency']
};

// Crime activities (Torn.com-inspired, but legal gray areas)
export const streetActivities = {
  HUSTLE: { name: 'Street Hustle', risk: 0.3, reward: 500, time: 300 },
  BOOTLEG: { name: 'Bootleg Sales', risk: 0.5, reward: 1500, time: 600 },
  UNDERGROUND_EVENTS: { name: 'Underground Events', risk: 0.4, reward: 2000, time: 900 },
  BLACK_MARKET: { name: 'Black Market Trading', risk: 0.7, reward: 5000, time: 1800 }
};

// Gang/Crew system (Torn.com-inspired)
export const crewRoles = {
  LEADER: { name: 'Crew Leader', bonus: 0.3, requirements: { level: 10, reputation: 80 } },
  UNDERBOSS: { name: 'Underboss', bonus: 0.2, requirements: { level: 7, reputation: 60 } },
  ENFORCER: { name: 'Enforcer', bonus: 0.15, requirements: { level: 5, reputation: 40 } },
  MEMBER: { name: 'Crew Member', bonus: 0.1, requirements: { level: 2, reputation: 20 } }
};