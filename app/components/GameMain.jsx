import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export const GameMain = ({ userId }) => {
  const [playerState, setPlayerState] = useState({
    level: 1,
    money: 1000,
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

  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [availableOpportunities, setAvailableOpportunities] = useState([]);

  useEffect(() => {
    // Load player state
    loadPlayerState(userId);
    // Generate opportunities based on player level
    generateOpportunities();
  }, [userId]);

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

  const handleBusinessAction = async (action, data) => {
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
  };

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

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Your Empire</h2>
          {playerState.businesses.map((business, index) => (
            <div key={index} className="border-b p-4 last:border-0">
              <h3 className="font-bold">{business.name}</h3>
              <p>Location: {business.location}</p>
              <p>Monthly Revenue: ${business.revenue}</p>
            </div>
          ))}
        </section>
      </div>

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