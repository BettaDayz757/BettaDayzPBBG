import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BusinessSimulation from '../game/business-simulation.js';
import { 
  norfolkNeighborhoods, 
  norfolkEvents, 
  getAvailableEvents, 
  getCurrentSeason,
  calculateEventImpact,
  communityOrganizations,
  norfolkChallenges
} from '../game/norfolk-events.js';

const BusinessDashboard = ({ player, onBusinessUpdate }) => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showNewBusinessForm, setShowNewBusinessForm] = useState(false);
  const [activeOpportunities, setActiveOpportunities] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [marketConditions, setMarketConditions] = useState({
    economy: 'stable',
    competition: 'moderate',
    seasonality: 'normal',
    tourism: 'average',
    season: getCurrentSeason()
  });

  const businessSim = new BusinessSimulation();

  useEffect(() => {
    // Load existing businesses
    if (player.businesses) {
      setBusinesses(player.businesses);
    }
    
    // Update market conditions
    updateMarketConditions();
    
    // Generate daily opportunities
    generateDailyOpportunities();
    
    // Generate active challenges
    generateActiveChallenges();
  }, [player]);

  const updateMarketConditions = () => {
    // Simulate dynamic market conditions
    const conditions = ['poor', 'stable', 'good', 'excellent'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    setMarketConditions(prev => ({
      ...prev,
      economy: randomCondition,
      competition: Math.random() > 0.5 ? 'high' : 'moderate',
      seasonality: getCurrentSeasonalEffect(),
      tourism: Math.random() > 0.3 ? 'high' : 'average',
      season: getCurrentSeason()
    }));
  };

  const getCurrentSeasonalEffect = () => {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 7) return 'summer_boost'; // Summer tourism
    if (month >= 11 || month <= 1) return 'holiday_season';
    return 'normal';
  };

  const generateActiveChallenges = () => {
    const currentSeason = getCurrentSeason();
    const availableChallenges = Object.entries(norfolkChallenges).filter(([key, challenge]) => {
      if (challenge.season && challenge.season !== currentSeason) return false;
      if (challenge.locations && businesses.length > 0) {
        return businesses.some(business => challenge.locations.includes(business.location));
      }
      return true;
    });

    setActiveChallenges(availableChallenges.map(([key, challenge]) => ({ id: key, ...challenge })));
  };

  const generateDailyOpportunities = () => {
    const currentSeason = getCurrentSeason();
    const playerLocation = businesses.length > 0 ? businesses[0].location : 'DOWNTOWN';
    
    // Get Norfolk-specific events
    const norfolkOpportunities = getAvailableEvents(
      player.reputation || 0, 
      player.money || 0, 
      currentSeason, 
      playerLocation
    );

    // Add some general opportunities
    const generalOpportunities = [
      {
        id: 'community_event',
        title: 'Local Community Event Sponsorship',
        description: 'Sponsor a neighborhood community event to build local reputation',
        cost: 2500,
        duration: 7,
        rewards: {
          revenue: 5000,
          reputation: 10,
          customerBase: 150
        },
        requirements: {
          minReputation: 5
        }
      },
      {
        id: 'social_media_campaign',
        title: 'Digital Marketing Campaign',
        description: 'Launch a targeted social media campaign for Norfolk area',
        cost: 3000,
        duration: 14,
        rewards: {
          revenue: 8000,
          reputation: 8,
          customerBase: 200
        },
        requirements: {
          minReputation: 0
        }
      }
    ];

    // Filter opportunities based on player's businesses and reputation
    const allOpportunities = [...norfolkOpportunities, ...generalOpportunities];
    const availableOpportunities = allOpportunities.filter(opp => {
      const meetsReputation = player.reputation >= (opp.requirements?.minReputation || 0);
      const canAfford = player.money >= opp.cost;
      return meetsReputation && canAfford;
    });

    setActiveOpportunities(availableOpportunities);
  };

  const handleStartBusiness = (businessConfig) => {
    try {
      const newBusiness = businessSim.startBusiness(businessConfig);
      setBusinesses(prev => [...prev, newBusiness]);
      setShowNewBusinessForm(false);
      
      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: 'BUSINESS_STARTED',
          business: newBusiness,
          cost: businessConfig.initialInvestment
        });
      }
    } catch (error) {
      console.error('Failed to start business:', error);
    }
  };

  const handleBusinessAction = (businessId, action, data) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    switch (action) {
      case 'HIRE_EMPLOYEE':
        businessSim.hireEmployee(businessId, data);
        break;
      case 'UPGRADE_PROPERTY':
        businessSim.upgradeProperty(businessId, data.upgradeType);
        break;
      case 'PARTICIPATE_EVENT':
        handleEventParticipation(businessId, data.eventId);
        break;
      case 'RUN_OPERATIONS':
        businessSim.runDailyOperations(businessId);
        break;
    }

    // Update businesses state
    const updatedBusinesses = Array.from(businessSim.businesses.values());
    setBusinesses(updatedBusinesses);
  };

  const handleEventParticipation = (businessId, eventId) => {
    const opportunity = activeOpportunities.find(o => o.id === eventId);
    const business = businesses.find(b => b.id === businessId);
    
    if (!opportunity || !business) return;

    // Check requirements
    const meetsRequirements = 
      (!opportunity.requirements?.minReputation || player.reputation >= opportunity.requirements.minReputation) &&
      (!opportunity.requirements?.businessTypes || opportunity.requirements.businessTypes.includes(business.type)) &&
      (player.money >= opportunity.cost);

    if (meetsRequirements) {
      // Calculate event impact
      const impact = calculateEventImpact(opportunity, business.type, business.location);
      
      // Apply rewards
      const updatedBusiness = {
        ...business,
        revenue: business.revenue + (opportunity.rewards.revenue || 0),
        reputation: business.reputation + (impact.reputationGain || 0),
        customerBase: (business.customerBase || 0) + (impact.customerBaseGain || 0)
      };

      // Update businesses
      setBusinesses(prev => prev.map(b => b.id === businessId ? updatedBusiness : b));

      // Remove opportunity after participation
      setActiveOpportunities(prev => prev.filter(o => o.id !== eventId));

      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: 'EVENT_PARTICIPATED',
          business: updatedBusiness,
          opportunity,
          cost: opportunity.cost
        });
      }
    }
  };

  const handleChallengeResponse = (challengeId, responseType, responseData) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    let cost = 0;
    let effectiveness = 0;

    // Handle different response types based on challenge
    if (challenge.mitigation && challenge.mitigation[responseType]) {
      cost = challenge.mitigation[responseType].cost;
      effectiveness = challenge.mitigation[responseType].effectiveness;
    } else if (challenge.adaptation && challenge.adaptation[responseType]) {
      cost = challenge.adaptation[responseType].cost;
      effectiveness = challenge.adaptation[responseType].effectiveness;
    } else if (challenge.strategies && challenge.strategies[responseType]) {
      cost = challenge.strategies[responseType].cost;
      effectiveness = challenge.strategies[responseType].effectiveness || 0;
    }

    if (player.money >= cost) {
      // Apply challenge response effects to all businesses
      const updatedBusinesses = businesses.map(business => {
        let updatedBusiness = { ...business };
        
        // Apply challenge impact reduction based on effectiveness
        if (challenge.impact) {
          if (challenge.impact.revenue) {
            const revenueImpact = challenge.impact.revenue * (1 - effectiveness);
            updatedBusiness.revenue = Math.max(0, business.revenue * (1 + revenueImpact));
          }
          if (challenge.impact.expenses) {
            const expenseImpact = challenge.impact.expenses * (1 - effectiveness);
            updatedBusiness.expenses = business.expenses * (1 + expenseImpact);
          }
          if (challenge.impact.customerBase) {
            const customerImpact = challenge.impact.customerBase * (1 - effectiveness);
            updatedBusiness.customerBase = Math.max(0, (business.customerBase || 0) * (1 + customerImpact));
          }
        }

        // Apply specific benefits
        if (challenge.strategies && challenge.strategies[responseType]) {
          const strategy = challenge.strategies[responseType];
          if (strategy.reputation) {
            updatedBusiness.reputation = Math.min(100, business.reputation + strategy.reputation);
          }
          if (strategy.communitySupport) {
            updatedBusiness.communitySupport = (business.communitySupport || 0) + strategy.communitySupport;
          }
          if (strategy.revenue) {
            updatedBusiness.revenue = business.revenue * strategy.revenue;
          }
        }

        return updatedBusiness;
      });

      setBusinesses(updatedBusinesses);

      // Remove challenge after response (or mark as handled)
      setActiveChallenges(prev => prev.filter(c => c.id !== challengeId));

      if (onBusinessUpdate) {
        onBusinessUpdate({
          type: 'CHALLENGE_RESPONDED',
          challenge,
          responseType,
          cost,
          effectiveness
        });
      }
    }
  };

  const BusinessCard = ({ business }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
      onClick={() => setSelectedBusiness(business)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
        <span className="text-2xl">{business.icon || '🏢'}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-lg font-semibold text-green-600">${business.revenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Expenses</p>
          <p className="text-lg font-semibold text-red-600">${business.expenses.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Level</p>
          <p className="font-semibold">{business.level}</p>
        </div>
        <div>
          <p className="text-gray-600">Reputation</p>
          <p className="font-semibold">{business.reputation}/100</p>
        </div>
        <div>
          <p className="text-gray-600">Employees</p>
          <p className="font-semibold">{business.employees.length}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${Math.min((business.reputation / 100) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );

  const OpportunityCard = ({ opportunity }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
    >
      <h4 className="text-lg font-bold text-blue-800 mb-2">{opportunity.title}</h4>
      <p className="text-gray-700 mb-3">{opportunity.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-600">Cost</p>
          <p className="font-semibold text-red-600">${opportunity.cost.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-semibold">{opportunity.duration} days</p>
        </div>
      </div>
      
      {opportunity.requirements && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">Requirements:</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.requirements.level && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Level {opportunity.requirements.level}+
              </span>
            )}
            {opportunity.requirements.reputation && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Reputation {opportunity.requirements.reputation}+
              </span>
            )}
          </div>
        </div>
      )}
      
      <button
        onClick={() => handleEventParticipation(selectedBusiness?.id, opportunity.id)}
        disabled={!selectedBusiness || player.money < opportunity.cost}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          selectedBusiness && player.money >= opportunity.cost
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {selectedBusiness ? 'Participate' : 'Select a Business First'}
      </button>
    </motion.div>
  );

  const ChallengeCard = ({ challenge }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4"
    >
      <h4 className="text-lg font-bold text-red-800 mb-2">{challenge.name}</h4>
      <p className="text-gray-700 mb-3">{challenge.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-600">Impact Duration</p>
          <p className="font-semibold">{challenge.duration} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Severity</p>
          <p className="font-semibold text-red-600">
            {challenge.impact?.revenue ? `${Math.abs(challenge.impact.revenue * 100)}% Revenue` : 'Variable'}
          </p>
        </div>
      </div>
      
      {/* Response Options */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Response Options:</p>
        {challenge.mitigation && Object.entries(challenge.mitigation).map(([key, option]) => (
          <button
            key={key}
            onClick={() => handleChallengeResponse(challenge.id, key)}
            disabled={player.money < option.cost}
            className={`w-full text-left p-2 rounded border text-sm ${
              player.money >= option.cost
                ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800'
                : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex justify-between">
              <span className="capitalize">{key.replace('_', ' ')}</span>
              <span>${option.cost.toLocaleString()}</span>
            </div>
            <div className="text-xs opacity-75">
              {Math.round(option.effectiveness * 100)}% effective
            </div>
          </button>
        ))}
        
        {challenge.adaptation && Object.entries(challenge.adaptation).map(([key, option]) => (
          <button
            key={key}
            onClick={() => handleChallengeResponse(challenge.id, key)}
            disabled={player.money < option.cost}
            className={`w-full text-left p-2 rounded border text-sm ${
              player.money >= option.cost
                ? 'border-green-300 bg-green-50 hover:bg-green-100 text-green-800'
                : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex justify-between">
              <span className="capitalize">{key.replace('_', ' ')}</span>
              <span>${option.cost.toLocaleString()}</span>
            </div>
            <div className="text-xs opacity-75">
              {Math.round(option.effectiveness * 100)}% effective
            </div>
          </button>
        ))}
        
        {challenge.strategies && Object.entries(challenge.strategies).map(([key, option]) => (
          <button
            key={key}
            onClick={() => handleChallengeResponse(challenge.id, key)}
            disabled={player.money < option.cost}
            className={`w-full text-left p-2 rounded border text-sm ${
              player.money >= option.cost
                ? 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800'
                : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex justify-between">
              <span className="capitalize">{key.replace('_', ' ')}</span>
              <span>${option.cost.toLocaleString()}</span>
            </div>
            <div className="text-xs opacity-75">
              {option.reputation && `+${option.reputation} reputation`}
              {option.communitySupport && ` +${option.communitySupport} community`}
              {option.revenue && ` ${Math.round((option.revenue - 1) * 100)}% revenue`}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Norfolk Business Empire</h1>
        
        {/* Market Conditions */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Economy</h3>
            <p className="text-xl font-semibold text-green-600 capitalize">
              {marketConditions.economy}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Competition</h3>
            <p className="text-xl font-semibold text-orange-600 capitalize">
              {marketConditions.competition}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Tourism</h3>
            <p className="text-xl font-semibold text-blue-600 capitalize">
              {marketConditions.tourism}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Season</h3>
            <p className="text-xl font-semibold text-purple-600 capitalize">
              {marketConditions.season}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Businesses</h3>
            <p className="text-xl font-semibold text-indigo-600">{businesses.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Businesses Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Businesses</h2>
            <button
              onClick={() => setShowNewBusinessForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Start New Business
            </button>
          </div>
          
          {businesses.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Businesses Yet</h3>
              <p className="text-gray-500 mb-4">Start your first business in Norfolk to begin building your empire!</p>
              <button
                onClick={() => setShowNewBusinessForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Start Your First Business
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>

        {/* Opportunities and Challenges Section */}
        <div className="space-y-6">
          {/* Opportunities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Norfolk Opportunities</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeOpportunities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No opportunities available right now.</p>
                  <button
                    onClick={generateDailyOpportunities}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Refresh Opportunities
                  </button>
                </div>
              ) : (
                activeOpportunities.map(opportunity => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))
              )}
            </div>
          </div>

          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Challenges</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Business Form Modal */}
      <AnimatePresence>
        {showNewBusinessForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewBusinessForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Start New Business</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail Store</option>
                    <option value="service">Service Business</option>
                    <option value="tech">Tech Company</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select location</option>
                    {Object.entries(norfolkNeighborhoods).map(([key, neighborhood]) => (
                      <option key={key} value={key}>
                        {neighborhood.name} - ${neighborhood.rentMultiplier * 1000}/month
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Investment
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter initial investment"
                    min="1000"
                    max={player.money}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available funds: ${player.money.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewBusinessForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStartBusiness({})}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Start Business
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Business Details Modal */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBusiness(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedBusiness.name}</h2>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Financial Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-semibold text-green-600">
                        ${selectedBusiness.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-semibold text-red-600">
                        ${selectedBusiness.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Net Profit:</span>
                      <span className="font-bold text-blue-600">
                        ${(selectedBusiness.revenue - selectedBusiness.expenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Business Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-semibold">{selectedBusiness.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reputation:</span>
                      <span className="font-semibold">{selectedBusiness.reputation}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employees:</span>
                      <span className="font-semibold">{selectedBusiness.employees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Base:</span>
                      <span className="font-semibold">{selectedBusiness.customerBase || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleBusinessAction(selectedBusiness.id, 'RUN_OPERATIONS')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Run Operations
                </button>
                <button
                  onClick={() => handleBusinessAction(selectedBusiness.id, 'HIRE_EMPLOYEE', { role: 'manager' })}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  Hire Employee
                </button>
                <button
                  onClick={() => handleBusinessAction(selectedBusiness.id, 'UPGRADE_PROPERTY', { upgradeType: 'efficiency' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                >
                  Upgrade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessDashboard;