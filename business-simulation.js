import { NorfolkEvents, NEIGHBORHOODS } from './norfolk-events';

class BusinessSimulation {
  constructor(player) {
    this.player = player;
    this.businesses = new Map();
    this.marketConditions = {
      economy: 1.0,
      competition: 1.0,
      opportunity: 1.0,
      seasonality: 1.0,
      tourism: 1.0
    };
    this.activeEvents = [];
    this.partnerships = new Map();
    this.challenges = new Map();
    this.lastUpdate = Date.now();
  }

  startBusiness(config) {
    const {
      type,
      location,
      initialInvestment,
      name
    } = config;

    const locationData = NEIGHBORHOODS[location];
    if (!locationData) throw new Error('Invalid location');

    const business = {
      id: Date.now(),
      name,
      type,
      location,
      level: 1,
      employees: [],
      revenue: 0,
      expenses: 0,
      reputation: 0,
      inventory: [],
      upgrades: [],
      lastUpdate: Date.now(),
      customerBase: 0,
      marketShare: 0,
      efficiency: 1.0,
      sustainability: 0,
      communityImpact: 0,
      partnerships: [],
      challenges: [],
      achievements: []
    };

    // Calculate initial metrics based on Norfolk location
    business.expenses = this.calculateExpenses(business);
    business.revenue = this.calculatePotentialRevenue(business);
    business.customerBase = this.calculateInitialCustomerBase(business);

    this.businesses.set(business.id, business);
    
    // Generate initial Norfolk-specific opportunities
    this.generateLocationOpportunities(business);
    
    return business;
  }

  calculateExpenses(business) {
    const baseExpenses = {
      rent: NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.01,
      utilities: 500 + (business.level * 100),
      payroll: business.employees.length * 2500,
      maintenance: 300 + (business.level * 50),
      insurance: 200 + (business.level * 25),
      marketing: 400 + (business.level * 75),
      supplies: 600 + (business.level * 100)
    };

    // Norfolk-specific adjustments
    if (business.location === 'DOWNTOWN') {
      baseExpenses.rent *= 1.5; // Higher downtown costs
      baseExpenses.marketing *= 0.8; // Better visibility
    } else if (business.location === 'BERKLEY') {
      baseExpenses.rent *= 0.7; // Lower costs in developing area
      baseExpenses.marketing *= 1.2; // Need more marketing
    }

    return Object.values(baseExpenses).reduce((a, b) => a + b, 0);
  }

  calculatePotentialRevenue(business) {
    const baseRevenue = NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.05;
    const locationMultiplier = this.getLocationMultiplier(business.location);
    const seasonalMultiplier = this.getSeasonalMultiplier(business.type);
    const reputationBonus = business.reputation * 10;
    
    return Math.floor(
      (baseRevenue * locationMultiplier * seasonalMultiplier * business.efficiency) + 
      reputationBonus + 
      (business.customerBase * 5)
    );
  }

  calculateInitialCustomerBase(business) {
    const locationData = NEIGHBORHOODS[business.location];
    const baseCustomers = locationData.propertyValues[business.type] / 100;
    
    // Adjust based on business type and location synergy
    let multiplier = 1.0;
    if (locationData.businessTypes.includes(business.type)) {
      multiplier = 1.3; // Good fit for location
    }
    
    return Math.floor(baseCustomers * multiplier);
  }

  getLocationMultiplier(location) {
    const multipliers = {
      'DOWNTOWN': 1.5,
      'GHENT': 1.3,
      'MILITARY_CIRCLE': 1.1,
      'OCEANVIEW': 1.0,
      'BERKLEY': 0.8,
      'PARK_PLACE': 0.9
    };
    return multipliers[location] || 1.0;
  }

  getSeasonalMultiplier(businessType) {
    const season = this.getCurrentSeason();
    const seasonalEffects = {
      'SPRING': { restaurant: 1.1, retail: 1.0, entertainment: 1.2 },
      'SUMMER': { restaurant: 1.3, retail: 1.1, entertainment: 1.4 },
      'FALL': { restaurant: 1.0, retail: 1.2, entertainment: 1.0 },
      'WINTER': { restaurant: 0.9, retail: 1.3, entertainment: 0.8 }
    };
    
    return seasonalEffects[season][businessType] || 1.0;
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'SPRING';
    if (month >= 5 && month <= 7) return 'SUMMER';
    if (month >= 8 && month <= 10) return 'FALL';
    return 'WINTER';
  }

  generateLocationOpportunities(business) {
    const locationData = NEIGHBORHOODS[business.location];
    const opportunities = [];

    // Generate events based on location
    locationData.events.forEach(eventType => {
      if (Math.random() < 0.3) { // 30% chance for each event
        opportunities.push({
          id: `${eventType}_${Date.now()}`,
          type: 'event',
          name: this.getEventName(eventType),
          description: this.getEventDescription(eventType),
          cost: Math.floor(Math.random() * 2000) + 500,
          potentialRevenue: Math.floor(Math.random() * 5000) + 1000,
          reputationGain: Math.floor(Math.random() * 10) + 5,
          duration: Math.floor(Math.random() * 7) + 1 // 1-7 days
        });
      }
    });

    business.opportunities = opportunities;
  }

