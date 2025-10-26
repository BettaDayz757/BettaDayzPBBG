import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BusinessDashboard from './BusinessDashboard';

const businessTypes = {
  TECH: 'Technology',
  RETAIL: 'Retail',
  FOOD: 'Restaurant',
  REAL_ESTATE: 'Real Estate',
  ENTERTAINMENT: 'Entertainment'
};

const locations = {
  MILITARY_CIRCLE: { name: 'Military Circle', cost: 5000, traffic: 'Medium' },
  DOWNTOWN: { name: 'Downtown Norfolk', cost: 15000, traffic: 'High' },
  GHENT: { name: 'Ghent District', cost: 12000, traffic: 'High' },
  OCEANVIEW: { name: 'Ocean View', cost: 8000, traffic: 'Medium' },
  BERKLEY: { name: 'Berkley', cost: 4000, traffic: 'Growing' }
};

const challenges = [
  {
    id: 'startup_capital',
    title: 'Securing Startup Capital',
    description: 'Navigate the challenges of raising initial funding through community support and strategic partnerships.'
  },
  {
    id: 'market_research',
    title: 'Market Research',
    description: 'Study the Norfolk market to identify underserved needs and opportunities.'
  },
  {
    id: 'community_support',
    title: 'Building Community Support',
    description: 'Engage with local community leaders and establish a strong network.'
  }
];

export const GameMain = ({ player, onBusinessAction }) => {
  const [playerState, setPlayerState] = useState(player || {
    level: 1,
    money: 10000,
    businesses: [],
    reputation: 0,
    skills: {
      leadership: 1,
      marketing: 1,
      finance: 1,
      networking: 1
    },
    completedChallenges: []
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [availableOpportunities, setAvailableOpportunities] = useState([]);

  useEffect(() => {
    if (player) {
      setPlayerState(player);
    }
    // Generate opportunities based on player level
    generateOpportunities();
  }, [player]);

  const loadPlayerState = async (userId) => {
    try {
      const response = await fetch(`/api/player/${userId}`);
      const data = await response.json();
      setPlayerState(data);
    } catch (error) {
      console.error('Error loading player state:', error);
    }
  };

  const generateOpportunities = () => {
    // Generate random business opportunities based on player's level and location
    const opportunities = [
      {
        type: 'investment',
        title: 'Tech Startup Partnership',
        description: 'Partner with local tech innovators',
        cost: 5000,
        potentialReturn: 15000
      },
      {
        type: 'property',
        title: 'Military Circle Retail Space',
        description: 'Prime location becoming available',
        cost: 8000,
        monthlyRevenue: 1200
      }
      // Add more dynamic opportunities
    ];
    setAvailableOpportunities(opportunities);
  };

  const handleBusinessUpdate = (updateData) => {
    switch (updateData.type) {
      case 'BUSINESS_STARTED':
        setPlayerState(prev => ({
          ...prev,
          money: prev.money - updateData.cost,
          businesses: [...prev.businesses, updateData.business]
        }));
        break;
      
      case 'EVENT_PARTICIPATED':
        setPlayerState(prev => ({
          ...prev,
          money: prev.money - updateData.cost,
          reputation: prev.reputation + (updateData.opportunity.rewards.reputation || 0)
        }));
        break;

      default:
        break;
    }

    if (onBusinessAction) {
      onBusinessAction(updateData.type, updateData);
    }
  };

  const handleBusinessAction = async (action, data) => {
    if (onBusinessAction) {
      await onBusinessAction(action, data);
    } else {
      // Fallback for local state management
      switch (action) {
        case 'START_BUSINESS':
          if (playerState.money >= data.cost) {
            setPlayerState(prev => ({
              ...prev,
              money: prev.money - data.cost,
              businesses: [...prev.businesses, data]
            }));
          }
          break;
        
        case 'INVEST':
          // Handle investment logic
          break;

        case 'NETWORK':
          // Increase networking skills and reputation
          break;
      }
    }
  };

  if (currentView === 'business') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Business Management</h1>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <BusinessDashboard 
          player={playerState} 
          onBusinessUpdate={handleBusinessUpdate}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Norfolk Business Empire</h1>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Cash</h3>
            <p className="text-2xl">${playerState.money.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Businesses</h3>
            <p className="text-2xl">{playerState.businesses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Reputation</h3>
            <p className="text-2xl">{playerState.reputation}/100</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Level</h3>
            <p className="text-2xl">{playerState.level}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('business')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center"
            >
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-semibold">Manage Businesses</div>
            </button>
            <button
              onClick={() => generateOpportunities()}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center"
            >
              <div className="text-2xl mb-2">💡</div>
              <div className="font-semibold">Find Opportunities</div>
            </button>
            <button
              onClick={() => setCurrentChallenge(challenges[0])}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Take Challenge</div>
            </button>
            <button
              onClick={() => loadPlayerState(playerState.id)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">View Analytics</div>
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Available Opportunities</h2>
          {availableOpportunities.map((opportunity, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="border-b p-4 last:border-0"
            >
              <h3 className="font-bold">{opportunity.title}</h3>
              <p className="text-gray-600">{opportunity.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-600">Cost: ${opportunity.cost}</span>
                <button
                  onClick={() => handleBusinessAction('START_BUSINESS', opportunity)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Take Action
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      </div>

      <section className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Your Empire</h2>
        {playerState.businesses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't started any businesses yet.</p>
            <button
              onClick={() => setCurrentView('business')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Start Your First Business
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerState.businesses.map((business, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-bold">{business.name}</h3>
                <p>Location: {business.location}</p>
                <p>Monthly Revenue: ${business.revenue}</p>
                <div className="mt-2">
                  <button
                    onClick={() => setCurrentView('business')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Skills & Development</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(playerState.skills).map(([skill, level]) => (
            <div key={skill} className="text-center">
              <h3 className="font-bold capitalize">{skill}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(level / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};