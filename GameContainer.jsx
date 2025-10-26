import React, { useState, useEffect } from 'react';
import { PaymentInterface } from './PaymentInterface';
import { CharacterCustomization } from './CharacterCustomization';
import { GameMain } from './GameMain';
import { CommunityHub } from './CommunityHub';
import BusinessSimulation from '../game/business-simulation';

export const GameContainer = () => {
  const [gameState, setGameState] = useState('character'); // character, main, community
  const [player, setPlayer] = useState(null);
  const [businessSim, setBusinessSim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (player) {
      try {
        setLoading(true);
        const sim = new BusinessSimulation(player);
        setBusinessSim(sim);
        setError(null);
      } catch (err) {
        setError('Failed to initialize business simulation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [player]);

  const handleCharacterCreation = (character) => {
    setPlayer({
      ...character,
      money: 10000, // Starting capital
      businesses: [],
      reputation: 0,
      level: 1,
      inventory: [],
      achievements: [],
      eventHistory: []
    });
    setGameState('main');
  };

  const handleBusinessAction = async (action, data) => {
    if (!businessSim) {
      setError('Business simulation not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      switch (action) {
        case 'START_BUSINESS':
          if (data.initialInvestment > player.money) {
            throw new Error('Insufficient funds');
          }
          const newBusiness = await businessSim.startBusiness(data);
          setPlayer(prev => ({
            ...prev,
            businesses: [...prev.businesses, newBusiness],
            money: prev.money - data.initialInvestment
          }));
          break;

        case 'UPGRADE_BUSINESS':
          const upgradedBusiness = await businessSim.upgradeProperty(data.businessId, data.upgradeType);
          updatePlayerBusinesses(upgradedBusiness);
          break;

        case 'HIRE_EMPLOYEE':
          const updatedBusiness = await businessSim.hireEmployee(data.businessId, data.employee);
          updatePlayerBusinesses(updatedBusiness);
          break;

        default:
          throw new Error('Invalid business action');
      }
    } catch (err) {
      setError(err.message || 'Failed to perform business action');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerBusinesses = (updatedBusiness) => {
    setPlayer(prev => ({
      ...prev,
      businesses: prev.businesses.map(b => 
        b.id === updatedBusiness.id ? updatedBusiness : b
      )
    }));
  };

  const handleCommunityInteraction = async (interaction) => {
    try {
      setLoading(true);
      setError(null);

      switch (interaction.type) {
        case 'event_completed':
          // Validate rewards exist
          if (!interaction.data?.rewards) {
            throw new Error('Invalid event rewards');
          }

          const { reputation = 0, skills = {} } = interaction.data.rewards;
          
          setPlayer(prev => ({
            ...prev,
            reputation: prev.reputation + reputation,
            skills: applySkillsUpdate(prev.skills, skills),
            eventHistory: [...prev.eventHistory, {
              ...interaction.data,
              timestamp: new Date()
            }]
          }));
          break;

        case 'connect_organization':
          // Handle new organization connections
          setPlayer(prev => ({
            ...prev,
            connections: [...(prev.connections || []), {
              organizationId: interaction.data.organizationId,
              connectionType: interaction.data.type,
              timestamp: new Date()
            }]
          }));
          break;

        default:
          throw new Error('Invalid community interaction type');
      }
    } catch (err) {
      setError(err.message || 'Failed to process community interaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applySkillsUpdate = (currentSkills, newSkills) => {
    const updated = { ...currentSkills };
    Object.entries(newSkills).forEach(([skill, increase]) => {
      updated[skill] = (updated[skill] || 0) + increase;
    });
    return updated;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {gameState === 'character' && (
        <CharacterCustomization onSave={handleCharacterCreation} />
      )}

      {gameState === 'main' && player && (
        <div>
          <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Norfolk Business Empire</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setGameState('main')}
                  className={`px-4 py-2 rounded transition duration-200 ease-in-out ${
                    gameState === 'main' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  Business
                </button>
                <button
                  onClick={() => setGameState('community')}
                  className={`px-4 py-2 rounded transition duration-200 ease-in-out ${
                    gameState === 'community' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  Community
                </button>
              </div>
            </div>
          </nav>

          {gameState === 'main' && (
            <GameMain
              player={player}
              onBusinessAction={handleBusinessAction}
            />
          )}

          {gameState === 'community' && (
            <CommunityHub
              player={player}
              onInteraction={handleCommunityInteraction}
            />
          )}

          <PaymentInterface
            userId={player.id}
            onSuccess={(transaction) => {
              setPlayer(prev => ({
                ...prev,
                money: prev.money + transaction.amount
              }));
            }}
          />
        </div>
      )}
    </div>
  );
};