  getEventName(eventType) {
    const eventNames = {
      'art_walk': 'Ghent Art Walk Participation',
      'food_festival': 'Norfolk Food & Wine Festival',
      'boutique_showcase': 'Local Boutique Showcase',
      'first_fridays': 'First Friday Downtown',
      'restaurant_week': 'Norfolk Restaurant Week',
      'business_expo': 'Hampton Roads Business Expo',
      'trade_show': 'Military Circle Trade Show',
      'tech_meetup': 'Norfolk Tech Meetup',
      'business_network': 'Business Networking Event',
      'community_market': 'Park Place Community Market',
      'street_fair': 'Neighborhood Street Fair',
      'local_showcase': 'Local Business Showcase'
    };
    return eventNames[eventType] || 'Community Event';
  }

  getEventDescription(eventType) {
    const descriptions = {
      'art_walk': 'Showcase your business during the monthly Ghent art walk',
      'food_festival': 'Participate in Norfolk\'s premier culinary event',
      'boutique_showcase': 'Feature your products in an exclusive boutique event',
      'first_fridays': 'Join the downtown monthly celebration',
      'restaurant_week': 'Special menu offerings during restaurant week',
      'business_expo': 'Network with regional business leaders',
      'trade_show': 'Display your services at the trade exhibition',
      'tech_meetup': 'Connect with Norfolk\'s tech community',
      'business_network': 'Build relationships with local entrepreneurs',
      'community_market': 'Engage with neighborhood residents',
      'street_fair': 'Participate in the local street festival',
      'local_showcase': 'Highlight your business to the community'
    };
    return descriptions[eventType] || 'Engage with the local community';
  }

  calculatePotentialRevenue(business) {
    const baseRevenue = NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.05;
    const locationMultiplier = this.getLocationMultiplier(business.location);
    const seasonalMultiplier = this.getSeasonalMultiplier(business.type);
    const reputationBonus = business.reputation * 10;
    
    return Math.floor(
      (baseRevenue * locationMultiplier * seasonalMultiplier * business.efficiency) + 
      reputationBonus + 
      (business.customerBase * 5)
    );
  }

  hireEmployee(businessId, employee) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    business.employees.push({
      id: Date.now(),
      ...employee,
      hireDate: new Date(),
      salary: this.calculateSalary(employee.role)
    });

    business.expenses = this.calculateExpenses(business);
    return business;
  }

  calculateSalary(role) {
    const baseSalaries = {
      'manager': 4000,
      'staff': 2500,
      'specialist': 3500
    };
    return baseSalaries[role] || 2500;
  }

  upgradeProperty(businessId, upgradeType) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    const upgrades = {
      'renovation': {
        cost: 10000,
        reputationBoost: 10,
        revenueMultiplier: 1.2
      },
      'expansion': {
        cost: 25000,
        capacityIncrease: 50,
        revenueMultiplier: 1.5
      },
      'technology': {
        cost: 15000,
        efficiencyBoost: 20,
        revenueMultiplier: 1.3
      }
    };

    const upgrade = upgrades[upgradeType];
    if (!upgrade) throw new Error('Invalid upgrade type');

    business.upgrades.push({
      type: upgradeType,
      installDate: new Date(),
      ...upgrade
    });

    return business;
  }

  runDailyOperations(businessId) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    const dailyRevenue = this.calculateDailyRevenue(business);
    const dailyExpenses = this.calculateDailyExpenses(business);
    const profit = dailyRevenue - dailyExpenses;

    // Random events
    const event = this.generateRandomEvent(business);
    if (event) {
      this.handleBusinessEvent(business, event);
    }

    // Update business metrics
    business.revenue += dailyRevenue;
    business.expenses += dailyExpenses;
    business.lastUpdate = Date.now();

    return {
      revenue: dailyRevenue,
      expenses: dailyExpenses,
      profit,
      event
    };
  }

  generateRandomEvent(business) {
    const events = [
      {
        type: 'opportunity',
        name: 'Local Partnership',
        effect: { reputationBoost: 5, revenueBoost: 1000 }
      },
      {
        type: 'challenge',
        name: 'Equipment Breakdown',
        effect: { expense: 2000, reputationLoss: 2 }
      },
      {
        type: 'community',
        name: 'Community Event',
        effect: { reputationBoost: 3, expense: 500 }
      }
    ];

    // 10% chance of event
    if (Math.random() < 0.1) {
      return events[Math.floor(Math.random() * events.length)];
    }
    return null;
  }

  handleBusinessEvent(business, event) {
    switch (event.type) {
      case 'opportunity':
        business.reputation += event.effect.reputationBoost;
        business.revenue += event.effect.revenueBoost;
        break;
      case 'challenge':
        business.reputation = Math.max(0, business.reputation - event.effect.reputationLoss);
        business.expenses += event.effect.expense;
        break;
      case 'community':
        business.reputation += event.effect.reputationBoost;
        business.expenses += event.effect.expense;
        break;
    }
  }

  getBusinessMetrics(businessId) {
    const business = this.businesses.get(businessId);
    if (!business) throw new Error('Business not found');

    return {
      dailyRevenue: this.calculateDailyRevenue(business),
      monthlyRevenue: business.revenue,
      monthlyExpenses: business.expenses,
      profit: business.revenue - business.expenses,
      reputation: business.reputation,
      employees: business.employees.length,
      upgrades: business.upgrades.length
    };
  }
}

export default BusinessSimulation;