import { NorfolkEvents, NEIGHBORHOODS } from './norfolk-events';

class BusinessSimulation {
  constructor(player) {
    this.player = player;
    this.businesses = new Map();
    this.marketConditions = {
      economy: 1.0,
      competition: 1.0,
      opportunity: 1.0,
    };
  }

  startBusiness(config) {
    const { type, location, initialInvestment, name } = config;

    const locationData = NEIGHBORHOODS[location];

    if (!locationData) {
      throw new Error('Invalid location');
    }

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
    };

    // Calculate initial metrics
    business.expenses = this.calculateExpenses(business);
    business.revenue = this.calculatePotentialRevenue(business);

    this.businesses.set(business.id, business);

    return business;
  }

  calculateExpenses(business) {
    const baseExpenses = {
      rent: NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.01,
      utilities: 500,
      payroll: business.employees.length * 2500,
      maintenance: 300,
    };

    return Object.values(baseExpenses).reduce((a, b) => a + b, 0);
  }

  calculatePotentialRevenue(business) {
    const baseRevenue = NEIGHBORHOODS[business.location].propertyValues[business.type] * 0.05;
    const multipliers = {
      location: this.getLocationMultiplier(business.location),
      reputation: 1 + business.reputation * 0.01,
      economy: this.marketConditions.economy,
      competition: this.marketConditions.competition,
    };

    return baseRevenue * Object.values(multipliers).reduce((a, b) => a * b, 1);
  }

  getLocationMultiplier(location) {
    const multipliers = {
      DOWNTOWN: 1.5,
      GHENT: 1.3,
      MILITARY_CIRCLE: 1.2,
      PARK_PLACE: 1.1,
    };
    return multipliers[location] || 1.0;
  }

  hireEmployee(businessId, employee) {
    const business = this.businesses.get(businessId);

    if (!business) {
      throw new Error('Business not found');
    }

    business.employees.push({
      id: Date.now(),
      ...employee,
      hireDate: new Date(),
      salary: this.calculateSalary(employee.role),
    });

    business.expenses = this.calculateExpenses(business);

    return business;
  }

  calculateSalary(role) {
    const baseSalaries = {
      manager: 4000,
      staff: 2500,
      specialist: 3500,
    };
    return baseSalaries[role] || 2500;
  }

  upgradeProperty(businessId, upgradeType) {
    const business = this.businesses.get(businessId);

    if (!business) {
      throw new Error('Business not found');
    }

    const upgrades = {
      renovation: {
        cost: 10000,
        reputationBoost: 10,
        revenueMultiplier: 1.2,
      },
      expansion: {
        cost: 25000,
        capacityIncrease: 50,
        revenueMultiplier: 1.5,
      },
      technology: {
        cost: 15000,
        efficiencyBoost: 20,
        revenueMultiplier: 1.3,
      },
    };

    const upgrade = upgrades[upgradeType];

    if (!upgrade) {
      throw new Error('Invalid upgrade type');
    }

    business.upgrades.push({
      type: upgradeType,
      installDate: new Date(),
      ...upgrade,
    });

    return business;
  }

  runDailyOperations(businessId) {
    const business = this.businesses.get(businessId);

    if (!business) {
      throw new Error('Business not found');
    }

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
      event,
    };
  }

  generateRandomEvent(business) {
    const events = [
      {
        type: 'opportunity',
        name: 'Local Partnership',
        effect: { reputationBoost: 5, revenueBoost: 1000 },
      },
      {
        type: 'challenge',
        name: 'Equipment Breakdown',
        effect: { expense: 2000, reputationLoss: 2 },
      },
      {
        type: 'community',
        name: 'Community Event',
        effect: { reputationBoost: 3, expense: 500 },
      },
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

    if (!business) {
      throw new Error('Business not found');
    }

    return {
      dailyRevenue: this.calculateDailyRevenue(business),
      monthlyRevenue: business.revenue,
      monthlyExpenses: business.expenses,
      profit: business.revenue - business.expenses,
      reputation: business.reputation,
      employees: business.employees.length,
      upgrades: business.upgrades.length,
    };
  }
}

export default BusinessSimulation;
